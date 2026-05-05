import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const peekTimer = useRef(null);
  const isHovered = useRef(false);

  // Сколько ждать после ухода курсора с верхней зоны, прежде чем спрятать.
  // Было 1800ms — стало 500ms. Хочешь ещё быстрее — поставь 250.
  const PEEK_HIDE_DELAY = 500;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (isHovered.current) setHidden(false);
      else if (y < 60) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY.current = y;
    };
    const onMove = (e) => {
      if (e.clientY < 90) {
        setHidden(false);
        clearTimeout(peekTimer.current);
        peekTimer.current = setTimeout(() => {
          if (window.scrollY > 60 && !isHovered.current) setHidden(true);
        }, PEEK_HIDE_DELAY);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      clearTimeout(peekTimer.current);
    };
  }, []);

  const links = [
    { to: "/directions", label: "НАПРАВЛЕНИЯ" },
    { to: "/recordings", label: "ВИДЕО" },
    { to: "/tests",      label: "ТЕСТЫ" },
  ];

  return (
    <header data-testid="nav-bar"
      onMouseEnter={() => { isHovered.current = true; setHidden(false); clearTimeout(peekTimer.current); }}
      onMouseLeave={() => {
        isHovered.current = false;
        clearTimeout(peekTimer.current);
        // Если уже проскроллено вниз — прячем почти сразу
        peekTimer.current = setTimeout(() => {
          if (window.scrollY > 60 && !isHovered.current) setHidden(true);
        }, 250);
      }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--nav-bg)", backdropFilter: "blur(10px)",
        borderBottom: "2px solid var(--line)",
        transform: hidden ? "translateY(-110%)" : "translateY(0)",
        transition: "transform 320ms cubic-bezier(.2,.8,.2,1), background 300ms ease",
      }}>
      <Link to="/" data-testid="nav-logo" style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "var(--fg)" }}>
        <div style={{ width: 32, height: 32, background: "var(--accent)", display: "grid", placeItems: "center", border: "2px solid var(--fg)", boxShadow: "3px 3px 0 var(--fg)", fontFamily: "Archivo Black", color: "#000", fontSize: 18 }}>P</div>
        <span className="display" style={{ fontSize: 18, letterSpacing: "0.18em", color: "var(--fg)" }}>PREPROOM</span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {links.map((l) => {
          const active = pathname.startsWith(l.to);
          return (
            <Link key={l.to} to={l.to} data-testid={`nav-${l.label.toLowerCase()}`} style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.22em",
              color: active ? "var(--accent-ink)" : "var(--fg-dim)", fontWeight: 700,
              paddingBottom: 2, borderBottom: active ? "2px solid var(--accent-ink)" : "2px solid transparent",
              textDecoration: "none",
            }}>{l.label}</Link>
          );
        })}
        <button onClick={onToggleTheme} data-testid="theme-toggle" aria-label="Toggle theme"
          className={`theme-lever ${theme === "light" ? "is-light" : ""}`}>
          <span className="theme-lever__track">
            <span className="theme-lever__knob"><span className="theme-lever__knob-glyph">{theme === "light" ? "☀" : "☾"}</span></span>
          </span>
          <span className="theme-lever__hint">{theme === "light" ? "PAPER" : "NIGHT"}</span>
        </button>
        <Link to="/directions" className="btn-brutal" data-testid="nav-cta-btn" style={{ padding: "10px 18px", fontSize: 11 }}>НАЧАТЬ →</Link>
      </nav>
    </header>
  );
}