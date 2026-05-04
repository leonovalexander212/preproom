import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

const QUESTIONS = [
  { q: "Мне важно, чтобы результат моей работы можно было показать и потрогать визуально.",
    pos: { frontend: 3 }, neg: { python: 1, java: 1 } },
  { q: "Я получаю удовольствие, когда ищу мелкие несоответствия и ошибки в чужой работе.",
    pos: { qa: 3 }, neg: { frontend: 1 } },
  { q: "Мне интереснее разбираться, почему что-то работает, чем как это выглядит.",
    pos: { python: 2, java: 2 }, neg: { frontend: 2 } },
  { q: "Я скорее доведу до идеала одну вещь, чем сделаю десять «сойдёт».",
    pos: { qa: 2, java: 2 }, neg: { php: 1 } },
  { q: "Мне комфортно работать с числами, графиками и закономерностями.",
    pos: { python: 3 }, neg: { frontend: 1 } },
  { q: "Я чаще выбираю стабильность и предсказуемость, чем хаос стартапа.",
    pos: { java: 3, qa: 1 }, neg: { frontend: 1, php: 1 } },
  { q: "Мне нравится быстро собирать сайты и видеть их онлайн уже сегодня.",
    pos: { php: 3, frontend: 2 }, neg: { java: 2 } },
  { q: "Я легче запоминаю логику через картинки и макеты, чем через текст.",
    pos: { frontend: 3 }, neg: { python: 1, java: 1 } },
  { q: "Мне приятно автоматизировать рутину скриптами.",
    pos: { python: 3, qa: 1 }, neg: {} },
  { q: "Я спокойно читаю длинную документацию, если она реально нужна для задачи.",
    pos: { java: 2, python: 1, qa: 1 }, neg: {} },
];

const STEPS = [-3, -2, -1, 0, 1, 2, 3];

const COLORS_LEFT  = ["#16a36b", "#24c57f", "#6fe0a8"];
const COLORS_RIGHT = ["#16a36b", "#24c57f", "#6fe0a8"];

const SIZES = [56, 46, 36, 26, 36, 46, 56];

export default function QuizDirection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [dirs, setDirs] = useState([]);

  useEffect(() => {
    api.getDirections().then(setDirs).catch(() => setDirs([]));
  }, []);

  const pick = (value) => {
    setAnswers((prev) => [...prev, value]);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 0) return;
    setAnswers((a) => a.slice(0, -1));
    setStep((s) => s - 1);
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  const finished = step >= QUESTIONS.length;

  const scores = {};
  answers.forEach((val, i) => {
    if (val === 0) return;
    const { pos, neg } = QUESTIONS[i];
    const target = val < 0 ? pos : neg;
    const strength = Math.abs(val);

    Object.entries(target || {}).forEach(([k, v]) => {
      scores[k] = (scores[k] || 0) + v * strength;
    });
  });

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      padding: "120px 28px 60px",
      background: "rgba(10,10,10,0.82)",
      backdropFilter: "blur(2px)",
      maxWidth: 960,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
    }}>
      {!finished ? (
        <QuestionStage step={step} total={QUESTIONS.length} q={QUESTIONS[step].q} onPick={pick} onBack={back} />
      ) : (
        <Results scores={scores} dirs={dirs} onReset={reset} />
      )}
    </div>
  );
}

function QuestionStage({ step, total, q, onPick, onBack }) {
  const progress = (step / total) * 100;

  return (
    <div style={{ minHeight: 520, display: "flex", flexDirection: "column" }}>
      <div className="mono" style={{
        display: "flex",
        justifyContent: "space-between",
        color: "var(--muted)",
        fontSize: 11,
        letterSpacing: "0.22em",
        marginBottom: 18
      }}>
        <span>ВОПРОС {step + 1} / {total}</span>
        <span style={{ color: "#24c57f" }}>ТЕСТ · НАПРАВЛЕНИЕ</span>
      </div>

      <div style={{ height: 6, background: "var(--bg-2)", border: "1px solid var(--line)", marginBottom: 48 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "#24c57f" }} />
      </div>

      <h1 className="display" style={{
        fontSize: "clamp(26px, 4vw, 44px)",
        lineHeight: 1.15,
        color: "#fff",
        textShadow: "0 2px 20px rgba(0,0,0,0.9)"
      }}>
        {q}
      </h1>

      <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 14 }}>
        <span className="mono" style={{ color: "#24c57f" }}>СОГЛАСЕН</span>

        {STEPS.map((v, i) => {
          const size = SIZES[i];
          const color = "#24c57f";

          return (
            <button
              key={v}
              onClick={() => onPick(v)}
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: `3px solid ${color}`,
                background: "transparent",
                cursor: "pointer",
              }}
            />
          );
        })}

        <span className="mono" style={{ color: "#16a36b" }}>НЕ СОГЛАСЕН</span>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 40 }}>
        {step > 0 && <button className="btn-ghost" onClick={onBack}>← НАЗАД</button>}
      </div>
    </div>
  );
}

function Results({ scores, dirs, onReset }) {
  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => dirs.find((d) => d.slug === slug))
    .filter(Boolean);

  const top = ranked.slice(0, 3);

  const ACCENTS = ["#24c57f", "#16a36b", "#0ea5e9"];

  return (
    <div>
      <div className="mono" style={{ color: "#24c57f" }}>› РЕЗУЛЬТАТ</div>

      <h1 className="display" style={{
        fontSize: "clamp(48px, 8vw, 104px)",
        color: "#fff"
      }}>
        ТВОЙ <span style={{ color: "#24c57f" }}>СТЕК</span>
      </h1>

      <p style={{ color: "#cfcfcf", fontSize: 15, maxWidth: 560 }}>
        Рекомендация на основе шкалы согласия.
      </p>

      <div style={{
        marginTop: 30,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20
      }}>
        {top.map((d, i) => {
          const accent = ACCENTS[i] || "#888";

          return (
            <div
              key={d.id}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-4px,-4px)";
                e.currentTarget.style.boxShadow = `12px 12px 0 ${accent}`;
                e.currentTarget.style.borderColor = accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow =
                  i === 0 ? `8px 8px 0 ${accent}` : "4px 4px 0 var(--line)";
                e.currentTarget.style.borderColor = "var(--fg)";
              }}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: 24,
                background: "var(--card)",
                color: "#fff",
                border: "2px solid var(--fg)",
                boxShadow:
                  i === 0 ? `8px 8px 0 ${accent}` : "4px 4px 0 var(--line)",
                transition:
                  "transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, border-color 220ms ease",
                cursor: "pointer",
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: 4,
                width: "100%",
                background: accent,
                transformOrigin: "left",
                animation: "result-bar 600ms ease forwards",
              }} />

              <style>{`
                @keyframes result-bar {
                  from { transform: scaleX(0); }
                  to { transform: scaleX(1); }
                }
              `}</style>

              <div className="display" style={{ fontSize: 40 }}>
                {d.name}
              </div>

              <p style={{ color: "#cfcfcf", fontSize: 13 }}>
                {d.description}
              </p>

              <Link to={`/d/${d.slug}`} style={{
                display: "inline-block",
                marginTop: 12,
                padding: "10px 14px",
                background: accent,
                color: "#000",
                textDecoration: "none",
                fontWeight: 700
              }}>
                ИЗУЧИТЬ
              </Link>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <button className="btn-ghost" onClick={onReset}>
          ПРОЙТИ ЕЩЁ РАЗ
        </button>
      </div>
    </div>
  );
}