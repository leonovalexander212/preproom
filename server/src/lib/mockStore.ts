// In-memory хранилище mock-сессий и rate-limit по IP.
// Анти-абуз: при abort попытка НЕ возвращается.

import { randomUUID } from 'node:crypto';
import type { Direction, Grade } from './mockBank';

export type Stage = 'qa' | 'coding' | 'finished' | 'aborted';
export type QuestionKind = 'theory' | 'practice' | 'coding';

export interface MockQuestionRuntime {
  id: string;          // questionId из БД
  text: string;
  topic: string;
  kind: QuestionKind;  // всегда 'theory' для real-DB вопросов
}

export interface CodingTaskRuntime {
  id: string;          // md-id
  title: string;
  description: string;
  starterCode: string;
  language: 'python' | 'java' | 'javascript' | 'php';
  difficulty: 'easy' | 'medium' | 'hard';
  testsCount: number;  // не показываем сами тесты
}

export interface AnswerRecord {
  questionId: string;
  questionText: string;
  topic: string;
  userAnswer: string;
}

export interface CodingRecord {
  taskId: string;
  title: string;
  language: string;
  userCode: string;
  testsPassed: number;
  testsTotal: number;
  errorSample?: string; // короткий первый сбой, без выдачи expected
}

export interface FinalReport {
  totalScore: number;        // 0..100
  rank: 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  rankLabel: string;
  verdict: 'passed' | 'failed';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  toImprove: string[];
}

export interface MockSession {
  id: string;
  createdAt: number;
  startedAt: number;
  durationMs: number;
  ip: string;
  direction: Direction;
  grade: Grade;
  stage: Stage;
  sourceInterviewTitle: string | null;

  questions: MockQuestionRuntime[];
  codingTasks: CodingTaskRuntime[];

  currentQuestionIdx: number;
  currentCodingIdx: number;

  answers: AnswerRecord[];
  coding: CodingRecord[];

  finalReport?: FinalReport;
}

const sessions = new Map<string, MockSession>();

const rateLog = new Map<string, number[]>();
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_PER_WEEK = parseInt(process.env.MOCK_MAX_PER_WEEK ?? '3', 10);

// Длительность теста — 35 минут по умолчанию (можно сделать 30 или 40 через env)
export const DURATION_MS = parseInt(process.env.MOCK_DURATION_MS ?? `${35 * 60 * 1000}`, 10);

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
  questions: MockQuestionRuntime[];
  codingTasks: CodingTaskRuntime[];
  sourceInterviewTitle: string | null;
}): MockSession {
  const now = Date.now();
  const session: MockSession = {
    id: randomUUID(),
    createdAt: now,
    startedAt: now,
    durationMs: DURATION_MS,
    ip: params.ip,
    direction: params.direction,
    grade: params.grade,
    stage: 'qa',
    sourceInterviewTitle: params.sourceInterviewTitle,
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

export function abortSession(id: string): MockSession | undefined {
  const s = sessions.get(id);
  if (!s) return undefined;
  if (s.stage === 'finished' || s.stage === 'aborted') return s;
  s.stage = 'aborted';
  return s;
}

export function isExpired(s: MockSession): boolean {
  return Date.now() - s.startedAt > s.durationMs;
}

export function remainingMs(s: MockSession): number {
  return Math.max(0, s.durationMs - (Date.now() - s.startedAt));
}

// GC старых сессий (>24ч)
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, s] of sessions) {
    if (s.createdAt < cutoff) sessions.delete(id);
  }
}, 60 * 60 * 1000).unref?.();