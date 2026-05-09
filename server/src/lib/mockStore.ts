// In-memory хранилище mock-сессий и progressive penalty по IP.
// Анти-абуз: при abort попытка НЕ возвращается.

import { createHmac, randomUUID } from 'node:crypto';
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
  language: 'python' | 'java' | 'javascript' | 'php' | 'csharp';
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
  errorSample?: string; // first failure sample, no expected value revealed
}

export interface AntiCheatResult {
  cheaterDetected: boolean;
  flaggedAnswers: number[];   // 1-based indices of flagged answers
  markerCount: number;
}

export interface FinalReport {
  totalScore: number;        // 0..100
  rank: 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'F';
  rankLabel: string;
  verdict: 'passed' | 'failed' | 'cheater';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  toImprove: string[];
  antiCheat?: AntiCheatResult;
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

if (!process.env.MOCK_SIGN_SECRET) {
  throw new Error('MOCK_SIGN_SECRET is required');
}
const SIGN_SECRET = process.env.MOCK_SIGN_SECRET;

/* ---------------- Progressive Penalty System ---------------- */

interface PenaltyRecord {
  count: number;                // сколько моков запущено (включая текущий)
  lastAttemptAt: number;        // timestamp последнего старта
  lastCompletedAt: number | null; // timestamp последнего успешного завершения
}

const penaltyLog = new Map<string, PenaltyRecord>();

// Progressive penalty tiers (ms):
// count=1 → 0ms  (первый мок сразу)
// count>=2 → 7 дней (строго 1 мок на неделю)
const PENALTY_MS: Record<number, number> = {
  1: 0,
};

function getPenaltyMs(count: number): number {
  if (count >= 2) return 7 * 24 * 3600_000;
  return PENALTY_MS[count] ?? 0;
}

function sign(ts: number): string {
  const payload = String(ts);
  const hmac = createHmac('sha256', SIGN_SECRET).update(payload).digest('hex').slice(0, 16);
  return `${payload}.${hmac}`;
}

export function verifySignedCooldown(signed: string): { valid: boolean; retryAfter: number } {
  const [payload, hmac] = signed.split('.');
  if (!payload || !hmac) return { valid: false, retryAfter: 0 };
  const expected = createHmac('sha256', SIGN_SECRET).update(payload).digest('hex').slice(0, 16);
  if (expected !== hmac) return { valid: false, retryAfter: 0 };
  const ts = parseInt(payload, 10);
  if (isNaN(ts)) return { valid: false, retryAfter: 0 };
  return { valid: true, retryAfter: Math.max(0, Math.ceil((ts - Date.now()) / 1000)) };
}

export function canStart(ip: string): { ok: boolean; retryAfter: number; signed?: string } {
  const rec = penaltyLog.get(ip);
  if (!rec) return { ok: true, retryAfter: 0 };

  const timeSinceAttempt = Date.now() - rec.lastAttemptAt;
  const penaltyMs = getPenaltyMs(rec.count);
  if (timeSinceAttempt >= penaltyMs) {
    return { ok: true, retryAfter: 0 };
  }

  const retryAfter = Math.ceil((penaltyMs - timeSinceAttempt) / 1000);
  return { ok: false, retryAfter, signed: sign(rec.lastAttemptAt + penaltyMs) };
}

export function recordStart(ip: string): void {
  const rec = penaltyLog.get(ip);
  if (!rec) {
    penaltyLog.set(ip, { count: 1, lastAttemptAt: Date.now(), lastCompletedAt: null });
  } else {
    rec.count++;
    rec.lastAttemptAt = Date.now();
  }
}

export function recordCompletion(ip: string): void {
  const rec = penaltyLog.get(ip);
  if (rec) {
    rec.lastCompletedAt = Date.now();
    // Нет сброса штрафа — строго 1 мок на неделю
  }
}

// Legacy rate-limit (недельный hard-cap, оставляем как safety-net)
const rateLog = new Map<string, number[]>();
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_PER_WEEK = parseInt(process.env.MOCK_MAX_PER_WEEK ?? '1', 10);

function gcLegacy(ip: string): number[] {
  const now = Date.now();
  const list = (rateLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  rateLog.set(ip, list);
  return list;
}

export function rateLimitStatus(ip: string) {
  const list = gcLegacy(ip);
  const remaining = Math.max(0, MAX_PER_WEEK - list.length);
  const resetAt = list.length > 0 ? Math.min(...list) + WINDOW_MS : null;
  return { used: list.length, limit: MAX_PER_WEEK, remaining, resetAt };
}

export function tryConsume(ip: string): boolean {
  const list = gcLegacy(ip);
  if (list.length >= MAX_PER_WEEK) return false;
  list.push(Date.now());
  rateLog.set(ip, list);
  return true;
}

/* ---------------- Session Lifecycle ---------------- */

// Длительность теста — 35 минут по умолчанию
export const DURATION_MS = parseInt(process.env.MOCK_DURATION_MS ?? `${35 * 60 * 1000}`, 10);

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

// GC старых penalty records (> 7 дней)
setInterval(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  for (const [ip, rec] of penaltyLog) {
    if (rec.lastAttemptAt < cutoff) penaltyLog.delete(ip);
  }
}, 60 * 60 * 1000).unref?.();