import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LS_KEY = "pp-mock-session";

/* ------------------------------- helpers ------------------------------- */

async function apiFetch(url, options) {
  let res;
  try { res = await fetch(url, options); }
  catch (e) { throw new Error(`Сеть не отвечает: ${e.message}`); }
  const text = await res.text();
  let data = null;
  if (text) { try { data = JSON.parse(text); } catch {} }
  if (!res.ok) {
    const msg = data?.message || data?.error || text?.slice(0, 200) || `HTTP ${res.status}`;
    const err = new Error(msg); err.status = res.status; err.data = data;
    throw err;
  }
  if (!data) throw new Error(`Пустой ответ HTTP ${res.status}.`);
  return data;
}

function fmtTime(ms) {
  if (ms <= 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const brBox = { border: "2px solid var(--fg)", background: "var(--bg)" };
const btnPrimary = {
  ...brBox, padding: "14px 22px", background: "var(--fg)", color: "var(--bg)",
  fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer",
  boxShadow: "6px 6px 0 var(--accent)", transition: "transform 120ms, box-shadow 120ms",
};
const btnGhost = {
  ...brBox, padding: "14px 22px", background: "transparent", color: "var(--fg)",
  fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer",
};
const btnDanger = {
  ...brBox, padding: "10px 16px", background: "transparent", color: "#ff5b00",
  borderColor: "#ff5b00", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer",
};

const PAGE_TOP = "112px";

function Crumb({ stage }) {
  const map = { setup: "НАСТРОЙКА", qa: "ВОПРОСЫ", coding: "ЛАЙВ-КОДИНГ", result: "РЕЗУЛЬТАТ", aborted: "ПРЕРВАНО" };
  return (
    <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: "0.12em", marginBottom: 16 }}>
      › ТЕСТЫ / AI MOCK / {map[stage] ?? stage}
    </div>
  );
}

/* ------------------------------- Hourglass ------------------------------- */

function Hourglass({ progress, danger }) {
  const p = Math.min(1, Math.max(0, progress));
  const topSandH = 32 * (1 - p);
  const botSandH = 32 * p;
  const fall = p > 0 && p < 1;

  return (
    <svg width="56" height="80" viewBox="0 0 56 80" style={{ display: "block" }} aria-hidden="true">
      <defs>
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={danger ? "#ff5b00" : "var(--accent, #e5ff00)"} />
          <stop offset="100%" stopColor={danger ? "#ff8a00" : "#fff79a"} />
        </linearGradient>
      </defs>
      <rect x="6" y="2" width="44" height="4" fill="currentColor" />
      <rect x="6" y="74" width="44" height="4" fill="currentColor" />
      <path d="M10 6 L46 6 L30 38 L46 74 L10 74 L26 38 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <clipPath id="topClip"><path d="M11 7 L45 7 L29.5 38 L26.5 38 Z" /></clipPath>
      <rect x="0" y={6 + (32 - topSandH)} width="56" height={topSandH} fill="url(#sandGrad)" clipPath="url(#topClip)">
        <animate attributeName="opacity" values="1;0.85;1" dur="1.6s" repeatCount="indefinite" />
      </rect>
      {fall && (
        <line x1="28" y1="38" x2="28" y2="42" stroke={danger ? "#ff5b00" : "var(--accent, #e5ff00)"} strokeWidth="2">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
        </line>
      )}
      <clipPath id="botClip"><path d="M26.5 38 L29.5 38 L46 74 L10 74 Z" /></clipPath>
      <rect x="0" y={74 - botSandH} width="56" height={botSandH} fill="url(#sandGrad)" clipPath="url(#botClip)" />
    </svg>
  );
}

/* ------------------------------- Setup ------------------------------- */

