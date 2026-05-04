import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const QUIZ_COMPLETED_KEY = 'preproom_quiz_completed';

// ── SVG-иконки направлений (те же что на главной) ─────────────────────────────

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
  default: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 9h6M9 12h6M9 15h4"/>
    </svg>
  ),
};

function getIcon(slug: string, size = 18) {
  return (ICONS[slug] ?? ICONS.default)(size);
}

// ── Направления, у которых уже есть вопросы (из seed.ts) ──────────────────────
const AVAILABLE_SLUGS = new Set(['java', 'python', 'php', 'qa', 'frontend']);

// ── Метаданные направлений ────────────────────────────────────────────────────
const DIRECTION_META: Record<string, { name: string; description: string }> = {
  frontend:          { name: 'Frontend',           description: 'React, TypeScript, интерфейсы' },
  python:            { name: 'Python',             description: 'Backend, data science, автоматизация' },
  java:              { name: 'Java',               description: 'Enterprise разработка, Spring' },
  csharp:            { name: 'C# / .NET',          description: 'Корпоративные приложения, игры' },
  go:                { name: 'Go',                 description: 'Микросервисы, высоконагруженные системы' },
  qa:                { name: 'QA',                 description: 'Ручное тестирование, баг-репорты' },
  aqa:               { name: 'AQA',                description: 'Автотесты, Selenium, Playwright' },
  'data-analyst':    { name: 'Дата-аналитик',      description: 'SQL, дашборды, метрики' },
  'data-science':    { name: 'Data Science',       description: 'ML, статистика, исследования' },
  devops:            { name: 'DevOps',             description: 'CI/CD, Docker, Kubernetes' },
  php:               { name: 'PHP',                description: 'Веб-разработка, CMS' },
  android:           { name: 'Android',            description: 'Kotlin, Java, мобильная разработка' },
  unity:             { name: 'Unity',              description: 'Разработка игр на Unity Engine' },
  'product-manager': { name: 'Продукт-менеджер',  description: 'Стратегия, roadmap, метрики' },
  'ai-engineer':     { name: 'AI Engineer',        description: 'LLM, RAG, ML-инженерия' },
};

// ── Вопросы (живой язык, без жаргона) ─────────────────────────────────────────

type QuizQuestion = {
  statement: string;
  agreeScores: Record<string, number>;
  disagreeScores: Record<string, number>;
};

const QUESTIONS: QuizQuestion[] = [
  {
    statement: 'Мне важно сразу видеть результат своей работы — глазами, а не в голове.',
    agreeScores:    { frontend: 3, android: 2, unity: 2 },
    disagreeScores: { python: 2, java: 2, go: 2, devops: 1 },
  },
  {
    statement: 'Мне всегда нравились задачи на логику, числа и закономерности.',
    agreeScores:    { 'data-science': 3, 'ai-engineer': 2, python: 1 },
    disagreeScores: { frontend: 2, qa: 1, 'product-manager': 1 },
  },
  {
    statement: 'Мне приятно находить ошибки и неточности там, где другие проходят мимо.',
    agreeScores:    { qa: 3, aqa: 2, devops: 1 },
    disagreeScores: { frontend: 1, 'product-manager': 1, unity: 1 },
  },
  {
    statement: 'Меня раздражает, когда сайт или приложение тормозит. Я бы хотел, чтобы у других такого не было.',
    agreeScores:    { go: 3, java: 2, devops: 2, frontend: 1 },
    disagreeScores: { 'data-analyst': 1, 'product-manager': 1 },
  },
  {
    statement: 'Я люблю разбираться в таблицах и графиках — мне интересно искать в них смысл.',
    agreeScores:    { 'data-analyst': 3, 'data-science': 2, 'ai-engineer': 1, python: 1 },
    disagreeScores: { frontend: 1, android: 1, unity: 1 },
  },
  {
    statement: 'Мне нравится идея делать то, что человек носит в кармане каждый день — приложения для телефона.',
    agreeScores:    { android: 3, csharp: 1 },
    disagreeScores: { frontend: 1, php: 1, 'data-analyst': 1 },
  },
  {
    statement: 'Я люблю играть в видеоигры и часто думаю о том, как они устроены изнутри.',
    agreeScores:    { unity: 3, csharp: 2 },
    disagreeScores: { qa: 1, 'data-analyst': 1, java: 1 },
  },
  {
    statement: 'Мне любопытно, как устроены огромные сервисы — например, как Netflix не падает, когда его смотрят миллионы людей.',
    agreeScores:    { devops: 3, go: 2, python: 1 },
    disagreeScores: { frontend: 1, unity: 1, 'product-manager': 1 },
  },
];

