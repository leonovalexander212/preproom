import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/*
  AI MOCK INTERVIEW — обновлённый поток:
  1) setup   — выбор направления (Python/Java/Frontend/PHP) и грейда (только Junior)
  2) qa      — реальные вопросы из БД, без пер-вопросного ревью
  3) coding  — лайв-кодинг, оценка через Piston (реальные тесты)
  4) result  — итог в стиле Devil May Cry (D/C/B/A/S/SS/SSS) + анимация

  Песочные часы: SVG с анимацией песка пропорционально таймеру.
  Прервать: списывает попытку (анти-абуз).
*/

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

function Crumb({ stage }) {
  const map = { setup: "НАСТРОЙКА", qa: "ВОПРОСЫ", coding: "ЛАЙВ-КОДИНГ", result: "РЕЗУЛЬТАТ", aborted: "ПРЕРВАНО" };
  return (
    <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: "0.12em", marginBottom: 16 }}>
      › ТЕСТЫ / AI MOCK / {map[stage] ?? stage}
    </div>
  );
}

/* ------------------------------- Hourglass ------------------------------- */
/* SVG-песочные часы, песок плавно перетекает по progress (0..1, где 0 — старт, 1 — конец) */

function Hourglass({ progress, danger }) {
  // прогресс от 0 (старт) до 1 (всё высыпалось)
  const p = Math.min(1, Math.max(0, progress));
  // верх: высота песка от 32 (полный) до 0; низ: от 0 до 32
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
      {/* рамка */}
      <rect x="6" y="2" width="44" height="4" fill="currentColor" />
      <rect x="6" y="74" width="44" height="4" fill="currentColor" />
      {/* стенки */}
      <path d="M10 6 L46 6 L30 38 L46 74 L10 74 L26 38 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* верхний песок */}
      <clipPath id="topClip"><path d="M11 7 L45 7 L29.5 38 L26.5 38 Z" /></clipPath>
      <rect x="0" y={6 + (32 - topSandH)} width="56" height={topSandH} fill="url(#sandGrad)" clipPath="url(#topClip)">
        <animate attributeName="opacity" values="1;0.85;1" dur="1.6s" repeatCount="indefinite" />
      </rect>
      {/* струйка */}
      {fall && (
        <line x1="28" y1="38" x2="28" y2="42" stroke={danger ? "#ff5b00" : "var(--accent, #e5ff00)"} strokeWidth="2">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
        </line>
      )}
      {/* нижний песок */}
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
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
      <Crumb stage="setup" />
      <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
        AI MOCK INTERVIEW
      </h1>
      <p style={{ opacity: 0.7, maxWidth: 680, margin: "0 0 28px", fontSize: 16, lineHeight: 1.5 }}>
        Реалистичный тех-собес с <b>Джарвисом</b>. Вопросы — из реальных видео-интервью в БД (порядок сохраняется).
        Лайв-кодинг — задачи в файлах, оценка автоматическими тестами в песочнице. Финальный ранг — в стиле Devil May Cry.
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
                {disabled && (
                  <div style={{ marginTop: 6, fontSize: 10, letterSpacing: "0.1em", opacity: 0.7 }}>
                    СКОРО
                  </div>
                )}
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
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                  {disabled ? "СКОРО" : g.hint}
                </div>
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
        <Link to="/tests" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>
          НАЗАД
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------- TopBar (timer + abort) ------------------------------- */

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
        @keyframes ppPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }
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

  const onKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
  };

  const total = session.totalQuestions;
  const answered = session.answers.length;
  const progress = total ? (answered / total) * 100 : 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <Crumb stage="qa" />
      <TopBar session={session} onAbort={onAbort}
              label={`ВОПРОС ${Math.min(session.currentQuestionNumber, total)} ИЗ ${total}`} />

      {/* Прогресс */}
      <div style={{ height: 6, background: "var(--fg)", opacity: 0.12, position: "relative", marginBottom: 20 }}>
        <div style={{ position: "absolute", inset: 0, width: `${progress}%`, background: "var(--accent)", transition: "width 300ms ease" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 20 }}>
        <div style={{ ...brBox, padding: 0, display: "flex", flexDirection: "column", minHeight: 540 }}>
          <div ref={scrollerRef} data-testid="mock-chat-scroller"
               style={{ flex: 1, overflowY: "auto", padding: 24, maxHeight: "60vh" }}>
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

          <div style={{ borderTop: "2px solid var(--fg)", padding: 16, background: "var(--bg)" }}>
            {error && <div style={{ marginBottom: 8, color: "#ff5b00", fontSize: 13, fontWeight: 700 }}>{error}</div>}
            <textarea
              data-testid="mock-answer-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              placeholder="Отвечай развёрнуто, как на реальном собесе. Джарвис не комментирует — итог в конце."
              rows={4}
              style={{
                width: "100%", padding: 12, fontFamily: "inherit", fontSize: 14,
                background: "transparent", color: "var(--fg)", border: "2px solid var(--fg)",
                resize: "vertical", outline: "none", boxSizing: "border-box",
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
      // даём пользователю увидеть результат, потом обновляем
      setTimeout(() => onUpdate(data.session), 1200);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (!task) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
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
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={20}
              style={{
                width: "100%", padding: 16, boxSizing: "border-box",
                fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
                fontSize: 14, lineHeight: 1.6, background: "transparent",
                color: "var(--fg)", border: "none", outline: "none", resize: "vertical",
                minHeight: 420,
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
              Код запускается на изолированном раннере (Piston). Тесты с stdin/stdout, ожидаемый ответ скрыт.
              Подсказок и подсчёта по человеку — нет, только автотесты.
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

/* ------------------------------- Result (DMC rank) ------------------------------- */

const RANK_THEMES = {
  D:   { color: "#7a7a7a", glow: "rgba(122,122,122,0.5)",  bg: "#1a1a1a", label: "DULL" },
  C:   { color: "#4ECDC4", glow: "rgba(78,205,196,0.6)",   bg: "#082624", label: "COOL" },
  B:   { color: "#3B82F6", glow: "rgba(59,130,246,0.7)",   bg: "#071a3a", label: "BRAVO" },
  A:   { color: "#A855F7", glow: "rgba(168,85,247,0.7)",   bg: "#1c0a2e", label: "ALRIGHT!" },
  S:   { color: "#FFD700", glow: "rgba(255,215,0,0.85)",   bg: "#241b00", label: "STYLISH!" },
  SS:  { color: "#FF6B35", glow: "rgba(255,107,53,0.95)",  bg: "#2c0b00", label: "SHOWTIME!!" },
  SSS: { color: "#FF1A8C", glow: "rgba(255,26,140,1.0)",   bg: "#100018", label: "SMOKIN' SEXY STYLE!!!" },
};

function ResultStage({ session, onRestart }) {
  const r = session.finalReport;
  if (!r) return null;
  const theme = RANK_THEMES[r.rank] ?? RANK_THEMES.D;
  const passed = r.verdict === "passed";
  const sssMode = r.rank === "SSS";

  // эпичная анимация: появление букв ранга по одной + screen shake
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <DMCStyles />

      {/* baner */}
      <div style={{
        position: "relative",
        background: `radial-gradient(ellipse at 30% 30%, ${theme.bg} 0%, var(--bg) 70%)`,
        borderBottom: "2px solid var(--fg)",
        padding: "60px 24px 40px",
        textAlign: "center",
        animation: "ppShake 0.6s ease-out",
      }}>
        {/* лучи */}
        <div className="ppRays" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            `conic-gradient(from 0deg, transparent 0deg, ${theme.glow} 10deg, transparent 20deg,` +
            ` transparent 60deg, ${theme.glow} 70deg, transparent 80deg,` +
            ` transparent 130deg, ${theme.glow} 140deg, transparent 150deg,` +
            ` transparent 210deg, ${theme.glow} 220deg, transparent 230deg,` +
            ` transparent 290deg, ${theme.glow} 300deg, transparent 310deg)`,
          opacity: 0.18, animation: "ppSpin 14s linear infinite",
        }} />

        <div style={{
          position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <div style={{ fontSize: 12, letterSpacing: "0.4em", opacity: 0.6 }}>
            ИТОГ · {session.directionLabel} · {session.grade}{session.stage === "aborted" ? " · ПРЕРВАНО" : ""}
          </div>

        <div data-testid="mock-rank-letters" style={{
          display: "flex", gap: r.rank.length === 3 ? 6 : 0,
          filter: `drop-shadow(0 0 30px ${theme.glow}) drop-shadow(4px 6px 0 #000)`,
        }}>
          {r.rank.split("").map((ch, i) => (
            <span
              key={i}
              className={`dmc-rank-letter ${sssMode ? "dmc-rank-letter--sss" : ""}`}
              style={{
                color: sssMode ? undefined : theme.color,
                animationDelay: `${0.18 + i * 0.18}s`,
                fontSize: "clamp(160px, 22vw, 280px)",
                textShadow: sssMode
                  ? `0 0 28px ${theme.glow}`
                  : `0 0 22px ${theme.glow}, 5px 5px 0 #000, -2px -2px 0 rgba(255,255,255,0.15)`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

          <div style={{
            fontFamily: "'Black Ops One', 'Big Shoulders Stencil Display', Impact, sans-serif",
            fontStyle: "italic",
            fontSize: "clamp(22px, 3vw, 38px)", letterSpacing: "0.1em",
            color: theme.color, marginTop: -8,
            animation: "ppFadeUp 0.6s ease-out 1.2s both",
          }}>
            {r.rankLabel || theme.label}
          </div>

          <div style={{
            display: "flex", alignItems: "baseline", gap: 10, marginTop: 14,
            animation: "ppFadeUp 0.6s ease-out 1.4s both",
          }}>
            <div data-testid="mock-final-score" style={{
              fontSize: "clamp(48px, 7vw, 92px)", fontWeight: 900, letterSpacing: "-0.04em",
              color: "var(--fg)", lineHeight: 1,
            }}>
              {r.totalScore}
            </div>
            <div style={{ fontSize: 14, opacity: 0.55, letterSpacing: "0.2em" }}>/100</div>
          </div>

          <div style={{
            display: "inline-block", padding: "4px 14px", marginTop: 8,
            background: passed ? "#34d399" : "#ff5b00", color: "#000",
            fontWeight: 900, letterSpacing: "0.15em", fontSize: 12,
            animation: "ppFadeUp 0.6s ease-out 1.6s both",
          }}>
            {passed ? "✓ ОФФЕР ВЕРОЯТЕН" : "× ПОКА НЕТ"}
          </div>
        </div>
      </div>

      {/* контент */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px",
        animation: "ppFadeUp 0.6s ease-out 1.9s both" }}>
        <Crumb stage="result" />

        <div style={{ ...brBox, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 10 }}>
            ФИДБЕК ОТ ДЖАРВИСА
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.6 }}>{r.summary}</div>
          {(r.strengths?.length > 0 || r.weaknesses?.length > 0) && (
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {r.strengths?.map((s, i) => <Tag key={`s${i}`} color="#34d399">+ {s}</Tag>)}
              {r.weaknesses?.map((w, i) => <Tag key={`w${i}`} color="#ff5b00">− {w}</Tag>)}
            </div>
          )}
        </div>

        {(session.coding?.length > 0) && (
          <div style={{ ...brBox, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 14 }}>
              ЛАЙВ-КОДИНГ
            </div>
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
          </div>
        )}

        {r.toImprove?.length > 0 && (
          <div style={{ ...brBox, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 14 }}>
              ЧТО ПОДТЯНУТЬ В ПЕРВУЮ ОЧЕРЕДЬ
            </div>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.6 }}>
              {r.toImprove.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
            </ol>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button data-testid="mock-restart-btn" onClick={onRestart} style={btnPrimary}>ПРОЙТИ ЕЩЁ РАЗ ↗</button>
          <Link to="/tests" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>К ТЕСТАМ</Link>
        </div>
      </div>
    </div>
  );
}

function DMCStyles() {
  return (
    <style>{`
      /* Devil May Cry-стайл шрифт: Black Ops One + Bungee Inline (для SSS) */
      @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Bungee+Inline&family=Big+Shoulders+Stencil+Display:wght@900&display=swap');

      .dmc-rank-letter {
        display: inline-block;
        opacity: 0;
        font-family: 'Black Ops One', 'Big Shoulders Stencil Display', Impact, sans-serif;
        font-style: italic;
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.02em;
        transform-origin: 50% 60%;
        animation: ppRankPop 0.7s cubic-bezier(0.2, 1.6, 0.4, 1) forwards;
      }
      .dmc-rank-letter--sss {
        font-family: 'Bungee Inline', 'Black Ops One', Impact, sans-serif;
        background: linear-gradient(90deg, #FF1A8C 0%, #FFD700 25%, #00E5FF 50%, #A855F7 75%, #FF1A8C 100%);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        animation: ppRankPop 0.7s cubic-bezier(0.2, 1.6, 0.4, 1) forwards,
                   ppRainbow 4s linear infinite;
      }

      @keyframes ppShake {
        0%, 100% { transform: translate(0, 0); }
        15% { transform: translate(-6px, 4px); }
        30% { transform: translate(6px, -4px); }
        45% { transform: translate(-4px, 2px); }
        60% { transform: translate(4px, -2px); }
        75% { transform: translate(-2px, 1px); }
      }
      @keyframes ppSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
      @keyframes ppFadeUp {
        0%   { opacity: 0; transform: translateY(14px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes ppRankPop {
        0%   { opacity: 0; transform: translateY(40px) scale(0.7) rotate(-8deg) skewX(-6deg); filter: blur(12px); }
        50%  { opacity: 1; transform: translateY(-10px) scale(1.18) rotate(2deg) skewX(-10deg); filter: blur(0); }
        100% { opacity: 1; transform: translateY(0)   scale(1)    rotate(0)    skewX(-8deg); filter: blur(0); }
      }
      @keyframes ppRainbow {
        0%   { background-position: 0%   50%; }
        100% { background-position: 200% 50%; }
      }
    `}</style>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      padding: "4px 10px", fontSize: 11, letterSpacing: "0.1em",
      border: `2px solid ${color}`, color, fontWeight: 700,
    }}>{children}</span>
  );
}

/* ------------------------------- Page root ------------------------------- */

export default function MockInterview() {
  const [session, setSession] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);
  const [meta, setMeta] = useState({ directions: [], grades: [] });
  const [finalizing, setFinalizing] = useState(false);
  const [confirmAbort, setConfirmAbort] = useState(false);

  // initial loads
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      apiFetch(`${API}/api/mock/session/${saved}`)
        .then((s) => { if (s?.id) setSession(s); else localStorage.removeItem(LS_KEY); })
        .catch(() => localStorage.removeItem(LS_KEY));
    }
    apiFetch(`${API}/api/mock/rate-limit`).then(setRateLimit).catch(() => setRateLimit(null));
    apiFetch(`${API}/api/mock/directions`).then(setMeta).catch(() => {});
  }, []);

  useEffect(() => { if (session?.id) localStorage.setItem(LS_KEY, session.id); }, [session?.id]);

  // авто-финалайз когда стадия finished/aborted и нет отчёта
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

  // авто-прерывание по таймеру (клиентский страж, сервер дублирует)
  useEffect(() => {
    if (!session || (session.stage !== "qa" && session.stage !== "coding")) return;
    const left = (session.startedAt + session.durationMs) - Date.now();
    if (left <= 0) {
      // уже истёк
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
    } catch (e) {
      console.error("abort failed:", e.message);
    } finally {
      setConfirmAbort(false);
    }
  };

  const askAbort = () => setConfirmAbort(true);

  if (!session) {
    return <Setup onStart={setSession} rateLimit={rateLimit} meta={meta} />;
  }

  // финал и/или ожидание подсчёта
  if (session.stage === "finished" || session.stage === "aborted") {
    if (finalizing || !session.finalReport) {
      return (
        <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: 24 }}>
          <Crumb stage="result" />
          <div style={{ ...brBox, padding: 32, boxShadow: "8px 8px 0 var(--accent)" }}>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.05em", marginBottom: 10 }}>
              ДЖАРВИС СВОДИТ ИТОГ...
            </div>
            <div style={{ opacity: 0.7, fontSize: 14 }}>5–15 секунд.</div>
          </div>
        </div>
      );
    }
    return <ResultStage session={session} onRestart={restart} />;
  }

  return (
    <>
      {session.stage === "qa" && (
        <ChatStage session={session} onUpdate={setSession} onAbort={askAbort} />
      )}
      {session.stage === "coding" && (
        <CodingStage session={session} onUpdate={setSession} onAbort={askAbort} />
      )}
      {confirmAbort && (
        <ConfirmModal
          onCancel={() => setConfirmAbort(false)}
          onConfirm={doAbort}
        />
      )}
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