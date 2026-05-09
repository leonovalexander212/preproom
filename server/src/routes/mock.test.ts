import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.hoisted(() => {
  process.env.MOCK_SIGN_SECRET = 'test-secret-256-bits-long-string-1234567890';
});

vi.mock('../lib/prisma', () => ({ prisma: { direction: { findUnique: vi.fn() }, interview: { findMany: vi.fn() } } }));
vi.mock('../lib/llm', () => ({ llm: { client: { chat: { completions: { create: vi.fn() } } }, model: 'test-model', provider: 'groq' } }));
vi.mock('../lib/mdLoader', () => ({ loadTasks: vi.fn(() => [{ id: 't1', title: 'T1', description: 'D1', starterCode: 'c1', language: 'python', difficulty: 'easy' }, { id: 't2', title: 'T2', description: 'D2', starterCode: 'c2', language: 'python', difficulty: 'medium' }]), pickRandomTasks: vi.fn((arr: any[], n: number) => arr.slice(0, n)) }));

import { prisma } from '../lib/prisma';
const mockPrisma = prisma as any;

import mockRouter from './mock';

function app() {
  const a = express();
  a.use(express.json());
  a.use('/api/mock', mockRouter);
  return a;
}

describe('GET /api/mock/directions', () => {
  it('returns directions and grades', async () => {
    const res = await request(app()).get('/api/mock/directions');
    expect(res.status).toBe(200);
    expect(res.body.directions).toBeInstanceOf(Array);
    expect(res.body.grades).toBeInstanceOf(Array);
  });
});

describe('GET /api/mock/rate-limit', () => {
  it('allows first request', async () => {
    const res = await request(app()).get('/api/mock/rate-limit');
    expect(res.status).toBe(200);
    expect(res.body.allowed).toBe(true);
    expect(res.body.retryAfter).toBe(0);
  });
});

describe('POST /api/mock/start', () => {
  it('rejects invalid body', async () => {
    const res = await request(app()).post('/api/mock/start').send({ direction: 'invalid', grade: 'JUNIOR' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('bad_request');
  });

  it('returns 503 when no eligible interviews', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue({ id: 'dir-python', slug: 'python' });
    mockPrisma.interview.findMany.mockResolvedValue([]);
    const res = await request(app()).post('/api/mock/start').send({ direction: 'python', grade: 'JUNIOR' });
    expect(res.status).toBe(503);
    expect(res.body.error).toBe('no_eligible_interview');
  });

  it('returns 500 when db direction missing', async () => {
    mockPrisma.direction.findUnique.mockResolvedValue(null);
    const res = await request(app()).post('/api/mock/start').send({ direction: 'python', grade: 'JUNIOR' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('db_direction_missing');
  });
});
