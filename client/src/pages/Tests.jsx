import React from "react";
import { Link } from "react-router-dom";

const TESTS = [
  {
    id: "mock",
    title: "AI MOCK INTERVIEW",
    tag: "~20 МИН · 5 ВОПРОСОВ + 1 ЛАЙВ-КОДИНГ",
    desc: "Реальное собеседование с ИИ-интервьюером. Он ревьюит строго, как техлид. В конце — оценка, вердикт и что подтянуть в первую очередь.",
    to: "/mock",
    cta: "НАЧАТЬ СОБЕС ↗",
    accent: "#a78bfa",
    status: "READY",
  },
  {
    id: "direction",
    title: "ПРОФОРИЕНТАЦИЯ",
    tag: "10 ВОПРОСОВ · 2 МИН",
    desc: "Шкала «Согласен ↔ Не согласен» в стиле 16personalities. Подберём 3 направления, с которых стоит начать.",
    to: "/quiz-direction",
    cta: "ПРОЙТИ ТЕСТ ↗",
    accent: "#e5ff00",
    status: "READY",
  },
  {
    id: "skill",
    title: "ТВОЙ ГРЕЙД",
    tag: "СКОРО",
    desc: "15 вопросов разной сложности — определим твой текущий уровень: Junior / Middle / Senior.",
    to: null, cta: "В РАЗРАБОТКЕ", accent: "#34d399", status: "WIP",
  },
  {
    id: "softskills",
    title: "SOFT SKILLS",
    tag: "СКОРО",
    desc: "Мини-интервью про коммуникацию, конфликты и работу в команде. Оценка от ИИ.",
    to: null, cta: "В РАЗРАБОТКЕ", accent: "#ff5b00", status: "WIP",
  },
];

export default function Tests() {
  return (
    <div style={{ paddingTop: 120, maxWidth: 1180, margin: "0 auto", padding: "120px 28px 60px" }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--accent-ink)", letterSpacing: "0.24em", marginBottom: 18 }}>
        › ХАБ ТЕСТОВ
      </div>
      <h1 className="display" style={{ fontSize: "clamp(56px, 9vw, 140px)", margin: 0, color: "var(--fg)" }}>
        <span className="glitch" data-text="ТЕСТЫ">ТЕСТЫ</span>
      </h1>


      <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {TESTS.map((t) => {
          const available = Boolean(t.to);
          const Wrap = available ? Link : "div";
          const wrapProps = available ? { to: t.to, "data-testid": `test-${t.id}` } : { "data-testid": `test-${t.id}`, "aria-disabled": true };
          return (
            <Wrap {...wrapProps} key={t.id}
              style={{
                display: "block", padding: 24, color: "var(--fg)", textDecoration: "none",
                background: "var(--card)", border: "2px solid var(--fg)",
                boxShadow: available ? `6px 6px 0 ${t.accent}` : "4px 4px 0 var(--line)",
                opacity: available ? 1 : 0.6, cursor: available ? "pointer" : "not-allowed",
                position: "relative", overflow: "hidden",
              }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: t.accent }} />
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: t.accent }}>
                {t.status === "READY" ? "● ДОСТУПЕН" : "○ В РАЗРАБОТКЕ"}
              </div>
              <div className="display" style={{ fontSize: 34, marginTop: 8, lineHeight: 0.95 }}>{t.title}</div>
              <div className="mono" style={{ marginTop: 8, fontSize: 11, letterSpacing: "0.2em", color: "var(--muted)" }}>{t.tag}</div>
              <p style={{ marginTop: 14, fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.55 }}>{t.desc}</p>
              <div style={{
                marginTop: 18, display: "inline-block",
                padding: "10px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                background: available ? t.accent : "transparent",
                color: available ? "#000" : "var(--muted)",
                border: "2px solid " + (available ? "#000" : "var(--line)"),
                boxShadow: available ? "4px 4px 0 #000" : "none",
              }}>{t.cta}</div>
            </Wrap>
          );
        })}
      </div>


    </div>
  );
}