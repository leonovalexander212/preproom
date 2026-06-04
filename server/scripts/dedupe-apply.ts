import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '../src/lib/prisma';

const DIRECTION_SLUG = process.argv[2] ?? 'python';

type Suggestion = {
  canonical: string;
  difficulty: 'JUNIOR' | 'MIDDLE' | 'SENIOR';
  approved: boolean;
  members: { id: string; text: string; difficulty: string; occurrences: number }[];
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const inputPath = path.resolve(process.cwd(), `data/${DIRECTION_SLUG}-dedupe-suggestions.json`);
  const content = await fs.readFile(inputPath, 'utf-8');
  const suggestions = JSON.parse(content) as Suggestion[];

  const direction = await prisma.direction.findUnique({ where: { slug: DIRECTION_SLUG } });
  if (!direction) throw new Error(`Направление "${DIRECTION_SLUG}" не найдено`);

  const approved = suggestions.filter((s) => s.approved);
  console.log(`\n🔧 Применяем дедупликацию для "${DIRECTION_SLUG}"`);
  console.log(`   Одобренных групп: ${approved.length} из ${suggestions.length}\n`);

  let mergedQuestions = 0;
  let relinkedInterviews = 0;
  let skippedGroups = 0;

  for (const group of approved) {
    const [canonical, ...duplicates] = group.members;
    const canonicalNormalized = normalize(group.canonical);
    const dupIds = duplicates.map((d) => d.id);

    try {
      // 1. Переносим связи с видео на канонический (дедуп связей)
      for (const dup of duplicates) {
        const links = await prisma.interviewQuestion.findMany({ where: { questionId: dup.id } });
        for (const link of links) {
          const existing = await prisma.interviewQuestion.findUnique({
            where: {
              interviewId_questionId: { interviewId: link.interviewId, questionId: canonical.id },
            },
          });
          if (!existing) {
            await prisma.interviewQuestion.update({ where: { id: link.id }, data: { questionId: canonical.id } });
            relinkedInterviews++;
          } else {
            await prisma.interviewQuestion.delete({ where: { id: link.id } });
          }
        }
      }

      // 2. Удаляем дубли ПЕРЕД обновлением канона (deleteMany не падает если что-то уже удалено)
      const del = await prisma.question.deleteMany({ where: { id: { in: dupIds } } });
      mergedQuestions += del.count;

      // 3. Обновляем текст канона — мягко: если всё равно конфликт уникальности
      //    (есть похожий вопрос вне группы), дубли уже слиты, просто оставляем старый текст канона.
      try {
        await prisma.question.update({
          where: { id: canonical.id },
          data: {
            text: group.canonical,
            normalizedText: canonicalNormalized,
            difficulty: group.difficulty,
          },
        });
      } catch {
        console.warn(`  ℹ️  Текст канона не обновлён (конфликт вне группы), но дубли слиты: "${group.canonical.slice(0, 50)}..."`);
      }
    } catch (e: any) {
      console.warn(`  ⚠️  Ошибка в группе "${group.canonical.slice(0, 50)}...": ${e?.message}`);
      skippedGroups++;
    }
  }

  console.log(`\n✓ Удалено дубликатов: ${mergedQuestions}`);
  console.log(`✓ Переподключено связей: ${relinkedInterviews}`);
  if (skippedGroups) console.log(`⚠️  Пропущено групп: ${skippedGroups}`);
  console.log();
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
