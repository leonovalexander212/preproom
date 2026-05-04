import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Direction } from '../types/api';

// ── Direction icons ───────────────────────────────────────────────────────────
const ICONS: Record<string, (s?: number) => JSX.Element> = {
  java: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="m8 4-2 4 2 3-2 3"/><path d="M14 4l-2 4 2 3-2 3"/><path d="M5 18c4 2 10 2 14 0"/><path d="M7 21c3 1 7 1 10 0"/>
    </svg>
  ),
  python: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="13" rx="3"/><path d="M4 9h16M9 3v6M15 9v7"/>
    </svg>
  ),
  php: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M8 10v4m0-2h3a1 1 0 0 1 0 2H8"/><path d="M14 10h2a2 2 0 0 1 0 4h-2v-4"/>
    </svg>
  ),
  qa: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M20 6 9 17l-5-5"/><circle cx="12" cy="12" r="9"/>
    </svg>
  ),
  frontend: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 14l-2 2 2 2M16 14l2 2-2 2"/>
    </svg>
  ),
  sql: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>
    </svg>
  ),
  default: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 9h6M9 12h6M9 15h4"/>
    </svg>
  ),
};

function getIcon(slug: string) {
  return (ICONS[slug] ?? ICONS.default)(16);
}

// ── Direction card ─────────────────────────────────────────────────────────────
function DirectionCard({ d, isHover, onHover }: { d: Direction; isHover: boolean; onHover: (v: boolean) => void }) {
  const isEmpty = d._count.questions === 0;
  const inner = (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        padding: '22px 20px 24px', borderRadius: 12,
        border: `1px solid ${isHover && !isEmpty ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
        background: 'rgba(22,23,29,0.65)',
        cursor: isEmpty ? 'default' : 'pointer',
        transition: 'all 200ms ease',
        transform: isHover && !isEmpty ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isHover && !isEmpty ? '0 14px 32px -16px rgba(99,102,241,0.6)' : 'none',
        opacity: isEmpty ? 0.55 : 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
        color: '#a5b4fc', display: 'grid', placeItems: 'center', marginBottom: 18,
        flexShrink: 0,
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
      {!isEmpty && (
        <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{d._count.questions}</span> вопросов
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{d._count.interviews}</span> интервью
          </span>
        </div>
      )}
    </div>
  );
  if (isEmpty) return inner;
  return <Link to={`/d/${d.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link>;
}

// ── DirectionsPage ─────────────────────────────────────────────────────────────
export function DirectionsPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  const { data: directions, isLoading } = useQuery({
    queryKey: ['directions'],
    queryFn: api.getDirections,
    staleTime: 5 * 60_000,
  });

  const available = (directions ?? []).filter(d => d._count.questions > 0);
  const upcoming  = (directions ?? []).filter(d => d._count.questions === 0);

  return (
    <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0' }}>

      {/* Hero */}
      <section style={{ padding: '70px 64px 50px', maxWidth: 1240, margin: '0 auto' }}>
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
          Направления
        </div>
        <h1 style={{ margin: 0, fontSize: 72, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>
          Направления
        </h1>
        <p style={{ marginTop: 18, fontSize: 14, color: '#94a3b8', lineHeight: 1.65, maxWidth: 520 }}>
          Выбери технологию и изучай вопросы, отсортированные по реальной частоте встречаемости
          в собеседованиях из открытого доступа.
        </p>
      </section>

      {/* Available directions */}
      <section style={{ padding: '0 64px 40px', maxWidth: 1240, margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ color: '#64748b', fontSize: 13, padding: '40px 0' }}>Загрузка...</div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 14,
            }}>
              {available.map(d => (
                <DirectionCard
                  key={d.id} d={d}
                  isHover={hovered === d.id}
                  onHover={v => setHovered(v ? d.id : null)}
                />
              ))}
            </div>

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <>
                <div style={{ marginTop: 48, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.14em', fontWeight: 600 }}>
                    Скоро появятся
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                }}>
                  {upcoming.map(d => (
                    <DirectionCard
                      key={d.id} d={d}
                      isHover={false}
                      onHover={() => {}}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

    </div>
  );
}