// ── Подсчёт результатов ───────────────────────────────────────────────────────

function computeResults(values: number[]): { slug: string; name: string; description: string; score: number }[] {
  const totals: Record<string, number> = {};

  values.forEach((val, qIdx) => {
    const q = QUESTIONS[qIdx];
    if (!q) return;
    const factor = val / 3; // от -1 до 1
    if (factor > 0) {
      for (const [slug, pts] of Object.entries(q.agreeScores)) {
        totals[slug] = (totals[slug] ?? 0) + pts * factor;
      }
    } else if (factor < 0) {
      for (const [slug, pts] of Object.entries(q.disagreeScores)) {
        totals[slug] = (totals[slug] ?? 0) + pts * Math.abs(factor);
      }
    }
  });

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([slug, score]) => ({
      slug,
      score,
      ...(DIRECTION_META[slug] ?? { name: slug, description: '' }),
    }));
}

// ── Иконки ────────────────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

// ── Шкала Agree/Disagree ──────────────────────────────────────────────────────
const SCALE_SIZES  = [40, 32, 26, 22, 26, 32, 40];
const SCALE_VALUES = [3, 2, 1, 0, -1, -2, -3];

function ScaleSelector({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', padding: '8px 0' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399', letterSpacing: '0.04em', minWidth: 64 }}>
        Согласен
      </span>

      {SCALE_SIZES.map((size, i) => {
        const v = SCALE_VALUES[i];
        const isSelected = value === v;
        const isHovered = hovered === i;
        const baseColor = v > 0 ? '#34d399' : v < 0 ? '#a78bfa' : '#94a3b8';

        return (
          <button
            key={i}
            onClick={() => onChange(v)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: size, height: size,
              borderRadius: '50%',
              border: `2px solid ${isSelected || isHovered ? baseColor : 'rgba(255,255,255,0.15)'}`,
              background: isSelected
                ? baseColor
                : isHovered
                  ? `${baseColor}33`           // ~20% заполнение при наведении
                  : 'transparent',
              boxShadow: isSelected
                ? `0 0 22px ${baseColor}aa, inset 0 0 8px rgba(255,255,255,0.25)`
                : isHovered
                  ? `0 0 14px ${baseColor}66`
                  : 'none',
              transform: isSelected ? 'scale(1.12)' : isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
            aria-label={`Оценка ${v}`}
          />
        );
      })}

      <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', letterSpacing: '0.04em', minWidth: 80, textAlign: 'right' }}>
        Не согласен
      </span>
    </div>
  );
}

