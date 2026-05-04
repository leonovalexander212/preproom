import { Link } from 'react-router-dom';

const GITHUB_URL = 'https://github.com/leonovalexander212';
const EMAIL = 'leonovalexanderip212@yandex.ru';

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
const GitHubIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12.07c0 5.13 3.29 9.46 7.86 10.99.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.78 2.7 1.27 3.36.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.71 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.97 10.97 0 0 1 5.74 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.44-2.69 5.42-5.25 5.7.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.16 0 .31.21.66.8.55A11.51 11.51 0 0 0 23.5 12.07C23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);

const MailIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
  </svg>
);

const ArrowOut = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
  </svg>
);

// ── ContactCard ───────────────────────────────────────────────────────────────
function ContactCard({
  icon, title, subtitle, value, href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '20px 24px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(22,23,29,0.65)',
        textDecoration: 'none',
        transition: 'all 220ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 14px 32px -16px rgba(99,102,241,0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 10,
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.25)',
        color: '#a5b4fc',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.14em', fontWeight: 600 }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', marginTop: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, fontFamily: "'JetBrains Mono', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      </div>

      <div style={{ color: '#475569', flexShrink: 0 }}>
        <ArrowOut size={14} />
      </div>
    </a>
  );
}

// ── ContactPage ───────────────────────────────────────────────────────────────
export function ContactPage() {
  return (
    <div style={{ position: 'relative', zIndex: 2, color: '#e2e8f0' }}>
      <section style={{ padding: '70px 64px 60px', maxWidth: 720, margin: '0 auto' }}>
        <Breadcrumb current="Связаться" />

        <h1 style={{ margin: 0, fontSize: 56, fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.05 }}>
          Связаться
        </h1>
        <p style={{ marginTop: 14, fontSize: 14, color: '#94a3b8', lineHeight: 1.6, maxWidth: 480 }}>
          Нашли баг, есть идея или просто хотите написать? Любой из вариантов ниже — рабочий.
        </p>

        <div style={{ marginTop: 40, display: 'grid', gap: 14 }}>
          <ContactCard
            icon={<GitHubIcon size={20} />}
            subtitle="GitHub"
            title="Открыть issue или прислать PR"
            value="github.com/leonovalexander212"
            href={GITHUB_URL}
          />
          <ContactCard
            icon={<MailIcon size={22} />}
            subtitle="Email"
            title="Написать напрямую"
            value={EMAIL}
            href={`mailto:${EMAIL}`}
          />
        </div>
      </section>
    </div>
  );
}
