import { describe, it, expect, vi } from 'vitest';

vi.hoisted(() => {
  process.env.MOCK_SIGN_SECRET = 'test-secret-256-bits-long-string-1234567890';
});

import {
  verifySignedCooldown,
  canStart,
  recordStart,
  recordCompletion,
  rateLimitStatus,
  tryConsume,
  createSession,
  getSession,
  abortSession,
  isExpired,
  remainingMs,
  MAX_PER_WEEK,
} from './mockStore';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
let seq = 0;
const ip = () => `10.0.0.${++seq}`;

describe('verifySignedCooldown', () => {
  it('accepts a valid signed cooldown', () => {
    const ts = Date.now() + 60000;
    const signed = `${ts}.${require('node:crypto').createHmac('sha256', process.env.MOCK_SIGN_SECRET!).update(String(ts)).digest('hex').slice(0, 16)}`;
    const result = verifySignedCooldown(signed);
    expect(result.valid).toBe(true);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('rejects tampered signature', () => {
    const signed = `${Date.now() + 60000}.deadbeef00000000`;
    const result = verifySignedCooldown(signed);
    expect(result.valid).toBe(false);
    expect(result.retryAfter).toBe(0);
  });

  it('rejects expired cooldown', () => {
    const ts = Date.now() - 1000;
    const signed = `${ts}.${require('node:crypto').createHmac('sha256', process.env.MOCK_SIGN_SECRET!).update(String(ts)).digest('hex').slice(0, 16)}`;
    const result = verifySignedCooldown(signed);
    expect(result.valid).toBe(true);
    expect(result.retryAfter).toBe(0);
  });

  it('rejects malformed input', () => {
    expect(verifySignedCooldown('')).toEqual({ valid: false, retryAfter: 0 });
    expect(verifySignedCooldown('no-dot')).toEqual({ valid: false, retryAfter: 0 });
    expect(verifySignedCooldown('abc.def')).toEqual({ valid: false, retryAfter: 0 });
  });
});

describe('canStart', () => {
  it('allows first mock attempt', () => {
    expect(canStart(ip())).toEqual({ ok: true, retryAfter: 0 });
  });

  it('blocks second attempt within 7 days', () => {
    const addr = ip();
    recordStart(addr);
    recordStart(addr);
    const result = canStart(addr);
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
    expect(result.signed).toBeDefined();
  });

  it('allows retry after penalty expires', () => {
    const addr = ip();
    recordStart(addr);
    recordStart(addr);
    vi.useFakeTimers();
    vi.advanceTimersByTime(WEEK_MS + 1000);
    expect(canStart(addr)).toEqual({ ok: true, retryAfter: 0 });
    vi.useRealTimers();
  });
});

describe('recordStart', () => {
  it('increments count on repeated attempts', () => {
    const addr = ip();
    recordStart(addr);
    recordStart(addr);
    expect(canStart(addr).ok).toBe(false);
  });
});

describe('recordCompletion', () => {
  it('does not reset penalty', () => {
    const addr = ip();
    recordStart(addr);
    recordStart(addr);
    recordCompletion(addr);
    expect(canStart(addr).ok).toBe(false);
  });
});

describe('legacy rate limit', () => {
  it('tracks consumption', () => {
    const addr = ip();
    expect(rateLimitStatus(addr).remaining).toBe(MAX_PER_WEEK);
    expect(tryConsume(addr)).toBe(true);
    expect(rateLimitStatus(addr).remaining).toBe(MAX_PER_WEEK - 1);
    expect(tryConsume(addr)).toBe(false);
  });
});

describe('session lifecycle', () => {
  it('creates and retrieves session', () => {
    const session = createSession({
      ip: ip(),
      direction: 'python',
      grade: 'JUNIOR',
      questions: [{ id: 'q1', text: 'Test?', topic: 'test', kind: 'theory' }],
      codingTasks: [],
      sourceInterviewTitle: 'test',
    });
    expect(session.id).toBeDefined();
    expect(session.stage).toBe('qa');
    expect(getSession(session.id)).toBeDefined();
  });

  it('aborts active session', () => {
    const session = createSession({
      ip: ip(),
      direction: 'python',
      grade: 'JUNIOR',
      questions: [],
      codingTasks: [],
      sourceInterviewTitle: null,
    });
    const aborted = abortSession(session.id);
    expect(aborted?.stage).toBe('aborted');
    expect(abortSession(session.id)?.stage).toBe('aborted');
  });

  it('detects expired session', () => {
    vi.useFakeTimers();
    const session = createSession({
      ip: ip(),
      direction: 'python',
      grade: 'JUNIOR',
      questions: [],
      codingTasks: [],
      sourceInterviewTitle: null,
    });
    vi.advanceTimersByTime(session.durationMs + 1);
    expect(isExpired(session)).toBe(true);
    expect(remainingMs(session)).toBe(0);
    vi.useRealTimers();
  });
});
