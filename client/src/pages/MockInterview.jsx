import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/*
  AI Mock Interview — 4 стадии:
    1) setup      — выбор направления и грейда
    2) qa         — вопросы + ревью ИИ в чате
    3) coding     — лайв-кодинг, ИИ даёт статический разбор
    4) result     — финальный отчёт

  Стилистика — брутализм как в остальном PrepRoom: CSS-переменные
  --bg / --fg / --accent, жирные рамки 2px solid, офсет-тени.
  Всё инлайново — чтобы файл копировался одним куском без правок CSS.
*/

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LS_KEY = "pp-mock-session";

const DIRECTIONS = [
  { slug: "frontend", label: "FRONTEND" },
  { slug: "java", label: "JAVA" },
  { slug: "python", label: "PYTHON" },
  { slug: "php", label: "PHP" },
  { slug: "csharp", label: "C#" },
];
const GRADES = [
  { slug: "JUNIOR", label: "JUNIOR", hint: "1-2 года" },
  { slug: "MIDDLE", label: "MIDDLE", hint: "2-4 года" },
  { slug: "SENIOR", label: "SENIOR", hint: "4+ лет" },
];
/* ----------------------------- fetch helper ----------------------------- */
// Безопасная обёртка над fetch: парсит только если тело похоже на JSON,
// иначе выбрасывает внятную ошибку с кодом и первыми байтами ответа.
// Нужна потому, что Express при 404/500 возвращает text/html — и res.json()
// падает с "Unexpected end of JSON input", съедая полезный контекст.
async function apiFetch(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (e) {
    throw new Error(`Сеть не отвечает: ${e.message}`);
  }
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { /* не JSON */ }
  }
  if (!res.ok) {
    const msg = data?.error || data?.message || text?.slice(0, 160) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  if (!data) {
    throw new Error(`Пустой ответ от сервера (HTTP ${res.status}). Проверь, что backend перезапущен и роут /api/mock подключён.`);
  }
  return data;
}
/* ----------------------------- shared UI ----------------------------- */

const brBox = {
  border: "2px solid var(--fg)",
  background: "var(--bg)",
};

const btnPrimary = {
  ...brBox,
  padding: "14px 22px",
  background: "var(--fg)",
  color: "var(--bg)",
  fontWeight: 800,
  letterSpacing: "0.06em",
  cursor: "pointer",
  boxShadow: "6px 6px 0 var(--accent)",
  transition: "transform 120ms ease, box-shadow 120ms ease",
};

const btnGhost = {
  ...brBox,
  padding: "14px 22px",
  background: "transparent",
  color: "var(--fg)",
  fontWeight: 800,
  letterSpacing: "0.06em",
  cursor: "pointer",
};

function Crumb({ stage }) {
  const map = { setup: "НАСТРОЙКА", qa: "ВОПРОСЫ", coding: "ЛАЙВ-КОДИНГ", result: "РЕЗУЛЬТАТ" };
  return (
    <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: "0.12em", marginBottom: 16 }}>
      › ТЕСТЫ / AI MOCK INTERVIEW / {map[stage]}
    </div>
  );
}

/* ----------------------------- Setup stage ----------------------------- */

