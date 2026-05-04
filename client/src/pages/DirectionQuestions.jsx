import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { api } from "../lib/api.js";
import AiChat from "../components/AiChat.jsx";

const LEVEL_COLOR = { JUNIOR: "#34d399", MIDDLE: "#e5ff00", SENIOR: "#ff2d55" };

export default function DirectionQuestions() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("TECHNICAL");
  const [level, setLevel] = useState("ALL");
  const [query, setQuery] = useState("");
  const [aiQuestion, setAiQuestion] = useState(null);
  const [counter, setCounter] = useState(0);
  const root = useRef(null);

  useEffect(() => {
    setData(null); setError(null);
    api.getDirectionQuestions(slug).then(setData).catch((e) => setError(e.message));
  }, [slug]);

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
  }, [data, tab, level, query]);

  const filtered = (data?.questions || []).filter((q) =>
    q.type === tab &&
    (level === "ALL" || q.difficulty === level) &&
    (query === "" || q.text.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div ref={root} style={{ position: "relative", zIndex: 2, paddingTop: 100 }}>
      <section style={{ padding: "60px 28px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="mono" style={{ display: "inline-block", fontSize: 11, letterSpacing: "0.22em", color: "var(--accent-ink)", border: "2px solid var(--accent-ink)", padding: "6px 12px", marginBottom: 28 }}>
          DOMAIN / {slug?.toUpperCase()}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end" }}>
          <h1 className="display" style={{ fontSize: "clamp(80px, 14vw, 220px)", margin: 0, color: "var(--fg)" }}>
            <span className="glitch" data-text={data?.direction?.name || slug?.toUpperCase()}>
              {data?.direction?.name || slug?.toUpperCase()}
            </span>
          </h1>
          <div style={{ border: "2px solid var(--fg)", padding: "20px 28px", background: "var(--card)", boxShadow: "6px 6px 0 var(--accent)", minWidth: 200, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 44, color: "var(--fg)" }} data-testid="counter">{counter.toLocaleString()}</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.22em", marginTop: 4 }}>ВОПРОСОВ</div>
          </div>
        </div>
        {data?.direction && (
          <p style={{ marginTop: 24, fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.6, maxWidth: 540 }}>
            <span style={{ color: "var(--accent-ink)" }}>›</span> Источник: {data.direction.totalInterviews} реальных интервью.
          </p>
        )}
      </section>

      <section style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto", borderTop: "2px solid var(--fg)", borderBottom: "2px solid var(--fg)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex" }}>
          {[{ k: "TECHNICAL", l: "ТЕХНИЧЕСКИЕ" }, { k: "BEHAVIORAL", l: "ПОВЕДЕНЧЕСКИЕ" }].map((t) => (
            <button key={t.k} data-testid={`tab-${t.k}`} onClick={() => setTab(t.k)} className="mono" style={{
              background: tab === t.k ? "var(--accent)" : "transparent",
              color: tab === t.k ? "#000" : "var(--fg-dim)",
              border: "2px solid var(--fg)", padding: "12px 22px",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              marginRight: -2, cursor: "pointer",
            }}>{t.l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", border: "2px solid var(--fg)" }}>
            {[{ k: "ALL", l: "ВСЕ" }, { k: "JUNIOR", l: "JR" }, { k: "MIDDLE", l: "MD" }, { k: "SENIOR", l: "SR" }].map((opt, i, arr) => (
              <button key={opt.k} data-testid={`level-${opt.k}`} onClick={() => setLevel(opt.k)} className="mono" style={{
                padding: "10px 16px", border: "none",
                background: level === opt.k ? (LEVEL_COLOR[opt.k] || "#e5ff00") : "transparent",
                color: level === opt.k ? "#000" : "var(--fg-dim)",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                borderRight: i < arr.length - 1 ? "2px solid var(--fg)" : "none",
                cursor: "pointer",
              }}>{opt.l}</button>
            ))}
          </div>
          <input data-testid="search-input" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="ПОИСК..." className="mono"
            style={{ background: "var(--card)", border: "2px solid var(--fg)", padding: "10px 14px", color: "var(--fg)", fontSize: 12, outline: "none", letterSpacing: "0.16em", minWidth: 200 }} />
        </div>
      </section>

      <section style={{ padding: "32px 28px 0", maxWidth: 1280, margin: "0 auto" }}>
        {error && <div className="mono" style={{ color: "var(--danger)", padding: 24, border: "2px dashed var(--danger)" }}>// ОШИБКА: {error}</div>}
        {!error && !data && <div className="mono" style={{ color: "var(--muted)", padding: 60, textAlign: "center", letterSpacing: "0.2em" }}>// ЗАГРУЗКА...</div>}
        {data && filtered.length === 0 && (
          <div className="mono" style={{ textAlign: "center", color: "var(--muted)", padding: 80, fontSize: 13, letterSpacing: "0.2em", border: "2px dashed var(--line)" }}>// НИЧЕГО НЕ НАЙДЕНО</div>
        )}
        {filtered.map((q, i) => <QuestionRow key={q.id} q={q} idx={i} onAsk={() => setAiQuestion(q)} />)}
      </section>

      {aiQuestion && (
        <AiChat questionId={aiQuestion.id} questionText={aiQuestion.text} onClose={() => setAiQuestion(null)} />
      )}
    </div>
  );
}

function QuestionRow({ q, onAsk }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const c = LEVEL_COLOR[q.difficulty] || "#888";
  const percent = Math.round((q.probability || 0) * 100);
  return (
    <div className="q-row" data-testid={`question-${q.id}`} style={{ borderTop: "2px solid var(--line)", background: open ? "var(--bg-2)" : (hover ? "var(--row-hover)" : (idx % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent")), transition: "background 160ms ease" }}>
      <div onClick={() => setOpen((v) => !v)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display: "grid", gridTemplateColumns: "70px 90px 1fr auto auto", gap: 24, alignItems: "center", padding: "22px 24px", cursor: "pointer" }}>
        <div className="mono" style={{ color: "var(--muted)", fontSize: 12, letterSpacing: "0.2em" }}>
  N°{String(idx + 1).padStart(3, "0")}
</div>
        <span className="mono" style={{ background: c, color: "#000", padding: "6px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textAlign: "center", border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}>{q.difficulty || "—"}</span>
        <div style={{ color: "var(--fg)", fontSize: 17, fontWeight: 600 }}>{q.text}</div>
        <ProgressBar percent={percent} color={c} />
        <div className="mono" style={{ color: hover ? "var(--accent-ink)" : "var(--muted)", fontSize: 14, transition: "all 160ms", transform: open ? "rotate(90deg)" : "rotate(0)" }}>→</div>
      </div>
      {open && (
        <div style={{ padding: "0 24px 24px", display: "grid", gap: 16 }}>
          {q.answer && (
            <div style={{ border: "2px solid var(--fg)", padding: 18, background: "var(--card)", boxShadow: "4px 4px 0 var(--line)" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--accent-ink)", marginBottom: 10 }}>// КРАТКИЙ ОТВЕТ</div>
              <div style={{ color: "var(--fg-dim)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{q.answer}</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-brutal" onClick={(e) => { e.stopPropagation(); onAsk(); }} data-testid={`ask-ai-${q.id}`} style={{ padding: "12px 20px", fontSize: 11 }}>
              УТОЧНИТЬ У ИИ ↗
            </button>
            <VideoAnswers questionId={q.id} />
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ percent, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
      <div style={{ width: 110, height: 8, background: "var(--bg-2)", border: "1px solid var(--line)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${percent}%`, background: color, transition: "width 600ms ease" }} />
      </div>
      <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", minWidth: 36 }}>{percent}%</span>
    </div>
  );
}

function VideoAnswers({ questionId }) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    api.getQuestionVideoAnswers(questionId).then(setItems).catch(() => setItems([]));
  }, [questionId]);
  if (!items || items.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((v, i) => (
        <a key={i} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: "10px 14px", fontSize: 10 }}>
          ▶ {v.timecode}
        </a>
      ))}
    </div>
  );
}