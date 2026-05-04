import { useState } from 'react';
import { THEMES, useTheme, type ThemeId } from '../lib/theme';

const PaletteIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="7" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="8" cy="10.5" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="10.5" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="9" cy="15" r="1.2" fill="currentColor" stroke="none"/>
  </svg>
);

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const { theme, setTheme } = useTheme();

  function close() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 250);
  }

  function pick(id: ThemeId) {
    setTheme(id);
    close();
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Сменить тему"
        style={{
          width: 34, height: 34, borderRadius: 8,
          display: 'grid', placeItems: 'center',
          border: '1px solid var(--c-border)',
          background: 'transparent',
          color: 'var(--c-text-secondary)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          flexShrink: 0,
          transition: 'all 200ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--c-primary-text)';
          e.currentTarget.style.borderColor = 'var(--c-primary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--c-text-secondary)';
          e.currentTarget.style.borderColor = 'var(--c-border)';
        }}
      >
        <PaletteIcon size={16} />
      </button>

      {/* Modal */}
      {open && (
        <>
          <div
            onClick={close}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              opacity: closing ? 0 : 1,
              transition: 'opacity 250ms ease',
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: closing
              ? 'translate(-50%, -50%) scale(0.96)'
              : 'translate(-50%, -50%) scale(1)',
            zIndex: 201,
            width: '100%', maxWidth: 380,
            padding: '28px 24px 24px',
            borderRadius: 16,
            border: '1px solid var(--c-border)',
            background: `rgba(var(--c-surface-r), var(--c-surface-g), var(--c-surface-b), 0.96)`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 24px 60px -16px rgba(0,0,0,0.7)',
            opacity: closing ? 0 : 1,
            transition: 'opacity 250ms ease, transform 250ms ease',
          }}>
            <h3 style={{
              fontSize: 16, fontWeight: 700, color: 'var(--c-text)', margin: 0, marginBottom: 6,
            }}>
              Тема оформления
            </h3>
            <p style={{
              fontSize: 12, color: 'var(--c-text-muted)', margin: '0 0 20px',
            }}>
              Выберите палитру под настроение.
            </p>

            <div style={{ display: 'grid', gap: 6 }}>
              {THEMES.map(t => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => pick(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: active
                        ? `1.5px solid ${t.swatch}`
                        : '1.5px solid transparent',
                      background: active
                        ? `${t.swatch}15`
                        : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      transition: 'all 180ms ease',
                    }}
                    onMouseEnter={e => {
                      if (!active) e.currentTarget.style.background = `${t.swatch}0d`;
                    }}
                    onMouseLeave={e => {
                      if (!active) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Swatch circle */}
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: t.swatch,
                      border: t.id === 'light' ? `1.5px solid ${t.border}` : '1.5px solid transparent',
                      boxShadow: active ? `0 0 12px ${t.swatch}88` : 'none',
                      flexShrink: 0,
                      transition: 'box-shadow 180ms ease',
                    }} />

                    <span style={{
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--c-text)' : 'var(--c-text-secondary)',
                    }}>
                      {t.label}
                    </span>

                    {active && (
                      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={t.swatch} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
