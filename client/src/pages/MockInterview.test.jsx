import { describe, it, expect, vi, beforeEach } from 'vitest';

function parseSignedCooldown(signed) {
  const [payload] = (signed || "").split(".");
  const ts = parseInt(payload, 10);
  if (isNaN(ts)) return 0;
  return Math.max(0, Math.ceil((ts - Date.now()) / 1000));
}

function fmtTime(ms) {
  if (ms <= 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

async function apiFetch(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (e) {
    throw new Error(`Сеть не отвечает: ${e.message}`);
  }
  const text = await res.text();
  let data = null;
  if (text) { try { data = JSON.parse(text); } catch {} }
  if (!res.ok) {
    const msg = data?.message || data?.error || text?.slice(0, 200) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  if (!data) throw new Error(`Пустой ответ HTTP ${res.status}.`);
  return data;
}

describe('parseSignedCooldown', () => {
  it('returns 0 for empty string', () => {
    expect(parseSignedCooldown('')).toBe(0);
  });

  it('returns 0 for invalid input', () => {
    expect(parseSignedCooldown('abc.def')).toBe(0);
  });

  it('returns 0 for expired cooldown', () => {
    const past = Date.now() - 60000;
    expect(parseSignedCooldown(`${past}.sig`)).toBe(0);
  });

  it('returns positive for future cooldown', () => {
    const future = Date.now() + 120000;
    const result = parseSignedCooldown(`${future}.sig`);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(120);
  });
});

describe('fmtTime', () => {
  it('formats 0 ms', () => {
    expect(fmtTime(0)).toBe('00:00');
  });

  it('formats negative as 00:00', () => {
    expect(fmtTime(-1000)).toBe('00:00');
  });

  it('formats seconds', () => {
    expect(fmtTime(45000)).toBe('00:45');
  });

  it('formats minutes', () => {
    expect(fmtTime(125000)).toBe('02:05');
  });
});

describe('apiFetch', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('returns parsed JSON on success', async () => {
    global.fetch.mockResolvedValue({ ok: true, text: async () => '{"id":"1"}' });
    const data = await apiFetch('/test');
    expect(data).toEqual({ id: '1' });
  });

  it('throws on network error', async () => {
    global.fetch.mockRejectedValue(new Error('offline'));
    await expect(apiFetch('/test')).rejects.toThrow('Сеть не отвечает');
  });

  it('throws on HTTP error with message', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 429, text: async () => '{"error":"rate_limit"}' });
    await expect(apiFetch('/test')).rejects.toThrow('rate_limit');
  });

  it('throws on empty success body', async () => {
    global.fetch.mockResolvedValue({ ok: true, text: async () => '' });
    await expect(apiFetch('/test')).rejects.toThrow('Пустой ответ');
  });
});
