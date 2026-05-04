import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api.js";

const POOL_SIZE = 10;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const [params] = useSearchParams();
  const direction = params.get("direction");
  const [pool, setPool] = useState(null);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!direction) return;
    api.getDirectionQuestions(direction)
      .then((d) => setPool(shuffle(d.questions).slice(0, POOL_SIZE)))
      .catch((e) => setError(e.message));
  }, [direction]);

  const current = pool?.[idx];
  const finished = pool && idx >= pool.length;

  const next = (correct) => {
    if (correct) setScore((s) => s + 1);
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  if (!direction) {
    return (
      <div style={{ paddingTop: 160, textAlign: "center", color: "var(--fg-dim)" }}>
        <div className="mono">// УКАЖИ ?direction=…</div>
        <Link to="/tests" className="btn-brutal" style={{ marginTop: 30 }}>К ВЫБОРУ →</Link>
      </div>
    );
  }
  if (error) return <div className="mono" style={{ paddingTop: 160, textAlign: "center", color: "var(--danger)" }}>// {error}</div>;
  if (!pool) return <div className="mono" style={{ paddingTop: 160, textAlign: "center", color: "var(--muted)", letterSpacing: "0.2em" }}>// ГОТОВЛЮ ВОПРОСЫ...</div>;

  if (finished) {
    return (
      <div style={{ paddingTop: 160, maxWidth: 720, margin: "0 auto", padding: "160px 28px 0" }}>
        <div className="mono" style={{ color: "var(--accent-ink)", letterSpacing: "0.22em", fontSize: 11 }}>› РЕЗУЛЬТАТ</div>
        <h1 className="display" style={{ fontSize: "clamp(64px, 10vw, 140px)", margin: "10px 0", color: "var(--fg)" }}>
          {score}<span style={{ color: "var(--accent-ink)" }}>/</span>{pool.length}
        </h1>
        <p style={{ color: "var(--fg-dim)", fontSize: 15, marginBottom: 30 }}>
          {score === pool.length ? "ПРЕВОСХОДНО. Ты прошёл квиз без ошибок." :
           score >= pool.length * 0.7 ? "Отличный результат — ещё чуть-чуть до идеала." :
           "Есть, над чем поработать. Возвращайся к теории и попробуй снова."}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to={`/tests/quiz?direction=${direction}`} className="btn-brutal" onClick={() => window.location.reload()}>ЕЩЁ РАЗ ↺</Link>
          <Link to="/tests" className="btn-ghost">К ВЫБОРУ →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 120, maxWidth: 880, margin: "0 auto", padding: "120px 28px 0" }}>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: 11, letterSpacing: "0.22em", marginBottom: 18 }}>
        <span>ВОПРОС {idx + 1} / {pool.length}</span>
        <span style={{ color: "var(--accent-ink)" }}>СЧЁТ: {score}</span>
      </div>
      <div style={{ height: 6, background: "var(--bg-2)", border: "1px solid var(--line)", marginBottom: 30 }}>
        <div style={{ width: `${(idx / pool.length) * 100}%`, height: "100%", background: "var(--accent)", transition: "width 300ms" }} />
      </div>
      <div className="card-brutal" style={{ padding: 30 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--accent-ink)" }}>{current.difficulty || "—"} · {current.type}</div>
        <div className="display" style={{ fontSize: 28, marginTop: 16, lineHeight: 1.15 }}>{current.text}</div>

        {revealed && current.answer && (
          <div style={{ marginTop: 22, padding: 18, border: "2px solid var(--fg)", background: "var(--bg-2)" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--accent-ink)", marginBottom: 10 }}>// ЭТАЛОННЫЙ ОТВЕТ</div>
            <div style={{ color: "var(--fg-dim)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{current.answer}</div>
          </div>
        )}

        <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {!revealed ? (
            <button className="btn-brutal" onClick={() => setRevealed(true)} data-testid="quiz-reveal">ПОКАЗАТЬ ОТВЕТ</button>
          ) : (
            <>
              <button className="btn-brutal" onClick={() => next(true)} data-testid="quiz-correct">ЗНАЛ ✓</button>
              <button className="btn-ghost" onClick={() => next(false)} data-testid="quiz-wrong">НЕ ЗНАЛ ✕</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}