import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";

function Page({ title, children }) {
  return (
    <div style={{ paddingTop: 120, maxWidth: 880, margin: "0 auto", padding: "140px 28px 80px" }}>
      <div className="mono" style={{ color: "var(--accent-ink)", letterSpacing: "0.22em", fontSize: 11, marginBottom: 14 }}>
        › ИНФОРМАЦИЯ
      </div>
      <h1 className="display" style={{ fontSize: "clamp(48px, 7vw, 110px)", margin: 0 }}>
        {title}
      </h1>
      <div style={{ marginTop: 30, color: "var(--fg-dim)", fontSize: 15, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

export const DocsPage = () => (
  <Page title="ДОКУМЕНТАЦИЯ">
    <p>
      PrepRoom — платформа с публичным REST API. Все эндпоинты доступны под префиксом <code>/api</code>, формат ответа — JSON.
    </p>

    <h3 style={{ color: "var(--fg)", marginTop: 26 }}>Основные эндпоинты</h3>
    <ul>
      <li><code>GET /api/health</code> — состояние сервиса</li>
      <li><code>GET /api/directions</code> — список направлений со счётчиками</li>
      <li><code>GET /api/directions/:slug/questions</code> — вопросы по направлению</li>
      <li><code>GET /api/questions/:id/video-answers</code> — видеоответы</li>
      <li><code>GET /api/interviews</code> — собеседования</li>
      <li><code>POST /api/ai/explain</code> — объяснение через ИИ</li>
    </ul>
  </Page>
);

export const PrivacyPage = () => (
  <Page title="КОНФИДЕНЦИАЛЬНОСТЬ">
    <p>Сервис не собирает персональные данные пользователей.</p>
  </Page>
);

export const TermsPage = () => (
  <Page title="УСЛОВИЯ">
    <p>PrepRoom предоставляется «как есть», в образовательных целях.</p>
  </Page>
);

export const StatusPage = () => {
  const [state, setState] = useState("checking");
  const [latency, setLatency] = useState(null);

  const ping = async () => {
    setState("checking");
    const t0 = performance.now();
    try {
      const r = await fetch(`${api.base}/api/health`);
      if (!r.ok) throw new Error();
      await r.json();
      setLatency(Math.round(performance.now() - t0));
      setState("ok");
    } catch {
      setState("down");
    }
  };

  useEffect(() => {
    ping();
  }, []);

  return (
    <Page title="СТАТУС">
      <div style={{ border: "2px solid var(--fg)", padding: 24 }}>
        {state === "ok" && `OK · ${latency} ms`}
        {state === "down" && "DOWN"}
        {state === "checking" && "CHECKING..."}
      </div>
    </Page>
  );
};

// ✅ ОБНОВЛЁННЫЙ CONTACT PAGE
export const ContactPage = () => (
  <Page title="КОНТАКТЫ">
    <p>Багрепорты, идеи, сотрудничество — пиши на почту или в GitHub.</p>

    <div style={{
      marginTop: 28,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 14
    }}>
      <ContactCard
        label="EMAIL"
        value="awesome.boonar@yandex.ru"
        href="mailto:awesome.boonar@yandex.ru"
        testid="contact-email"
      />

      <ContactCard
        label="GITHUB"
        value="leonovalexander212"
        href="https://github.com/leonovalexander212"
        testid="contact-github"
      />
    </div>

    <p style={{
      marginTop: 24,
      fontSize: 13,
      color: "var(--muted)"
    }}>
      Александр Леонов · СибГУТИ · 2026.
    </p>
  </Page>
);

function ContactCard({ label, value, href, testid }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      data-testid={testid}
      style={{
        display: "block",
        padding: "18px 20px",
        color: "var(--fg)",
        border: "2px solid var(--fg)",
        background: "var(--card)",
        textDecoration: "none",
        transition: "background 160ms ease, color 160ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#e5ff00";
        e.currentTarget.style.color = "#000";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--card)";
        e.currentTarget.style.color = "var(--fg)";
      }}
    >
      <div className="mono" style={{
        fontSize: 10,
        letterSpacing: "0.22em",
        color: "var(--accent-ink)"
      }}>
        {label}
      </div>

      <div style={{
        marginTop: 8,
        fontSize: 15,
        lineHeight: 1.35,
        fontWeight: 600,
        wordBreak: "break-all",
        overflowWrap: "anywhere",
        hyphens: "none",
        textTransform: "none",
      }}>
        {value}
      </div>

      <div className="mono" style={{
        marginTop: 10,
        fontSize: 10,
        letterSpacing: "0.2em",
        opacity: 0.6
      }}>
        OPEN ↗
      </div>
    </a>
  );
}