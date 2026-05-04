import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const QUIZ_COMPLETED_KEY = 'preproom_quiz_completed';

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

// ── Icons ─────────────────────────────────────────────────────────────────────
const CompassIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const ClockIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ListIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const ArrowRight = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

// ── Test Card ─────────────────────────────────────────────────────────────────
type TestCardProps = {
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  meta: { label: string; icon: React.ReactNode }[];
  ctaLabel: string;
  to?: string;
  disabled?: boolean;
};

function TestCard({ icon, badge, badgeColor, title, description, meta, ctaLabel, to, disabled }: TestCardProps) {
  const [hover, setHover] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '26px 28px',
        borderRadius: 14,
        border: hover && !disabled
          ? '1px solid rgba(99,102,241,0.4)'
          : '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(22,23,29,0.65)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 220ms ease',
        transform: hover && !disabled ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover && !disabled ? '0 14px 32px -16px rgba(99,102,241,0.6)' : 'none',
        opacity: disabled ? 0.5 : 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
          color: '#a5b4fc',
          display: 'grid', placeItems: 'center',
        }}>
          {icon}
        </div>
        {badge && (
          <span style={{
            fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase' as const,
            letterSpacing: '0.14em',
            padding: '3px 9px', borderRadius: 999,
            background: `${badgeColor ?? '#34d399'}20`,
            color: badgeColor ?? '#34d399',
            border: `1px solid ${badgeColor ?? '#34d399'}40`,
          }}>
            {badge}
          </span>
        )}
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: 0, marginBottom: 8, letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.55, margin: 0, marginBottom: 18 }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
        {meta.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#64748b' }}>
            <span style={{ color: '#475569' }}>{m.icon}</span>
            {m.label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex' }}>
        {disabled ? (
          <span style={{
            padding: '9px 18px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: '#475569',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            Скоро
          </span>
        ) : (
          <span
            className="twk-shimmer-host"
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              boxShadow: '0 6px 20px -6px rgba(99,102,241,0.6)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {ctaLabel} <ArrowRight />
          </span>
        )}
      </div>
    </div>
  );

  if (disabled || !to) return inner;
  return <Link to={to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link>;
}

// ── TestsPage ─────────────────────────────────────────────────────────────────
export function TestsPage() {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(!!localStorage.getItem(QUIZ_COMPLETED_KEY));
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0' }}>
      <section style={{ padding: '70px 64px 50px', maxWidth: 1240, margin: '0 auto' }}>
        <Breadcrumb current="Тесты" />

        <h1 style={{ margin: 0, fontSize: 72, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>
          Тесты
        </h1>
        <p style={{ marginTop: 18, fontSize: 14, color: '#94a3b8', lineHeight: 1.65, maxWidth: 560 }}>
          Короткие интерактивные тесты, помогающие сориентироваться в платформе.
          Без регистрации, всё считается локально в браузере.
        </p>
      </section>

      <section style={{ padding: '0 64px 80px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          <TestCard
            icon={<CompassIcon size={22} />}
            badge={completed ? 'пройдено' : 'доступно'}
            badgeColor={completed ? '#a5b4fc' : '#34d399'}
            title="Подбор направления"
            description="Восемь утверждений о ваших вкусах, темпераменте и интересах. По итогам — три направления, которые подходят лучше всего."
            meta={[
              { label: '8 вопросов',     icon: <ListIcon size={13} /> },
              { label: '~2 минуты',      icon: <ClockIcon size={13} /> },
            ]}
            ctaLabel={completed ? 'Перепройти' : 'Пройти тест'}
            to="/tests/quiz"
          />

          <TestCard
            icon={<ListIcon size={22} />}
            badge="скоро"
            badgeColor="#64748b"
            title="Готовность к собеседованию"
            description="Мини-симуляция: вы отвечаете на типовые вопросы выбранного направления, а ИИ оценивает уверенность ответа и пробелы в знаниях."
            meta={[
              { label: 'разные форматы', icon: <ListIcon size={13} /> },
              { label: '~15 минут',      icon: <ClockIcon size={13} /> },
            ]}
            ctaLabel="Скоро"
            disabled
          />
        </div>
      </section>
    </div>
  );
}
