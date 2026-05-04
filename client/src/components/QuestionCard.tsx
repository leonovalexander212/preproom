import { useState, useRef, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, X, PlayCircle, ExternalLink, Loader2 } from 'lucide-react';
import { AiChat } from './AiChat';
import { api } from '../lib/api';
import type { Question } from '../types/api';

type Props = { question: Question; popularityPct?: number };

// ── Grade config ──────────────────────────────────────────────────────────────
const GRADE = {
  JUNIOR: { bg: 'rgba(16,185,129,0.12)',  fg: '#34d399', ring: '#10b981' },
  MIDDLE: { bg: 'rgba(245,158,11,0.12)',  fg: '#fbbf24', ring: '#f59e0b' },
  SENIOR: { bg: 'rgba(244,63,94,0.12)',   fg: '#fb7185', ring: '#f43f5e' },
} as const;

// ── ProgressRing ──────────────────────────────────────────────────────────────
// Шанс встречи вопроса в реальном собеседовании.
// Капается на 95% — никогда не показываем 100%.
function ProgressRing({ percent, ringColor }: { percent: number; ringColor: string }) {
  const size = 58, stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
           style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={ringColor} strokeWidth={stroke} fill="none"
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 800ms ease', filter: `drop-shadow(0 0 4px ${ringColor}66)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 11, color: '#cbd5e1', fontWeight: 700 }}>
        {percent}%
      </div>
    </div>
  );
}

// ── Ripple effect ─────────────────────────────────────────────────────────────
function useRipple() {
  const [drops, setDrops] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const idRef = useRef(0);
  const spawn = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;
    const id = ++idRef.current;
    setDrops(d => [...d, { id, x, y, size }]);
    setTimeout(() => setDrops(d => d.filter(r => r.id !== id)), 700);
  };
  const rippleEls = drops.map(d => (
    <span key={d.id} style={{
      position: 'absolute',
      left: d.x - d.size / 2, top: d.y - d.size / 2,
      width: d.size, height: d.size, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(165,180,252,0.4) 0%, rgba(99,102,241,0) 65%)',
      pointerEvents: 'none',
      animation: 'twk-ripple 700ms ease-out forwards',
      mixBlendMode: 'screen' as const,
    }} />
  ));
  return { spawn, rippleEls };
}

// ── Chevron icon ──────────────────────────────────────────────────────────────
function ChevronRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
}

