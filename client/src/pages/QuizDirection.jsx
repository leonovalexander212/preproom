import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";

const QUESTIONS = [
  { q: "Я люблю, когда результат работы можно увидеть сразу.",
    pos: { frontend: 3, "3d-artist": 3, unity: 2, android: 2, seo: 2, "product-manager": 1, php: 1, csharp: 1, cpp: 1 },
    neg: { python: 2, java: 2, devops: 2, "data-engineer": 2, "data-science": 1, rust: 1, go: 1, "1c": 1, "business-analyst": 1, "data-analyst": 1, qa: 1, aqa: 1 } },
  { q: "Меня больше привлекает внутренняя работа, которую пользователи не видят: хранение информации, механизмы, связи между программами.",
    pos: { python: 3, java: 3, cpp: 2, rust: 2, go: 2, devops: 2, "data-engineer": 2, csharp: 1, "data-science": 1, "data-analyst": 1, aqa: 1 },
    neg: { frontend: 2, "3d-artist": 2, seo: 2, unity: 1, android: 1, "product-manager": 1, "business-analyst": 1, "1c": 1, qa: 1, php: 1 } },
  { q: "Мне нравится работать с цифрами и таблицами.",
    pos: { "data-science": 3, "data-analyst": 3, "data-engineer": 2, python: 1, java: 1, "business-analyst": 2, "product-manager": 1, qa: 1, csharp: 1, cpp: 1, rust: 1, go: 1 },
    neg: { frontend: 2, "3d-artist": 2, unity: 1, seo: 1, php: 1, android: 1, "1c": 1, devops: 1, aqa: 1 } },
  { q: "Я хочу чтобы всем вокруг было удобно пользоваться программами и сайтами.",
    pos: { "product-manager": 3, frontend: 2, "business-analyst": 2, android: 2, qa: 1, seo: 1, "3d-artist": 1, unity: 1, php: 1, "data-analyst": 1, java: 1 },
    neg: { cpp: 2, rust: 2, go: 1, devops: 2, "data-engineer": 1, "data-science": 1, "1c": 1, python: 1, aqa: 1, csharp: 1 } },
  { q: "Мне нравится замечать ошибки и проверять, всё ли сделано правильно.",
    pos: { qa: 3, aqa: 3, "data-analyst": 1, "business-analyst": 1, java: 1, python: 1, "data-science": 1, "product-manager": 1 },
    neg: { frontend: 2, "3d-artist": 1, unity: 1, android: 1, seo: 1, php: 1, devops: 1, cpp: 1, rust: 1, go: 1, "1c": 1, csharp: 1, "data-engineer": 1 } },
  { q: "Я предпочитаю работу в большой спокойной компании, а не в небольшом быстро меняющемся коллективе.",
    pos: { java: 3, "1c": 3, csharp: 2, "business-analyst": 2, qa: 1, "data-analyst": 1, "product-manager": 1, "data-science": 1, "data-engineer": 1 },
    neg: { frontend: 2, php: 2, python: 1, go: 1, devops: 1, "3d-artist": 1, unity: 1, android: 1, seo: 1, rust: 1, cpp: 1, aqa: 1 } },
  { q: "Мне интересно поддерживать работу больших систем и следить, чтобы всё функционировало как часы.",
    pos: { devops: 3, "data-engineer": 2, go: 2, aqa: 2, python: 1, java: 1, csharp: 1, cpp: 1, rust: 1, "data-science": 1, "data-analyst": 1 },
    neg: { frontend: 2, "3d-artist": 1, seo: 1, unity: 1, android: 1, php: 1, "1c": 1, "business-analyst": 1, "product-manager": 1, qa: 1 } },
  { q: "Я хорошо умею описывать задачи и договариваться с разными людьми.",
    pos: { "business-analyst": 3, "product-manager": 2, java: 2, "1c": 2, qa: 1, "data-analyst": 1, csharp: 1, "data-science": 1, devops: 1, "data-engineer": 1, seo: 1 },
    neg: { frontend: 2, cpp: 1, rust: 1, go: 1, "3d-artist": 1, unity: 1, android: 1, php: 1, python: 1, aqa: 1 } },
  { q: "Я бы хотел научиться делать игры.",
    pos: { unity: 3, cpp: 2, csharp: 2, "3d-artist": 2, android: 1, frontend: 1, qa: 1, aqa: 1 },
    neg: { python: 2, java: 2, php: 2, "1c": 2, devops: 1, "data-engineer": 1, "data-science": 1, "business-analyst": 1, "product-manager": 1, seo: 1, rust: 1, go: 1, "data-analyst": 1 } },
  { q: "Я бы хотел создавать приложения для телефонов.",
    pos: { android: 3, frontend: 2, unity: 1, "3d-artist": 1, csharp: 1, cpp: 1, qa: 1, aqa: 1, "product-manager": 1 },
    neg: { python: 2, java: 2, php: 2, "1c": 2, devops: 1, "data-engineer": 1, "data-science": 1, rust: 1, go: 1, "business-analyst": 1, seo: 1, "data-analyst": 1 } },
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
  frontend:          "#ff2d55",
  python:            "#ffd500",
  java:              "#ff5b00",
  csharp:            "#a855f7",
  cpp:               "#3b82f6",
  go:                "#06b6d4",
  rust:              "#f97316",
  php:               "#8b5cf6",
  android:           "#22c55e",
  unity:             "#ec4899",
  "1c":              "#eab308",
  devops:            "#0ea5e9",
  "data-engineer":   "#14b8a6",
  qa:                "#24c57f",
  aqa:               "#10b981",
  "data-science":    "#6366f1",
  "data-analyst":    "#f59e0b",
  "business-analyst": "#d946ef",
  "product-manager": "#ef4444",
  seo:               "#84cc16",
  "3d-artist":       "#c084fc",
  default:           "#64748b",
};

