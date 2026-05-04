import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * Конвертирует "HH:MM:SS" или "MM:SS" в секунды для параметра t= в YouTube URL.
 */
function timecodeToSeconds(tc: string): number {
  const parts = tc.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

/**
 * Добавляет параметр t= к YouTube URL.
 * Поддерживает форматы youtube.com/watch?v=... и youtu.be/...
 */
function buildYoutubeUrl(videoUrl: string, timecode: string): string {
  const seconds = timecodeToSeconds(timecode);
  if (seconds === 0) return videoUrl;
  try {
    const url = new URL(videoUrl);
    url.searchParams.set('t', String(seconds));
    return url.toString();
  } catch {
    return videoUrl;
  }
}

/**
 * GET /api/questions/:questionId/video-answers
 * Возвращает список видео-ответов на вопрос: интервью с таймкодами.
 * Возвращает только те записи, где есть таймкод.
 */
router.get('/:questionId/video-answers', async (req, res) => {
  try {
    const { questionId } = req.params;

    const links = await prisma.interviewQuestion.findMany({
      where: {
        questionId,
        timecode: { not: null },
      },
      select: {
        timecode: true,
        interview: {
          select: {
            title: true,
            videoUrl: true,
          },
        },
      },
      orderBy: { interview: { createdAt: 'asc' } },
    });

    const result = links.map((l) => ({
      title: l.interview.title,
      videoUrl: l.interview.videoUrl,
      timecode: l.timecode!,
      youtubeUrl: buildYoutubeUrl(l.interview.videoUrl, l.timecode!),
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
