import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const PING_INTERVAL_MS = 15_000;

type CheckState = 'checking' | 'up' | 'down';

interface Check {
  id: string;
  name: string;
  description: string;
  endpoint: string;
}

const CHECKS: Check[] = [
  { id: 'api',  name: 'API сервер',         description: 'Основной HTTP-интерфейс',     endpoint: '/api/directions' },
  { id: 'db',   name: 'База данных',        description: 'Postgres через Prisma',       endpoint: '/api/directions' },
];

interface CheckStatus {
  state: CheckState;
  latency: number;
  lastChecked: Date | null;
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ current }: { current: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '4px 11px', borderRadius: 999,
      background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)',
      color: '#a5b4fc', fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 22,
    }}>
      <Link
        to="/"
        style={{ color: 'inherit', textDecoration: 'none', transition: 'color 160ms' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = '#a5b4fc')}
      >
        Платформа
      </Link>
      <span style={{ opacity: 0.5 }}>/</span>
      {current}
    </div>
  );
}

// ── Status dot (pulsing) ──────────────────────────────────────────────────────
function StatusDot({ state, size = 10 }: { state: CheckState; size?: number }) {
  const color = state === 'up' ? '#34d399' : state === 'down' ? '#f87171' : '#fbbf24';
  return (
    <span style={{ position: 'relative', width: size, height: size, display: 'inline-block', flexShrink: 0 }}>
      <span style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%', background: color,
        boxShadow: `0 0 ${size * 1.4}px ${color}aa`,
      }} />
      {state !== 'checking' && (
        <span style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%', background: color,
          opacity: 0.5,
          animation: `pingPulse 2s ease-out infinite`,
        }} />
      )}
    </span>
  );
}

// ── StatusPage ────────────────────────────────────────────────────────────────
export function StatusPage() {
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(CHECKS.map(c => [c.id, { state: 'checking' as CheckState, latency: 0, lastChecked: null }]))
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function pingCheck(check: Check) {
    const start = Date.now();
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(`${API_URL}${check.endpoint}`, { signal: ctrl.signal });
      clearTimeout(timeout);
      const latency = Date.now() - start;
      setStatuses(s => ({
        ...s,
        [check.id]: {
          state: res.ok ? 'up' : 'down',
          latency,
          lastChecked: new Date(),
        },
      }));
    } catch {
      setStatuses(s => ({
        ...s,
        [check.id]: {
          state: 'down',
          latency: 0,
          lastChecked: new Date(),
        },
      }));
    }
  }

  function pingAll() {
    CHECKS.forEach(c => pingCheck(c));
  }

  useEffect(() => {
    pingAll();
    intervalRef.current = setInterval(pingAll, PING_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const allUp = CHECKS.every(c => statuses[c.id]?.state === 'up');
  const anyDown = CHECKS.some(c => statuses[c.id]?.state === 'down');
  const checking = CHECKS.some(c => statuses[c.id]?.state === 'checking');

  const overallState: CheckState = anyDown ? 'down' : allUp ? 'up' : 'checking';
  const overallTitle = anyDown
    ? 'Зафиксированы перебои'
    : allUp
      ? 'Все системы работают'
      : 'Проверка статуса...';
  const overallColor = overallState === 'up' ? '#34d399' : overallState === 'down' ? '#f87171' : '#fbbf24';

  return (
    <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0' }}>
      <style>{`
        @keyframes pingPulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          80%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
      `}</style>

      <section style={{ padding: '70px 64px 60px', maxWidth: 760, margin: '0 auto' }}>
        <Breadcrumb current="Статус API" />

        <h1 style={{ margin: 0, fontSize: 56, fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.05 }}>
          Статус системы
        </h1>
        <p style={{ marginTop: 14, fontSize: 14, color: '#94a3b8', lineHeight: 1.6, maxWidth: 520 }}>
          Текущая работоспособность сервисов платформы. Обновление автоматическое каждые 15 секунд.
        </p>

        {/* Overall status banner */}
        <div style={{
          marginTop: 36,
          padding: '20px 24px',
          borderRadius: 12,
          border: `1px solid ${overallColor}40`,
          background: `${overallColor}0d`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: `0 8px 30px -16px ${overallColor}88`,
        }}>
          <StatusDot state={overallState} size={14} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
              {overallTitle}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Последняя проверка: {checking ? 'выполняется...' : 'только что'}
            </div>
          </div>
        </div>

        {/* Individual checks */}
        <div style={{ marginTop: 28, display: 'grid', gap: 10 }}>
          {CHECKS.map(check => {
            const s = statuses[check.id];
            const stateColor = s?.state === 'up' ? '#34d399' : s?.state === 'down' ? '#f87171' : '#fbbf24';
            return (
              <div
                key={check.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(22,23,29,0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <StatusDot state={s?.state ?? 'checking'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{check.name}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{check.description}</div>
                </div>
                <div style={{
                  fontSize: 11,
                  color: stateColor,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: 'right',
                }}>
                  {s?.state === 'up' && `${s.latency} мс`}
                  {s?.state === 'down' && 'недоступен'}
                  {s?.state === 'checking' && '...'}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: 36, fontSize: 11.5, color: '#475569', lineHeight: 1.6 }}>
          Если вы видите красную лампочку — попробуйте обновить страницу через минуту.
          Если проблема не решается, напишите на{' '}
          <a href="mailto:leonovalexanderip212@yandex.ru" style={{ color: '#a5b4fc' }}>
            leonovalexanderip212@yandex.ru
          </a>.
        </p>
      </section>
    </div>
  );
}