function Setup({ onStart, rateLimit }) {
  const [direction, setDirection] = useState(null);
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
      <Crumb stage="setup" />

      <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
        AI MOCK INTERVIEW
      </h1>
      <p style={{ opacity: 0.7, maxWidth: 640, margin: "0 0 28px", fontSize: 16, lineHeight: 1.5 }}>
        Реалистичное техническое собеседование с ИИ. Отвечаешь на вопросы, решаешь 1-2 задачи на
        лайв-кодинг, в конце получаешь строгое ревью — пройдёшь или нет, что подтянуть в первую очередь.
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
        <div style={{ fontSize: 12, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 12 }}>
          1. НАПРАВЛЕНИЕ
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {DIRECTIONS.map((d) => (
            <button
              key={d.slug}
              data-testid={`mock-direction-${d.slug}`}
              onClick={() => setDirection(d.slug)}
              style={{
                ...brBox, padding: "22px 18px", cursor: "pointer", textAlign: "left",
                background: direction === d.slug ? "var(--fg)" : "transparent",
                color: direction === d.slug ? "var(--bg)" : "var(--fg)",
                fontWeight: 800, letterSpacing: "0.08em", fontSize: 18,
                boxShadow: direction === d.slug ? "6px 6px 0 var(--accent)" : "none",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 12 }}>
          2. ГРЕЙД
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {GRADES.map((g) => (
            <button
              key={g.slug}
              data-testid={`mock-grade-${g.slug}`}
              onClick={() => setGrade(g.slug)}
              style={{
                ...brBox, padding: "22px 18px", cursor: "pointer", textAlign: "left",
                background: grade === g.slug ? "var(--fg)" : "transparent",
                color: grade === g.slug ? "var(--bg)" : "var(--fg)",
                boxShadow: grade === g.slug ? "6px 6px 0 var(--accent)" : "none",
              }}
            >
              <div style={{ fontWeight: 800, letterSpacing: "0.08em", fontSize: 20 }}>{g.label}</div>
              <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>{g.hint}</div>
            </button>
          ))}
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

/* ----------------------------- Chat stage (QA) ----------------------------- */

function ChatStage({ session, onUpdate, onAdvance }) {
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
      if (data.session.stage !== "qa") onAdvance(data.session);
    } catch (e) {
      setError(e.message);
      setDraft(current);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
  };

  const progress = (session.answers.length / session.totalQuestions) * 100;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <Crumb stage="qa" />

      {/* Top bar with progress */}
      <div style={{
        ...brBox, padding: 16, display: "flex", alignItems: "center", gap: 16,
        flexWrap: "wrap", marginBottom: 24,
      }}>
        <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "0.05em" }}>
          СЕССИЯ · ВОПРОС {Math.min(session.currentQuestionNumber, session.totalQuestions)} ИЗ {session.totalQuestions}
        </div>
        <div style={{ flex: 1, minWidth: 180, height: 6, background: "var(--fg)", opacity: 0.12, position: "relative" }}>
          <div style={{
            position: "absolute", inset: 0, width: `${progress}%`,
            background: "var(--accent)", transition: "width 300ms ease",
          }} />
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: "0.1em" }}>
          {session.directionLabel} · {session.grade}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 20 }}>
        {/* Chat */}
        <div style={{ ...brBox, padding: 0, display: "flex", flexDirection: "column", minHeight: 560 }}>
          <div
            ref={scrollerRef}
            data-testid="mock-chat-scroller"
            style={{ flex: 1, overflowY: "auto", padding: 24, maxHeight: "60vh" }}
          >
            {session.answers.map((a, i) => (
              <React.Fragment key={a.questionId}>
                <AIBubble text={a.questionText} tag={`${a.topic} · ВОПРОС ${i + 1}`} />
                <UserBubble text={a.userAnswer} />
                <ReviewBubble review={a} />
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
            {error && (
              <div style={{ marginBottom: 8, color: "#ff5b00", fontSize: 13, fontWeight: 700 }}>
                {error}
              </div>
            )}
            <textarea
              data-testid="mock-answer-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              placeholder="Отвечай развёрнуто, как на реальном собесе."
              rows={4}
              style={{
                width: "100%", padding: 12, fontFamily: "inherit", fontSize: 14,
                background: "transparent", color: "var(--fg)", border: "2px solid var(--fg)",
                resize: "vertical", outline: "none", boxSizing: "border-box",
              }}
            />
            <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                data-testid="mock-answer-submit"
                onClick={submit}
                disabled={!draft.trim() || loading}
                style={{ ...btnPrimary, opacity: !draft.trim() || loading ? 0.4 : 1 }}
              >
                {loading ? "ИИ ДУМАЕТ..." : "ОТПРАВИТЬ →"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...brBox, padding: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 8 }}>
              ТЕКУЩИЙ СЧЁТ
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-0.03em" }}>
              {avgScore(session.answers)}<span style={{ fontSize: 18, opacity: 0.5 }}> / 10</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
              средняя по {session.answers.length} ответам
            </div>
          </div>

          <div style={{ ...brBox, padding: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 10 }}>
              ПРАВИЛА
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>
              <li>ИИ ревьюит строго, как на реальном собесе</li>
              <li>Пропустить вопрос нельзя — ответь хоть коротко</li>
              <li>После {session.totalQuestions} вопросов — лайв-кодинг</li>
            </ul>
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
        ...brBox, width: 36, height: 36, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0,
      }}>AI</div>
      <div style={{
        ...brBox, padding: "12px 16px", maxWidth: "80%",
        boxShadow: highlight ? "5px 5px 0 var(--accent)" : "none",
      }}>
        {tag && (
          <div style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.55, marginBottom: 6 }}>
            {tag}
          </div>
        )}
        <div style={{ fontSize: 15, lineHeight: 1.55 }}>{text}</div>
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, justifyContent: "flex-end" }}>
      <div style={{
        ...brBox, padding: "12px 16px", maxWidth: "80%",
        background: "var(--fg)", color: "var(--bg)",
      }}>
        <div style={{ fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{text}</div>
      </div>
      <div style={{
        ...brBox, width: 36, height: 36, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0,
        background: "var(--fg)", color: "var(--bg)",
      }}>Я</div>
    </div>
  );
}

