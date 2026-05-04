import React from "react";

function Page({ title, children }) {
  return (
    <div style={{ paddingTop: 120, maxWidth: 880, margin: "0 auto", padding: "140px 28px 80px" }}>
      <div className="mono" style={{ color: "var(--accent-ink)", letterSpacing: "0.22em", fontSize: 11, marginBottom: 14 }}>› ИНФОРМАЦИЯ</div>
      <h1 className="display" style={{ fontSize: "clamp(48px, 7vw, 110px)", margin: 0 }}>{title}</h1>
      <div style={{ marginTop: 30, color: "var(--fg-dim)", fontSize: 15, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export const DocsPage = () => (
  <Page title="ДОКУМЕНТАЦИЯ">
    <p>API публикует данные о направлениях, вопросах и интервью. Все эндпоинты доступны под префиксом <code>/api</code>.</p>
    <p><strong>Эндпоинты:</strong></p>
    <ul>
      <li><code>GET /api/directions</code></li>
      <li><code>GET /api/directions/:slug/questions</code></li>
      <li><code>GET /api/questions/:id/video-answers</code></li>
      <li><code>GET /api/interviews</code></li>
      <li><code>POST /api/ai/explain</code> (SSE)</li>
    </ul>
  </Page>
);

export const PrivacyPage = () => (
  <Page title="КОНФИДЕНЦИАЛЬНОСТЬ">
    <p>Сервис не собирает персональные данные пользователей. Используется только локальное хранилище для темы оформления.</p>
  </Page>
);

export const TermsPage = () => (
  <Page title="УСЛОВИЯ">
    <p>Сервис предоставляется «как есть». Контент — выжимка публичных интервью с YouTube, используется в образовательных целях.</p>
  </Page>
);

export const StatusPage = () => (
  <Page title="СТАТУС">
    <p className="mono" style={{ color: "var(--accent-ink)" }}>● ВСЕ СИСТЕМЫ ОПЕРАТИВНЫ</p>
  </Page>
);

export const ContactPage = () => (
  <Page title="КОНТАКТЫ">
    <p>Александр Леонов · СибГУТИ · <a href="https://github.com/leonovalexander212" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-ink)", textDecoration: "underline" }}>github.com/leonovalexander212</a></p>
  </Page>
);