import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { PrismaClient } from '../../generated/prisma/client';

type Difficulty = 'JUNIOR' | 'MIDDLE' | 'SENIOR';

type ParsedInterview = {
  url: string;
  difficulty: Difficulty;
  questions: string[];
};

const DIFF_MAP: Record<string, Difficulty> = {
  J: 'JUNIOR',
  M: 'MIDDLE',
  S: 'SENIOR',
};

const DIFF_ORDER: Record<Difficulty, number> = {
  JUNIOR: 0,
  MIDDLE: 1,
  SENIOR: 2,
};

/**
 * Нормализует текст вопроса для сравнения дубликатов:
 * "Что такое Event Loop?" === "что   такое event-loop"
 */
export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')   // всё кроме букв/цифр/пробелов → пробел
    .replace(/\s+/g, ' ')                 // множественные пробелы → один
    .trim();
}

/**
 * Парсит текстовый файл с транскрибациями в структурированный список интервью.
 */
export function parseInterviewFile(content: string): ParsedInterview[] {
  const lines = content.split('\n').map((l) => l.trim());
  const result: ParsedInterview[] = [];

  let currentDifficulty: Difficulty | null = null;
  let currentInterview: ParsedInterview | null = null;

  const DIFF_HEADER = /^([JMS]):$/;
  const LANG_HEADER = /^[A-ZА-Я0-9#/.\s-]+:$/;   // PYTHON:, JAVA:, C#:
  const INTERVIEW_START = /^(\d+)\)(.*)$/;
  const URL_LINE = /^https?:\/\//;
  const SEPARATOR = /^=+$/;

  for (const line of lines) {
    if (!line || SEPARATOR.test(line)) continue;

    // Заголовок уровня: "J:", "M:", "S:"
    const diffMatch = line.match(DIFF_HEADER);
    if (diffMatch) {
      currentDifficulty = DIFF_MAP[diffMatch[1]];
      currentInterview = null;
      continue;
    }

    // Заголовок направления: "PYTHON:", "JAVA:" — игнорируем
    if (LANG_HEADER.test(line)) continue;

    // Начало нового интервью: "1)URL" или просто "1)"
    const startMatch = line.match(INTERVIEW_START);
    if (startMatch) {
      if (!currentDifficulty) continue;
      const url = startMatch[2].trim();
      currentInterview = {
        url,
        difficulty: currentDifficulty,
        questions: [],
      };
      result.push(currentInterview);
      continue;
    }

    // Отдельная URL-строка (например, второй источник для одного интервью)
    if (URL_LINE.test(line)) {
      if (currentInterview && !currentInterview.url) {
        currentInterview.url = line;
      }
      // Дополнительные URL игнорируем — для MVP один URL на интервью
      continue;
    }

    // Всё остальное — это вопрос
    if (currentInterview) {
      currentInterview.questions.push(line);
    }
  }

  return result;
}

/**
 * Читает файл интервью, парсит и заливает в БД с учётом дедупликации вопросов.
 * Предварительно очищает данные указанного направления.
 */
export async function seedInterviewFile(
  prisma: PrismaClient,
  filePath: string,
  directionSlug: string,
): Promise<void> {
  console.log(`\n📂 Импорт ${filePath} → направление "${directionSlug}"`);

  const direction = await prisma.direction.findUnique({
    where: { slug: directionSlug },
  });
  if (!direction) {
    throw new Error(`Направление "${directionSlug}" не найдено. Сначала seedDirections.`);
  }

  // Очищаем только данные этого направления
  await prisma.interview.deleteMany({ where: { directionId: direction.id } });
  await prisma.question.deleteMany({ where: { directionId: direction.id } });

  // Читаем и парсим файл
  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = await fs.readFile(absolutePath, 'utf-8');
  const interviews = parseInterviewFile(content);
  console.log(`  📋 Найдено интервью: ${interviews.length}`);

  // Кеш: нормализованный текст → { id, difficulty }
  const questionCache = new Map<string, { id: string; difficulty: Difficulty }>();

  let totalQuestions = 0;
  let totalLinks = 0;
  let skippedNoUrl = 0;

  for (let i = 0; i < interviews.length; i++) {
    const iw = interviews[i];
    if (!iw.url) {
      skippedNoUrl++;
      continue;
    }

    const createdInterview = await prisma.interview.create({
      data: {
        directionId: direction.id,
        title: `${iw.difficulty} интервью #${i + 1}`,
        videoUrl: iw.url,
      },
    });

    for (const rawText of iw.questions) {
      const normalized = normalizeQuestionText(rawText);
      if (!normalized) continue;

      let cached = questionCache.get(normalized);

      if (!cached) {
        // Новый вопрос
        const created = await prisma.question.create({
        data: {
            directionId: direction.id,
            text: rawText,
            normalizedText: normalized,
            difficulty: iw.difficulty,
            answer: '',
        },
        });
        cached = { id: created.id, difficulty: iw.difficulty };
        questionCache.set(normalized, cached);
        totalQuestions++;
      } else if (DIFF_ORDER[iw.difficulty] < DIFF_ORDER[cached.difficulty]) {
        // Встретили тот же вопрос на более низком уровне — понижаем
        await prisma.question.update({
          where: { id: cached.id },
          data: { difficulty: iw.difficulty },
        });
        cached.difficulty = iw.difficulty;
      }

      // Связываем вопрос с интервью (игнорируя дубликаты в рамках одного интервью)
      try {
        await prisma.interviewQuestion.create({
          data: {
            interviewId: createdInterview.id,
            questionId: cached.id,
          },
        });
        totalLinks++;
      } catch {
        // Вопрос уже связан с этим интервью — ок
      }
    }
  }

  console.log(`  ✓ Уникальных вопросов: ${totalQuestions}`);
  console.log(`  ✓ Связей вопрос↔интервью: ${totalLinks}`);
  if (skippedNoUrl) console.log(`  ⚠️  Пропущено без URL: ${skippedNoUrl}`);
}