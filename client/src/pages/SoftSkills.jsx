import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const TRAITS = {
  clarity: { label: "Ясность", color: "#e5ff00" },
  empathy: { label: "Эмпатия", color: "#24c57f" },
  ownership: { label: "Ответственность", color: "#ff5b00" },
  conflict: { label: "Конфликты", color: "#ff2d55" },
  structure: { label: "Структура", color: "#7dd3fc" },
};

const QUESTIONS = [
  {
    scene: "Дедлайн горит, задача крупнее, чем казалась. Тимлид спрашивает: “успеешь?”",
    pressure: "Ограниченное время",
    options: [
      { text: "Скажу “да”, а потом попробую догнать ночью.", impact: { ownership: 1, clarity: -2, structure: -1 } },
      { text: "Покажу текущий статус, риски и предложу урезать scope до MVP.", impact: { clarity: 2, ownership: 2, structure: 2 } },
      { text: "Отвечу, что не моя вина: требования постоянно менялись.", impact: { ownership: -2, conflict: -1, empathy: -1 } },
      { text: "Попрошу ещё пару дней без деталей, чтобы не создавать панику.", impact: { clarity: -1, empathy: 1, structure: -1 } },
    ],
  },
  {
    scene: "Коллега публично критикует твой подход на созвоне.",
    pressure: "Публичное напряжение",
    options: [
      { text: "Спокойно уточню факты и предложу разобрать варианты после созвона.", impact: { conflict: 2, clarity: 2, empathy: 1 } },
      { text: "Отвечу жёстко, чтобы не выглядело, будто я слабее.", impact: { conflict: -2, empathy: -2, clarity: -1 } },
      { text: "Промолчу, но потом перестану вовлекать его в обсуждения.", impact: { conflict: -1, empathy: -1, ownership: -1 } },
      { text: "Соглашусь со всем, даже если не согласен, чтобы быстрее закончить.", impact: { clarity: -2, conflict: -1, empathy: 1 } },
    ],
  },
  {
    scene: "На ревью тебе оставили 18 комментариев. Часть кажется вкусовщиной.",
    pressure: "Обратная связь",
    options: [
      { text: "Разделю комментарии на баги, стиль и вопросы; спорное вынесу в короткий тред.", impact: { structure: 2, clarity: 2, conflict: 1 } },
      { text: "Исправлю всё молча, чтобы не спорить.", impact: { empathy: 1, clarity: -1, ownership: 1 } },
      { text: "Напишу, что ревью слишком придирчивое и блокирует работу.", impact: { conflict: -2, empathy: -1, ownership: -1 } },
      { text: "Выберу только те пункты, с которыми согласен, остальное проигнорирую.", impact: { ownership: -2, clarity: -1, structure: -1 } },
    ],
  },
  {
    scene: "Продакт просит “маленькую правку”, но ты видишь риск сломать соседний сценарий.",
    pressure: "Неясные требования",
    options: [
      { text: "Опишу риск, предложу быстрый безопасный вариант и проверочный чек-лист.", impact: { ownership: 2, structure: 2, clarity: 2 } },
      { text: "Сделаю как просят: ответственность за решение на продакте.", impact: { ownership: -1, empathy: -1, structure: -1 } },
      { text: "Откажусь делать, пока не будет полного ТЗ.", impact: { clarity: 1, ownership: -1, conflict: -1 } },
      { text: "Сначала уточню цель правки и критерий успеха, потом оценю риск.", impact: { clarity: 2, empathy: 1, structure: 1 } },
    ],
  },
  {
    scene: "Новичок в команде третий раз задаёт похожий вопрос.",
    pressure: "Наставничество",
    options: [
      { text: "Дам ссылку на документацию без объяснений: пусть учится искать.", impact: { empathy: -2, clarity: -1 } },
      { text: "Разберу пример, а потом предложу ему самому написать короткую памятку.", impact: { empathy: 2, structure: 2, ownership: 1 } },
      { text: "Сделаю задачу за него, чтобы не терять время команды.", impact: { empathy: 1, ownership: -1, structure: -1 } },
      { text: "Попрошу тимлида заменить ему задачу на проще.", impact: { empathy: -1, ownership: -1, conflict: -1 } },
    ],
  },
  {
    scene: "Ты понял, что вчера дал неверную оценку задачи.",
    pressure: "Ошибка в прогнозе",
    options: [
      { text: "Сразу обновлю оценку, объясню причину и предложу новый план.", impact: { ownership: 2, clarity: 2, structure: 1 } },
      { text: "Подожду до следующего стендапа: вдруг успею наверстать.", impact: { clarity: -2, ownership: -1 } },
      { text: "Скажу, что оценка была предварительной, поэтому проблема не во мне.", impact: { ownership: -2, conflict: -1 } },
      { text: "Сначала сам найду самый дешёвый компромисс, потом принесу варианты.", impact: { structure: 2, ownership: 1, clarity: 1 } },
    ],
  },
  {
    scene: "Команда спорит: быстро выпустить фичу или дополировать качество.",
    pressure: "Конфликт приоритетов",
    options: [
      { text: "Предложу критерии решения: риск, влияние на пользователя, стоимость отката.", impact: { structure: 2, clarity: 2, conflict: 1 } },
      { text: "Встану на сторону большинства, чтобы не затягивать.", impact: { conflict: 1, clarity: -1, ownership: -1 } },
      { text: "Буду настаивать на качестве: выпускать сырой продукт нельзя.", impact: { ownership: 1, empathy: -1, conflict: -1 } },
      { text: "Соберу короткий эксперимент: что можно проверить за день до решения.", impact: { structure: 2, ownership: 2, empathy: 1 } },
    ],
  },
  {
    scene: "В чате клиент пишет резко и обвиняет команду в непрофессионализме.",
    pressure: "Эмоциональный клиент",
    options: [
      { text: "Признаю эмоцию, зафиксирую факты и дам следующий конкретный шаг.", impact: { empathy: 2, clarity: 2, conflict: 2 } },
      { text: "Отвечу формально: “ваше обращение принято”.", impact: { empathy: -1, clarity: 1, conflict: -1 } },
      { text: "Объясню, что клиент сам поздно дал данные.", impact: { ownership: -1, empathy: -2, conflict: -2 } },
      { text: "Не буду отвечать без менеджера, чтобы не усугубить.", impact: { structure: 1, ownership: -1, clarity: -1 } },
    ],
  },
  {
    scene: "На дейли ты застрял, но причина пока не ясна.",
    pressure: "Блокер",
    options: [
      { text: "Скажу “разбираюсь”, деталей нет — не хочу шуметь раньше времени.", impact: { clarity: -1, structure: -1 } },
      { text: "Назову гипотезы, что уже проверил, и кого/что нужно для разблокировки.", impact: { clarity: 2, structure: 2, ownership: 2 } },
      { text: "Попрошу созвон всей команды прямо сейчас.", impact: { ownership: 1, empathy: -1, structure: -1 } },
      { text: "Сменю задачу, а эту оставлю до момента, когда появится вдохновение.", impact: { ownership: -2, structure: -2 } },
    ],
  },
  {
    scene: "Тебе нужно объяснить сложное техническое решение не техническому стейкхолдеру.",
    pressure: "Перевод с технарского",
    options: [
      { text: "Начну с бизнес-эффекта, затем дам аналогию и только потом детали.", impact: { clarity: 2, empathy: 2, structure: 1 } },
      { text: "Покажу диаграмму компонентов: так точнее.", impact: { structure: 1, clarity: -1 } },
      { text: "Скажу, что это внутренние технические детали.", impact: { empathy: -1, clarity: -2 } },
      { text: "Подготовлю два варианта: короткий summary и deep dive по запросу.", impact: { clarity: 2, structure: 2, empathy: 1 } },
    ],
  },
  {
    scene: "В задаче обнаружился баг после релиза, и его нашёл пользователь.",
    pressure: "Инцидент",
    options: [
      { text: "Сначала фикс, потом разбор: что пропустили и как не повторить.", impact: { ownership: 2, structure: 2, clarity: 1 } },
      { text: "Буду искать, кто именно внёс ошибку.", impact: { conflict: -2, empathy: -1, structure: -1 } },
      { text: "Напишу пользователю техническое объяснение, почему так вышло.", impact: { clarity: 1, empathy: -1 } },
      { text: "Предложу публичный статус: признали, исправляем, ETA такой-то.", impact: { clarity: 2, ownership: 1, empathy: 1 } },
    ],
  },
  {
    scene: "Ты не согласен с решением лида, но команда уже почти договорилась.",
    pressure: "Несогласие с авторитетом",
    options: [
      { text: "Коротко обозначу риск, предложу критерий проверки и поддержу финальное решение.", impact: { conflict: 2, clarity: 2, ownership: 2 } },
      { text: "Промолчу: если решение плохое, потом будет видно.", impact: { ownership: -2, clarity: -1, conflict: -1 } },
      { text: "Продолжу спорить, пока все не увидят слабые места.", impact: { clarity: 1, conflict: -2, empathy: -1 } },
      { text: "Напишу лиду отдельно после встречи, чтобы не спорить при всех.", impact: { empathy: 1, conflict: 1, clarity: -1 } },
    ],
  },
];

