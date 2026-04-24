import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '../src/lib/prisma';
import { openrouter } from '../src/lib/openrouter';
import { pipeline, type FeatureExtractionPipeline } from '@xenova/transformers';

// Настройки
const DIRECTION_SLUG = process.argv[2] ?? 'python';
const SKIP_LLM = process.argv.includes('--skip-llm');
const SIMILARITY_THRESHOLD = 0.92;
const EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';
const CONFIRM_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';
const LLM_DELAY_MS = 8000;           // 8 сек между запросами = ~7 req/min (под лимит 8/min)
const LLM_MAX_RETRIES = 3;

type Difficulty = 'JUNIOR' | 'MIDDLE' | 'SENIOR';

type QuestionRow = {
  id: string;
  text: string;
  difficulty: Difficulty;
  occurrences: number;
};

type Cluster = {
  canonicalText: string;
  canonicalDifficulty: Difficulty;
  members: QuestionRow[];
};

// ==================== MATH ====================

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function pickMinDifficulty(members: QuestionRow[]): Difficulty {
  const order = { JUNIOR: 0, MIDDLE: 1, SENIOR: 2 };
  return members.reduce<Difficulty>(
    (min, m) => (order[m.difficulty] < order[min] ? m.difficulty : min),
    members[0].difficulty,
  );
}

// ==================== EMBEDDINGS (локальные) ====================

let extractor: FeatureExtractionPipeline | null = null;

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  console.log(`  📊 Загружаем модель ${EMBEDDING_MODEL}...`);
  if (!extractor) {
    extractor = await pipeline('feature-extraction', EMBEDDING_MODEL);
  }
  console.log(`  📊 Получаем эмбеддинги для ${texts.length} вопросов (локально)...`);

  const embeddings: number[][] = [];
  for (let i = 0; i < texts.length; i++) {
    const output = await extractor!(`query: ${texts[i]}`, { pooling: 'mean', normalize: true });
    embeddings.push(Array.from(output.data as Float32Array));
    if ((i + 1) % 50 === 0 || i === texts.length - 1) {
      process.stdout.write(`    ${i + 1}/${texts.length}\r`);
    }
  }
  console.log();
  return embeddings;
}

// ==================== CLUSTERING ====================

function cluster(questions: QuestionRow[], embeddings: number[][]): QuestionRow[][] {
  const n = questions.length;
  const parent = Array.from({ length: n }, (_, i) => i);

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  const union = (a: number, b: number) => {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (cosineSimilarity(embeddings[i], embeddings[j]) >= SIMILARITY_THRESHOLD) {
        union(i, j);
      }
    }
  }

  const groups = new Map<number, QuestionRow[]>();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(questions[i]);
  }

  return Array.from(groups.values()).filter((g) => g.length > 1);
}

// ==================== LLM CONFIRMATION (с ретраями) ====================

