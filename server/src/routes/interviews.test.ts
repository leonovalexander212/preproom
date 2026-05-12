import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../lib/prisma', () => ({ prisma: {
  direction: { findUnique: vi.fn() },
  interview: { findMany: vi.fn() },
} }));

import { prisma } from '../lib/prisma';
const mockPrisma = prisma as any;

import interviewsRouter from './interviews';

function app() {
  const a = express();
  a.use('/api/interviews', interviewsRouter);
  return a;
}

describe('GET /api/interviews', () => {
  it('returns all interviews with metadata', async () => {
    mockPrisma.interview.findMany.mockResolvedValue([
      { id: 'i1', title: 'Python JUNIOR Interview', videoUrl: 'https://youtube.com/watch?v=abc123', direction: { slug: 'python', name: 'Python' }, _count: { questions: 15 } },
      { id: 'i2', title: 'Frontend MIDDLE Interview', videoUrl: 'https://youtu.be/def456', direction: { slug: 'frontend', name: 'Frontend' }, _count: { questions: 20 } },
    ]);

    const res = await request(app()).get('/api/interviews');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].difficulty).toBe('JUNIOR');
    expect(res.body[1].difficulty).toBe('MIDDLE');
    expect(res.body[0].thumbnailUrl).toContain('abc123');
    expect(res.body[0].questionCount).toBe(15);
  });

  it('filters by direction slug', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue({ id: 'd1' });
    mockPrisma.interview.findMany.mockResolvedValue([
      { id: 'i1', title: 'Python JUNIOR', videoUrl: 'https://youtube.com/watch?v=abc', direction: { slug: 'python', name: 'Python' }, _count: { questions: 10 } },
    ]);

    const res = await request(app()).get('/api/interviews?direction=python');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].directionSlug).toBe('python');
    expect(mockPrisma.direction.findUnique).toHaveBeenCalledWith({ where: { slug: 'python' } });
  });

  it('filters by difficulty', async () => {
    mockPrisma.interview.findMany.mockResolvedValue([
      { id: 'i1', title: 'Python JUNIOR', videoUrl: 'https://youtube.com/watch?v=abc', direction: { slug: 'python', name: 'Python' }, _count: { questions: 10 } },
    ]);

    const res = await request(app()).get('/api/interviews?difficulty=JUNIOR');
    expect(res.status).toBe(200);
    expect(mockPrisma.interview.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ title: { contains: 'JUNIOR' } }),
    }));
  });

  it('returns empty array for unknown direction', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue(null);
    const res = await request(app()).get('/api/interviews?direction=unknown');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 500 on db error', async () => {
    mockPrisma.interview.findMany.mockRejectedValue(new Error('db down'));
    const res = await request(app()).get('/api/interviews');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('GET /api/interviews/thumb/:videoId', () => {
  it('rejects invalid videoId format', async () => {
    const res = await request(app()).get('/api/interviews/thumb/invalid!');
    expect(res.status).toBe(400);
  });

  it('returns 502 when youtube is unreachable', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const res = await request(app()).get('/api/interviews/thumb/abc123def');
    expect(res.status).toBe(502);
  });
});