// ── Декоративный gradient orb ─────────────────────────────────────────────────
function Orb() {
  return (
    <div
      className="animate-orb"
      style={{
        position: 'absolute',
        top: '8%',
        left: '50%',
        width: 720, height: 720,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.06) 38%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

// ── Страница квиза ────────────────────────────────────────────────────────────

export function QuizPage() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [phase, setPhase] = useState<'quiz' | 'results'>('quiz');

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];
  const progress = (step / total) * 100;
  const currentValue = values[step];

  // При достижении экрана результатов записываем факт прохождения в localStorage
  // (TestsPage читает этот флаг и переключает CTA с 'Пройти' на 'Перепройти').
  useEffect(() => {
    if (phase === 'results') {
      localStorage.setItem(QUIZ_COMPLETED_KEY, String(Date.now()));
    }
  }, [phase]);

  function handleScaleChange(v: number) {
    const next = [...values];
    next[step] = v;
    setValues(next);

    setTimeout(() => {
      if (step + 1 >= total) {
        setPhase('results');
      } else {
        setStep(step + 1);
      }
    }, 500);
  }

  const results = phase === 'results' ? computeResults(values as number[]) : [];

  // ── Экран результатов ─────────────────────────────────────────────────────

  if (phase === 'results') {
    return (
      <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0', minHeight: 'calc(100vh - 80px)' }}>
        <Orb />
        <section style={{
          position: 'relative', zIndex: 1,
          padding: '70px 64px 100px',
          maxWidth: 660,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 11px', borderRadius: 999,
            background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.20)',
            color: '#34d399', fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
            Тест пройден
          </div>

          <h1 style={{
            fontSize: 36, fontWeight: 700, margin: 0,
            letterSpacing: '-0.025em', lineHeight: 1.1,
            background: 'linear-gradient(135deg,#fff 0%,#a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Ваши направления
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 10 }}>
            Топ-3 на основе ваших ответов.
          </p>

          <div style={{ display: 'grid', gap: 12, marginTop: 36, textAlign: 'left' }}>
            {results.map((r, i) => {
              const available = AVAILABLE_SLUGS.has(r.slug);
              return (
                <div
                  key={r.slug}
                  className="animate-result-card"
                  style={{
                    animationDelay: `${i * 120}ms`,
                    padding: '20px 22px',
                    borderRadius: 12,
                    border: i === 0
                      ? '1px solid rgba(99,102,241,0.4)'
                      : '1px solid rgba(255,255,255,0.06)',
                    background: i === 0
                      ? 'rgba(99,102,241,0.08)'
                      : 'rgba(22,23,29,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: i === 0 ? '0 8px 30px -12px rgba(99,102,241,0.5)' : 'none',
                    opacity: available ? 1 : 0.55,
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: '#a5b4fc',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    {getIcon(r.slug)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{r.name}</span>
                      {i === 0 && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          padding: '2px 7px', borderRadius: 999,
                          background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
                        }}>
                          лучшее совпадение
                        </span>
                      )}
                      {!available && (
                        <span style={{
                          fontSize: 9, fontWeight: 600,
                          color: '#64748b',
                        }}>
                          скоро
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                      {r.description}
                    </div>
                  </div>

                  {available ? (
                    <Link
                      to={`/d/${r.slug}`}
                      className="twk-shimmer-host"
                      style={{
                        background: i === 0
                          ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                          : 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.10)',
                        padding: '8px 14px',
                        borderRadius: 8,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        flexShrink: 0,
                        boxShadow: i === 0 ? '0 4px 14px -4px rgba(99,102,241,0.5)' : 'none',
                      }}
                    >
                      Изучить подробнее <ArrowRight />
                    </Link>
                  ) : (
                    <span style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: '#475569',
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      Скоро
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <Link
            to="/directions"
            style={{
              display: 'inline-block',
              marginTop: 28,
              fontSize: 12.5,
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            Все направления →
          </Link>
        </section>
      </div>
    );
  }

  // ── Экран теста ────────────────────────────────────────────────────────────

  return (
    <div style={{
      position: 'relative',
      zIndex: 2,
      color: '#e2e8f0',
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Orb />

      <section style={{
        position: 'relative', zIndex: 1,
        padding: '0 64px',
        maxWidth: 720,
        width: '100%',
        margin: '0 auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Бейдж + заголовок */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 11px', borderRadius: 999,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.20)',
            color: '#a5b4fc', fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 14,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
            Подбор направления
          </div>

          <div style={{
            fontSize: 11, color: '#64748b',
            letterSpacing: '0.12em', textTransform: 'uppercase' as const,
            fontWeight: 600,
          }}>
            Вопрос {step + 1} из {total}
          </div>
        </div>

        {/* Прогресс-бар */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            height: 3, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg,#6366f1,#a855f7,#8b5cf6)',
              backgroundSize: '200% 100%',
              width: `${progress}%`,
              transition: 'width 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              boxShadow: '0 0 12px rgba(139,92,246,0.5)',
            }} />
          </div>
        </div>

        {/* Утверждение + шкала (анимируются при смене step) */}
        <div key={step} className="animate-question">
          <div style={{
            fontSize: 22, fontWeight: 600, color: '#fff',
            marginBottom: 44, lineHeight: 1.4,
            textAlign: 'center',
            maxWidth: 560,
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            {current.statement}
          </div>

          <ScaleSelector value={currentValue} onChange={handleScaleChange} />
        </div>
      </section>
    </div>
  );
}