// ── QuestionCard ──────────────────────────────────────────────────────────────
export const QuestionCard = memo(function QuestionCard({ question, popularityPct }: Props) {
  const [open, setOpen]             = useState(false);
  const [aiOpen, setAiOpen]         = useState(false);
  const [videosOpen, setVideosOpen] = useState(false);
  const [hover, setHover]           = useState(false);
  const { spawn, rippleEls }        = useRipple();

  const g = question.difficulty ? GRADE[question.difficulty] : GRADE.JUNIOR;

  // Шанс встречи в % приходит снаружи (DirectionPage считает по позиции
  // вопроса в отсортированном списке). Если нет — fallback к probability.
  const pct = popularityPct ?? Math.max(15, Math.min(95, Math.round(question.probability * 100)));

  const { data: videoAnswers, isLoading: videosLoading } = useQuery({
    queryKey: ['video-answers', question.id],
    queryFn: () => api.getQuestionVideoAnswers(question.id),
    enabled: videosOpen,
    staleTime: 5 * 60_000,
  });
  const hasVideos = (videoAnswers?.length ?? 0) > 0;

  function toggle() {
    setOpen(v => { if (v) { setAiOpen(false); setVideosOpen(false); } return !v; });
  }
  function toggleVideos() { setVideosOpen(v => !v); if (aiOpen) setAiOpen(false); }
  function toggleAi()     { setAiOpen(v => !v);     if (videosOpen) setVideosOpen(false); }

  const isActive = open || hover;

  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${isActive ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
      background: 'rgba(22,23,29,0.7)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      transition: 'all 220ms ease',
      boxShadow: isActive ? '0 16px 40px -20px rgba(99,102,241,0.45)' : 'none',
    }}>

      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div
        role="button" tabIndex={0}
        onPointerDown={spawn}
        onClick={toggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onKeyDown={e => e.key === 'Enter' && toggle()}
        style={{
          display: 'grid', gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center', gap: 24,
          padding: '16px 24px', cursor: 'pointer',
          position: 'relative', overflow: 'hidden', userSelect: 'none',
        }}
      >
        {rippleEls}

        <ProgressRing percent={pct} ringColor={g.ring} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            {question.difficulty && (
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                background: g.bg, color: g.fg, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em',
              }}>
                {question.difficulty}
              </span>
            )}
            {question.topic && (
              <span style={{ fontSize: 11, color: '#64748b' }}>{question.topic.name}</span>
            )}
          </div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em', lineHeight: 1.35 }}>
            {question.text}
          </div>
        </div>

        <div style={{
          color: isActive ? '#a5b4fc' : '#475569',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'all 220ms ease',
        }}>
          <ChevronRight size={18} />
        </div>
      </div>

      {/* ── Expanded content ───────────────────────────────────────────── */}
      {open && (
        <div className="animate-fade-in" style={{ padding: '14px 24px 22px', paddingLeft: 24 + 58 + 24 }}>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {!aiOpen ? (
              <button
                onClick={toggleAi}
                className="twk-shimmer-host"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 11.5, fontWeight: 600,
                  background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))',
                  color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)',
                  padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <Sparkles size={13} />
                Уточнить у ИИ
              </button>
            ) : (
              <button
                onClick={() => setAiOpen(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 11.5, fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <X size={13} />
                Свернуть чат
              </button>
            )}

            <button
              onClick={toggleVideos}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11.5, fontWeight: 600,
                background: videosOpen ? 'rgba(255,255,255,0.04)' : 'rgba(16,185,129,0.10)',
                color:      videosOpen ? '#94a3b8' : '#34d399',
                border: `1px solid ${videosOpen ? 'rgba(255,255,255,0.08)' : 'rgba(16,185,129,0.25)'}`,
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {videosLoading ? <Loader2 size={13} className="animate-spin" /> : videosOpen ? <X size={13} /> : <PlayCircle size={13} />}
              {videosOpen ? 'Свернуть' : 'Посмотреть ответ'}
            </button>

          </div>

          {videosOpen && (
            <VideoAnswersPanel videoAnswers={videoAnswers} isLoading={videosLoading} hasVideos={hasVideos} />
          )}
          {aiOpen && (
            <AiChat key={question.id} question={question} onClose={() => setAiOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
});

// ── Video answers panel ───────────────────────────────────────────────────────
type VAProps = {
  videoAnswers: import('../types/api').VideoAnswer[] | undefined;
  isLoading: boolean;
  hasVideos: boolean;
};

function VideoAnswersPanel({ videoAnswers, isLoading, hasVideos }: VAProps) {
  if (isLoading) {
    return (
      <div style={{
        marginTop: 12, borderRadius: 10, padding: '14px 16px',
        background: 'rgba(22,23,29,0.5)', border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b',
      }}>
        <Loader2 size={13} className="animate-spin" />
        Загружаем ссылки...
      </div>
    );
  }
  if (!hasVideos) {
    return (
      <div style={{
        marginTop: 12, borderRadius: 10, padding: '14px 16px',
        background: 'rgba(22,23,29,0.5)', border: '1px solid rgba(255,255,255,0.06)',
        fontSize: 13, color: '#64748b', fontStyle: 'italic',
      }}>
        Для этого вопроса нет записей с таймкодами.
      </div>
    );
  }
  return (
    <div style={{
      marginTop: 12, borderRadius: 10, padding: '12px 14px',
      background: 'rgba(22,23,29,0.5)', border: '1px solid rgba(255,255,255,0.06)',
      display: 'grid', gap: 6,
    }}>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 4 }}>
        Ответы из реальных интервью
      </div>
      {videoAnswers!.map((v, i) => (
        <a
          key={i} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
            textDecoration: 'none', transition: 'all 180ms ease',
          }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.07)'; el.style.borderColor = 'rgba(16,185,129,0.3)'; }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.03)'; el.style.borderColor = 'rgba(255,255,255,0.05)'; }}
        >
          <PlayCircle size={15} style={{ color: '#34d399', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {v.title}
          </div>
          <span style={{
            flexShrink: 0, fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            color: '#34d399', background: 'rgba(16,185,129,0.10)',
            padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.2)',
          }}>
            {v.timecode}
          </span>
          <ExternalLink size={11} style={{ color: '#475569', flexShrink: 0 }} />
        </a>
      ))}
    </div>
  );
}
