import React, { useEffect, useRef, useState } from "react";
import { api } from "../lib/api.js";

const PAGE_REC = 9;

const NO_GRADE_DIRS = [
  "3d-artist", "1c", "data-engineer", "data-science", "ai-engineer",
  "reverse-engineer", "rust", "seo", "business-analyst", "data-analyst", "product-manager",
];

export default function Recordings() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const [dir, setDir] = useState("");
  const [diff, setDiff] = useState("");
  const [dirs, setDirs] = useState([]);
  const [page, setPage] = useState(1);

  const showGrades = !dir || !NO_GRADE_DIRS.includes(dir);

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
          className="crumb-tag"
          style={{
            marginBottom: 18,
          }}
        >
          ИСТОЧНИКИ
        </div>

        <h1
          className="display"
          style={{
            fontSize: "clamp(60px, 9vw, 140px)",
            margin: 0,
            color: "var(--fg)",
          }}
        >
          <span className="glitch" data-text="ВИДЕО">
            ВИДЕО
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
          <span style={{ color: "var(--accent-ink)" }}>›</span> Видео-собеседования, на основе которых формируется база вопросов.
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
          onChange={(val) => { setDir(val); setDiff(""); }}
          placeholder="ВСЕ НАПРАВЛЕНИЯ"
          options={[
            { value: "", label: "ВСЕ НАПРАВЛЕНИЯ" },
            ...dirs.map((d) => ({
              value: d.slug,
              label: d.name,
            })),
          ]}
        />

        {showGrades && (
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
        )}
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
              className="card-solid"
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
                  {iv.directionName} · {iv.difficulty}
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

/* ===== Dropdown ===== */
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
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState("");

  if (totalPages <= 1) return null;

  const arrowBtn = (disabled) => ({
    width: 44,
    height: 40,
    fontFamily: "'Space Mono', monospace",
    fontSize: 16,
    border: "2px solid var(--fg)",
    background: "var(--card)",
    color: "var(--fg)",
    cursor: disabled ? "default" : "pointer",
    fontWeight: 700,
    opacity: disabled ? 0.35 : 1,
    flexShrink: 0,
    transition: "background 140ms ease, color 140ms ease",
  });

  const commit = () => {
    const n = parseInt(val, 10);
    if (!Number.isNaN(n)) {
      const clamped = Math.min(Math.max(1, n), totalPages);
      if (clamped !== page) onChange(clamped);
    }
    setEditing(false);
    setVal("");
  };

  return (
    <div
      data-testid="pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        marginTop: 40,
        padding: "4px 0",
      }}
    >
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={arrowBtn(page === 1)}
        aria-label="Предыдущая страница"
      >
        ←
      </button>

      <div
        className="mono"
        data-testid="pagination-info"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          letterSpacing: "0.12em",
          color: "var(--fg)",
          minWidth: 160,
          textAlign: "center",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span>СТРАНИЦА</span>
        {editing ? (
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value.replace(/\D/g, ""))}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commit(); }
              if (e.key === "Escape") { setEditing(false); setVal(""); }
            }}
            placeholder={String(page)}
            data-testid="pagination-jump-input"
            className="mono"
            style={{
              width: 52,
              height: 30,
              textAlign: "center",
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              border: "2px solid var(--accent)",
              background: "var(--bg)",
              color: "var(--fg)",
              outline: "none",
              padding: 0,
            }}
          />
        ) : (
          <button
            onClick={() => { setEditing(true); setVal(""); }}
            title="Нажми, чтобы ввести номер страницы"
            data-testid="pagination-current"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--accent-ink)",
              background: "transparent",
              border: "none",
              borderBottom: "2px dotted var(--accent-ink)",
              cursor: "pointer",
              padding: "0 2px",
              lineHeight: 1.4,
            }}
          >
            {page}
          </button>
        )}
        <span>ИЗ {totalPages}</span>
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        style={arrowBtn(page === totalPages)}
        aria-label="Следующая страница"
      >
        →
      </button>
    </div>
  );
}
