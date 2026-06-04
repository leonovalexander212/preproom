import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { api } from "../lib/api.js";
import AiChat from "../components/AiChat.jsx";
import { Pagination } from "./Recordings.jsx";

const LEVEL_COLOR = { ALL: "#ff5b00", JUNIOR: "#34d399", MIDDLE: "#e5ff00", SENIOR: "#ff2d55" };
const PAGE = 15;

function truncateQuestionText(text, maxChars) {
  if (!text || text.length <= maxChars) return text;

  const MIN_VISIBLE_BEFORE_ELLIPSIS = 3;
  const safeLimit = Math.max(MIN_VISIBLE_BEFORE_ELLIPSIS, maxChars);
  const slice = text.slice(0, safeLimit).trimEnd();
  const lastSpace = slice.lastIndexOf(" ");

  if (lastSpace === -1) {
    return `${slice.slice(0, Math.max(MIN_VISIBLE_BEFORE_ELLIPSIS, slice.length))}…`;
  }

  const charsAfterLastSpace = slice.length - lastSpace - 1;

  if (charsAfterLastSpace > 0 && charsAfterLastSpace < MIN_VISIBLE_BEFORE_ELLIPSIS) {
    const extended = text
      .slice(0, Math.min(text.length, lastSpace + 1 + MIN_VISIBLE_BEFORE_ELLIPSIS))
      .trimEnd();
    return `${extended}…`;
  }

  const wordBoundaryCut = lastSpace > safeLimit * 0.55 ? slice.slice(0, lastSpace) : slice;
  return `${wordBoundaryCut.trimEnd()}…`;
}

function getQuestionTextLimit(viewportWidth) {
  if (viewportWidth <= 768) {
    const horizontalPadding = viewportWidth <= 480 ? 48 : 72;
    const usableWidth = Math.max(260, viewportWidth - horizontalPadding);
    const fontSize = viewportWidth <= 480 ? 14 : 15;
    const averageCharWidth = fontSize * 0.62;
    const allowedLines = viewportWidth <= 480 ? 3 : 2;
    return Math.max(42, Math.floor(usableWidth / averageCharWidth) * allowedLines - 4);
  }

  return 55;
}

function useViewportWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    let raf;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, []);

  return width;
}