function Setup({ onStart, rateLimit, meta }) {
  const [direction, setDirection] = useState(null);
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const directions = meta?.directions ?? [];
  const grades = meta?.grades ?? [];

  const canStart = Boolean(
    direction && grade && !loading && (rateLimit == null || rateLimit.remaining > 0)
  );

  const submit = async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch(`${API}/api/mock/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, grade }),
      });
      onStart(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: `${PAGE_TOP} 24px 48px` }}>
      <Crumb stage="setup" />
      <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
        AI MOCK INTERVIEW
      </h1>
      <p style={{ opacity: 0.7, maxWidth: 680, margin: "0 0 28px", fontSize: 16, lineHeight: 1.5 }}>
        Реалистичный тех-собес с <b>Джарвисом</b>. 15 технических вопросов — из реальных видео-интервью в БД.
        Лайв-кодинг — задачи в файлах, оценка автотестами.
      </p>

      {rateLimit && (
        <div data-testid="mock-ratelimit" style={{
          ...brBox, display: "inline-block", padding: "8px 14px", fontSize: 12,
          letterSpacing: "0.1em", marginBottom: 32,
          background: rateLimit.remaining > 0 ? "transparent" : "var(--fg)",
          color: rateLimit.remaining > 0 ? "var(--fg)" : "var(--bg)",
        }}>
          {rateLimit.remaining > 0
            ? `ОСТАЛОСЬ ${rateLimit.remaining} / ${rateLimit.limit} ИНТЕРВЬЮ НА ЭТОЙ НЕДЕЛЕ`
            : `ЛИМИТ НА НЕДЕЛЮ ИСЧЕРПАН. СБРОС: ${rateLimit.resetAt ? new Date(rateLimit.resetAt).toLocaleDateString() : "—"}`}
        </div>
      )}

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 12 }}>1. НАПРАВЛЕНИЕ</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {directions.map((d) => {
            const active = direction === d.slug;
            const disabled = !d.available;
            return (
              <button
                key={d.slug}
                data-testid={`mock-direction-${d.slug}`}
                onClick={() => !disabled && setDirection(d.slug)}
                disabled={disabled}
                title={disabled ? d.disabledReason : ""}
                style={{
                  ...brBox, padding: "22px 18px", textAlign: "left", fontWeight: 800, fontSize: 18,
                  letterSpacing: "0.08em", cursor: disabled ? "not-allowed" : "pointer",
                  background: active ? "var(--fg)" : "transparent",
                  color: active ? "var(--bg)" : "var(--fg)",
                  opacity: disabled ? 0.35 : 1,
                  boxShadow: active ? "6px 6px 0 var(--accent)" : "none",
                }}
              >
                {d.label}
                {disabled && (<div style={{ marginTop: 6, fontSize: 10, letterSpacing: "0.1em", opacity: 0.7 }}>СКОРО</div>)}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 12 }}>2. ГРЕЙД</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {grades.map((g) => {
            const active = grade === g.slug;
            const disabled = !g.available;
            return (
              <button
                key={g.slug}
                data-testid={`mock-grade-${g.slug}`}
                onClick={() => !disabled && setGrade(g.slug)}
                disabled={disabled}
                title={disabled ? g.disabledReason : ""}
                style={{
                  ...brBox, padding: "22px 18px", textAlign: "left",
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: active ? "var(--fg)" : "transparent",
                  color: active ? "var(--bg)" : "var(--fg)",
                  opacity: disabled ? 0.35 : 1,
                  boxShadow: active ? "6px 6px 0 var(--accent)" : "none",
                }}
              >
                <div style={{ fontWeight: 800, letterSpacing: "0.08em", fontSize: 20 }}>{g.label}</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>{disabled ? "СКОРО" : g.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div style={{ ...brBox, padding: 12, marginBottom: 16, background: "#ff5b00", color: "#000", fontWeight: 700 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          data-testid="mock-start-btn"
          onClick={submit}
          disabled={!canStart}
          style={{ ...btnPrimary, opacity: canStart ? 1 : 0.4, cursor: canStart ? "pointer" : "not-allowed" }}
        >
          {loading ? "ПОДГОТОВКА..." : "НАЧАТЬ СОБЕС ↗"}
        </button>
        <Link to="/tests" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>НАЗАД</Link>
      </div>
    </div>
  );
}

/* ------------------------------- TopBar ------------------------------- */

function TopBar({ session, onAbort, label }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);
  const elapsed = now - session.startedAt;
  const left = Math.max(0, session.durationMs - elapsed);
  const progress = Math.min(1, elapsed / session.durationMs);
  const danger = left < 5 * 60 * 1000;

  return (
    <div style={{
      ...brBox, padding: 14, display: "flex", alignItems: "center", gap: 16,
      flexWrap: "wrap", marginBottom: 24,
    }}>
      <div style={{ color: "var(--fg)", display: "flex", alignItems: "center", gap: 14 }}>
        <Hourglass progress={progress} danger={danger} />
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.6 }}>ОСТАЛОСЬ</div>
          <div style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 26, fontWeight: 900,
            color: danger ? "#ff5b00" : "var(--fg)", animation: danger ? "ppPulse 1s ease-in-out infinite" : "none",
            letterSpacing: "0.05em",
          }}>
            {fmtTime(left)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ fontSize: 11, opacity: 0.55, letterSpacing: "0.1em", marginTop: 4 }}>
          {session.directionLabel} · {session.grade}
          {session.sourceInterviewTitle ? ` · ${session.sourceInterviewTitle.slice(0, 64)}` : ""}
        </div>
      </div>

      <button data-testid="mock-abort-btn" onClick={onAbort} style={btnDanger}>
        ✕ ПРЕРВАТЬ СОБЕС
      </button>

      <style>{`
        @keyframes ppPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
      `}</style>
    </div>
  );
}

/* ------------------------------- QA Stage ------------------------------- */

function ChatStage({ session, onUpdate, onAbort }) {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [session.answers.length, session.currentQuestion?.id]);

  const submit = async () => {
    if (!draft.trim() || loading) return;
    setLoading(true); setError(null);
    const current = draft;
    setDraft("");
    try {
      const data = await apiFetch(`${API}/api/mock/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, answer: current }),
      });
      onUpdate(data.session);
    } catch (e) { setError(e.message); setDraft(current); }
    finally { setLoading(false); }
  };

  const onKey = (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(); };

  const total = session.totalQuestions;
  const answered = session.answers.length;
  const progress = total ? (answered / total) * 100 : 0;

  return (
    <div className="mock-root" style={{ maxWidth: 1100, margin: "0 auto", padding: `${PAGE_TOP} 24px 32px` }}>
      <Crumb stage="qa" />
      <TopBar session={session} onAbort={onAbort}
              label={`ВОПРОС ${Math.min(session.currentQuestionNumber, total)} ИЗ ${total}`} />

      <div style={{ height: 6, background: "var(--fg)", opacity: 0.12, position: "relative", marginBottom: 20 }}>
        <div style={{ position: "absolute", inset: 0, width: `${progress}%`, background: "var(--accent)", transition: "width 300ms ease" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 20 }}>
        <div style={{ ...brBox, padding: 0 }} className="mock-chat-shell">
          <div
            ref={scrollerRef}
            data-testid="mock-chat-scroller"
            data-lenis-prevent
            className="mock-chat-scroller"
          >
            {session.answers.map((a, i) => (
              <React.Fragment key={a.questionId + i}>
                <AIBubble text={a.questionText} tag={`${a.topic} · ВОПРОС ${i + 1}`} />
                <UserBubble text={a.userAnswer} />
              </React.Fragment>
            ))}
            {session.currentQuestion && (
              <AIBubble
                text={session.currentQuestion.text}
                tag={`${session.currentQuestion.topic} · ВОПРОС ${session.currentQuestionNumber}`}
                highlight
              />
            )}
          </div>

          <div style={{ borderTop: "2px solid var(--fg)", padding: 16, background: "var(--bg)", flex: "0 0 auto" }}>
            {error && <div style={{ marginBottom: 8, color: "#ff5b00", fontSize: 13, fontWeight: 700 }}>{error}</div>}
            <textarea
              data-testid="mock-answer-input"
              data-lenis-prevent
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              placeholder="Отвечай развёрнуто, как на реальном собесе. Джарвис не комментирует — итог в конце."
              rows={4}
              style={{
                width: "100%", padding: 12, fontFamily: "inherit", fontSize: 14,
                background: "transparent", color: "var(--fg)", border: "2px solid var(--fg)",
                resize: "none", outline: "none", boxSizing: "border-box",
              }}
            />
            <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
              <span style={{ fontSize: 11, opacity: 0.55, letterSpacing: "0.1em", marginRight: "auto" }}>
                Ctrl/⌘ + Enter — отправить
              </span>
              <button
                data-testid="mock-answer-submit"
                onClick={submit}
                disabled={!draft.trim() || loading}
                style={{ ...btnPrimary, opacity: !draft.trim() || loading ? 0.4 : 1 }}
              >
                {loading ? "ОТПРАВКА..." : "ОТПРАВИТЬ →"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...brBox, padding: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 8 }}>ДЖАРВИС</div>
            <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>
              Веду собеседование строго, как на оффер. Ревью не даю по ходу — итог объявлю в конце.
              Прервёшь — попытка списывается.
            </div>
          </div>
          <div style={{ ...brBox, padding: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 8 }}>ПРОГРЕСС</div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em" }}>
              {answered}<span style={{ fontSize: 16, opacity: 0.5 }}> / {total}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.55, marginTop: 4 }}>после QA — лайв-кодинг</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIBubble({ text, tag, highlight }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <div style={{
        ...brBox, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900, flexShrink: 0, letterSpacing: "0.05em",
      }}>JV</div>
      <div style={{ ...brBox, padding: "12px 16px", maxWidth: "82%",
        boxShadow: highlight ? "5px 5px 0 var(--accent)" : "none" }}>
        {tag && (
          <div style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.55, marginBottom: 6 }}>{tag}</div>
        )}
        <div style={{ fontSize: 15, lineHeight: 1.55 }}>{text}</div>
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, justifyContent: "flex-end" }}>
      <div style={{ ...brBox, padding: "12px 16px", maxWidth: "82%", background: "var(--fg)", color: "var(--bg)" }}>
        <div style={{ fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{text}</div>
      </div>
      <div style={{
        ...brBox, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900, flexShrink: 0, background: "var(--fg)", color: "var(--bg)",
      }}>Я</div>
    </div>
  );
}

