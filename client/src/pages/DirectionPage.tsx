import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { QuestionCard } from '../components/QuestionCard';
import type { Difficulty, QuestionType } from '../types/api';

const PAGE_SIZE = 25;

type FilterState = {
  difficulty: Difficulty | null;
  type: QuestionType | null;
  search: string;
};

// ── CountUp ───────────────────────────────────────────────────────────────────
function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    let raf: number;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      setV(Math.round((1 - Math.pow(1 - k, 3)) * to));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v.toLocaleString('ru')}</>;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = (s = 13) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

// ── Pagination ─────────────────────────────────────────────────────────────────
function pBtn(active: boolean, disabled: boolean): React.CSSProperties {
  return {
    minWidth: 32, height: 32, padding: '0 8px', borderRadius: 6, border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', fontSize: 12.5, fontWeight: active ? 700 : 500,
    background: active ? 'rgba(99,102,241,0.22)' : 'rgba(22,23,29,0.7)',
    color: active ? '#a5b4fc' : disabled ? '#334155' : '#94a3b8',
    boxShadow: active ? 'inset 0 0 0 1px rgba(99,102,241,0.5)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
    transition: 'all 160ms', opacity: disabled ? 0.35 : 1,
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
  for (const n of sorted) { if (n - prev > 1) items.push('…'); items.push(n); prev = n; }
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

// ── DirectionPage ─────────────────────────────────────────────────────────────
export function DirectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [filter, setFilter] = useState<FilterState>({
    difficulty: null,
    type: 'TECHNICAL',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', slug, filter.difficulty, filter.type],
    queryFn: () =>
      api.getDirectionQuestions(slug!, {
        ...(filter.difficulty && { difficulty: filter.difficulty }),
        ...(filter.type      && { type: filter.type }),
      }),
    enabled: !!slug,
  });

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter.difficulty, filter.type, filter.search]);

  const normalize = (s: string) => s.toLowerCase().replace(/ё/g, 'е');

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = normalize(filter.search.trim());
    if (!s) return data.questions;
    return data.questions.filter(q => normalize(q.text).includes(s));
  }, [data, filter.search]);

  const totalPages    = Math.ceil(filtered.length / PAGE_SIZE);
  const pageFrom      = (currentPage - 1) * PAGE_SIZE;
  const pageQuestions = filtered.slice(pageFrom, pageFrom + PAGE_SIZE);

  // Шанс встречи = 95 − √(rank/N) × 80, где rank — позиция вопроса
  // в отсортированном списке (API сортирует по occurrences DESC).
  //   rank 0%    → 95%
  //   rank 5%    → ~77%
  //   rank 25%   → ~55%
  //   rank 50%   → ~38%
  //   rank 100%  → 15%
  // Используем последовательный rank, а не средний по группе — иначе
  // когда у большинства вопросов occurrences=1, все они схлопывались
  // бы в один процент.
  const popularityMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!data || data.questions.length === 0) return map;
    const denom = Math.max(1, data.questions.length - 1);
    data.questions.forEach((q, i) => {
      const pct = Math.round(95 - Math.sqrt(i / denom) * 80);
      map.set(q.id, Math.min(95, Math.max(15, pct)));
    });
    return map;
  }, [data]);

  const toggleType = (t: QuestionType) =>
    setFilter(f => ({ ...f, type: f.type === t ? null : t }));
  const toggleDifficulty = (d: Difficulty) =>
    setFilter(f => ({ ...f, difficulty: f.difficulty === d ? null : d }));

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', color: '#64748b', padding: '120px 64px', fontSize: 13 }}>
        Загрузка вопросов...
      </div>
    );
  }
  if (error || !data) {
    return (
      <div style={{ textAlign: 'center', color: '#64748b', padding: '120px 64px', fontSize: 13 }}>
        Не удалось загрузить направление.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        padding: '70px 64px 50px', maxWidth: 1240, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 11px', borderRadius: 999,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.18)',
            color: '#a5b4fc', fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 22,
          }}>
            <Link
              to="/directions"
              style={{
                color: '#94a3b8', textDecoration: 'none',
                transition: 'color 160ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >
              Направление
            </Link>
            <span style={{ opacity: 0.4 }}>/</span>
            {data.direction.name}
          </div>
          <h1 style={{ margin: 0, fontSize: 72, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>
            {data.direction.name}
          </h1>
          <p style={{ marginTop: 18, fontSize: 14, color: '#94a3b8', lineHeight: 1.65, maxWidth: 480 }}>
            Вопросы ранжированы по частоте встречаемости
            в {data.direction.totalInterviews} реальных интервью.
          </p>
        </div>

        <div style={{
          padding: '20px 30px',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
          background: 'rgba(22,23,29,0.6)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)', textAlign: 'center', minWidth: 180,
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            <CountUp to={data.questions.length} />
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 600 }}>
            Вопросов
          </div>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <section style={{
        padding: '16px 64px 20px', maxWidth: 1240, margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap' as const,
      }}>
        {/* Type tabs */}
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { key: 'TECHNICAL'  as QuestionType, label: 'Технические'   },
            { key: 'BEHAVIORAL' as QuestionType, label: 'Поведенческие' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => toggleType(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                color: filter.type === t.key ? '#fff' : '#94a3b8',
                fontSize: 14, fontWeight: filter.type === t.key ? 600 : 500,
                padding: '10px 0',
                borderBottom: filter.type === t.key ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'color 160ms',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Grade pills */}
          <div style={{ display: 'inline-flex', padding: 3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(22,23,29,0.6)' }}>
            {([
              { k: null,     l: 'ВСЕ'    },
              { k: 'JUNIOR', l: 'JUNIOR' },
              { k: 'MIDDLE', l: 'MIDDLE' },
              { k: 'SENIOR', l: 'SENIOR' },
            ] as { k: Difficulty | null; l: string }[]).map(opt => {
              const active = filter.difficulty === opt.k;
              return (
                <button
                  key={opt.l}
                  onClick={() => opt.k ? toggleDifficulty(opt.k) : setFilter(f => ({ ...f, difficulty: null }))}
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

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, background: 'rgba(22,23,29,0.6)', minWidth: 220,
          }}>
            <span style={{ color: '#64748b', display: 'flex' }}>{SearchIcon(13)}</span>
            <input
              value={filter.search}
              onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
              placeholder="Поиск вопросов..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#cbd5e1', fontSize: 12.5, flex: 1, fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Question list ─────────────────────────────────────────────────── */}
      <section style={{ padding: '28px 64px 60px', maxWidth: 1240, margin: '0 auto', display: 'grid', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: 80, fontSize: 13 }}>
            Ничего не найдено по фильтрам.
          </div>
        ) : (
          pageQuestions.map((q, i) => (
            <div
              key={q.id}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(i * 20, 300)}ms` }}
            >
              <QuestionCard question={q} popularityPct={popularityMap.get(q.id)} />
            </div>
          ))
        )}

        {filtered.length > 0 && (
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <Pagination
              current={currentPage}
              total={totalPages}
              onChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
            <span style={{ fontSize: 11.5, color: '#475569' }}>
              {pageFrom + 1}–{Math.min(pageFrom + PAGE_SIZE, filtered.length)} из {filtered.length} вопросов
            </span>
          </div>
        )}
      </section>

    </div>
  );
}
