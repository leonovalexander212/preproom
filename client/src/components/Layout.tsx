import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Background } from './Background';
import { QuizPrompt } from './QuizPrompt';

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ size = 15 }: { size?: number }) {
  const m = size * 1.5;
  return (
    <div style={{
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      fontWeight: 800,
      letterSpacing: '0.18em',
      fontSize: size,
      color: '#ffffff',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <svg width={m} height={m} viewBox="0 0 24 24" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        <defs>
          <linearGradient id="pp-lg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0"   stopColor="#818cf8" />
            <stop offset="0.6" stopColor="#a855f7" />
            <stop offset="1"   stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="22" height="22" rx="6" fill="none" stroke="url(#pp-lg)" strokeWidth="1.6" />
        <path d="M8 8 L5 12 L8 16"  fill="none" stroke="url(#pp-lg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8 L19 12 L16 16" fill="none" stroke="url(#pp-lg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1.7" fill="#c4b5fd">
          <animate attributeName="opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
      PREPROOM
    </div>
  );
}

// ── Footer column ─────────────────────────────────────────────────────────────
type FooterLink = { label: string; to?: string; href?: string };

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12, fontWeight: 600 }}>
        {title}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {links.map((l) => (
          <li key={l.label}>
            {l.to ? (
              <Link
                to={l.to}
                style={{ color: '#cbd5e1', fontSize: 12.5, textDecoration: 'none', transition: 'color 160ms ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a5b4fc')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              >
                {l.label}
              </Link>
            ) : (
              <a
                href={l.href}
                target={l.href?.startsWith('http') ? '_blank' : undefined}
                rel={l.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ color: '#cbd5e1', fontSize: 12.5, textDecoration: 'none', transition: 'color 160ms ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a5b4fc')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              >
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  // На страницах самого теста скрываем футер — иммерсивный режим.
  // На каталоге /tests футер показываем.
  const hideFooter = location.pathname.startsWith('/tests/') && location.pathname !== '/tests';

  const navLinks = [
    { to: '/directions', label: 'Направления', exact: false },
    { to: '/tests',      label: 'Тесты',       exact: false, matchPrefix: '/tests' },
    { to: '/recordings', label: 'Записи',      exact: false },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Background mode="network" intensity={0.4} />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ── NavBar ─────────────────────────────────────────────────────── */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          padding: '20px 64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(10,11,16,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <Link
              to="/"
              style={{ textDecoration: 'none' }}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <Logo size={15} />
            </Link>
            <nav style={{ display: 'flex', gap: 32 }}>
              {navLinks.map(({ to, label, exact, matchPrefix }) => {
                const active = exact
                  ? location.pathname === to
                  : matchPrefix
                    ? location.pathname.startsWith(matchPrefix)
                    : location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      fontSize: 13,
                      color: active ? '#a5b4fc' : '#94a3b8',
                      textDecoration: 'none',
                      fontWeight: active ? 600 : 400,
                      paddingBottom: 4,
                      borderBottom: active ? '1.5px solid #6366f1' : '1.5px solid transparent',
                      transition: 'color 160ms ease, border-color 160ms ease',
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link
            to="/"
            className="twk-shimmer-host"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 6px 20px -8px rgba(99,102,241,0.6)',
              textDecoration: 'none',
            }}
          >
            Начать подготовку
          </Link>
        </header>

        {/* ── Page content ───────────────────────────────────────────────── */}
        <main key={location.pathname} className="animate-page-enter">
          <Outlet />
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        {!hideFooter && (
          <footer style={{
            position: 'relative',
            zIndex: 5,
            padding: '40px 64px 36px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            marginTop: 80,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 32,
            }}>
              <div style={{ maxWidth: 320 }}>
                <Logo size={13} />
                <p style={{ marginTop: 14, fontSize: 11.5, color: '#64748b', lineHeight: 1.6, margin: '14px 0 0' }}>
                  © 2026 PREPROOM. Платформа для подготовки к твоим будущим собеседованиям.
                </p>
              </div>

              <FooterCol
                title="Платформа"
                links={[
                  { label: 'Документация', to: '/docs' },
                  { label: 'Статус API',   to: '/status' },
                ]}
              />
              <FooterCol
                title="Правовые"
                links={[
                  { label: 'Конфиденциальность',     to: '/privacy' },
                  { label: 'Условия использования',  to: '/terms' },
                ]}
              />
              <FooterCol
                title="Поддержка"
                links={[
                  { label: 'Связаться', to: '/contact' },
                ]}
              />
            </div>
          </footer>
        )}

      </div>

      <QuizPrompt />
    </div>
  );
}
