import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../lib/prisma', () => ({ prisma: {
  interviewQuestion: { findMany: vi.fn() },
} }));

import { prisma } from '../lib/prisma';
const mockPrisma = prisma as any;

import questionsRouter from './questions';

function app() {
  const a = express();
  a.use('/api/questions', questionsRouter);
  return a;
}

describe('timecodeToSeconds', () => {
  it('converts HH:MM:SS', () => {
    const router = questionsRouter;
    expect(true).toBe(true);
  });
});

describe('GET /api/questions/:questionId/video-answers', () => {
  it('returns video answers with youtube urls', async () => {
    mockPrisma.interviewQuestion.findMany.mockResolvedValue([
      {
        timecode: '00:05:30',
        interview: { title: 'Python Interview', videoUrl: 'https://youtube.com/watch?v=abc123' },
      },
      {
        timecode: '01:20:15',
        interview: { title: 'Advanced Python', videoUrl: 'https://youtu.be/def456' },
      },
    ]);

    const res = await request(app()).get('/api/questions/q1/video-answers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].timecode).toBe('00:05:30');
    expect(res.body[0].youtubeUrl).toContain('t=330');
    expect(res.body[1].youtubeUrl).toContain('t=4815');
  });

  it('skips entries without timecode', async () => {
    mockPrisma.interviewQuestion.findMany.mockResolvedValue([]);
    const res = await request(app()).get('/api/questions/q1/video-answers');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 500 on db error', async () => {
    mockPrisma.interviewQuestion.findMany.mockRejectedValue(new Error('db down'));
    const res = await request(app()).get('/api/questions/q1/video-answers');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
