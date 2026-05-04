import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer data-testid="footer" style={{
      position: "relative", zIndex: 5, marginTop: 120,
      borderTop: "2px solid var(--fg)", padding: "60px 28px 36px", background: "var(--bg)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: 48, maxWidth: 1280, margin: "0 auto" }}>
        <div>
          <div className="display" style={{ fontSize: 56 }}>PREPROOM<span style={{ color: "var(--accent-ink)" }}>.</span></div>
          <p style={{ marginTop: 14, color: "var(--muted)", fontSize: 12, lineHeight: 1.7, maxWidth: 320 }}>
            © 2026 — Платформа подготовки к собеседованиям.<br/>ЛЕОНОВ АЛЕКСАНДР. СИБГУТИ.
          </p>
        </div>
        {[
          { title: "ПЛАТФОРМА", links: [["Документация","/docs"],["Статус API","/status"]] },
          { title: "ПРАВОВОЕ", links: [["Конфиденциальность","/privacy"],["Условия","/terms"]] },
          { title: "ПОДДЕРЖКА", links: [["Связаться","/contact"]] },
        ].map((c) => (
          <div key={c.title}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--accent-ink)", marginBottom: 16 }}>{c.title}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              {c.links.map(([l, to]) => (
                <li key={l}><Link to={to} style={{ color: "var(--fg-dim)", fontSize: 13 }}>{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="marquee" style={{
        marginTop: 60, paddingTop: 24, paddingBottom: 4, borderTop: "2px solid var(--line)",
        color: "var(--accent-ink)", fontFamily: "'Archivo Black'", fontSize: 56, letterSpacing: "-0.03em",
      }}>
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="marquee-seg">PER&nbsp;·&nbsp;ASPERA&nbsp;·&nbsp;AD&nbsp;·&nbsp;SCIENTIAM&nbsp;·&nbsp;</span>
          ))}
        </div>
      </div>
    </footer>
  );
}