const ARCHETYPES = [
  {
    id: "navigator",
    title: "Командный навигатор",
    condition: (s) => s.clarity >= 68 && s.empathy >= 62 && s.structure >= 58,
    summary: "Ты хорошо переводишь хаос в понятные шаги, слышишь людей и держишь разговор в рабочем русле.",
    advice: "Развивай фасилитацию: бери сложные обсуждения, где нужно собрать разные позиции и довести до решения.",
  },
  {
    id: "owner",
    title: "Антикризисный драйвер",
    condition: (s) => s.ownership >= 70 && s.structure >= 58,
    summary: "Ты склонен брать ответственность и быстро превращать проблему в план действий.",
    advice: "Следи, чтобы скорость не превращалась в давление на окружающих: добавляй больше проверки ожиданий.",
  },
  {
    id: "diplomat",
    title: "Дипломат команды",
    condition: (s) => s.empathy >= 70 && s.conflict >= 58,
    summary: "Ты умеешь снижать градус напряжения и сохранять контакт даже в неприятных разговорах.",
    advice: "Не бойся быть конкретнее: мягкость становится сильнее, когда рядом есть чёткие договорённости.",
  },
  {
    id: "architect",
    title: "Архитектор процессов",
    condition: (s) => s.structure >= 72,
    summary: "Ты ищешь систему, критерии и повторяемый процесс там, где другие видят только спор мнений.",
    advice: "Добавляй больше эмоционального контекста: иногда людям важно сначала почувствовать, что их услышали.",
  },
  {
    id: "builder",
    title: "Растущий практик",
    condition: () => true,
    summary: "База уже есть, но результат сильно зависит от ситуации: где-то ты берёшь лидерство, где-то уходишь в тень.",
    advice: "Выбери один навык на ближайшие две недели: ясные апдейты, спокойный конфликт или раннее поднятие рисков.",
  },
];

