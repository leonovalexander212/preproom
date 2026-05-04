import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Новый ключ — timestamp последнего показа попапа.
// Меняем имя ключа от старого булева флага, чтобы у пользователей,
// у которых застрял старый флаг, попап заработал заново.
const LS_KEY = 'preproom_quiz_prompt_last_seen';
const COOLDOWN_DAYS = 3;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 5000;

/**
 * Попап, всплывающий через 5 секунд после захода.
 * Запоминает timestamp последнего показа — повторно появится не раньше,
 * чем через COOLDOWN_DAYS дней. Не показывается на страницах /tests/*.
 */
export function QuizPrompt() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Не показываем, если уже на странице тестов (включая каталог)
    if (location.pathname.startsWith('/tests')) return;

    // Проверяем cooldown — если последний показ был < 3 дней назад, молчим
    const lastSeenRaw = localStorage.getItem(LS_KEY);
    if (lastSeenRaw) {
      const lastSeen = parseInt(lastSeenRaw, 10);
      if (!Number.isNaN(lastSeen) && Date.now() - lastSeen < COOLDOWN_MS) return;
    }

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  function close() {
    setClosing(true);
    // Записываем timestamp — попап вернётся через COOLDOWN_DAYS дней
    localStorage.setItem(LS_KEY, String(Date.now()));
    setTimeout(() => setVisible(false), 300);
  }

  function dismiss() { close(); }

  function accept() {
    close();
    setTimeout(() => navigate('/tests/quiz'), 150);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: closing ? 0 : 1,
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: closing
          ? 'translate(-50%, -50%) scale(0.95)'
          : 'translate(-50%, -50%) scale(1)',
        zIndex: 101,
        width: '100%', maxWidth: 420,
        padding: '32px 28px 26px',
        borderRadius: 16,
        border: '1px solid rgba(99,102,241,0.25)',
        background: 'rgba(16,17,24,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 24px 60px -16px rgba(0,0,0,0.7), 0 0 40px -10px rgba(99,102,241,0.3)',
        textAlign: 'center',
        opacity: closing ? 0 : 1,
        transition: 'opacity 300ms ease, transform 300ms ease',
      }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
          display: 'grid', placeItems: 'center',
          margin: '0 auto 18px',
          color: '#a5b4fc',
        }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
          </svg>
        </div>

        <h2 style={{
          fontSize: 18, fontWeight: 700, color: '#fff', margin: 0,
        }}>
          Не знаете, с чего начать?
        </h2>

        <p style={{
          fontSize: 12.5, color: '#94a3b8', marginTop: 8, lineHeight: 1.55,
          maxWidth: 320, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Короткий тест из 8 вопросов подберёт направления под вас.
        </p>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'center' }}>
          <button
            onClick={dismiss}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Не сейчас
          </button>

          <button
            onClick={accept}
            className="twk-shimmer-host"
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 6px 20px -6px rgba(99,102,241,0.6)',
            }}
          >
            Пройти тест
          </button>
        </div>
      </div>
    </>
  );
}
