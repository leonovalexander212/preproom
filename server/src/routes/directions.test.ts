import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../lib/prisma', () => ({ prisma: {
  direction: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  interview: {
    count: vi.fn(),
  },
  question: {
    findMany: vi.fn(),
  },
} }));

import { prisma } from '../lib/prisma';
const mockPrisma = prisma as any;

import directionsRouter, { clearDirectionsCache } from './directions';

function app() {
  const a = express();
  a.use(express.json());
  a.use('/api/directions', directionsRouter);
  return a;
}

describe('GET /api/directions', () => {
  beforeEach(() => { clearDirectionsCache(); });

  it('returns directions ordered by order', async () => {
    mockPrisma.direction.findMany.mockResolvedValue([
      { id: '1', slug: 'python', name: 'Python', description: 'desc', iconUrl: null, category: 'backend', hasDifficultyLevels: true, isFeatured: true, _count: { questions: 42, interviews: 3 } },
      { id: '2', slug: 'frontend', name: 'Frontend', description: 'desc', iconUrl: null, category: 'frontend', hasDifficultyLevels: true, isFeatured: false, _count: { questions: 30, interviews: 2 } },
    ]);

    const res = await request(app()).get('/api/directions');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].slug).toBe('python');
    expect(res.body[0]._count.questions).toBe(42);
    expect(mockPrisma.direction.findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { order: 'asc' } }));
  });

  it('returns 500 on db error', async () => {
    mockPrisma.direction.findMany.mockRejectedValue(new Error('db down'));
    const res = await request(app()).get('/api/directions');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('GET /api/directions/:slug/questions', () => {
  const baseDirection = { id: 'd1', name: 'Python', hasDifficultyLevels: true, _count: { interviews: 5 } };

  it('returns questions with probability', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue(baseDirection);
    mockPrisma.question.findMany.mockResolvedValue([
      { id: 'q1', text: 'What is GIL?', difficulty: 'JUNIOR', type: 'TECHNICAL', answer: 'answer', topic: { name: 'Core', slug: 'core' }, _count: { interviewQuestions: 3 } },
      { id: 'q2', text: 'Decorators?', difficulty: 'MIDDLE', type: 'TECHNICAL', answer: 'answer', topic: { name: 'Advanced', slug: 'advanced' }, _count: { interviewQuestions: 2 } },
    ]);

    const res = await request(app()).get('/api/directions/python/questions');
    expect(res.status).toBe(200);
    expect(res.body.direction.slug).toBe('python');
    expect(res.body.questions).toHaveLength(2);
    expect(res.body.questions[0].probability).toBe(0.6); // 3/5
    expect(res.body.questions[0].occurrences).toBe(3);
  });

  it('filters by difficulty', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue(baseDirection);
    mockPrisma.interview.count.mockResolvedValue(2);
    mockPrisma.question.findMany.mockResolvedValue([
      { id: 'q1', text: 'GIL', difficulty: 'JUNIOR', type: 'TECHNICAL', answer: 'ans', topic: { name: 'Core', slug: 'core' }, _count: { interviewQuestions: 2 } },
    ]);

    const res = await request(app()).get('/api/directions/python/questions?difficulty=JUNIOR');
    expect(res.status).toBe(200);
    expect(res.body.questions).toHaveLength(1);
    expect(res.body.questions[0].difficulty).toBe('JUNIOR');
    expect(mockPrisma.interview.count).toHaveBeenCalled();
  });

  it('filters by type', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue(baseDirection);
    mockPrisma.interview.count.mockResolvedValue(1);
    mockPrisma.question.findMany.mockResolvedValue([
      { id: 'q1', text: 'Behavioral?', difficulty: 'JUNIOR', type: 'BEHAVIORAL', answer: 'ans', topic: null, _count: { interviewQuestions: 1 } },
    ]);

    const res = await request(app()).get('/api/directions/python/questions?type=BEHAVIORAL');
    expect(res.status).toBe(200);
    expect(res.body.questions[0].type).toBe('BEHAVIORAL');
  });

  it('filters by topic slug', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue(baseDirection);
    mockPrisma.question.findMany.mockResolvedValue([
      { id: 'q1', text: 'Event loop', difficulty: 'JUNIOR', type: 'TECHNICAL', answer: 'ans', topic: { name: 'Async', slug: 'async' }, _count: { interviewQuestions: 1 } },
    ]);

    const res = await request(app()).get('/api/directions/python/questions?topic=async');
    expect(res.status).toBe(200);
    expect(mockPrisma.question.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ topic: { slug: 'async' } }),
    }));
  });

  it('returns 404 for unknown direction', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue(null);
    const res = await request(app()).get('/api/directions/unknown/questions');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Direction not found');
  });

  it('returns 500 on db error', async () => {
    mockPrisma.direction.findUnique.mockRejectedValue(new Error('db down'));
    const res = await request(app()).get('/api/directions/python/questions');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
