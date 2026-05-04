import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Difficulty } from '../types/api';

const PAGE_SIZE = 12;

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlayIcon = (s = 20) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const ExternalIcon = (s = 12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const ChevronIcon = (s = 12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

// ── Grade colors ──────────────────────────────────────────────────────────────
const GRADE: Record<Difficulty, { bg: string; fg: string }> = {
  JUNIOR: { bg: 'rgba(16,185,129,0.12)', fg: '#34d399' },
  MIDDLE: { bg: 'rgba(245,158,11,0.12)',  fg: '#fbbf24' },
  SENIOR: { bg: 'rgba(244,63,94,0.12)',   fg: '#fb7185' },
};

// ── Pagination ────────────────────────────────────────────────────────────────
function pBtn(active: boolean, disabled: boolean): React.CSSProperties {
  return {
    minWidth: 32, height: 32, padding: '0 8px', borderRadius: 6, border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', fontSize: 12.5, fontWeight: active ? 700 : 500,
    background: active ? 'rgba(99,102,241,0.22)' : 'rgba(22,23,29,0.7)',
    color: active ? '#a5b4fc' : disabled ? '#334155' : '#94a3b8',
    boxShadow: active ? 'inset 0 0 0 1px rgba(99,102,241,0.5)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
    transition: 'all 160ms',
    opacity: disabled ? 0.35 : 1,
  };
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;

  const wanted = new Set<number>([1, 2]);
  for (let i = current - 2; i <= current + 2; i++) if (i >= 1 && i <= total) wanted.add(i);
  wanted.add(total - 1); wanted.add(total);
  const sorted = Array.from(wanted).filter(n => n >= 1 && n <= total).sort((a, b) => a - b);

  const items: (number | '…')[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (n - prev > 1) items.push('…');
    items.push(n);
    prev = n;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
      <button style={pBtn(false, current <= 1)} disabled={current <= 1} onClick={() => onChange(current - 1)}>←</button>
      {items.map((item, i) =>
        item === '…'
          ? <span key={`e${i}`} style={{ color: '#475569', fontSize: 13, padding: '0 2px' }}>…</span>
          : <button key={item} style={pBtn(item === current, false)} onClick={() => onChange(item as number)}>{item}</button>
      )}
      <button style={pBtn(false, current >= total)} disabled={current >= total} onClick={() => onChange(current + 1)}>→</button>
    </div>
  );
}

// ── Recording card ────────────────────────────────────────────────────────────
function RecordingCard({ iv }: { iv: import('../types/api').Interview }) {
  const [hover, setHover] = useState(false);
  const g = GRADE[iv.difficulty];

  return (
    <a
      href={iv.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', textDecoration: 'none',
        borderRadius: 12,
        border: `1px solid ${hover ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
        background: 'rgba(22,23,29,0.7)',
        overflow: 'hidden',
        transition: 'all 220ms ease',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover ? '0 16px 40px -20px rgba(99,102,241,0.45)' : 'none',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0d0e14', overflow: 'hidden' }}>
        {iv.thumbnailUrl ? (
          <img
            src={iv.thumbnailUrl}
            alt={iv.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: hover ? 0.85 : 0.75, transition: 'opacity 200ms' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'rgba(99,102,241,0.06)' }}>
            <span style={{ color: '#334155', fontSize: 11 }}>нет превью</span>
          </div>
        )}
        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', placeItems: 'center',
          background: 'rgba(0,0,0,0.35)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 200ms',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(99,102,241,0.9)',
            display: 'grid', placeItems: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(99,102,241,0.6)',
          }}>
            {PlayIcon(22)}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 4,
            background: g.bg, color: g.fg,
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em',
          }}>{iv.difficulty}</span>
          <span style={{
            padding: '2px 8px', borderRadius: 4,
            background: 'rgba(99,102,241,0.10)', color: '#a5b4fc',
            fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em',
          }}>{iv.directionName.toUpperCase()}</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 13, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {iv.title}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 }}>
          <span style={{ color: hover ? '#a5b4fc' : '#475569', transition: 'color 200ms' }}>
            {ExternalIcon(12)}
          </span>
        </div>
      </div>
    </a>
  );
}

// ── RecordingsPage ────────────────────────────────────────────────────────────
export function RecordingsPage() {
  const [direction, setDirection] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews', direction, difficulty],
    queryFn: () => api.getInterviews({
      ...(direction  && { direction  }),
      ...(difficulty && { difficulty }),
    }),
    staleTime: 5 * 60_000,
  });

  const { data: directions } = useQuery({
    queryKey: ['directions'],
    queryFn: api.getDirections,
    staleTime: 10 * 60_000,
  });

  // Reset to page 1 when filters change
  const handleDirectionChange = (v: string) => { setDirection(v); setCurrentPage(1); };
  const handleDifficultyChange = (d: Difficulty | null) => { setDifficulty(d); setCurrentPage(1); };

  const all = interviews ?? [];
  const totalPages = Math.ceil(all.length / PAGE_SIZE);
  const pageFrom = (currentPage - 1) * PAGE_SIZE;
  const pageItems = all.slice(pageFrom, pageFrom + PAGE_SIZE);

  return (
    <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '70px 64px 40px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 11px', borderRadius: 999,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.18)',
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
          Записи
        </div>
        <h1 style={{
          margin: 0, fontSize: 72, fontWeight: 700,
          letterSpacing: '-0.03em', color: '#fff', lineHeight: 1,
        }}>
          Записи
        </h1>
        <p style={{ marginTop: 18, fontSize: 14, color: '#94a3b8', lineHeight: 1.65, maxWidth: 480 }}>
          Реальные собеседования из открытого доступа. Смотри, как люди отвечают на вопросы.
        </p>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <section style={{
        padding: '14px 64px 18px', maxWidth: 1240, margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center',
        gap: 16, flexWrap: 'wrap' as const,
      }}>

        {/* Direction dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            value={direction}
            onChange={e => handleDirectionChange(e.target.value)}
            style={{
              appearance: 'none', WebkitAppearance: 'none',
              padding: '7px 36px 7px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(22,23,29,0.7)',
              color: direction ? '#e2e8f0' : '#94a3b8',
              fontSize: 12.5, fontWeight: 500,
              cursor: 'pointer', outline: 'none',
              fontFamily: 'inherit',
            }}
          >
            <option value="">Все направления</option>
            {(directions ?? []).filter(d => d._count.interviews > 0).map(d => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
          </select>
          <span style={{
            position: 'absolute', right: 10, pointerEvents: 'none',
            color: '#64748b', display: 'flex',
          }}>
            {ChevronIcon(12)}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

        {/* Grade pills */}
        <div style={{
          display: 'inline-flex', padding: 3, borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(22,23,29,0.6)',
        }}>
          {([
            { k: null,     l: 'ВСЕ'    },
            { k: 'JUNIOR', l: 'JUNIOR' },
            { k: 'MIDDLE', l: 'MIDDLE' },
            { k: 'SENIOR', l: 'SENIOR' },
          ] as { k: Difficulty | null; l: string }[]).map(opt => {
            const active = difficulty === opt.k;
            return (
              <button
                key={opt.l}
                onClick={() => handleDifficultyChange(opt.k)}
                style={{
                  padding: '6px 12px', borderRadius: 6, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em',
                  color: active ? '#fff' : '#94a3b8',
                  background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                  boxShadow: active ? 'inset 0 0 0 1px rgba(99,102,241,0.35)' : 'none',
                  transition: 'all 160ms',
                }}
              >
                {opt.l}
              </button>
            );
          })}
        </div>

        {/* Count badge */}
        {all.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#475569' }}>
            {all.length} записей
          </span>
        )}
      </section>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '32px 64px 60px', maxWidth: 1240, margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 0', fontSize: 13 }}>
            Загрузка записей...
          </div>
        ) : all.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 0', fontSize: 13 }}>
            Записей не найдено. Попробуй изменить фильтры.
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {pageItems.map((iv, i) => (
                <div
                  key={iv.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                >
                  <RecordingCard iv={iv} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <Pagination current={currentPage} total={totalPages} onChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              {totalPages > 1 && (
                <span style={{ fontSize: 11.5, color: '#475569' }}>
                  {pageFrom + 1}–{Math.min(pageFrom + PAGE_SIZE, all.length)} из {all.length}
                </span>
              )}
            </div>
          </>
        )}
      </section>

    </div>
  );
}