function ReviewBubble({ review }) {
  const good = review.aiScore >= 7;
  return (
    <div style={{
      ...brBox, padding: "12px 16px", marginBottom: 24, marginLeft: 48,
      boxShadow: `4px 4px 0 ${good ? "#34d399" : "#ff5b00"}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.6 }}>
          РЕВЬЮ ОТ ИИ
        </div>
        <div style={{ fontSize: 12, fontWeight: 900 }}>{review.aiScore} / 10</div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.55 }}>{review.aiReviewText}</div>
      {review.aiFlags?.length > 0 && (
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {review.aiFlags.map((f, i) => (
            <span key={i} style={{
              fontSize: 10, letterSpacing: "0.1em", padding: "3px 8px",
              border: "1px solid var(--fg)", opacity: 0.75,
            }}>{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function avgScore(list) {
  if (!list || list.length === 0) return 0;
  return Math.round((list.reduce((s, a) => s + (a.aiScore || 0), 0) / list.length) * 10) / 10;
}

/* ----------------------------- Coding stage ----------------------------- */

function CodingStage({ session, onUpdate, onAdvance }) {
  const task = session.currentCoding;
  const [code, setCode] = useState(task?.starterCode ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastReview, setLastReview] = useState(null);

  useEffect(() => {
    setCode(task?.starterCode ?? "");
    setLastReview(null);
  }, [task?.id]);

  const submit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true); setError(null);
     try {
      const data = await apiFetch(`${API}/api/mock/coding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, code }),
      });
      setLastReview(data.review);
      onUpdate(data.session);
      if (data.session.stage !== "coding") {
        setTimeout(() => onAdvance(data.session), 1500);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <Crumb stage="coding" />

      <div style={{ ...brBox, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 6 }}>
          ЗАДАЧА {session.currentCodingNumber} ИЗ {session.totalCoding} · LEETCODE-STYLE
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em" }}>
          {task.title}
        </h2>
        <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.55 }}>{task.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 20 }}>
        <div>
          <div style={{
            ...brBox, padding: 0, overflow: "hidden",
            fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
          }}>
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
              rows={18}
              style={{
                width: "100%", padding: 16, boxSizing: "border-box",
                fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
                fontSize: 14, lineHeight: 1.6, background: "transparent",
                color: "var(--fg)", border: "none", outline: "none", resize: "vertical",
                minHeight: 380,
              }}
            />
          </div>

          {error && (
            <div style={{ ...brBox, marginTop: 12, padding: 12, background: "#ff5b00", color: "#000", fontWeight: 700 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={() => setCode(task.starterCode)}
              style={{ ...btnGhost, padding: "10px 18px" }}
            >
              СБРОСИТЬ
            </button>
            <button
              data-testid="mock-code-submit"
              onClick={submit}
              disabled={loading || !code.trim()}
              style={{ ...btnPrimary, opacity: loading || !code.trim() ? 0.4 : 1 }}
            >
              {loading ? "ИИ РАЗБИРАЕТ..." : "СДАТЬ РЕШЕНИЕ →"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...brBox, padding: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 8 }}>
              АЛИНА НАБЛЮДАЕТ
            </div>
            <div style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>
              Не пишет код за тебя. После отправки даст статический разбор:
              корректность, edge-кейсы, сложность, идиоматичность.
            </div>
          </div>

          {task.hints?.length > 0 && (
            <div style={{ ...brBox, padding: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 8 }}>
                ПОДСКАЗКИ
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.55 }}>
                {task.hints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}

          {lastReview && (
            <div style={{ ...brBox, padding: 18, boxShadow: "4px 4px 0 var(--accent)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6 }}>
                  РАЗБОР
                </div>
                <div style={{ fontWeight: 900 }}>
                  {lastReview.aiScore}/10 · {lastReview.testsPassed}/{lastReview.testsTotal} тестов
                </div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.55 }}>{lastReview.aiReviewText}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function extFromLang(l) {
  return { javascript: "js", java: "java", python: "py", php: "php", csharp: "cs" }[l] ?? "txt";
}

/* ----------------------------- Result stage ----------------------------- */

function ResultStage({ session, onRestart }) {
  const r = session.finalReport;
  if (!r) return null;

  const passed = r.verdict === "passed";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <Crumb stage="result" />

      <div style={{
        ...brBox, padding: 28, marginBottom: 24, position: "relative",
        boxShadow: `10px 10px 0 ${passed ? "#34d399" : "#ff5b00"}`,
      }}>
        <div style={{
          display: "inline-block", padding: "4px 10px",
          background: passed ? "#34d399" : "#ff5b00", color: "#000",
          fontWeight: 900, letterSpacing: "0.1em", fontSize: 12, marginBottom: 14,
        }}>
          {passed ? "✓ ОФФЕР ВЕРОЯТЕН" : "× ПОКА НЕТ"}
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{ margin: 0, fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, letterSpacing: "-0.03em" }}>
              {passed ? "ГОТОВ К СОБЕСУ!" : "ЕЩЁ ПОДТЯГИВАЙ"}
            </h1>
            <div style={{ opacity: 0.7, marginTop: 8, fontSize: 14, lineHeight: 1.55 }}>
              {session.directionLabel} · {session.grade} · {session.answers.length} вопросов и {session.coding.length} задач на лайв-кодинг.
            </div>
          </div>
          <div data-testid="mock-final-score" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 84, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1 }}>
              {r.totalScore}
            </div>
            <div style={{ fontSize: 12, letterSpacing: "0.2em", opacity: 0.55, marginTop: 6 }}>
              ИЗ 100
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...brBox, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 10 }}>
          РЕВЬЮ ОТ ИИ
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.6 }}>{r.summary}</div>
        {(r.strengths?.length > 0 || r.weaknesses?.length > 0) && (
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {r.strengths?.map((s, i) => (
              <Tag key={`s${i}`} color="#34d399">{s}</Tag>
            ))}
            {r.weaknesses?.map((w, i) => (
              <Tag key={`w${i}`} color="#ff5b00">{w}</Tag>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 24 }}>
        {r.skillBreakdown && Object.keys(r.skillBreakdown).length > 0 && (
          <div style={{ ...brBox, padding: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 14 }}>
              СРЕЗ ПО СКИЛЛАМ
            </div>
            {Object.entries(r.skillBreakdown).map(([topic, v]) => (
              <div key={topic} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{topic}</span><span style={{ fontWeight: 800 }}>{v}</span>
                </div>
                <div style={{ height: 4, background: "var(--fg)", opacity: 0.15, position: "relative" }}>
                  <div style={{
                    position: "absolute", inset: 0, width: `${Math.max(0, Math.min(100, v))}%`,
                    background: v >= 70 ? "#34d399" : v >= 50 ? "#e5ff00" : "#ff5b00",
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ ...brBox, padding: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 14 }}>
            РАЗБОР ПО ВОПРОСАМ
          </div>
          {[...session.answers, ...session.coding.map((c) => ({
            questionText: `${c.title} — лайв-кодинг`,
            topic: "CODING",
            aiScore: c.aiScore,
          }))].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.questionText}
                </div>
                <div style={{ fontSize: 10, opacity: 0.55, letterSpacing: "0.15em", marginTop: 2 }}>
                  {a.topic}
                </div>
              </div>
              <div style={{
                width: 70, height: 4, background: "var(--fg)", opacity: 0.15, position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: 0, width: `${(a.aiScore / 10) * 100}%`,
                  background: a.aiScore >= 7 ? "#34d399" : a.aiScore >= 5 ? "#e5ff00" : "#ff5b00",
                }} />
              </div>
              <div style={{ fontWeight: 900, fontSize: 13, width: 40, textAlign: "right" }}>
                {a.aiScore}/10
              </div>
            </div>
          ))}
        </div>
      </div>

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
        <button data-testid="mock-restart-btn" onClick={onRestart} style={btnPrimary}>
          ПРОЙТИ ЕЩЁ РАЗ ↗
        </button>
        <Link to="/tests" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>
          К ТЕСТАМ
        </Link>
      </div>
    </div>
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

/* ----------------------------- Page ----------------------------- */

export default function MockInterview() {
  const [session, setSession] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);
  const [finalizing, setFinalizing] = useState(false);

  // рестор сессии из localStorage (если пользователь обновил страницу)
    useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      apiFetch(`${API}/api/mock/session/${saved}`)
        .then((s) => { if (s?.id) setSession(s); else localStorage.removeItem(LS_KEY); })
        .catch(() => localStorage.removeItem(LS_KEY));
    }
    apiFetch(`${API}/api/mock/rate-limit`).then(setRateLimit).catch(() => setRateLimit(null));
  }, []);

  // автосохранение id
  useEffect(() => {
    if (session?.id) localStorage.setItem(LS_KEY, session.id);
  }, [session?.id]);

  // когда сервер говорит, что стадия finished — автоматически добиваем финалайз
  useEffect(() => {
    if (session?.stage === "finished" && !session.finalReport && !finalizing) {
      setFinalizing(true);
      apiFetch(`${API}/api/mock/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      })
        .then((s) => { if (s?.id) setSession(s); })
        .catch((e) => console.error("finish failed:", e.message))
        .finally(() => setFinalizing(false));
    }
  }, [session?.stage, session?.finalReport, finalizing, session?.id]);

  const restart = () => {
    localStorage.removeItem(LS_KEY);
    setSession(null);
    apiFetch(`${API}/api/mock/rate-limit`).then(setRateLimit).catch(() => {});
  };

  if (!session) return <Setup onStart={setSession} rateLimit={rateLimit} />;
  if (session.stage === "qa") return <ChatStage session={session} onUpdate={setSession} onAdvance={setSession} />;
  if (session.stage === "coding") return <CodingStage session={session} onUpdate={setSession} onAdvance={setSession} />;

  if (finalizing || !session.finalReport) {
    return (
      <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: 24 }}>
        <Crumb stage="result" />
        <div style={{ ...brBox, padding: 32, boxShadow: "8px 8px 0 var(--accent)" }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.05em", marginBottom: 10 }}>
            ИИ СВОДИТ ИТОГИ...
          </div>
          <div style={{ opacity: 0.7, fontSize: 14 }}>Обычно 5-15 секунд.</div>
        </div>
      </div>
    );
  }

  return <ResultStage session={session} onRestart={restart} />;
}