const INITIAL_SCORES = Object.fromEntries(Object.keys(TRAITS).map((key) => [key, 0]));
const MAX_PER_TRAIT = QUESTIONS.length * 2;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildScores(answers) {
  const raw = { ...INITIAL_SCORES };
  answers.forEach((answerIndex, questionIndex) => {
    const option = QUESTIONS[questionIndex]?.options[answerIndex];
    if (!option) return;
    Object.entries(option.impact).forEach(([trait, value]) => {
      raw[trait] += value;
    });
  });

  const normalized = {};
  Object.keys(TRAITS).forEach((trait) => {
    normalized[trait] = Math.round(clamp(((raw[trait] + MAX_PER_TRAIT) / (MAX_PER_TRAIT * 2)) * 100, 0, 100));
  });
  return normalized;
}

function pickArchetype(scores) {
  return ARCHETYPES.find((type) => type.condition(scores));
}

function getSignal(scores) {
  const entries = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const [weakTrait, weakValue] = entries[0];
  const [strongTrait, strongValue] = entries[entries.length - 1];

  const scripts = {
    clarity: "Перед ответом формулируй: статус, риск, следующий шаг. Это резко снижает шум в коммуникации.",
    empathy: "Добавляй фразу признания контекста: “вижу, почему это важно/неприятно”. После неё проще обсуждать факты.",
    ownership: "Раньше поднимай риски и приходи с вариантами, а не только с проблемой.",
    conflict: "В конфликте отделяй человека от решения: спорь с риском, а не с личностью.",
    structure: "Используй мини-рамку: цель, ограничения, варианты, критерий выбора.",
  };

  return {
    weakTrait,
    weakValue,
    strongTrait,
    strongValue,
    script: scripts[weakTrait],
  };
}