async function confirmCluster(members: QuestionRow[]): Promise<Cluster | null> {
  const list = members.map((m, i) => `${i + 1}. ${m.text}`).join('\n');

  const prompt = `Ты анализируешь список вопросов с технических собеседований по Python.
Эти вопросы были автоматически сгруппированы как семантически похожие.

Вопросы:
${list}

Задача:
1. Определи, все ли они действительно об одной и той же теме (возможны разные формулировки одного вопроса).
2. Если да — сформулируй самый чёткий и полный канонический вариант вопроса.
3. Если это разные вопросы — верни false.

Ответь СТРОГО в формате JSON без markdown, без пояснений:
{"same": true, "canonical": "Канонический вопрос здесь"}
или
{"same": false}`;

  for (let attempt = 1; attempt <= LLM_MAX_RETRIES; attempt++) {
    try {
      const response = await openrouter.chat.completions.create({
        model: CONFIRM_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content ?? '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]) as
        | { same: true; canonical: string }
        | { same: false };

      if (!parsed.same) return null;

      return {
        canonicalText: parsed.canonical,
        canonicalDifficulty: pickMinDifficulty(members),
        members,
      };
    } catch (error: any) {
      const is429 = error?.status === 429 || String(error?.message).includes('429');
      if (is429 && attempt < LLM_MAX_RETRIES) {
        const backoff = LLM_DELAY_MS * attempt * 2;
        console.warn(`    ⏳ Rate limit, ждём ${backoff / 1000}s (попытка ${attempt}/${LLM_MAX_RETRIES})...`);
        await sleep(backoff);
        continue;
      }
      console.warn(`    ⚠️ Пропуск группы: ${error?.message}`);
      return null;
    }
  }
  return null;
}

// ==================== MAIN ====================

async function main() {
  console.log(`\n🔍 Дедупликация вопросов для "${DIRECTION_SLUG}"${SKIP_LLM ? ' (без LLM-подтверждения)' : ''}\n`);

  const direction = await prisma.direction.findUnique({
    where: { slug: DIRECTION_SLUG },
  });
  if (!direction) throw new Error(`Направление "${DIRECTION_SLUG}" не найдено`);

  const rawQuestions = await prisma.question.findMany({
    where: { directionId: direction.id },
    select: {
      id: true,
      text: true,
      difficulty: true,
      _count: { select: { interviewQuestions: true } },
    },
  });

  const questions: QuestionRow[] = rawQuestions
    .filter((q): q is typeof q & { difficulty: Difficulty } => q.difficulty !== null)
    .map((q) => ({
      id: q.id,
      text: q.text,
      difficulty: q.difficulty,
      occurrences: q._count.interviewQuestions,
    }));

  console.log(`  📋 Всего вопросов: ${questions.length}`);

  const embeddings = await getEmbeddings(questions.map((q) => q.text));

  console.log(`  🧮 Кластеризуем (порог = ${SIMILARITY_THRESHOLD})...`);
  const candidateClusters = cluster(questions, embeddings);
  console.log(`  ✓ Найдено кандидатских групп: ${candidateClusters.length}`);

  let confirmed: Cluster[] = [];

  if (SKIP_LLM) {
    // Без LLM — берём самую длинную формулировку как каноническую
    confirmed = candidateClusters.map((members) => ({
      canonicalText: [...members].sort((a, b) => b.text.length - a.text.length)[0].text,
      canonicalDifficulty: pickMinDifficulty(members),
      members,
    }));
    console.log(`  ✓ Режим --skip-llm: все группы приняты (проверишь вручную)`);
  } else {
    console.log(`\n  🤖 Подтверждаем через LLM (задержка ${LLM_DELAY_MS / 1000}s между запросами)...`);
    console.log(`  ⏱️  Ожидаемое время: ~${Math.ceil((candidateClusters.length * LLM_DELAY_MS) / 60000)} мин\n`);

    for (let i = 0; i < candidateClusters.length; i++) {
      process.stdout.write(`    ${i + 1}/${candidateClusters.length}`);
      const result = await confirmCluster(candidateClusters[i]);
      if (result) confirmed.push(result);
      process.stdout.write(` ${result ? '✓' : '—'}\n`);
      if (i < candidateClusters.length - 1) await sleep(LLM_DELAY_MS);
    }
    console.log(`\n  ✓ Подтверждено групп: ${confirmed.length}`);
  }

  const outputPath = path.resolve(process.cwd(), `data/${DIRECTION_SLUG}-dedupe-suggestions.json`);
  const output = confirmed
    .map((c) => ({
      canonical: c.canonicalText,
      difficulty: c.canonicalDifficulty,
      approved: true,
      members: c.members.map((m) => ({
        id: m.id,
        text: m.text,
        difficulty: m.difficulty,
        occurrences: m.occurrences,
      })),
    }))
    .sort((a, b) => b.members.length - a.members.length);

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n💾 Результат записан в ${outputPath}`);
  console.log(`   Проверь файл, поменяй "approved": false для неверно сгруппированных\n`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());