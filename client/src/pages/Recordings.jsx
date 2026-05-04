import React, { useEffect, useRef, useState } from "react";
import { api } from "../lib/api.js";

const PAGE_REC = 9;

export default function Recordings() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const [dir, setDir] = useState("");
  const [diff, setDiff] = useState("");
  const [dirs, setDirs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.getDirections().then(setDirs).catch(() => {});
  }, []);

  useEffect(() => {
    api.getInterviews({
      direction: dir || undefined,
      difficulty: diff || undefined,
    })
      .then((list) => {
        setItems(list);
        setPage(1);
      })
      .catch((e) => setError(e.message));
  }, [dir, diff]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_REC));
  const pageItems = items.slice((page - 1) * PAGE_REC, page * PAGE_REC);

  return (
    <div style={{ position: "relative", zIndex: 2, paddingTop: 120 }}>
      <section style={{ padding: "60px 28px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--accent-ink)",
            letterSpacing: "0.24em",
            marginBottom: 18,
          }}
        >
          › ИСТОЧНИКИ
        </div>

        <h1
          className="display"
          style={{
            fontSize: "clamp(60px, 9vw, 140px)",
            margin: 0,
            color: "var(--fg)",
          }}
        >
          <span className="glitch" data-text="ИНТЕРВЬЮ">
            ИНТЕРВЬЮ
          </span>
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 14,
            color: "var(--fg-dim)",
            maxWidth: 540,
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: "var(--accent-ink)" }}>›</span> Реальные видео-собеседования, на основе которых формируется база вопросов.
        </p>
      </section>

      <section
        style={{
          padding: "20px 28px",
          maxWidth: 1280,
          margin: "0 auto",
          borderTop: "2px solid var(--fg)",
          borderBottom: "2px solid var(--fg)",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
          position: "relative",
          zIndex: 20,
        }}
      >
        <Dropdown
          value={dir}
          onChange={setDir}
          placeholder="ВСЕ НАПРАВЛЕНИЯ"
          options={[
            { value: "", label: "ВСЕ НАПРАВЛЕНИЯ" },
            ...dirs.map((d) => ({
              value: d.slug,
              label: d.name,
            })),
          ]}
        />

        <div style={{ display: "flex", border: "2px solid var(--fg)" }}>
          {[
            ["", "ВСЕ"],
            ["JUNIOR", "JR"],
            ["MIDDLE", "MD"],
            ["SENIOR", "SR"],
          ].map(([k, l], i, a) => (
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
          ))}
        </div>
      </section>

      <section style={{ padding: "32px 28px 0", maxWidth: 1280, margin: "0 auto" }}>
        {error && (
          <div className="mono" style={{ color: "var(--danger)", padding: 24 }}>
            // ОШИБКА: {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {pageItems.map((iv) => (
            <a
              key={iv.id}
              href={iv.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`interview-${iv.id}`}
              className="card-brutal"
              style={{ display: "block", color: "var(--fg)" }}
            >
              <ThumbImg src={iv.thumbnailUrl} />

              <div style={{ padding: 18 }}>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    color: "var(--accent-ink)",
                    marginBottom: 8,
                  }}
                >
                  {iv.directionName} · {iv.difficulty} · {iv.questionCount} ВОПР
                </div>

                <div style={{ fontSize: 15, lineHeight: 1.4, fontWeight: 600 }}>
                  {iv.title}
                </div>
              </div>
            </a>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </section>
    </div>
  );
}

/* ===== Thumb ===== */
function ThumbImg({ src }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 180,
        background: "linear-gradient(90deg, #111 0%, #1a1a1a 50%, #111 100%)",
        backgroundSize: "200% 100%",
        animation: loaded ? "none" : "shimmer 1.2s linear infinite",
        borderBottom: "2px solid var(--fg)",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {src && (
        <img
          src={src}
          alt=""
          loading="eager"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 220ms ease",
          }}
        />
      )}
    </div>
  );
}

/* ===== Dropdown (ИЗМЕНЁН ТОЛЬКО ОТКРЫТЫЙ БЛОК) ===== */
function Dropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 220 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-testid="dir-dropdown-btn"
        className="mono"
        style={{
          width: "100%",
          background: "var(--card)",
          border: "2px solid var(--fg)",
          padding: "10px 14px",
          color: "var(--fg)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {current?.label || placeholder}
        </span>

        <span
          style={{
            transition: "transform 160ms ease",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          data-testid="dir-dropdown-menu"
          data-lenis-prevent
          onMouseEnter={() => {
            document.body.style.overflow = "hidden";
          }}
          onMouseLeave={() => {
            document.body.style.overflow = "";
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--card)",
            border: "2px solid var(--fg)",
            boxShadow: "4px 4px 0 var(--accent)",
            maxHeight: 280,
            overflowY: "auto",
            zIndex: 50,
          }}
        >
          {options.map((o) => (
            <button
              key={o.value || "all"}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="mono"
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                border: "none",
                background: o.value === value ? "var(--accent)" : "transparent",
                color: o.value === value ? "#000" : "var(--fg-dim)",
                cursor: "pointer",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== Pagination ===== */
export function Pagination({ page, totalPages, onChange }) {
  const pages = pageRange(page, totalPages);

  const btn = (active) => ({
    minWidth: 40,
    height: 40,
    padding: "0 10px",
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    border: "2px solid var(--fg)",
    background: active ? "var(--accent)" : "var(--card)",
    color: active ? "#000" : "var(--fg)",
    cursor: "pointer",
    fontWeight: 700,
  });

  return (
    <div
      data-testid="pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 8,
        marginTop: 40,
        flexWrap: "wrap",
      }}
    >
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={{ ...btn(false), opacity: page === 1 ? 0.4 : 1 }}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`d${i}`} style={{ alignSelf: "center", color: "var(--muted)" }}>
            …
          </span>
        ) : (
          <button key={p} onClick={() => onChange(p)} style={btn(p === page)}>
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        style={{ ...btn(false), opacity: page === totalPages ? 0.4 : 1 }}
      >
        →
      </button>
    </div>
  );
}

function pageRange(current, total) {
  const out = [];
  const push = (v) => out.push(v);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) push(i);
    return out;
  }

  push(1);
  if (current > 4) push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) push(i);

  if (current < total - 3) push("...");
  push(total);

  return out;
}