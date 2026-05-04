import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Direction } from '../types/api';

// ── Direction icons (inline SVG) ──────────────────────────────────────────────
const ICONS: Record<string, (s?: number) => JSX.Element> = {
  java: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="m8 4-2 4 2 3-2 3"/><path d="M14 4l-2 4 2 3-2 3"/><path d="M5 18c4 2 10 2 14 0"/><path d="M7 21c3 1 7 1 10 0"/>
    </svg>
  ),
  python: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="13" rx="3"/><path d="M4 9h16M9 3v6M15 9v7"/>
    </svg>
  ),
  php: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M8 10v4m0-2h3a1 1 0 0 1 0 2H8"/><path d="M14 10h2a2 2 0 0 1 0 4h-2v-4"/>
    </svg>
  ),
  qa: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M20 6 9 17l-5-5"/><circle cx="12" cy="12" r="9"/>
    </svg>
  ),
  frontend: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 14l-2 2 2 2M16 14l2 2-2 2"/>
    </svg>
  ),
  sql: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>
    </svg>
  ),
  default: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 9h6M9 12h6M9 15h4"/>
    </svg>
  ),
};

function getIcon(slug: string) {
  return (ICONS[slug] ?? ICONS.default)(16);
}

// ── CountUp animation ─────────────────────────────────────────────────────────
function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    let raf: number;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(Math.round(eased * to));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v.toLocaleString('ru')}</>;
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(full: string, { speed = 28, startDelay = 0, key = 0 } = {}) {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setN(0); setDone(false);
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(function step() {
      if (cancelled) return;
      let i = 0;
      const id = setInterval(() => {
        if (cancelled) { clearInterval(id); return; }
        i++;
        setN(i);
        if (i >= full.length) { clearInterval(id); setDone(true); }
      }, speed);
      timers.push(id as unknown as ReturnType<typeof setTimeout>);
    }, startDelay));
    return () => { cancelled = true; timers.forEach(t => { clearTimeout(t); clearInterval(t as unknown as ReturnType<typeof setInterval>); }); };
  }, [full, speed, startDelay, key]);
  return { text: full.slice(0, n), done };
}

// ── Code scenarios ────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    file: 'binary_search.py',
    src: [
      { l: '1',  parts: [['k','class'], ['s',' '], ['c','Solution:']] },
      { l: '2',  parts: [['s','    '], ['c','# Оптимизированный бинарный поиск']] },
      { l: '3',  parts: [['s','    '], ['k','def'], ['s',' '], ['fn','search'], ['s','(self, nums: '], ['ty','list'], ['s',', target: '], ['ty','int'], ['s','):']] },
      { l: '4',  parts: [['s','        left, right = 0, '], ['nm','len'], ['s','(nums) - 1']] },
      { l: '5',  parts: [['s','        '], ['k','while'], ['s',' left <= right:']] },
      { l: '6',  parts: [['s','            mid = (left + right) // 2']] },
      { l: '7',  parts: [['s','            '], ['k','if'], ['s',' nums[mid] == target:']] },
      { l: '8',  parts: [['s','                '], ['k','return'], ['s',' mid']] },
      { l: '9',  parts: [['s','            '], ['k','elif'], ['s',' nums[mid] < target:']] },
      { l: '10', parts: [['s','                left = mid + 1']] },
      { l: '11', parts: [['s','            '], ['k','else'], ['s',':']] },
      { l: '12', parts: [['s','                right = mid - 1']] },
      { l: '13', parts: [['s','        '], ['k','return'], ['s',' -1']] },
    ],
    term: ['$ python binary_search.py','Тест 1: ПРОЙДЕН (2ms)','Тест 2: ПРОЙДЕН (1ms)','Тест 3: ПРОЙДЕН (4ms)','Сложность: O(log n) — OK'],
  },
  {
    file: 'two_sum.py',
    src: [
      { l: '1', parts: [['k','def'], ['s',' '], ['fn','two_sum'], ['s','(nums: '], ['ty','list'], ['s',', target: '], ['ty','int'], ['s','):']] },
      { l: '2', parts: [['s','    '], ['c','# хэш-таблица: значение → индекс']] },
      { l: '3', parts: [['s','    seen = {}']] },
      { l: '4', parts: [['s','    '], ['k','for'], ['s',' i, x '], ['k','in'], ['s',' '], ['nm','enumerate'], ['s','(nums):']] },
      { l: '5', parts: [['s','        need = target - x']] },
      { l: '6', parts: [['s','        '], ['k','if'], ['s',' need '], ['k','in'], ['s',' seen:']] },
      { l: '7', parts: [['s','            '], ['k','return'], ['s',' [seen[need], i]']] },
      { l: '8', parts: [['s','        seen[x] = i']] },
      { l: '9', parts: [['s','    '], ['k','return'], ['s',' []']] },
    ],
    term: ['$ pytest two_sum.py -q','....                                    [100%]','4 passed in 0.08s','Память: 14.2 MB · Время: 38ms'],
  },
];