function ProgressBar({ current, total }) {
  const width = (current / total) * 100;
  return (
    <div data-testid="soft-progress-shell" style={{ height: 8, background: "var(--bg-2)", border: "2px solid var(--fg)", overflow: "hidden" }}>
      <div data-testid="soft-progress-bar" style={{ width: `${width}%`, height: "100%", background: "#ff5b00", transition: "width 260ms ease" }} />
    </div>
  );
}

function ScoreBar({ trait, value }) {
  const meta = TRAITS[trait];
  return (
    <div data-testid={`soft-score-row-${trait}`} style={{ border: "2px solid var(--fg)", background: "var(--card)", padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
        <span data-testid={`soft-score-label-${trait}`} className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: meta.color }}>{meta.label}</span>
        <span data-testid={`soft-score-value-${trait}`} className="display" style={{ fontSize: 26 }}>{value}</span>
      </div>
      <div style={{ marginTop: 10, height: 10, background: "var(--bg-2)", border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: meta.color, transition: "width 500ms ease" }} />
      </div>
    </div>
  );
}

function Radar({ scores }) {
  const traits = Object.keys(TRAITS);
  const points = traits.map((trait, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / traits.length;
    const radius = 34 + scores[trait] * 0.55;
    const x = 100 + Math.cos(angle) * radius;
    const y = 100 + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div data-testid="soft-radar-card" style={{ border: "2px solid var(--fg)", background: "#050505", padding: 18, boxShadow: "8px 8px 0 #ff5b00" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "#ff5b00", marginBottom: 12 }}>SOFT RADAR</div>
      <svg data-testid="soft-radar-chart" viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 320, display: "block", margin: "0 auto" }}>
        {[85, 62, 40].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        ))}
        {traits.map((trait, index) => {
          const angle = -Math.PI / 2 + (index * Math.PI * 2) / traits.length;
          const x = 100 + Math.cos(angle) * 88;
          const y = 100 + Math.sin(angle) * 88;
          const labelX = 100 + Math.cos(angle) * 105;
          const labelY = 100 + Math.sin(angle) * 105;
          return (
            <g key={trait}>
              <line x1="100" y1="100" x2={x} y2={y} stroke="rgba(255,255,255,0.12)" />
              <text x={labelX} y={labelY} fill={TRAITS[trait].color} fontSize="8" textAnchor="middle" dominantBaseline="middle">{TRAITS[trait].label}</text>
            </g>
          );
        })}
        <polygon points={points} fill="rgba(255,91,0,0.32)" stroke="#ff5b00" strokeWidth="3" />
        <circle cx="100" cy="100" r="3" fill="#e5ff00" />
      </svg>
    </div>
  );
}

