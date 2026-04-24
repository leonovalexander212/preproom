import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/directions
 * Возвращает список всех направлений, отсортированных по полю order.
 */
router.get('/', async (req, res) => {
  try {
    const directions = await prisma.direction.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        iconUrl: true,
        category: true,
        hasDifficultyLevels: true,
        isFeatured: true,
        _count: {
          select: {
            questions: true,
            interviews: true,
          },
        },
      },
    });
    res.json(directions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/directions/:slug/questions
 * Возвращает список вопросов направления с рассчитанной вероятностью встречаемости.
 * Опциональные query-параметры:
 *   ?difficulty=JUNIOR|MIDDLE|SENIOR — фильтр по сложности
 *   ?topic=event-loop — фильтр по slug топика
 */
router.get('/:slug/questions', async (req, res) => {
  try {
    const { slug } = req.params;
    const { difficulty, topic, type } = req.query;

    // 1. Находим направление
    const direction = await prisma.direction.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        _count: { select: { interviews: true } },
      },
    });

    if (!direction) {
      return res.status(404).json({ error: 'Direction not found' });
    }

    // 2. Если пришли с фильтром по грейду и/или типу — считаем базу процентов
    //    не от всех интервью, а только от тех, где есть вопросы подходящего грейда/типа.
    //    Это делает процент осмысленным.
    let totalInterviews = direction._count.interviews;
    if (difficulty || type) {
      totalInterviews = await prisma.interview.count({
        where: {
          directionId: direction.id,
          questions: {
            some: {
              question: {
                ...(difficulty && { difficulty: difficulty as 'JUNIOR' | 'MIDDLE' | 'SENIOR' }),
                ...(type && { type: type as 'TECHNICAL' | 'BEHAVIORAL' | 'LOGIC_PUZZLE' }),
              },
            },
          },
        },
      });
    }

    // 3. Загружаем вопросы с подсчётом количества интервью, в которых они были
    const questions = await prisma.question.findMany({
      where: {
        directionId: direction.id,
        ...(difficulty && { difficulty: difficulty as 'JUNIOR' | 'MIDDLE' | 'SENIOR' }),
        ...(type && { type: type as 'TECHNICAL' | 'BEHAVIORAL' | 'LOGIC_PUZZLE' }),
        ...(topic && { topic: { slug: topic as string } }),
      },
      select: {
        id: true,
        text: true,
        difficulty: true,
        type: true,
        answer: true,
        topic: { select: { name: true, slug: true } },
        _count: { select: { interviewQuestions: true } },
      },
    });

    // 4. Рассчитываем вероятность и сортируем по ней
    const enriched = questions
      .map((q) => ({
        id: q.id,
        text: q.text,
        difficulty: q.difficulty,
        type: q.type,
        answer: q.answer,
        topic: q.topic,
        occurrences: q._count.interviewQuestions,
        totalInterviews,
        probability:
          totalInterviews === 0
            ? 0
            : q._count.interviewQuestions / totalInterviews,
      }))
      .sort((a, b) => b.probability - a.probability);

    res.json({
      direction: { name: direction.name, slug, totalInterviews },
      questions: enriched,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;