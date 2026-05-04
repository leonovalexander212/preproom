import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api } from "../lib/api.js";
import DomainIcon from "../components/DomainIcon.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function Directions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const root = useRef(null);

  useEffect(() => {
    api.getDirections().then(setItems).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".domain-card", { opacity: 0, y: 60, duration: 0.7, ease: "power3.out", stagger: 0.05 });
    }, root);
    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={root} style={{ position: "relative", zIndex: 2, paddingTop: 120 }}>
      <section style={{ padding: "60px 28px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--accent-ink)", letterSpacing: "0.24em", marginBottom: 18 }}>› ВЫБЕРИ СТЕК</div>
        <h1 className="display" style={{ fontSize: "clamp(56px, 9vw, 140px)", margin: 0, color: "var(--fg)" }}>
          <span className="glitch" data-text="НАПРАВЛЕНИЯ">НАПРАВЛЕНИЯ</span>
        </h1>
        <p style={{ marginTop: 22, fontSize: 14, color: "var(--fg-dim)", maxWidth: 560, lineHeight: 1.6 }}>
          <span style={{ color: "var(--accent-ink)" }}>›</span> Каждое направление содержит вопросы, ранжированные по реальной частоте встречаемости в собеседованиях.
        </p>
      </section>

      <section style={{ padding: "0 28px", maxWidth: 1280, margin: "0 auto" }}>
        {error && <div className="mono" style={{ color: "var(--danger)", padding: 24, border: "2px dashed var(--danger)" }}>// ОШИБКА: {error}</div>}
        {!error && items.length === 0 && (
          <div className="mono" style={{ color: "var(--muted)", padding: 60, textAlign: "center", letterSpacing: "0.2em" }}>// ЗАГРУЗКА...</div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: items.length ? "2px solid var(--fg)" : "none" }}>
          {items.map((d, idx) => {
            const onLastRow = idx >= Math.floor((items.length - 1) / 3) * 3;
            return (
              <Link
                key={d.id}
                to={`/d/${d.slug}`}
                data-testid={`direction-${d.slug}`}
                className="domain-card"
                style={{
                  position: "relative", padding: "36px 28px 28px",
                  borderRight: idx % 3 !== 2 ? "2px solid var(--fg)" : "none",
                  borderBottom: !onLastRow ? "2px solid var(--fg)" : "none",
                  background: "var(--card)", color: "var(--fg)",
                  minHeight: 240, display: "flex", flexDirection: "column", justifyContent: "space-between",
                  overflow: "hidden", transition: "background 180ms ease, color 180ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e5ff00"; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card)"; e.currentTarget.style.color = "var(--fg)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", opacity: 0.7 }}>N°{String(idx+1).padStart(2,"0")}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.55 }}>{d._count.questions} ВОПР · {d._count.interviews} ИНТ ↗</div>
                </div>
                <div style={{ position: "absolute", bottom: 18, right: 18, opacity: 0.85, pointerEvents: "none" }}>
                  <DomainIcon slug={d.slug} />
                </div>
                <div>
                  <div className="display" style={{ fontSize: 48, lineHeight: 0.9 }}>{d.name}</div>
                  {d.description && <p style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.55, opacity: 0.85, maxWidth: "75%" }}>{d.description}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}