/* ------------------------------- Coding Stage ------------------------------- */

function difficultyColor(d) {
  return d === "easy" ? "#34d399" : d === "medium" ? "#e5ff00" : "#ff5b00";
}

function CodingStage({ session, onUpdate, onAbort }) {
  const task = session.currentCoding;
  const [code, setCode] = useState(task?.starterCode ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => { setCode(task?.starterCode ?? ""); setLastResult(null); }, [task?.id]);

  const submit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true); setError(null);
    try {
      const data = await apiFetch(`${API}/api/mock/coding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, code }),
      });
      setLastResult(data.result);
      setTimeout(() => onUpdate(data.session), 1200);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (!task) return null;

  return (
    <div className="mock-root" style={{ maxWidth: 1200, margin: "0 auto", padding: `${PAGE_TOP} 24px 32px` }}>
      <Crumb stage="coding" />
      <TopBar session={session} onAbort={onAbort}
              label={`ЗАДАЧА ${session.currentCodingNumber} ИЗ ${session.totalCoding}`} />

      <div style={{ ...brBox, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{
            padding: "3px 10px", fontSize: 11, letterSpacing: "0.15em", fontWeight: 800,
            border: `2px solid ${difficultyColor(task.difficulty)}`, color: difficultyColor(task.difficulty),
          }}>
            СЛОЖНОСТЬ: {String(task.difficulty || "").toUpperCase()}
          </span>
          <span style={{ fontSize: 11, opacity: 0.55, letterSpacing: "0.15em" }}>
            ТЕСТОВ: {task.testsCount} · {task.language.toUpperCase()}
          </span>
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em" }}>{task.title}</h2>
        <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{task.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 20 }}>
        <div>
          <div style={{ ...brBox, padding: 0, overflow: "hidden",
            fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }}>
            <div style={{
              padding: "10px 14px", borderBottom: "2px solid var(--fg)",
              fontSize: 11, letterSpacing: "0.15em", opacity: 0.7,
              display: "flex", justifyContent: "space-between",
            }}>
              <span>{`solution.${extFromLang(task.language)}`}</span>
              <span>{task.language.toUpperCase()}</span>
            </div>
            <textarea
              data-testid="mock-code-editor"
              data-lenis-prevent
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={14}
              style={{
                width: "100%", padding: 16, boxSizing: "border-box",
                fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
                fontSize: 14, lineHeight: 1.6, background: "transparent",
                color: "var(--fg)", border: "none", outline: "none", resize: "vertical",
                minHeight: 300,
              }}
            />
          </div>

          {error && (
            <div style={{ ...brBox, marginTop: 12, padding: 12, background: "#ff5b00", color: "#000", fontWeight: 700 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setCode(task.starterCode)} style={{ ...btnGhost, padding: "10px 18px" }}>
              СБРОСИТЬ
            </button>
            <button data-testid="mock-code-submit" onClick={submit}
                    disabled={loading || !code.trim()}
                    style={{ ...btnPrimary, opacity: loading || !code.trim() ? 0.4 : 1 }}>
              {loading ? "ЗАПУСК ТЕСТОВ..." : "СДАТЬ →"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...brBox, padding: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 8 }}>ПЕСОЧНИЦА</div>
            <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.55 }}>
              Код прогоняется AI-раннером против скрытых тестов (stdin/stdout). Ожидаемый ответ тебе не виден.
            </div>
          </div>

          {lastResult && (
            <div style={{ ...brBox, padding: 18,
              boxShadow: lastResult.testsPassed === lastResult.testsTotal && lastResult.testsTotal > 0
                ? "5px 5px 0 #34d399" : "5px 5px 0 #ff5b00" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 8 }}>РЕЗУЛЬТАТ</div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>
                {lastResult.testsPassed} <span style={{ opacity: 0.5, fontSize: 16 }}>/ {lastResult.testsTotal}</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>тестов пройдено</div>
              {lastResult.errorSample && (
                <div style={{ marginTop: 10, padding: 10, border: "1px dashed #ff5b00",
                  fontSize: 12, color: "#ff5b00", lineHeight: 1.45 }}>
                  {lastResult.errorSample}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function extFromLang(l) {
  return { javascript: "js", java: "java", python: "py", php: "php" }[l] ?? "txt";
}

/* ------------------------------- DMC RANK ------------------------------- */

const RANK_ORDER = ["D", "C", "B", "A", "S", "SS", "SSS"];
const SCRAMBLE_POOL = ["D","C","B","A","S","#","%","@","*","&","?","X","§","Ω","∆"];

const RANK_THEMES = {
  D:   { mid:"#e8e8e8", stroke:"#3a3a3a", glow:"rgba(255,255,255,0.40)", accent:"#bdbdbd", label:"DULL"  },
  C:   { mid:"#7EEADF", stroke:"#0d3a36", glow:"rgba(78,205,196,0.65)",  accent:"#4ECDC4", label:"COOL"  },
  B:   { mid:"#6aa7ff", stroke:"#0c2358", glow:"rgba(59,130,246,0.7)",   accent:"#3B82F6", label:"BRAVO" },
  A:   { mid:"#c38bff", stroke:"#330e63", glow:"rgba(168,85,247,0.75)",  accent:"#A855F7", label:"ALRIGHT!" },
  S:   { mid:"#ffd54a", stroke:"#3a2900", glow:"rgba(255,215,0,0.85)",   accent:"#FFD700", label:"STYLISH!" },
  SS:  { mid:"#ff8d52", stroke:"#421400", glow:"rgba(255,107,53,0.95)",  accent:"#FF6B35", label:"SHOWTIME!!" },
  SSS: { mid:"#ff5ca6", stroke:"#3d0024", glow:"rgba(255,26,140,1.0)",   accent:"#FF1A8C", label:"SMOKIN' SEXY STYLE!!!" },
};

/**
 * RankGlyph — статичная широкая буква (используется в результате)
 *  - stack из 2 слоёв (тень-back + main-front) + жирный stroke + scaleX 1.25
 */
function RankGlyph({ rank, size = "clamp(160px, 18vw, 240px)" }) {
  const theme = RANK_THEMES[rank] ?? RANK_THEMES.D;
  const isSSS = rank === "SSS";
  const cssVars = {
    "--dmc-mid":    theme.mid,
    "--dmc-stroke": theme.stroke,
    "--dmc-glow":   theme.glow,
    fontSize: size,
  };
  return (
    <div className={`rg-stage ${isSSS ? "rg-stage--sss" : ""}`} style={cssVars}>
      <span className="rg-glyph rg-glyph--back" aria-hidden="true">{rank}</span>
      <span className="rg-glyph rg-glyph--front">{rank}</span>
    </div>
  );
}

/* ------------------------------- JUDGEMENT cinematic ------------------------------- */
/**
 * Полноэкранный «суд». Показывается с момента, как тест завершён,
 * скремблит букву пока летит запрос на /finish, потом плавно «защёлкивается»
 * на финальный ранг с impact, screen-shake и волной — после чего fade-out.
 *
 * Никакого отдельного экрана «Джарвис считает...» — ожидание API ВКЛЮЧЕНО в
 * саму сцену. Если ответ уже пришёл к моменту монтирования — крутит короткую
 * драматическую увертюру (~1.6с) и сразу лочится.
 */
function JudgementCinematic({ targetRank, onDone }) {
  const [glyph, setGlyph] = useState("?");
  const [phase, setPhase] = useState("scramble"); // scramble | lock | impact
  const [statusIdx, setStatusIdx] = useState(0);
  const startedAt = useRef(Date.now());
  const lockedRef = useRef(false); // защита от двойного запуска lock в StrictMode
  const stageRef = useRef(null);
  const glyphRef = useRef(null);
  const ringRef = useRef(null);
  const sparksRef = useRef(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  const STATUSES = [
    "INITIATING JUDGEMENT",
    "PARSING RESPONSES",
    "CROSS-REF DB",
    "WEIGHING WEAKNESSES",
    "FORGING VERDICT",
  ];

  // ticker — крутится пока не дошли до impact
  useEffect(() => {
    if (phase === "impact") return;
    const t = setInterval(() => setStatusIdx((i) => (i + 1) % STATUSES.length), 700);
    return () => clearInterval(t);
  }, [phase]);

  // scramble loop пока phase==='scramble'
  useEffect(() => {
    if (phase !== "scramble") return;
    const t = setInterval(() => {
      setGlyph(SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)]);
    }, 60);
    return () => clearInterval(t);
  }, [phase]);

  // когда приходит targetRank — выдерживаем минимум 2.2с скрембла, потом lock-секвенция
  useEffect(() => {
    if (!targetRank) return;
    if (lockedRef.current) return;
    lockedRef.current = true;

    const elapsed = Date.now() - startedAt.current;
    const minScramble = 2200;
    const wait = Math.max(0, minScramble - elapsed);

    const lockTimer = setTimeout(() => {
      setPhase("lock");
      const idxTarget = Math.max(0, RANK_ORDER.indexOf(targetRank));
      let i = 0;
      const step = () => {
        setGlyph(RANK_ORDER[i]);
        if (glyphRef.current) {
          gsap.fromTo(glyphRef.current,
            { scale: 1.22 },
            { scale: 1, duration: 0.22, ease: "power3.out", overwrite: "auto" });
        }
        if (i >= idxTarget) {
          // IMPACT
          setTimeout(() => {
            setPhase("impact");
            if (stageRef.current) {
              gsap.to(stageRef.current, {
                keyframes: [
                  { x: -10, y: 6, duration: 0.05 },
                  { x:  12, y: -8, duration: 0.05 },
                  { x:  -7, y: 4, duration: 0.05 },
                  { x:   5, y: -3, duration: 0.05 },
                  { x:   0, y: 0, duration: 0.05 },
                ],
                overwrite: "auto",
              });
            }
            if (glyphRef.current) {
              gsap.fromTo(glyphRef.current,
                { scale: 1.85 },
                { scale: 1, duration: 1.0, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
            }
            if (ringRef.current) {
              gsap.fromTo(ringRef.current,
                { scale: 0.2, opacity: 0.95 },
                { scale: 6, opacity: 0, duration: 1.2, ease: "power2.out", overwrite: "auto" });
            }
            if (sparksRef.current) {
              const sp = sparksRef.current.querySelectorAll(".jdg-spark");
              sp.forEach((s, k) => {
                const a = (k / sp.length) * Math.PI * 2 + Math.random() * 0.3;
                const d = 220 + Math.random() * 180;
                gsap.set(s, { x: 0, y: 0, opacity: 1, scale: 1 });
                gsap.to(s, {
                  x: Math.cos(a) * d, y: Math.sin(a) * d,
                  opacity: 0, scale: 0.2,
                  duration: 0.9 + Math.random() * 0.5,
                  ease: "power2.out",
                });
              });
            }
            // финальный handoff — через framer exit
            setTimeout(() => onDoneRef.current?.(), 1400);
          }, 250);
          return;
        }
        i++;
        const remaining = idxTarget - i + 1;
        const delay = remaining > 3 ? 130 : remaining > 1 ? 220 : 360;
        setTimeout(step, delay);
      };
      step();
    }, wait);

    return () => clearTimeout(lockTimer);
  }, [targetRank]);

  const theme = RANK_THEMES[targetRank] ?? RANK_THEMES.D;
  const cssVars = {
    "--dmc-mid":    theme.mid,
    "--dmc-stroke": theme.stroke,
    "--dmc-glow":   theme.glow,
    "--jdg-accent": theme.accent,
  };
  const isSSS = targetRank === "SSS" && phase !== "scramble";

  return (
    <motion.div
      ref={stageRef}
      className="jdg-overlay"
      style={cssVars}
      data-testid="judgement-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="jdg-grid" aria-hidden="true" />
      <div className="jdg-vignette" aria-hidden="true" />

      <div className="jdg-top-line">
        <span>JARVIS</span>
        <span className="jdg-blink">●</span>
        <span>JUDGEMENT_PROTOCOL.exe</span>
      </div>

      <div className="jdg-center">
        <span ref={ringRef} className="jdg-ring" aria-hidden="true" />
        <span ref={sparksRef} className="jdg-sparks" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, i) => (<span key={i} className="jdg-spark" />))}
        </span>

        <motion.div
          ref={glyphRef}
          initial={{ scale: 0.6, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`rg-stage jdg-glyph ${isSSS ? "rg-stage--sss" : ""}`}
        >
          <span className="rg-glyph rg-glyph--back" aria-hidden="true">{glyph}</span>
          <span className="rg-glyph rg-glyph--front">{glyph}</span>
        </motion.div>

        {phase === "scramble" ? (
          <div className="jdg-status">
            <span className="jdg-bracket">[</span>
            <span className="jdg-status-text">{STATUSES[statusIdx]}</span>
            <span className="jdg-bracket">]</span>
          </div>
        ) : (
          <div className="jdg-status jdg-status--locked">
            <span>RANK ACQUIRED</span>
          </div>
        )}
      </div>

      <div className="jdg-bottom-line">
        <span>{phase === "scramble" ? "ANALYZING…" : "VERDICT LOCKED"}</span>
        <span className="jdg-bar"><span className="jdg-bar-fill" /></span>
      </div>
    </motion.div>
  );
}

/* ------------------------------- JudgementPortal ------------------------------- */

function JudgementPortal({ show, targetRank, onDone }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {show && (
        <JudgementCinematic
          key="cinematic"
          targetRank={targetRank}
          onDone={onDone}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ------------------------------- Result ------------------------------- */

function Tag({ color, children }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 10px",
      border: `2px solid ${color}`, color, fontSize: 11,
      letterSpacing: "0.1em", fontWeight: 800,
    }}>{children}</span>
  );
}

function ResultStage({ session, onRestart }) {
  const r = session.finalReport;
  if (!r) return null;
  const theme = RANK_THEMES[r.rank] ?? RANK_THEMES.D;
  const passed = r.verdict === "passed";

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1], delay: 0.05 + i * 0.08 },
    }),
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mock-root"
      style={{ maxWidth: 1200, margin: "0 auto", padding: `${PAGE_TOP} 24px 40px` }}
    >
      <Crumb stage="result" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            style={{ ...brBox, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 10 }}>
              ФИДБЕК ОТ ДЖАРВИСА
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.6 }}>{r.summary}</div>
            {(r.strengths?.length > 0 || r.weaknesses?.length > 0) && (
              <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {r.strengths?.map((s, i) => <Tag key={`s${i}`} color="#34d399">+ {s}</Tag>)}
                {r.weaknesses?.map((w, i) => <Tag key={`w${i}`} color="#ff5b00">- {w}</Tag>)}
              </div>
            )}
          </motion.div>

          {(session.coding?.length > 0) && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              style={{ ...brBox, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 14 }}>ЛАЙВ-КОДИНГ</div>
              {session.coding.map((c, i) => {
                const ok = c.testsTotal > 0 && c.testsPassed === c.testsTotal;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
                    padding: 10, border: `2px solid ${ok ? "#34d399" : "#ff5b00"}`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>{c.title}</div>
                      {c.errorSample && (
                        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{c.errorSample}</div>
                      )}
                    </div>
                    <div style={{ fontWeight: 900, color: ok ? "#34d399" : "#ff5b00" }}>
                      {c.testsPassed} / {c.testsTotal}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {r.toImprove?.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              style={{ ...brBox, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 14 }}>
                ЧТО ПОДТЯНУТЬ В ПЕРВУЮ ОЧЕРЕДЬ
              </div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.6 }}>
                {r.toImprove.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
              </ol>
            </motion.div>
          )}

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button data-testid="mock-restart-btn" onClick={onRestart} style={btnPrimary}>ПРОЙТИ ЕЩЁ РАЗ ↗</button>
            <Link to="/tests" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>К ТЕСТАМ</Link>
          </motion.div>
        </div>

        <div style={{ position: "sticky", top: 120, display: "flex", flexDirection: "column",
          alignItems: "center", paddingTop: 12 }}>
          <RankGlyph rank={r.rank} size="clamp(160px, 18vw, 240px)" />
          <div data-testid="mock-rank-letters" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>{r.rank}</div>

          <div style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "clamp(16px, 2vw, 22px)",
            fontWeight: 800,
            color: theme.accent,
            letterSpacing: "0.12em",
            marginTop: 24,
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            {r.rankLabel || theme.label}
          </div>

          <div style={{ fontSize: 10, letterSpacing: "0.25em", marginTop: 10, opacity: 0.55 }}>
            {session.directionLabel?.toUpperCase?.()} · {session.grade?.toUpperCase?.()}
          </div>

          <div style={{ marginTop: 24 }}>
            <span data-testid="mock-final-score" className="display"
              style={{ fontSize: "clamp(48px, 7vw, 72px)", lineHeight: 0.9, color: "var(--fg)" }}>
              {r.totalScore}
            </span>
            <span className="display" style={{ fontSize: 18, opacity: 0.5, marginLeft: 4 }}>/100</span>
          </div>

          <div style={{
            display: "inline-block", padding: "5px 12px", marginTop: 16,
            background: passed ? "#34d399" : "#ff5b00", color: "#000",
            fontWeight: 900, letterSpacing: "0.15em", fontSize: 11,
          }}>
            {passed ? "✓ ОФФЕР" : "× ПОКА НЕТ"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------- Page root ------------------------------- */

export default function MockInterview() {
  const [session, setSession] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);
  const [meta, setMeta] = useState({ directions: [], grades: [] });
  const [finalizing, setFinalizing] = useState(false);
  const [confirmAbort, setConfirmAbort] = useState(false);
  const [cinematicDone, setCinematicDone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      apiFetch(`${API}/api/mock/session/${saved}`)
        .then((s) => {
          if (s?.id) {
            setSession(s);
            // если сессия уже завершена и отчёт есть — кинематик не нужен
            if ((s.stage === "finished" || s.stage === "aborted") && s.finalReport) {
              setCinematicDone(true);
            }
          } else localStorage.removeItem(LS_KEY);
        })
        .catch(() => localStorage.removeItem(LS_KEY));
    }
    apiFetch(`${API}/api/mock/rate-limit`).then(setRateLimit).catch(() => setRateLimit(null));
    apiFetch(`${API}/api/mock/directions`).then(setMeta).catch(() => {});
  }, []);

  useEffect(() => { if (session?.id) localStorage.setItem(LS_KEY, session.id); }, [session?.id]);

  useEffect(() => {
    if (!session) return;
    const needFinalize = (session.stage === "finished" || session.stage === "aborted") && !session.finalReport && !finalizing;
    if (!needFinalize) return;
    setFinalizing(true);
    apiFetch(`${API}/api/mock/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    })
      .then((s) => { if (s?.id) setSession(s); })
      .catch((e) => console.error("finish failed:", e.message))
      .finally(() => setFinalizing(false));
  }, [session?.stage, session?.finalReport, finalizing, session?.id]);

  useEffect(() => {
    if (!session || (session.stage !== "qa" && session.stage !== "coding")) return;
    const left = (session.startedAt + session.durationMs) - Date.now();
    if (left <= 0) {
      apiFetch(`${API}/api/mock/finish`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      }).then((s) => s?.id && setSession(s)).catch(() => {});
      return;
    }
    const t = setTimeout(() => {
      apiFetch(`${API}/api/mock/finish`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      }).then((s) => s?.id && setSession(s)).catch(() => {});
    }, left + 500);
    return () => clearTimeout(t);
  }, [session?.id, session?.stage, session?.startedAt, session?.durationMs]);

  const restart = () => {
    localStorage.removeItem(LS_KEY);
    setSession(null);
    setCinematicDone(false);
    apiFetch(`${API}/api/mock/rate-limit`).then(setRateLimit).catch(() => {});
  };

  const doAbort = async () => {
    if (!session) return;
    try {
      const s = await apiFetch(`${API}/api/mock/abort`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      setSession(s);
    } catch (e) { console.error("abort failed:", e.message); }
    finally { setConfirmAbort(false); }
  };

  const askAbort = () => setConfirmAbort(true);

  const startSession = (nextSession) => {
    setCinematicDone(false);
    setSession(nextSession);
  };

  if (!session) return <Setup onStart={startSession} rateLimit={rateLimit} meta={meta} />;

  const isFinishedStage = session.stage === "finished" || session.stage === "aborted";
  const showCinematic = isFinishedStage && !cinematicDone;
  const targetRank = session.finalReport?.rank;

  return (
    <>
      {!isFinishedStage && (
        <>
          {session.stage === "qa" && (<ChatStage session={session} onUpdate={setSession} onAbort={askAbort} />)}
          {session.stage === "coding" && (<CodingStage session={session} onUpdate={setSession} onAbort={askAbort} />)}
        </>
      )}

      {isFinishedStage && cinematicDone && session.finalReport && (
        <ResultStage session={session} onRestart={restart} />
      )}

      <JudgementPortal
        show={showCinematic}
        targetRank={targetRank}
        onDone={() => setCinematicDone(true)}
      />

      {confirmAbort && (<ConfirmModal onCancel={() => setConfirmAbort(false)} onConfirm={doAbort} />)}
    </>
  );
}

function ConfirmModal({ onCancel, onConfirm }) {
  return (
    <div onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>
      <div style={{ ...brBox, padding: 28, maxWidth: 480, width: "100%", boxShadow: "8px 8px 0 #ff5b00" }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 10 }}>
          ПРЕРВАТЬ СОБЕС?
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.85, marginBottom: 18 }}>
          Попытка <b>не вернётся</b>: за неделю их всего 3, и эта будет считаться использованной.
          Джарвис всё равно выдаст итоговый ранг по тому, что ты успел.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button onClick={onCancel} style={btnGhost}>ПРОДОЛЖИТЬ СОБЕС</button>
          <button data-testid="mock-abort-confirm" onClick={onConfirm}
            style={{ ...btnPrimary, background: "#ff5b00", color: "#000", boxShadow: "6px 6px 0 var(--fg)" }}>
            ПРЕРВАТЬ ↗
          </button>
        </div>
      </div>
    </div>
  );
}