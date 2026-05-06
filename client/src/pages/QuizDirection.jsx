import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
const SIZES = [56, 46, 36, 26, 36, 46, 56];

// цвета по позиции: зел(за) → серый(нейтр) → красный(против)
const STEP_COLORS = [
  "#16a36b", // -3 strongly agree
  "#24c57f", // -2
  "#6fe0a8", // -1
  "#888888", //  0 neutral gray
  "#ff7a7a", // +1
  "#ff4d4d", // +2
  "#d12a2a", // +3 strongly disagree
];

// уникальные цвета под каждое направление — чтобы карточки не повторялись
const DIR_COLOR = {
  frontend: "#ff2d55",
  python:   "#ffd500",
  java:     "#ff5b00",
  qa:       "#24c57f",
  php:      "#8b5cf6",
  default:  "#0ea5e9",
};

export default function QuizDirection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [dirs, setDirs] = useState([]);

  useEffect(() => { api.getDirections().then(setDirs).catch(() => setDirs([])); }, []);

  const pick = (value) => { setAnswers((p) => [...p, value]); setStep((s) => s + 1); };
  const back = () => { if (!step) return; setAnswers((a) => a.slice(0, -1)); setStep((s) => s - 1); };
  const reset = () => { setAnswers([]); setStep(0); };

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
      minHeight: "calc(100vh - 80px)", padding: "120px 28px 60px",
      background: "rgba(10,10,10,0.82)", backdropFilter: "blur(2px)",
      maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column",
    }}>
      {!finished
        ? <QuestionStage step={step} total={QUESTIONS.length} q={QUESTIONS[step].q} onPick={pick} onBack={back} />
        : <Results scores={scores} dirs={dirs} onReset={reset} />
      }
    </div>
  );
}

function CircleButton({ size, color, onClick }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <button
      data-testid="quiz-circle-btn"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: size, height: size, borderRadius: "50%",
        border: `3px solid ${color}`,
        background: active ? color : hover ? `${color}55` : "transparent",
        cursor: "pointer", padding: 0,
        transition: "background 140ms ease, transform 140ms ease, box-shadow 140ms ease",
        transform: hover ? "scale(1.08)" : "scale(1)",
        boxShadow: hover ? `0 0 16px ${color}66` : "none",
      }}
    />
  );
}