export default function DirectionQuestions() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [tab, setTab] = useState("TECHNICAL");
  const [level, setLevel] = useState("ALL");
  const [query, setQuery] = useState("");

  const [aiQuestion, setAiQuestion] = useState(null);
  const [counter, setCounter] = useState(0);
  const [page, setPage] = useState(1);

  const root = useRef(null);
  const prevSlugRef = useRef(slug);

  useEffect(() => {
    if (!slug) return;
    setError(null);

    if (prevSlugRef.current !== slug) {
      setData(null);
      setLevel("ALL");
      prevSlugRef.current = slug;
      return;
    }

    const params = level !== "ALL" ? { difficulty: level } : {};
    api.getDirectionQuestions(slug, params).then(setData).catch((e) => setError(e.message));
  }, [slug, level]);
  useEffect(() => { setPage(1); }, [slug, tab, level, query]);

  useEffect(() => {
    const total = data?.questions?.length || 0;
    let raf; const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - k, 3);
      setCounter(Math.round(eased * total));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      gsap.from(".q-row", { opacity: 0, y: 20, duration: 0.5, stagger: 0.04, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, [data, tab, level, query, page]);

  const filtered = (data?.questions || []).filter((q) =>
    q.type === tab &&
    (query === "" || q.text.toLowerCase().includes(query.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageItems = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div ref={root} className="dq-page" style={{ position: "relative", zIndex: 2, paddingTop: 100 }}>
      <style>{`
        .dq-page,
        .dq-hero,
        .dq-toolbar,
        .dq-list-section {
          box-sizing: border-box;
          max-width: 100%;
        }

        .dq-page {
          overflow-x: clip;
        }

        .dq-header-grid {
          min-width: 0;
        }

        .direction-questions-title,
        .direction-questions-title .glitch {
          min-width: 0;
          max-width: 100%;
          white-space: normal;
          word-break: keep-all;
          overflow-wrap: normal;
          hyphens: none;
        }

        .direction-questions-title {
          line-height: 0.95;
        }

        .direction-questions-title .glitch {
          display: block;
        }

        .dq-counter-box {
          max-width: 100%;
          overflow: hidden;
        }

        @media (min-width: 832px) {
          .dq-header-grid {
            grid-template-columns: minmax(0, 1fr) minmax(150px, 220px) !important;
          }

          .direction-questions-title {
            overflow: visible;
          }

          .direction-questions-title .glitch {
            white-space: normal;
            word-break: keep-all;
            overflow-wrap: normal;
          }

          .dq-counter-box {
            justify-self: end !important;
          }

          .dq-search {
            width: 100%;
            justify-self: stretch;
          }
        }

        @media (max-width: 831px) {
          .dq-page {
            padding-top: 86px !important;
          }

          .dq-hero {
            padding: 34px 16px 26px !important;
            overflow: hidden;
            text-align: center;
          }

          .dq-header-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            justify-items: center;
            align-items: center !important;
          }

          .direction-questions-title {
            width: 100%;
            max-width: calc(100vw - 32px);
            line-height: 0.86 !important;
            text-align: center !important;
            overflow: hidden;
          }

          .direction-questions-title .glitch {
            white-space: nowrap !important;
          }

          .dq-counter-box {
            width: min(100%, 260px) !important;
            min-width: 0 !important;
            justify-self: center !important;
            margin: 0 !important;
            padding: 18px 20px !important;
            box-shadow: 5px 5px 0 var(--accent) !important;
          }

          .dq-counter-number {
            font-size: clamp(34px, 13vw, 54px) !important;
            line-height: 0.92 !important;
          }

          .dq-toolbar {
            padding: 16px !important;
            gap: 14px !important;
          }

          .dq-tabs {
            width: 100%;
          }

          .dq-tab-btn {
            flex: 1 1 auto;
            padding: 10px 14px !important;
            font-size: 10px !important;
          }

          .dq-levels {
            width: 100%;
          }

          .dq-level-btn {
            flex: 1 1 auto;
            padding: 8px 12px !important;
            font-size: 9px !important;
          }

          .dq-toolbar {
            grid-template-columns: 1fr !important;
          }

          .dq-search {
            width: 100% !important;
            max-width: 100% !important;
            justify-self: stretch;
          }
        }

        @media (max-width: 420px) {
          .dq-hero {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .direction-questions-title {
            max-width: calc(100vw - 24px);
          }

          .dq-counter-box {
            width: min(100%, 238px) !important;
          }
        }
      `}</style>

      <section className="dq-hero" style={{ padding: "60px 28px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="crumb-tag dq-crumb-tag"
          style={{
            position: "relative", zIndex: 5, isolation: "isolate",
            display: "inline-flex", alignItems: "center", gap: 6,
            border: "2px solid var(--accent-ink)",
            padding: "6px 12px", marginBottom: 28,
            background: "var(--bg, #0a0a0a)",
          }}
        >
          <Link
            to="/directions"
            data-testid="crumb-home"
            style={{ color: "var(--accent-ink)", textDecoration: "none", fontSize: 17, letterSpacing: "0.12em" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            НАПРАВЛЕНИЯ
          </Link>
          <span style={{ opacity: 0.6, fontSize: 20 }}>/</span>
          <span
            data-testid="crumb-slug"
            style={{ color: "var(--accent-ink)", cursor: "default", pointerEvents: "none", userSelect: "none", fontSize: 20, letterSpacing: "0.12em" }}
          >
            {slug?.toUpperCase()}
          </span>
        </div>

        <div className="dq-header-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(150px, 220px)", gap: 40, alignItems: "end" }}>
           {(() => {
            // Заглушка из slug: дефисы → пробелы, чтобы при загрузке не мелькал "-"
            const dirName = data?.direction?.name || (slug || "").toUpperCase().replace(/-/g, " ");
            return (
           <h1
             className="display direction-questions-title dq-direction-title"
             data-testid="direction-questions-title"
             style={{ margin: 0, color: "var(--fg)", pointerEvents: "none", minWidth: 0, fontSize: "clamp(34px, 6vw, 84px)" }}
           >
             <span className="glitch" data-text={dirName}>
               {dirName}
             </span>
           </h1>
            );
          })()}
          <div className="dq-counter-box" data-testid="dq-counter-box" style={{
            border: "2px solid var(--fg)", padding: "20px 28px",
            background: "var(--card)", boxShadow: "6px 6px 0 var(--accent)",
            minWidth: 200, textAlign: "center", boxSizing: "border-box", maxWidth: "100%"
          }}>
            <div className="display dq-counter-number" data-testid="dq-counter-number" style={{ fontSize: 44, color: "var(--fg)" }}>{counter.toLocaleString()}</div>
            <div className="mono" data-testid="dq-counter-label" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.22em", marginTop: 4 }}>ВОПРОСОВ</div>
          </div>
        </div>
      </section>

      <section className="dq-toolbar" style={{
        padding: "24px 28px", maxWidth: 1280, margin: "0 auto",
        borderTop: "2px solid var(--fg)", borderBottom: "2px solid var(--fg)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16,
        alignItems: "center",
      }}>
        <div className="dq-tabs" style={{ display: "flex", justifyContent: "center" }}>
          {[{ k: "TECHNICAL", l: "ТЕХНИЧЕСКИЕ" }, { k: "BEHAVIORAL", l: "ПОВЕДЕНЧЕСКИЕ" }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} data-testid={`dq-tab-${t.k.toLowerCase()}`} className="mono dq-tab-btn" style={{
              background: tab === t.k ? "var(--accent)" : "transparent",
              color: tab === t.k ? "#000" : "var(--fg-dim)",
              border: "2px solid var(--fg)", padding: "12px 22px", cursor: "pointer",
              flex: "1 1 auto",
            }}>{t.l}</button>
          ))}
        </div>
        {data?.direction?.hasDifficultyLevels !== false && (
          <div className="dq-levels" style={{ display: "flex", justifyContent: "center" }}>
            {[{ k: "ALL", l: "ВСЕ" }, { k: "JUNIOR", l: "JUNIOR" }, { k: "MIDDLE", l: "MIDDLE" }, { k: "SENIOR", l: "SENIOR" }].map((g) => (
              <button key={g.k} onClick={() => setLevel(g.k)} data-testid={`dq-level-${g.k.toLowerCase()}`} className="mono dq-level-btn" style={{
                background: level === g.k ? LEVEL_COLOR[g.k] || "var(--accent)" : "transparent",
                color: level === g.k ? "#000" : "var(--fg-dim)",
                border: "2px solid var(--fg)", padding: "10px 18px", cursor: "pointer",
                fontSize: 10, letterSpacing: "0.15em", fontWeight: 700,
                flex: "1 1 auto",
              }}>{g.l}</button>
            ))}
          </div>
        )}
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="ПОИСК..." className="mono dq-search"
          data-testid="dq-search-input"
          style={{ background: "var(--card)", border: "2px solid var(--fg)", padding: "10px 14px", color: "var(--fg)", boxSizing: "border-box" }}
        />
      </section>

      <section className="dq-list-section" style={{ padding: "32px 28px 0", maxWidth: 1280, margin: "0 auto" }}>
        {pageItems.map((q, i) => (
          <QuestionRow key={q.id} q={q} idx={(page - 1) * PAGE + i} onAsk={() => setAiQuestion(q)} />
        ))}

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        )}
      </section>

      {aiQuestion && (
        <AiChat questionId={aiQuestion.id} questionText={aiQuestion.text} onClose={() => setAiQuestion(null)} />
      )}
    </div>
  );
}

function QuestionRow({ q, idx = 0, onAsk }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const viewportWidth = useViewportWidth();
  const c = LEVEL_COLOR[q.difficulty] || "#888";
  const percent = Math.round((q.probability || 0) * 100);

  const maxChars = getQuestionTextLimit(viewportWidth);
  const needsTruncation = q.text.length > maxChars;
  const displayText = !open && needsTruncation ? truncateQuestionText(q.text, maxChars) : q.text;

  const askButton = (
    <button
      className="btn-accent ai-ask-btn"
      onClick={(e) => { e.stopPropagation(); onAsk(); }}
      data-testid={`ask-ai-${q.id}`}
      style={{ padding: "12px 20px", fontSize: 11 }}
    >УТОЧНИТЬ У ИИ ↗</button>
  );

  return (
    <div className="q-row" data-testid={`question-${q.id}`} style={{
      borderTop: "2px solid var(--line)",
      background: open ? "var(--bg-2)" : hover ? "var(--row-hover)" : (idx % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent"),
      transition: "background 160ms ease",
    }}>
      <div
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="dq-row-inner"
        style={{
          display: "grid", gridTemplateColumns: "70px 90px 1fr auto auto",
          gap: 24, alignItems: "center", padding: "22px 24px", cursor: "pointer"
        }}
      >
        <div className="mono dq-num" data-testid={`question-number-${q.id}`} style={{ color: "var(--muted)", fontSize: 12, letterSpacing: "0.2em" }}>
          N°{String(idx + 1).padStart(3, "0")}
        </div>
        <span className="mono dq-level" data-testid={`question-level-${q.id}`} style={{
          background: c, color: "#000", padding: "6px 10px",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
          textAlign: "center", border: "2px solid #000", boxShadow: "2px 2px 0 #000"
        }}>{q.difficulty || "—"}</span>
        <div className="dq-text" data-testid={`question-text-${q.id}`} style={{ color: "var(--fg)", fontSize: 17, fontWeight: 600 }}>
          <span className={`dq-text-content ${open ? "dq-text-content--expanded" : ""}`}>
            {displayText}
          </span>
        </div>
        <ProgressBar percent={percent} color={c} questionId={q.id} />
        <div className="mono dq-arrow" style={{
          color: hover ? "var(--accent-ink)" : "var(--muted)",
          fontSize: 14, transition: "all 160ms", transform: open ? "rotate(90deg)" : "rotate(0)"
        }}>→</div>
      </div>

      {open && (
        <div className="dq-expand" style={{ padding: "0 24px 24px", display: "grid", gap: 16 }}>
          {q.answer && (
            <div className="dq-answer-card" data-testid={`answer-card-${q.id}`}>
              <div className="dq-answer" style={{
                border: "2px solid var(--fg)", padding: 18,
                background: "var(--card)", boxShadow: "4px 4px 0 var(--line)"
              }}>
                <div className="mono" data-testid={`answer-label-${q.id}`} style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--accent-ink)", marginBottom: 10 }}>
                  // КРАТКИЙ ОТВЕТ
                </div>
                <div className="dq-answer-text" data-testid={`answer-text-${q.id}`} style={{ color: "var(--fg-dim)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{q.answer}</div>
              </div>
              <div className="dq-expand-actions" data-testid={`question-actions-${q.id}`}>
                <VideoAnswers questionId={q.id} />
                {q.type !== "BEHAVIORAL" && (
                  <div className="dq-ask-wrap dq-ask-wrap--desktop">
                    {askButton}
                  </div>
                )}
              </div>
            </div>
          )}
          {!q.answer && (
            <div className="dq-expand-actions" data-testid={`question-actions-${q.id}`}>
              <VideoAnswers questionId={q.id} />
              {q.type !== "BEHAVIORAL" && (
                <div className="dq-ask-wrap">
                  {askButton}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ percent, color, questionId }) {
  return (
    <div className="dq-progress" data-testid={`question-progress-${questionId}`} style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
      <div className="dq-progress-bar" data-testid={`question-progress-bar-${questionId}`} style={{ width: 110, height: 8, background: "var(--bg-2)", border: "1px solid var(--line)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${percent}%`, background: color, transition: "width 600ms ease" }} />
      </div>
      <span className="mono" data-testid={`question-progress-percent-${questionId}`} style={{ fontSize: 11, color: "var(--fg-dim)", minWidth: 36 }}>{percent}%</span>
    </div>
  );
}

function VideoAnswers({ questionId }) {
  const [items, setItems] = useState(null);
  useEffect(() => { api.getQuestionVideoAnswers(questionId).then(setItems).catch(() => setItems([])); }, [questionId]);
  if (!items || items.length === 0) return null;
  return (
    <div className="dq-videos" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((v, i) => (
        <a key={i} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer"
          className="btn-ghost dq-video-btn" data-testid={`video-answer-${questionId}-${i}`} style={{ padding: "10px 14px", fontSize: 10 }}>
          ▶ {v.timecode}
        </a>
      ))}
    </div>
  );
}
