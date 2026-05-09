import { Router } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { prisma } from '../lib/prisma';

const router = Router();

const THUMBS_DIR = join(__dirname, '..', '..', 'public', 'thumbs');

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
  if (!id) return null;
  if (existsSync(join(THUMBS_DIR, `${id}.jpg`))) {
    return `/static/thumbs/${id}.jpg`;
  }
  return `/api/interviews/thumb/${id}`;
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

const thumbCache = new Map<string, { buf: Buffer; ct: string; ts: number }>();
const THUMB_TTL = 1000 * 60 * 60 * 24;

router.get('/thumb/:videoId', async (req, res) => {
  const { videoId } = req.params;
  if (!/^[\w-]{6,20}$/.test(videoId)) return res.status(400).end();

  const cached = thumbCache.get(videoId);
  if (cached && Date.now() - cached.ts < THUMB_TTL) {
    res.set('Content-Type', cached.ct);
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(cached.buf);
  }

  try {
    const url = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const resp = await fetch(url);
    if (!resp.ok) return res.status(502).end();

    const buf = Buffer.from(await resp.arrayBuffer());
    const ct = resp.headers.get('content-type') || 'image/jpeg';
    thumbCache.set(videoId, { buf, ct, ts: Date.now() });

    res.set('Content-Type', ct);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buf);
  } catch {
    res.status(502).end();
  }
});

export default router;
