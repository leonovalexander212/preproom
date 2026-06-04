import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '../src/lib/prisma';
import { ai, cleanupModel, askJson, sleep as aiSleep } from './_ai';
import { pipeline, type FeatureExtractionPipeline } from '@xenova/transformers';

// Настройки
const DIRECTION_SLUG = process.argv[2] ?? 'python';
const SKIP_LLM = process.argv.includes('--skip-llm');
const SIMILARITY_THRESHOLD = 0.84;          // ниже = больше кандидатов (LLM потом разобьёт)
const EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';
const LLM_DELAY_MS = 250;                    // Groq спокойно держит 30 req/min
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

/**
 * Greedy кластеризация с complete-linkage:
 * новый элемент попадает в кластер только если его сходство с КАЖДЫМ
 * уже находящимся там элементом >= порога. Это не даёт цепочкам
 * "близких пар" сливать половину базы в один гигантский кластер.
 */
function cluster(questions: QuestionRow[], embeddings: number[][]): QuestionRow[][] {
  const n = questions.length;
  const clusters: number[][] = [];

  for (let i = 0; i < n; i++) {
    let bestCluster = -1;
    let bestMinSim = -1;
    for (let c = 0; c < clusters.length; c++) {
      let minSim = 1;
      for (const j of clusters[c]) {
        const s = cosineSimilarity(embeddings[i], embeddings[j]);
        if (s < minSim) minSim = s;
        if (minSim < SIMILARITY_THRESHOLD) break;
      }
      if (minSim >= SIMILARITY_THRESHOLD && minSim > bestMinSim) {
        bestMinSim = minSim;
        bestCluster = c;
      }
    }
    if (bestCluster >= 0) clusters[bestCluster].push(i);
    else clusters.push([i]);
  }

  return clusters
    .filter((g) => g.length > 1)
    .map((idxs) => idxs.map((i) => questions[i]));
}

// ==================== LLM CONFIRMATION (с ретраями) ====================

// ==================== LLM: разбиение кластера на подгруппы ====================

// Модель получает кластер похожих вопросов и разбивает его на подгруппы
// настоящих дубликатов. Для каждой подгруппы (>=2) выбирает канонический.
// Это решает проблему, когда эмбеддинги слепили рядом разные вопросы.
type LlmGroup = { indices: number[]; canonical: string };

async function confirmCluster(members: QuestionRow[]): Promise<Cluster[]> {
  const list = members.map((m, i) => `${i + 1}. ${m.text}`).join("\n");

  const prompt = `Ниже группа вопросов с IT-собеседований по теме "${DIRECTION_SLUG}", автоматически собранных как похожие.
Некоторые — это ОДИН И ТОТ ЖЕ вопрос разными словами, некоторые — РАЗНЫЕ вопросы.

Вопросы:
${list}

Задача: сгруппируй НОМЕРА вопросов, которые означают по сути одно и то же (дубликаты-перефразировки).
- В одну подгруппу объединяй ТОЛЬКО настоящие дубликаты (один и тот же смысл).
- Разные вопросы НЕ объединяй, даже если тема близкая.
- Для каждой подгруппы выбери самую чёткую и полную формулировку как каноническую.
- Вопросы, у которых нет дубликатов, не включай никуда.

Верни СТРОГО JSON без markdown:
{"groups": [{"indices": [1, 3], "canonical": "Чёткая формулировка"}, {"indices": [2, 5, 6], "canonical": "..."}]}
Если дубликатов нет вообще: {"groups": []}`;

  const parsed = await askJson<{ groups: LlmGroup[] }>(prompt, { temperature: 0.1 });
  if (!parsed?.groups?.length) return [];

  const result: Cluster[] = [];
  for (const g of parsed.groups) {
    const groupMembers = (g.indices || [])
      .map((idx) => members[idx - 1])
      .filter((m): m is QuestionRow => Boolean(m));
    // дубль = минимум 2 вопроса
    if (groupMembers.length < 2) continue;
    const canonical = (g.canonical && g.canonical.trim())
      ? g.canonical.trim()
      : [...groupMembers].sort((a, b) => b.text.length - a.text.length)[0].text;
    result.push({
      canonicalText: canonical,
      canonicalDifficulty: pickMinDifficulty(groupMembers),
      members: groupMembers,
    });
  }
  return result;
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
      const subClusters = await confirmCluster(candidateClusters[i]);
      confirmed.push(...subClusters);
      process.stdout.write(` ${subClusters.length > 0 ? "✓ +" + subClusters.length : "—"}\n`);
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
