import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function Recordings() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  // --- FILTER STATE ---
  const [dir, setDir] = useState("");
  const [diff, setDiff] = useState("");
  const [dirs, setDirs] = useState([]);

  // 🔥 пагинация
  const PAGE_REC = 9;
  const [visibleRec, setVisibleRec] = useState(PAGE_REC);

  // загрузка направлений
  useEffect(() => {
    api.getDirections().then(setDirs).catch(() => {});
  }, []);

  // загрузка интервью с фильтрами + сброс лимита
  useEffect(() => {
    api
      .getInterviews({
        direction: dir || undefined,
        difficulty: diff || undefined,
      })
      .then(setItems)
      .catch((e) => setError(e.message));

    // сброс при смене фильтра
    setVisibleRec(PAGE_REC);
  }, [dir, diff]);

  return (
    <div style={{ position: "relative", zIndex: 2, paddingTop: 120 }}>
      {/* HERO */}
      <section style={{ padding: "60px 28px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="mono" style={{
          fontSize: 11,
          color: "var(--accent-ink)",
          letterSpacing: "0.24em",
          marginBottom: 18,
        }}>
          › ИСТОЧНИКИ
        </div>

        <h1 className="display" style={{
          fontSize: "clamp(60px, 9vw, 140px)",
          margin: 0,
          color: "var(--fg)",
        }}>
          <span className="glitch" data-text="ИНТЕРВЬЮ">
            ИНТЕРВЬЮ
          </span>
        </h1>

        <p style={{
          marginTop: 20,
          fontSize: 14,
          color: "var(--fg-dim)",
          maxWidth: 540,
          lineHeight: 1.6,
        }}>
          <span style={{ color: "var(--accent-ink)" }}>›</span> Реальные
          видео-собеседования, на основе которых формируется база вопросов.
        </p>
      </section>

      {/* TOOLBAR */}
      <section style={{
        padding: "20px 28px",
        maxWidth: 1280,
        margin: "0 auto",
        display: "flex",
        gap: 16,
        borderTop: "2px solid var(--fg)",
        borderBottom: "2px solid var(--fg)",
        flexWrap: "wrap",
      }}>
        {/* Direction */}
        <select
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          className="mono"
          style={{
            background: "var(--card)",
            border: "2px solid var(--fg)",
            padding: "10px 14px",
            color: "var(--fg)",
          }}
        >
          <option value="">ВСЕ НАПРАВЛЕНИЯ</option>
          {dirs.map((d) => (
            <option key={d.id} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <div style={{ display: "flex", border: "2px solid var(--fg)" }}>
          {[["", "ВСЕ"], ["JUNIOR", "JR"], ["MIDDLE", "MD"], ["SENIOR", "SR"]].map(
            ([k, l], i, a) => (
              <button
                key={k || "all"}
                onClick={() => setDiff(k)}
                className="mono"
                style={{
                  padding: "10px 16px",
                  border: "none",
                  cursor: "pointer",
                  background: diff === k ? "var(--accent)" : "transparent",
                  color: diff === k ? "#000" : "var(--fg-dim)",
                  borderRight: i < a.length - 1 ? "2px solid var(--fg)" : "none",
                }}
              >
                {l}
              </button>
            )
          )}
        </div>
      </section>

      {/* GRID */}
      <section style={{ padding: "0 28px", maxWidth: 1280, margin: "0 auto" }}>
        {error && (
          <div className="mono" style={{ color: "var(--danger)", padding: 24 }}>
            // ОШИБКА: {error}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {items.slice(0, visibleRec).map((iv) => (
            <a
              key={iv.id}
              href={iv.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`interview-${iv.id}`}
              className="card-brutal"
              style={{ display: "block", color: "var(--fg)" }}
            >
              {iv.thumbnailUrl && (
                <img
                  src={iv.thumbnailUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderBottom: "2px solid var(--fg)",
                  }}
                />
              )}

              <div style={{ padding: 18 }}>
                <div className="mono" style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: "var(--accent-ink)",
                  marginBottom: 8,
                }}>
                  {iv.directionName} · {iv.difficulty} · {iv.questionCount} ВОПР
                </div>

                <div style={{
                  fontSize: 15,
                  lineHeight: 1.4,
                  fontWeight: 600,
                }}>
                  {iv.title}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* LOAD MORE */}
        {items.length > visibleRec && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              className="btn-ghost"
              data-testid="load-more-recordings"
              onClick={() => setVisibleRec((v) => v + PAGE_REC)}
            >
              ЗАГРУЗИТЬ ЕЩЁ →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}