const COLOR: Record<string, string> = {
  k: '#c084fc', c: '#475569', fn: '#60a5fa', ty: '#fbbf24', nm: '#34d399', s: '#cbd5e1',
};

function CodeMock() {
  const [run, setRun] = useState(0);
  const [fading, setFading] = useState(false);
  const scenario = SCENARIOS[run % SCENARIOS.length];
  const PY_SOURCE = scenario.src;
  const PY_FULL = PY_SOURCE.map(r => r.parts.map(p => p[1]).join('')).join('\n');
  const { text, done: codeDone } = useTypewriter(PY_FULL, { speed: 22, key: run });

  let consumed = 0;
  const visibleLines = PY_SOURCE.map((row, i) => {
    const lineStr = row.parts.map(p => p[1]).join('');
    const lineLen = lineStr.length + (i < PY_SOURCE.length - 1 ? 1 : 0);
    const startsAt = consumed; consumed += lineLen;
    const remaining = Math.max(0, text.length - startsAt);
    if (remaining <= 0) return null;
    let need = Math.min(remaining, lineStr.length);
    const out: JSX.Element[] = [];
    for (let j = 0; j < row.parts.length; j++) {
      const [kind, str] = row.parts[j];
      if (need <= 0) break;
      const take = str.slice(0, need);
      out.push(<span key={j} style={{ color: COLOR[kind] || '#cbd5e1', fontStyle: kind === 'c' ? 'italic' : 'normal' }}>{take}</span>);
      need -= take.length;
    }
    return { l: row.l, content: out };
  }).filter(Boolean);

  const TERM_FULL = scenario.term.join('\n') + '\n';
  const { text: termText, done: termDone } = useTypewriter(codeDone ? TERM_FULL : '', { speed: 28, startDelay: 800, key: run });

  useEffect(() => {
    if (!termDone) return;
    const idHold = setTimeout(() => setFading(true), 4500);
    const idSwap = setTimeout(() => { setRun(r => r + 1); setFading(false); }, 5200);
    return () => { clearTimeout(idHold); clearTimeout(idSwap); };
  }, [termDone]);

  const termLines = termText.split('\n');

  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      background: '#0d0e14',
      boxShadow: '0 30px 60px -30px rgba(99,102,241,0.35), 0 20px 60px -30px rgba(0,0,0,0.6)',
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 12,
      opacity: fading ? 0 : 1,
      transform: fading ? 'translateY(4px)' : 'translateY(0)',
      transition: 'opacity 700ms ease, transform 700ms ease',
    }}>
      {/* title bar */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'block' }}/>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'block' }}/>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'block' }}/>
        <div style={{ flex: 1, textAlign: 'center', color: '#64748b', fontSize: 11 }}>{scenario.file}</div>
        <div style={{ fontSize: 9.5, color: codeDone ? '#10b981' : '#fbbf24', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 6px currentColor', display: 'block' }}/>
          {codeDone ? 'ready' : 'typing'}
        </div>
      </div>
      {/* code area */}
      <div style={{ padding: '16px 18px', color: '#cbd5e1', lineHeight: 1.7, height: 300, overflow: 'hidden' }}>
        {PY_SOURCE.map((row, i) => {
          const v = visibleLines.find(vl => vl && vl.l === row.l);
          const isLast = v && i === visibleLines.length - 1 && !codeDone;
          return (
            <div key={row.l} style={{ display: 'flex', gap: 14, opacity: v ? 1 : 0.15 }}>
              <span style={{ color: '#334155', width: 18, textAlign: 'right', flexShrink: 0 }}>{row.l}</span>
              <span style={{ whiteSpace: 'pre' }}>
                {v ? v.content : ''}
                {isLast && <span className="twk-cursor" style={{ color: '#a5b4fc' }} />}
              </span>
            </div>
          );
        })}
      </div>
      {/* terminal */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 18px', background: 'rgba(99,102,241,0.04)', color: '#94a3b8', height: 120, overflow: 'hidden' }}>
        <div style={{ color: '#64748b', marginBottom: 4, fontSize: 11 }}>// terminal</div>
        {termLines.map((line, i) => {
          const isLast = i === termLines.length - 1;
          let body: JSX.Element | string;
          if (line.startsWith('$ ')) {
            body = <><span style={{ color: '#a5b4fc' }}>$</span>{line.slice(1)}</>;
          } else if (line.includes('ПРОЙДЕН')) {
            const idx = line.indexOf('ПРОЙДЕН');
            body = <>{line.slice(0, idx)}<span style={{ color: '#10b981' }}>ПРОЙДЕН</span>{line.slice(idx + 7)}</>;
          } else { body = line; }
          return (
            <div key={i} style={{ whiteSpace: 'pre' }}>
              {body}{isLast && !termDone && <span className="twk-cursor" style={{ color: '#a5b4fc' }} />}
            </div>
          );
        })}
        {termDone && <div style={{ whiteSpace: 'pre' }}><span style={{ color: '#a5b4fc' }}>$</span><span className="twk-cursor" style={{ color: '#a5b4fc' }} /></div>}
      </div>
    </div>
  );
}

// ── Direction card ────────────────────────────────────────────────────────────
function DirectionCard({ d, isHover, onHover }: { d: Direction; isHover: boolean; onHover: (v: boolean) => void }) {
  const isEmpty = d._count.questions === 0;
  const inner = (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        padding: '22px 20px 24px',
        borderRadius: 12,
        border: `1px solid ${isHover && !isEmpty ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
        background: 'rgba(22,23,29,0.65)',
        cursor: isEmpty ? 'default' : 'pointer',
        transition: 'all 200ms ease',
        transform: isHover && !isEmpty ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isHover && !isEmpty ? '0 14px 32px -16px rgba(99,102,241,0.6)' : 'none',
        opacity: isEmpty ? 0.55 : 1,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.25)',
        color: '#a5b4fc',
        display: 'grid', placeItems: 'center',
        marginBottom: 18,
      }}>
        {getIcon(d.slug)}
      </div>
      <div style={{ fontSize: 14.5, color: '#fff', fontWeight: 600, marginBottom: 6 }}>
        {d.name}
        {isEmpty && <span style={{ marginLeft: 8, fontSize: 10, color: '#64748b', fontWeight: 500 }}>скоро</span>}
      </div>
      <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
        {d.description || `${d._count.questions} вопросов · ${d._count.interviews} интервью`}
      </div>
    </div>
  );
  if (isEmpty) return inner;
  return <Link to={`/d/${d.slug}`} style={{ textDecoration: 'none' }}>{inner}</Link>;
}

// ── Check icon ────────────────────────────────────────────────────────────────
const CheckIcon = (s = 11) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const ArrowIcon = (s = 12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

// ── HomePage ──────────────────────────────────────────────────────────────────
export function HomePage() {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  const { data: directions, isLoading } = useQuery({
    queryKey: ['directions'],
    queryFn: api.getDirections,
  });

  const totalQuestions  = directions?.reduce((s, d) => s + d._count.questions,  0) ?? 0;
  const totalInterviews = directions?.reduce((s, d) => s + d._count.interviews, 0) ?? 0;

  return (
    <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0' }}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 64px 80px', textAlign: 'center', maxWidth: 980, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 999,
          border: '1px solid rgba(99,102,241,0.22)',
          background: 'rgba(99,102,241,0.05)',
          fontSize: 10.5, color: '#a5b4fc',
          letterSpacing: '0.18em', fontWeight: 600,
          marginBottom: 32, textTransform: 'uppercase' as const,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1', display: 'block' }} />
          Бета · 2026
        </div>

        <h1 style={{
          fontSize: 64, fontWeight: 700, letterSpacing: '-0.025em',
          lineHeight: 1.05, margin: 0, color: '#fff',
        }}>
          Пройди любое собеседование<br />с{' '}
          <span style={{
            background: 'linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>математической точностью</span>
        </h1>

        <p style={{ marginTop: 24, fontSize: 16, color: '#94a3b8', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Вопросы ранжированы по частоте встречаемости в реальных интервью.
          Сначала изучай то, что спрашивают чаще всего.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36 }}>
          <Link
            to={directions?.find(d => d._count.questions > 0)?.slug ? `/d/${directions.find(d => d._count.questions > 0)!.slug}` : '/'}
            className="twk-shimmer-host twk-pulse"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '12px 22px', fontSize: 14, borderRadius: 10,
              fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 12px 30px -8px rgba(99,102,241,0.7), inset 0 1px 0 rgba(255,255,255,0.18)',
              textDecoration: 'none', display: 'inline-block',
            }}
          >
            Начать пробное интервью
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: 64, padding: '28px 40px',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          background: 'rgba(22,23,29,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 32,
        }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              {isLoading ? '...' : <CountUp to={totalQuestions} />}
            </div>
            <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.18em', marginTop: 6 }}>
              Отобранных вопросов
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              {isLoading ? '...' : <CountUp to={totalInterviews} />}
            </div>
            <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.18em', marginTop: 6 }}>
              Собеседований из открытого доступа
            </div>
          </div>
        </div>
      </section>

      {/* ── Directions ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 64px 0', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Направления</h2>
            <p style={{ fontSize: 13.5, color: '#94a3b8', margin: '10px 0 0', maxWidth: 520, lineHeight: 1.55 }}>
              Твой личный билет в мир IT-технологий.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>Загрузка направлений...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 14 }}>
            {(directions ?? []).slice(0, 5).map(d => (
              <DirectionCard
                key={d.id} d={d}
                isHover={hoveredDomain === d.id}
                onHover={(v) => setHoveredDomain(v ? d.id : null)}
              />
            ))}
            {/* "More directions" — links to /directions */}
            <Link
              to="/directions"
              style={{ textDecoration: 'none', display: 'block' }}
              onMouseEnter={() => setHoveredDomain('__more')}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              <div style={{
                padding: '22px 20px 24px', borderRadius: 12,
                border: hoveredDomain === '__more' ? '1px dashed rgba(165,180,252,0.55)' : '1px dashed rgba(255,255,255,0.10)',
                background: hoveredDomain === '__more' ? 'rgba(99,102,241,0.06)' : 'rgba(22,23,29,0.35)',
                cursor: 'pointer', transition: 'all 200ms ease',
                transform: hoveredDomain === '__more' ? 'translateY(-3px)' : 'translateY(0)',
                display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', minHeight: 156,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px dashed rgba(99,102,241,0.35)',
                  color: '#a5b4fc', display: 'grid', placeItems: 'center',
                  transition: 'transform 220ms ease',
                  transform: hoveredDomain === '__more' ? 'translateX(3px)' : 'translateX(0)',
                }}>
                  {ArrowIcon(16)}
                </div>
                <div>
                  <div style={{ fontSize: 14.5, color: '#fff', fontWeight: 600, marginBottom: 6 }}>
                    Ещё {Math.max(0, (directions ?? []).length - 5)}+
                  </div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>Go, Rust, Kotlin, C#, DevOps, C++ и другие.</div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* ── Simulator section ──────────────────────────────────────────────── */}
      <section style={{ padding: '120px 64px 80px', maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 80, alignItems: 'start' }}>
        <div>
          <span style={{
            display: 'inline-block', padding: '4px 10px', borderRadius: 6,
            background: 'rgba(99,102,241,0.10)', color: '#a5b4fc',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
            textTransform: 'uppercase' as const, marginBottom: 18,
          }}>Симулятор</span>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Реальное<br />боевое окружение
          </h2>
          <p style={{ fontSize: 13.5, color: '#94a3b8', margin: '16px 0 28px', lineHeight: 1.65, maxWidth: 440 }}>
            Хватит тренироваться в вакууме. Учи вопросы по статистике реальных интервью и знай, к чему готовиться.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {['Вопросы с реальной частотой встречаемости', 'Объяснения от ИИ прямо в карточке', 'Ответы из записей настоящих интервью'].map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, display: 'grid', placeItems: 'center',
                  background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc',
                }}>{CheckIcon(11)}</span>
                <span style={{ color: '#cbd5e1', fontSize: 13.5 }}>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            to={directions?.find(d => d._count.questions > 0)?.slug ? `/d/${directions.find(d => d._count.questions > 0)!.slug}` : '/'}
            className="twk-shimmer-host"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              marginTop: 36, padding: '11px 18px', fontSize: 13,
              borderRadius: 8, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              textDecoration: 'none',
              boxShadow: '0 6px 20px -8px rgba(99,102,241,0.6)',
            }}
          >
            Начать изучение {ArrowIcon(12)}
          </Link>
        </div>
        <CodeMock />
      </section>

    </div>
  );
}