// Все направления квиза (кроме reverse-engineer и ai-engineer)
const QUIZ_DIRECTIONS = [
  { slug: "python",            name: "Python",            description: "Backend, data science, автоматизация" },
  { slug: "frontend",          name: "Frontend",          description: "React, TypeScript, интерфейсы" },
  { slug: "java",              name: "Java",              description: "Enterprise разработка, Spring" },
  { slug: "csharp",            name: "C# / .NET",         description: "Корпоративные приложения, игры" },
  { slug: "cpp",               name: "C++",               description: "Системное программирование, игры" },
  { slug: "go",                name: "Go",                description: "Высоконагруженные сервисы, микросервисы" },
  { slug: "rust",              name: "Rust",              description: "Системный язык с безопасной памятью" },
  { slug: "php",               name: "PHP",               description: "Веб-разработка, CMS, бэкенд сайтов" },
  { slug: "android",           name: "Android",           description: "Kotlin, Java, мобильная разработка" },
  { slug: "unity",             name: "Unity / Game Dev",  description: "Разработка игр на Unity Engine" },
  { slug: "1c",                name: "1C",                description: "Разработка в платформе 1C" },
  { slug: "devops",            name: "DevOps",            description: "CI/CD, Docker, Kubernetes, облака" },
  { slug: "data-engineer",     name: "Data Engineer",     description: "ETL, data pipelines, хранилища данных" },
  { slug: "qa",                name: "QA",                description: "Ручное тестирование, чек-листы, баг-репорты" },
  { slug: "aqa",               name: "AQA / Automation",  description: "Автотесты на Selenium, Playwright, pytest" },
  { slug: "data-science",      name: "Data Science",      description: "ML, статистика, исследование данных" },
  { slug: "data-analyst",      name: "Data Analyst",      description: "SQL, дашборды, метрики продукта" },
  { slug: "business-analyst",  name: "Business Analyst",  description: "Требования, процессы, постановка задач" },
  { slug: "product-manager",   name: "Product Manager",   description: "Продуктовая стратегия, roadmap, метрики" },
  { slug: "seo",               name: "SEO Specialist",    description: "Поисковая оптимизация, контент, ссылки" },
  { slug: "3d-artist",         name: "3D Artist",         description: "Моделирование, текстурирование, рендер" },
];

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
    <div className="quiz-direction-wrap" style={{
      minHeight: "calc(100vh - 80px)", padding: "120px 28px 60px",
      backdropFilter: "blur(2px)",
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
  const isTouching = React.useRef(false);
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <button
      data-testid="quiz-circle-btn"
      onClick={() => { setHover(false); setActive(false); onClick(); }}
      onMouseEnter={() => { if (!isTouching.current) setHover(true); }}
      onMouseLeave={() => { setHover(false); setActive(false); isTouching.current = false; }}
      onMouseDown={() => { if (!isTouching.current) setActive(true); }}
      onMouseUp={() => setActive(false)}
      onTouchStart={() => { isTouching.current = true; setActive(true); }}
      onTouchEnd={() => { setHover(false); setActive(false); setTimeout(() => { isTouching.current = false; }, 400); }}
      style={{
        width: size, height: size, borderRadius: "50%",
        border: `3px solid ${color}`,
        background: active ? color : hover ? `${color}55` : "transparent",
        cursor: "pointer", padding: 0,
        WebkitTapHighlightColor: "transparent",
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
    navigate("/tests");
  };

  return (
    <div style={{ minHeight: 560, display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Top bar: counter + label + exit button — all inside panel flow */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="mono" style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.22em" }}>
          <div>ВОПРОС</div>
          <div>{step + 1} / {total}</div>
        </div>
        <span className="mono" style={{ color: "#24c57f", fontSize: 11, letterSpacing: "0.22em" }}>ТЕСТ · НАПРАВЛЕНИЕ</span>
        <button
          type="button"
          data-testid="quiz-exit-btn"
          onClick={onExit}
          style={{
            padding: "10px 14px",
            background: "transparent", color: "#ff5b00",
            border: "2px solid #ff5b00",
            fontWeight: 800, cursor: "pointer",
            fontFamily: "inherit", fontSize: 16,
            boxShadow: "4px 4px 0 #ff5b00",
            transition: "transform 140ms ease, background 140ms ease, color 140ms ease",
            lineHeight: 1,
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
          ←
        </button>
      </div>

      <div style={{ height: 6, background: "var(--bg-2)", border: "1px solid var(--line)", marginBottom: 48 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "#24c57f", transition: "width 300ms ease" }} />
      </div>

      <div style={{ flex: 1, minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h1
          className="display quiz-direction-question-title"
          data-testid="quiz-direction-question-title"
          style={{
            fontSize: "clamp(26px, 4vw, 44px)",
            lineHeight: 1.15,
            color: "#fff",
            textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            margin: 0,
            textAlign: "center",
            width: "100%",
          }}
        >
          {q}
        </h1>
      </div>

      <div className="quiz-circles-row" style={{
        marginTop: 32, display: "flex", justifyContent: "center",
        alignItems: "center", gap: 14, flexWrap: "nowrap",
      }}>
        <span className="mono quiz-circle-label" style={{ color: "#24c57f", whiteSpace: "nowrap", fontSize: 11 }}>СОГЛАСЕН</span>
        {STEPS.map((v, i) => (
          <CircleButton key={`${step}-${v}`} size={SIZES[i]} color={STEP_COLORS[i]} onClick={() => onPick(v)} />
        ))}
        <span className="mono quiz-circle-label" style={{ color: "#d12a2a", whiteSpace: "nowrap", fontSize: 11 }}>НЕ СОГЛАСЕН</span>
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
  const result = new Set(dirs.map((d) => d.slug));

  const ranked = QUIZ_DIRECTIONS
    .map((d) => ({ ...d, score: scores[d.slug] || 0, hasData: result.has(d.slug) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const top = ranked;

  return (
    <div>
      <div className="mono quiz-result-kicker" style={{ color: "#24c57f", marginBottom: 5 }}>› РЕЗУЛЬТАТ</div>

      <h1 className="display quiz-result-title" style={{ fontSize: "clamp(48px, 8vw, 104px)", color: "var(--fg)" }}>
        ТВОЙ <span style={{ color: "#24c57f" }}>СТЕК</span>
      </h1>

      <p className="quiz-result-lead" style={{ color: "var(--fg-dim)", fontSize: 15, maxWidth: 560 }}>
        Рекомендация на основе шкалы согласия.
      </p>

      <div style={{
        marginTop: 30,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {top.map((d, i) => {
          const accent = DIR_COLOR[d.slug] || DIR_COLOR.default;
          const isFirst = i === 0;

          const cardStyle = {
            position: "relative",
            overflow: "hidden",
            padding: 24,
            background: "var(--card)",
            color: "var(--fg)",
            border: "2px solid var(--fg)",
            boxShadow: isFirst ? `8px 8px 0 ${accent}` : "4px 4px 0 var(--line)",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
          };

          const topBar = (
            <div style={{
              position: "absolute",
              top: 0, left: 0, height: 4, width: "100%",
              background: accent,
              transformOrigin: "left",
              animation: "result-bar 600ms ease forwards",
            }} />
          );

          const content = (
            <>
              {topBar}
              <style>{`@keyframes result-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>

              <div className="display quiz-result-card-title" style={{ fontSize: "clamp(26px, 3.5vw, 34px)", color: "var(--fg)", lineHeight: 1.1, wordBreak: "break-word", overflowWrap: "break-word" }}>
                {d.name}
              </div>

              <div style={{ flex: 1, minHeight: 0 }}>
                <p className="quiz-result-card-desc" style={{ color: "var(--fg-dim)", fontSize: 13, margin: 0, wordBreak: "break-word", overflowWrap: "break-word" }}>
                  {d.description}
                </p>
              </div>

              {d.hasData ? (
                <div style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "10px 14px",
                  background: accent,
                  color: "#000",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}>
                  ИЗУЧИТЬ →
                </div>
              ) : (
                <div style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "var(--bg-2)",
                  color: "var(--muted)",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  border: "2px dashed var(--line)",
                }}>
                  СКОРО
                </div>
              )}
            </>
          );

          if (d.hasData) {
            return (
              <Link
                key={d.slug}
                to={`/d/${d.slug}`}
                data-testid={`result-card-${d.slug}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-4px,-4px)";
                  e.currentTarget.style.boxShadow = `12px 12px 0 ${accent}`;
                  e.currentTarget.style.borderColor = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0,0)";
                  e.currentTarget.style.boxShadow = isFirst ? `8px 8px 0 ${accent}` : "4px 4px 0 var(--line)";
                  e.currentTarget.style.borderColor = "var(--fg)";
                }}
                style={{
                  ...cardStyle,
                  cursor: "pointer",
                  transition: "transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, border-color 220ms ease",
                }}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={d.slug}
              data-testid={`result-card-${d.slug}`}
              style={{
                ...cardStyle,
                cursor: "default",
                opacity: 0.75,
              }}
            >
              {content}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <button className="btn-ghost" onClick={onReset}>ПРОЙТИ ЕЩЁ РАЗ</button>
      </div>
    </div>
  );
}