// In-memory хранилище mock-сессий и rate-limit по IP.
// Сознательно без БД: пользователь попросил заглушки, а миграция моделей
// под сессии потребовала бы прогона prisma migrate в их окружении.
// При желании позже легко переносится в Prisma — интерфейс одинаковый.

import { randomUUID } from 'node:crypto';
import type { Direction, Grade, MockQuestion, CodingTask } from './mockBank';

export type Stage = 'qa' | 'coding' | 'finished';

export interface AnswerRecord {
  questionId: string;
  questionText: string;
  topic: string;
  kind: 'soft' | 'theory' | 'practice';
  userAnswer: string;
  aiReviewText: string;
  aiScore: number; // 0..10
  aiFlags: string[]; // короткие теги: "чёткая структура", "слабая типизация"...
}

export interface CodingRecord {
  taskId: string;
  title: string;
  language: string;
  userCode: string;
  aiReviewText: string;
  aiScore: number; // 0..10
  testsPassed: number;
  testsTotal: number;
}

export interface MockSession {
  id: string;
  createdAt: number;
  ip: string;
  direction: Direction;
  grade: Grade;
  stage: Stage;

  questions: MockQuestion[];
  codingTasks: CodingTask[];

  currentQuestionIdx: number; // индекс текущего вопроса в массиве questions
  currentCodingIdx: number;

  answers: AnswerRecord[];
  coding: CodingRecord[];

  finalReport?: {
    totalScore: number; // 0..100
    verdict: 'passed' | 'failed';
    summary: string;
    strengths: string[];
    weaknesses: string[];
    toImprove: string[];
    skillBreakdown: Record<string, number>; // topic -> 0..100
  };
}

const sessions = new Map<string, MockSession>();

// Rate limit: IP -> список timestamp начала интервью (epoch ms) за последние 7 суток
const rateLog = new Map<string, number[]>();
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_PER_WEEK = parseInt(process.env.MOCK_MAX_PER_WEEK ?? '3', 10);

function gc(ip: string): number[] {
  const now = Date.now();
  const list = (rateLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  rateLog.set(ip, list);
  return list;
}

export function rateLimitStatus(ip: string) {
  const list = gc(ip);
  const remaining = Math.max(0, MAX_PER_WEEK - list.length);
  const resetAt = list.length > 0 ? Math.min(...list) + WINDOW_MS : null;
  return { used: list.length, limit: MAX_PER_WEEK, remaining, resetAt };
}

export function tryConsume(ip: string): boolean {
  const list = gc(ip);
  if (list.length >= MAX_PER_WEEK) return false;
  list.push(Date.now());
  rateLog.set(ip, list);
  return true;
}

export function createSession(params: {
  ip: string;
  direction: Direction;
  grade: Grade;
  questions: MockQuestion[];
  codingTasks: CodingTask[];
}): MockSession {
  const session: MockSession = {
    id: randomUUID(),
    createdAt: Date.now(),
    ip: params.ip,
    direction: params.direction,
    grade: params.grade,
    stage: 'qa',
    questions: params.questions,
    codingTasks: params.codingTasks,
    currentQuestionIdx: 0,
    currentCodingIdx: 0,
    answers: [],
    coding: [],
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): MockSession | undefined {
  return sessions.get(id);
}

// Периодическая чистка старых сессий (>24ч), чтобы память не росла
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, s] of sessions) {
    if (s.createdAt < cutoff) sessions.delete(id);
  }
}, 60 * 60 * 1000).unref?.();