function QuestionStage({ step, answers, onPick, onBack }) {
  const question = QUESTIONS[step];
  return (
    <div data-testid="soft-question-stage" style={{ maxWidth: 980, margin: "0 auto", padding: "120px 28px 64px" }}>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 16, color: "var(--muted)", fontSize: 11, letterSpacing: "0.2em", marginBottom: 18, flexWrap: "wrap" }}>
        <span data-testid="soft-question-counter">СЦЕНАРИЙ {step + 1} / {QUESTIONS.length}</span>
        <span data-testid="soft-question-pressure" style={{ color: "#ff5b00" }}>{question.pressure}</span>
      </div>

      <ProgressBar current={step} total={QUESTIONS.length} />

      <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "minmax(0, 1fr) 220px", gap: 24, alignItems: "stretch" }} className="soft-stage-grid">
        <div className="card-brutal" style={{ padding: 28, minHeight: 280 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#ff5b00", marginBottom: 18 }}>// WORKPLACE SIMULATION</div>
          <h1 data-testid="soft-question-text" className="display" style={{ fontSize: "clamp(30px, 5vw, 56px)", lineHeight: 0.98, color: "var(--fg)", maxWidth: 820 }}>
            {question.scene}
          </h1>
        </div>

        <div style={{ border: "2px solid var(--fg)", padding: 18, background: "var(--card)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "6px 6px 0 #e5ff00" }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "#e5ff00", marginBottom: 12 }}>ИЗЮМИНКА</div>
            <p data-testid="soft-feature-note" style={{ color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.55 }}>
              В конце получишь не просто балл, а профиль поведения: сильный паттерн, зона риска и готовую фразу для интервью.
            </p>
          </div>
          <div data-testid="soft-answered-count" className="display" style={{ fontSize: 48, marginTop: 20, color: "#e5ff00" }}>{answers.length}</div>
        </div>
      </div>

      <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }} className="soft-options-grid">
        {question.options.map((option, index) => (
          <button
            key={option.text}
            data-testid={`soft-option-${step}-${index}`}
            onClick={() => onPick(index)}
            style={{
              textAlign: "left",
              padding: 18,
              minHeight: 96,
              color: "var(--fg)",
              background: "var(--card)",
              border: "2px solid var(--fg)",
              cursor: "pointer",
              boxShadow: "4px 4px 0 var(--line)",
              transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-3px,-3px)"; e.currentTarget.style.boxShadow = "8px 8px 0 #ff5b00"; e.currentTarget.style.borderColor = "#ff5b00"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--line)"; e.currentTarget.style.borderColor = "var(--fg)"; }}
          >
            <span className="mono" style={{ display: "block", fontSize: 10, letterSpacing: "0.18em", color: "#ff5b00", marginBottom: 10 }}>ВАРИАНТ {index + 1}</span>
            <span style={{ fontSize: 14, lineHeight: 1.55 }}>{option.text}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 28, minHeight: 44, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {step > 0 ? (
          <button data-testid="soft-back-button" className="btn-ghost" onClick={onBack}>← НАЗАД</button>
        ) : (
          <Link data-testid="soft-tests-link" to="/tests" className="btn-ghost">← К ТЕСТАМ</Link>
        )}
      </div>
      <style>{`
        @media (max-width: 760px) {
          .soft-stage-grid { grid-template-columns: 1fr !important; }
          .soft-options-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ResultStage({ scores, onReset }) {
  const archetype = pickArchetype(scores);
  const signal = getSignal(scores);
  const average = Math.round(Object.values(scores).reduce((sum, value) => sum + value, 0) / Object.values(scores).length);

  return (
    <div data-testid="soft-result-stage" style={{ maxWidth: 1180, margin: "0 auto", padding: "120px 28px 70px" }}>
      <div className="mono" style={{ color: "#ff5b00", letterSpacing: "0.22em", fontSize: 11, marginBottom: 14 }}>› SOFT SKILLS REPORT</div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 30, alignItems: "start" }} className="soft-result-grid">
        <div>
          <h1 data-testid="soft-archetype-title" className="display" style={{ fontSize: "clamp(48px, 8vw, 116px)", margin: 0, color: "var(--fg)" }}>
            {archetype.title}
          </h1>
          <p data-testid="soft-archetype-summary" style={{ marginTop: 20, color: "var(--fg-dim)", fontSize: 16, lineHeight: 1.65, maxWidth: 760 }}>
            {archetype.summary}
          </p>

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }} className="soft-score-grid">
            {Object.entries(scores).map(([trait, value]) => <ScoreBar key={trait} trait={trait} value={value} />)}
          </div>

          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }} className="soft-insight-grid">
            <div data-testid="soft-strong-card" style={{ border: "2px solid var(--fg)", background: "var(--card)", padding: 20, boxShadow: "6px 6px 0 #24c57f" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "#24c57f", marginBottom: 10 }}>СИЛЬНЫЙ ПАТТЕРН</div>
              <div className="display" style={{ fontSize: 34 }}>{TRAITS[signal.strongTrait].label}</div>
              <p style={{ marginTop: 10, color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.55 }}>
                Это твоя опора в командной работе. Используй её как якорь в стрессовых обсуждениях.
              </p>
            </div>
            <div data-testid="soft-risk-card" style={{ border: "2px solid var(--fg)", background: "var(--card)", padding: 20, boxShadow: "6px 6px 0 #ff2d55" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "#ff2d55", marginBottom: 10 }}>ЗОНА РИСКА</div>
              <div className="display" style={{ fontSize: 34 }}>{TRAITS[signal.weakTrait].label}</div>
              <p data-testid="soft-risk-script" style={{ marginTop: 10, color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.55 }}>
                {signal.script}
              </p>
            </div>
          </div>

          <div data-testid="soft-interview-script" style={{ marginTop: 24, border: "2px solid var(--fg)", background: "var(--bg-2)", padding: 22 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "#e5ff00", marginBottom: 10 }}>ФРАЗА ДЛЯ СОБЕСЕДОВАНИЯ</div>
            <p style={{ color: "var(--fg)", fontSize: 15, lineHeight: 1.7 }}>
              “В сложных ситуациях я стараюсь быстро отделить факты от эмоций: фиксирую текущий статус, называю риск и предлагаю 2–3 варианта следующего шага. Так команда быстрее приходит к решению.”
            </p>
          </div>

          <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button data-testid="soft-restart-button" className="btn-brutal" onClick={onReset}>ПРОЙТИ ЕЩЁ РАЗ ↺</button>
            <Link data-testid="soft-result-tests-link" to="/tests" className="btn-ghost">К ТЕСТАМ →</Link>
          </div>
        </div>

        <aside style={{ position: "sticky", top: 120 }} className="soft-result-aside">
          <Radar scores={scores} />
          <div data-testid="soft-total-card" style={{ marginTop: 18, border: "2px solid var(--fg)", background: "var(--card)", padding: 22 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--muted)" }}>ОБЩИЙ ИНДЕКС</div>
            <div data-testid="soft-total-score" className="display" style={{ fontSize: 82, marginTop: 10, color: average >= 70 ? "#24c57f" : average >= 55 ? "#e5ff00" : "#ff5b00" }}>{average}</div>
            <p data-testid="soft-archetype-advice" style={{ color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.55, marginTop: 10 }}>{archetype.advice}</p>
          </div>
        </aside>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .soft-result-grid { grid-template-columns: 1fr !important; }
          .soft-result-aside { position: static !important; }
        }
        @media (max-width: 680px) {
          .soft-score-grid, .soft-insight-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function SoftSkills() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const finished = step >= QUESTIONS.length;
  const scores = useMemo(() => buildScores(answers), [answers]);

  const pick = (optionIndex) => {
    setAnswers((prev) => [...prev, optionIndex]);
    setStep((prev) => prev + 1);
  };

  const back = () => {
    if (step === 0) return;
    setAnswers((prev) => prev.slice(0, -1));
    setStep((prev) => prev - 1);
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  return finished
    ? <ResultStage scores={scores} onReset={reset} />
    : <QuestionStage step={step} answers={answers} onPick={pick} onBack={back} />;
}