function QuestionStage({ step, total, q, onPick, onBack }) {
  const progress = (step / total) * 100;
  const navigate = useNavigate();

  const onExit = () => {
    if (step > 0 && !window.confirm("Выйти из теста? Прогресс не сохранится.")) return;
    navigate("/tests");
  };

  return (
    <div style={{ minHeight: 560, display: "flex", flexDirection: "column", position: "relative" }}>
      {/* фикс: кнопка выхода справа сверху — стиль такой же, как у "ПРЕРВАТЬ СОБЕС" в моке */}
      <button
        type="button"
        data-testid="quiz-exit-btn"
        onClick={onExit}
        style={{
          position: "absolute", top: 650, right: 0, zIndex: 5,
          padding: "10px 16px",
          background: "transparent", color: "#ff5b00",
          border: "2px solid #ff5b00",
          fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer",
          fontFamily: "inherit", fontSize: 13,
          boxShadow: "4px 4px 0 #ff5b00",
          transition: "transform 140ms ease, background 140ms ease, color 140ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ff5b00";
          e.currentTarget.style.color = "#000";
          e.currentTarget.style.transform = "translate(-2px,-2px)";
          e.currentTarget.style.boxShadow = "6px 6px 0 #000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#ff5b00";
          e.currentTarget.style.transform = "translate(0,0)";
          e.currentTarget.style.boxShadow = "4px 4px 0 #ff5b00";
        }}
      >
        ✕ НАЗАД
      </button>

      <div className="mono" style={{
        display: "flex", justifyContent: "space-between", color: "var(--muted)",
        fontSize: 11, letterSpacing: "0.22em", marginBottom: 18,
        paddingRight: 110, // чтобы шапка не залезала под кнопку
      }}>
        <span>ВОПРОС {step + 1} / {total}</span>
        <span style={{ color: "#24c57f" }}>ТЕСТ · НАПРАВЛЕНИЕ</span>
      </div>

      <div style={{ height: 6, background: "var(--bg-2)", border: "1px solid var(--line)", marginBottom: 48 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "#24c57f", transition: "width 300ms ease" }} />
      </div>

      {/* фикс: фиксированная высота блока вопроса → кружки не прыгают */}
      <div style={{ flex: 1, minHeight: 260, display: "flex", alignItems: "center" }}>
        <h1 className="display" style={{
          fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1.15, color: "#fff",
          textShadow: "0 2px 20px rgba(0,0,0,0.9)", margin: 0,
        }}>
          {q}
        </h1>
      </div>

      <div style={{
        marginTop: 32, display: "flex", justifyContent: "center",
        alignItems: "center", gap: 14, flexWrap: "nowrap",
      }}>
        <span className="mono" style={{ color: "#24c57f", whiteSpace: "nowrap" }}>СОГЛАСЕН</span>
        {STEPS.map((v, i) => (
          <CircleButton key={v} size={SIZES[i]} color={STEP_COLORS[i]} onClick={() => onPick(v)} />
        ))}
        <span className="mono" style={{ color: "#d12a2a", whiteSpace: "nowrap" }}>НЕ СОГЛАСЕН</span>
      </div>

      {/* фикс: зона под кнопку "НАЗАД" зарезервирована всегда → первый вопрос не прыгает */}
      <div style={{ marginTop: 40, minHeight: 44 }}>
        {step > 0
          ? <button className="btn-ghost" onClick={onBack}>← НАЗАД</button>
          : <span style={{ visibility: "hidden" }} className="btn-ghost">← НАЗАД</span>
        }
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

  return (
    <div>
      <div className="mono" style={{ color: "#24c57f" }}>› РЕЗУЛЬТАТ</div>
      <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 104px)", color: "#fff" }}>
        ТВОЙ <span style={{ color: "#24c57f" }}>СТЕК</span>
      </h1>
      <p style={{ color: "#cfcfcf", fontSize: 15, maxWidth: 560 }}>Рекомендация на основе шкалы согласия.</p>

      <div style={{
        marginTop: 30, display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20
      }}>
        {top.map((d, i) => {
          const accent = DIR_COLOR[d.slug] || DIR_COLOR.default;
          return (
            <Link
              key={d.id}
              to={`/d/${d.slug}`}
              data-testid={`result-card-${d.slug}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-4px,-4px)";
                e.currentTarget.style.boxShadow = `12px 12px 0 ${accent}`;
                e.currentTarget.style.borderColor = accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = i === 0 ? `8px 8px 0 ${accent}` : "4px 4px 0 var(--line)";
                e.currentTarget.style.borderColor = "var(--fg)";
              }}
              style={{
                position: "relative", overflow: "hidden", padding: 24,
                background: "var(--card)", color: "#fff", border: "2px solid var(--fg)",
                boxShadow: i === 0 ? `8px 8px 0 ${accent}` : "4px 4px 0 var(--line)",
                transition: "transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, border-color 220ms ease",
                cursor: "pointer", textDecoration: "none", display: "block",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, height: 4, width: "100%",
                background: accent, transformOrigin: "left",
                animation: "result-bar 600ms ease forwards",
              }} />
              <style>{`@keyframes result-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>

              <div className="display" style={{ fontSize: 40, color: "#fff" }}>{d.name}</div>
              <p style={{ color: "#cfcfcf", fontSize: 13 }}>{d.description}</p>
              <div style={{
                display: "inline-block", marginTop: 12, padding: "10px 14px",
                background: accent, color: "#000", fontWeight: 700, letterSpacing: "0.12em",
              }}>
                ИЗУЧИТЬ →
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <button className="btn-ghost" onClick={onReset}>ПРОЙТИ ЕЩЁ РАЗ</button>
      </div>
    </div>
  );
}