import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/** Извлекает VIDEO_ID из любого формата YouTube URL */
function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function makeThumbnail(videoUrl: string): string | null {
  const id = extractVideoId(videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

function parseDifficulty(title: string): string {
  if (title.includes('JUNIOR'))  return 'JUNIOR';
  if (title.includes('MIDDLE'))  return 'MIDDLE';
  if (title.includes('SENIOR'))  return 'SENIOR';
  return 'JUNIOR';
}

/**
 * GET /api/interviews
 * Возвращает список всех интервью с метаданными направления.
 * ?direction=java   — фильтр по slug направления
 * ?difficulty=JUNIOR — фильтр по грейду
 */
router.get('/', async (req, res) => {
  try {
    const { direction, difficulty } = req.query;

    const where: Record<string, any> = {};
    if (direction) {
      const dir = await prisma.direction.findUnique({ where: { slug: String(direction) } });
      if (!dir) return res.json([]);
      where.directionId = dir.id;
    }
    if (difficulty) {
      where.title = { contains: String(difficulty).toUpperCase() };
    }

    const interviews = await prisma.interview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        direction: { select: { slug: true, name: true } },
        _count: { select: { questions: true } },
      },
    });

    const result = interviews.map((iv) => ({
      id: iv.id,
      title: iv.title,
      videoUrl: iv.videoUrl,
      thumbnailUrl: makeThumbnail(iv.videoUrl),
      directionSlug: iv.direction.slug,
      directionName: iv.direction.name,
      difficulty: parseDifficulty(iv.title),
      questionCount: iv._count.questions,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
