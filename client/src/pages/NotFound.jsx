import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ paddingTop: 120, maxWidth: 1180, margin: "0 auto", padding: "120px 28px 60px", textAlign: "center" }}>
      <div className="crumb-tag" style={{ marginBottom: 18, display: "inline-block" }}>
        ОШИБКА
      </div>

      <h1 className="display" style={{ fontSize: "clamp(48px, 14vw, 120px)", margin: 0, color: "var(--fg)", lineHeight: 0.9 }}>
        <span className="glitch" data-text="404">404</span>
      </h1>

      <p className="mono" style={{ marginTop: 24, fontSize: 14, letterSpacing: "0.15em", color: "var(--fg-dim)" }}>
        ТАКОЙ СТРАНИЦЫ НЕТ НА САЙТЕ
      </p>

      <Link
        to="/"
        className="btn-accent"
        style={{ marginTop: 40, display: "inline-block" }}
      >
        НА ГЛАВНУЮ →
      </Link>
    </div>
  );
}
