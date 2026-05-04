import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

export default function Tests() {
  const [dirs, setDirs] = useState([]);
  useEffect(() => { api.getDirections().then(setDirs).catch(() => {}); }, []);

  return (
    <div style={{ position: "relative", zIndex: 2, paddingTop: 120, maxWidth: 1280, margin: "0 auto", padding: "120px 28px 0" }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--accent-ink)", letterSpacing: "0.24em", marginBottom: 18 }}>› ТРЕНИРОВКА</div>
      <h1 className="display" style={{ fontSize: "clamp(60px, 9vw, 140px)", margin: 0, color: "var(--fg)" }}>
        <span className="glitch" data-text="КВИЗ">КВИЗ</span>
      </h1>
      <p style={{ marginTop: 20, fontSize: 14, color: "var(--fg-dim)", maxWidth: 540, lineHeight: 1.6 }}>
        <span style={{ color: "var(--accent-ink)" }}>›</span> Выбери направление — сгенерируем 10 случайных вопросов с проверкой через ИИ.
      </p>
      <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {dirs.map((d) => (
          <Link key={d.id} to={`/tests/quiz?direction=${d.slug}`} className="card-brutal" data-testid={`quiz-direction-${d.slug}`}
            style={{ padding: 22, color: "var(--fg)", display: "block" }}>
            <div className="display" style={{ fontSize: 28 }}>{d.name}</div>
            <div className="mono" style={{ marginTop: 10, fontSize: 11, color: "var(--accent-ink)", letterSpacing: "0.2em" }}>
              {d._count.questions} ВОПР ↗
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}