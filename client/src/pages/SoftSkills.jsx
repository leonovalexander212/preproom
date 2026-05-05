import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const TRAITS = {
  clarity:   { label: "Ясность",         color: "#e5ff00" },
  empathy:   { label: "Эмпатия",         color: "#24c57f" },
  ownership: { label: "Ответственность", color: "#ff5b00" },
  conflict:  { label: "Конфликты",       color: "#ff2d55" },
  structure: { label: "Структура",       color: "#7dd3fc" },
};

/* ---- ВОПРОСЫ С УСИЛЕННЫМИ ИМПАКТАМИ ----
   Диапазон: от -20 до +20.
   "Хорошие" варианты дают суммарно +20..+40
   "Плохие" варианты дают суммарно -20..-40
   Экстремальные варианты создают ярко выраженные профили
*/
const QUESTIONS = [
  {
    scene: "Дедлайн горит, задача крупнее, чем казалась. Тимлид спрашивает: \u201cуспеешь?\u201d",
    pressure: "Ограниченное время",
    options: [
      { text: "Скажу \u201cда\u201d, а потом попробую догнать ночью.", impact: { clarity: -14, empathy: 0, ownership: 6, conflict: -5, structure: -12 } },
      { text: "Покажу текущий статус, риски и предложу урезать scope до MVP.", impact: { clarity: 18, empathy: 8, ownership: 16, conflict: 5, structure: 15 } },
      { text: "Отвечу, что не моя вина: требования постоянно менялись.", impact: { clarity: -10, empathy: -12, ownership: -20, conflict: -15, structure: -8 } },
      { text: "Попрошу ещё пару дней без деталей, чтобы не создавать панику.", impact: { clarity: -15, empathy: 6, ownership: -8, conflict: 2, structure: -14 } },
    ],
  },
  {
    scene: "Коллега публично критикует твой подход на созвоне.",
    pressure: "Публичное напряжение",
    options: [
      { text: "Спокойно уточню факты и предложу разобрать варианты после созвона.", impact: { clarity: 14, empathy: 12, ownership: 10, conflict: 20, structure: 6 } },
      { text: "Отвечу жёстко, чтобы не выглядело, будто я слабее.", impact: { clarity: -8, empathy: -18, ownership: 2, conflict: -20, structure: -5 } },
      { text: "Промолчу, но потом перестану вовлекать его в обсуждения.", impact: { clarity: -6, empathy: -10, ownership: -12, conflict: -14, structure: -5 } },
      { text: "Соглашусь со всем, даже если не согласен, чтобы быстрее закончить.", impact: { clarity: -16, empathy: 5, ownership: -12, conflict: -4, structure: -10 } },
    ],
  },
  {
    scene: "На ревью тебе оставили 18 комментариев. Часть кажется вкусовщиной.",
    pressure: "Обратная связь",
    options: [
      { text: "Разделю комментарии на баги, стиль и вопросы; спорное вынесу в тред.", impact: { clarity: 16, empathy: 6, ownership: 12, conflict: 10, structure: 20 } },
      { text: "Исправлю всё молча, чтобы не спорить.", impact: { clarity: -6, empathy: 10, ownership: 5, conflict: 2, structure: 0 } },
      { text: "Напишу, что ревью слишком придирчивое и блокирует работу.", impact: { clarity: -5, empathy: -15, ownership: -10, conflict: -20, structure: -8 } },
      { text: "Выберу только те пункты, с которыми согласен, остальное проигнорирю.", impact: { clarity: -10, empathy: -5, ownership: -16, conflict: -6, structure: -14 } },
    ],
  },
  {
    scene: "Продакт просит \u201cмаленькую правку\u201d, но ты видишь риск сломать соседний сценарий.",
    pressure: "Неясные требования",
    options: [
      { text: "Предложу безопасный вариант и проверочный чек-лист.", impact: { clarity: 20, empathy: 5, ownership: 18, conflict: 6, structure: 20 } },
      { text: "Сделаю как просят: ответственность за решение на них.", impact: { clarity: -6, empathy: -8, ownership: -18, conflict: 2, structure: -10 } },
      { text: "Откажусь делать, пока не будет полного ТЗ.", impact: { clarity: 4, empathy: -10, ownership: -8, conflict: -16, structure: 2 } },
      { text: "Сначала уточню цель правки, потом оценю риск.", impact: { clarity: 14, empathy: 10, ownership: 12, conflict: 8, structure: 12 } },
    ],
  },
  {
    scene: "Новичок в команде третий раз задаёт похожий вопрос.",
    pressure: "Наставничество",
    options: [
      { text: "Дам ссылку на документацию без объяснений: пусть учится искать.", impact: { clarity: -8, empathy: -20, ownership: -5, conflict: -6, structure: 0 } },
      { text: "Разберу пример и предложу ему написать короткую памятку.", impact: { clarity: 10, empathy: 20, ownership: 12, conflict: 6, structure: 16 } },
      { text: "Сделаю задачу за него, чтобы не терять время команды.", impact: { clarity: 2, empathy: 6, ownership: -12, conflict: 2, structure: -18 } },
      { text: "Попрошу тимлида заменить ему задачу на проще.", impact: { clarity: -5, empathy: -10, ownership: -10, conflict: -8, structure: -6 } },
    ],
  },
  {
    scene: "Ты понял, что вчера дал неверную оценку задачи.",
    pressure: "Ошибка в прогнозе",
    options: [
      { text: "Сразу обновлю оценку, объясню причину и предложу новый план.", impact: { clarity: 20, empathy: 6, ownership: 20, conflict: 8, structure: 12 } },
      { text: "Подожду до следующего стендапа: вдруг успею наверстать.", impact: { clarity: -18, empathy: -4, ownership: -14, conflict: -5, structure: -10 } },
      { text: "Оценка была предварительной, поэтому проблема не во мне.", impact: { clarity: -10, empathy: -8, ownership: -20, conflict: -12, structure: -6 } },
      { text: "Сначала сам найду дешёвый компромисс, потом принесу варианты.", impact: { clarity: 12, empathy: 8, ownership: 14, conflict: 4, structure: 16 } },
    ],
  },
  {
    scene: "Команда спорит: быстро выпустить фичу или дополировать качество.",
    pressure: "Конфликт приоритетов",
    options: [
      { text: "Предложу критерии: риск, влияние на пользователя, стоимость отката.", impact: { clarity: 16, empathy: 6, ownership: 12, conflict: 10, structure: 20 } },
      { text: "Встану на сторону большинства, чтобы не затягивать.", impact: { clarity: -10, empathy: 2, ownership: -8, conflict: 6, structure: -12 } },
      { text: "Буду настаивать на качестве: выпускать сырой продукт нельзя.", impact: { clarity: 6, empathy: -10, ownership: 8, conflict: -18, structure: 2 } },
      { text: "Соберу короткий эксперимент: что можно проверить за день.", impact: { clarity: 12, empathy: 10, ownership: 16, conflict: 6, structure: 14 } },
    ],
  },
  {
    scene: "В чате клиент пишет резко и обвиняет команду в непрофессионализме.",
    pressure: "Эмоциональный клиент",
    options: [
      { text: "Зафиксирую факты и дам конкретный следующий шаг.", impact: { clarity: 16, empathy: 20, ownership: 12, conflict: 16, structure: 8 } },
      { text: "Отвечу формально: \u201cваше обращение принято\u201d.", impact: { clarity: 6, empathy: -16, ownership: -4, conflict: -6, structure: 2 } },
      { text: "Объясню, что клиент сам не лучше.", impact: { clarity: -5, empathy: -20, ownership: -10, conflict: -20, structure: -4 } },
      { text: "Не буду отвечать без менеджера, чтобы не усугубить.", impact: { clarity: -10, empathy: 4, ownership: -12, conflict: 4, structure: 6 } },
    ],
  },
  {
    scene: "На дейли ты застрял, но причина пока не ясна.",
    pressure: "Блокер",
    options: [
      { text: "Скажу \u201cразбираюсь\u201d, деталей нет \u2014 не хочу шуметь раньше времени.", impact: { clarity: -16, empathy: -4, ownership: -6, conflict: 2, structure: -12 } },
      { text: "Назову гипотезы, что проверил, и что нужно для разблокировки.", impact: { clarity: 20, empathy: 6, ownership: 18, conflict: 8, structure: 20 } },
      { text: "Попрошу созвон всей команды прямо сейчас.", impact: { clarity: 6, empathy: -10, ownership: 6, conflict: -6, structure: -10 } },
      { text: "Сменю задачу и вернусь к этой, когда появится вдохновение.", impact: { clarity: -10, empathy: -5, ownership: -20, conflict: -4, structure: -16 } },
    ],
  },
  {
    scene: "Тебе нужно объяснить сложное техническое решение не техническому стейкхолдеру.",
    pressure: "Перевод с технарского",
    options: [
      { text: "Начну с бизнес-эффекта, затем аналогию и только потом детали.", impact: { clarity: 20, empathy: 16, ownership: 8, conflict: 6, structure: 12 } },
      { text: "Покажу диаграмму компонентов: так точнее.", impact: { clarity: -6, empathy: -6, ownership: 6, conflict: 2, structure: 10 } },
      { text: "Скажу, что это внутренние технические детали.", impact: { clarity: -20, empathy: -16, ownership: -10, conflict: -10, structure: -6 } },
      { text: "Подготовлю короткий summary и deep dive по запросу.", impact: { clarity: 16, empathy: 12, ownership: 12, conflict: 4, structure: 18 } },
    ],
  },
  {
    scene: "В задаче обнаружился баг после релиза, и его нашёл пользователь.",
    pressure: "Инцидент",
    options: [
      { text: "Сначала фикс, потом разбор.", impact: { clarity: 10, empathy: 6, ownership: 20, conflict: 8, structure: 14 } },
      { text: "Буду искать, кто именно внёс ошибку.", impact: { clarity: -6, empathy: -16, ownership: -10, conflict: -20, structure: -8 } },
      { text: "Напишу пользователю техническое объяснение, почему так вышло.", impact: { clarity: 6, empathy: -10, ownership: 2, conflict: -6, structure: 2 } },
      { text: "Предложу публичный статус.", impact: { clarity: 16, empathy: 12, ownership: 12, conflict: 8, structure: 12 } },
    ],
  },
  {
    scene: "Ты не согласен с решением лида, но команда уже почти договорилась.",
    pressure: "Несогласие с авторитетом",
    options: [
      { text: "Коротко обозначу риск и поддержу решение.", impact: { clarity: 16, empathy: 12, ownership: 18, conflict: 16, structure: 10 } },
      { text: "Промолчу: если решение плохое, потом будет видно.", impact: { clarity: -14, empathy: -4, ownership: -20, conflict: -10, structure: -8 } },
      { text: "Буду спорить, пока все не увидят слабые места.", impact: { clarity: 6, empathy: -16, ownership: 6, conflict: -20, structure: 2 } },
      { text: "Напишу лиду отдельно после встречи, чтобы не спорить при всех.", impact: { clarity: -6, empathy: 8, ownership: 2, conflict: 6, structure: -4 } },
    ],
  },
];

const ARCHETYPES = [
  {
    id: "navigator",
    title: "Командный навигатор",
    condition: (s) => s.clarity >= 72 && s.empathy >= 65 && s.structure >= 60,
    summary: "Ты хорошо переводишь хаос в понятные шаги, слышишь людей и держишь разговор в рабочем русле.",
    advice: "Развивай фасилитацию: бери сложные обсуждения, где нужно собрать разные позиции и довести до решения.",
  },
  {
    id: "owner",
    title: "Антикризисный драйвер",
    condition: (s) => s.ownership >= 72 && s.structure >= 60,
    summary: "Ты склонен брать ответственность и быстро превращать проблему в план действий.",
    advice: "Следи, чтобы скорость не превращалась в давление на окружающих: добавляй больше проверки ожиданий.",
  },
  {
    id: "diplomat",
    title: "Дипломат команды",
    condition: (s) => s.empathy >= 72 && s.conflict >= 60,
    summary: "Ты умеешь снижать градус напряжения и сохранять контакт даже в неприятных разговорах.",
    advice: "Не бойся быть конкретнее: мягкость становится сильнее, когда рядом есть чёткие договорённости.",
  },
  {
    id: "architect",
    title: "Архитектор процессов",
    condition: (s) => s.structure >= 74,
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* ---- НОВАЯ ЛОГИКА ПОДСЧЁТА ----
   Считаем реальный мин/макс по каждому трейту из ВСЕХ вопросов
   (худший возможный выбор vs лучший возможный выбор),
   затем линейно нормализуем в [0, 100].
   Теперь: все плохие ответы → ~0, все хорошие → ~100.
*/
function computeTraitBounds() {
  const mins = { ...INITIAL_SCORES };
  const maxs = { ...INITIAL_SCORES };
  QUESTIONS.forEach((q) => {
    Object.keys(TRAITS).forEach((t) => {
      const values = q.options.map((o) => o.impact[t] || 0);
      mins[t] += Math.min(...values);
      maxs[t] += Math.max(...values);
    });
  });
  return { mins, maxs };
}

const BOUNDS = computeTraitBounds();

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
    const min = BOUNDS.mins[trait];
    const max = BOUNDS.maxs[trait];
    const range = max - min || 1;
    normalized[trait] = Math.round(clamp(((raw[trait] - min) / range) * 100, 0, 100));
  });
  return normalized;
}

function pickArchetype(scores) {
  return ARCHETYPES.find((type) => type.condition(scores));
}

function getSignal(scores) {
  const entries = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const [weakTrait] = entries[0];
  const [strongTrait] = entries[entries.length - 1];

  const scripts = {
    clarity: "Перед ответом формулируй: статус, риск, следующий шаг.",
    empathy: "Добавляй фразу признания: \u201cвижу, почему это важно\u201d.",
    ownership: "Раньше поднимай риски и приходи с вариантами.",
    conflict: "В конфликте отделяй человека от решения.",
    structure: "Используй рамку: цель, ограничения, варианты, критерий.",
  };

  return { weakTrait, strongTrait, script: scripts[weakTrait] };
}

/* ---- Shuffle с seed (детерминированный на сессию) ---- */
function seededShuffle(arr, seed) {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = ((s >>> 0) % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* ---- Progress Bar ---- */
function ProgressBar({ current, total }) {
  const width = (current / total) * 100;
  return (
    <div data-testid="soft-progress-shell" style={{ height: 8, background: "var(--bg-2)", border: "2px solid var(--fg)", overflow: "hidden" }}>
      <div data-testid="soft-progress-bar" style={{ width: `${width}%`, height: "100%", background: "#ff5b00", transition: "width 260ms ease" }} />
    </div>
  );
}

/* ---- Compact Score Row ---- */
function ScoreRow({ trait, value }) {
  const meta = TRAITS[trait];
  return (
    <div data-testid={`soft-score-row-${trait}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
      <span data-testid={`soft-score-label-${trait}`} className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: meta.color, width: 110, flexShrink: 0 }}>{meta.label}</span>
      <div style={{ flex: 1, height: 8, background: "var(--bg-2)", border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: meta.color, transition: "width 500ms ease" }} />
      </div>
      <span data-testid={`soft-score-value-${trait}`} className="display" style={{ fontSize: 18, width: 32, textAlign: "right" }}>{value}</span>
    </div>
  );
}

/* ---- Radar (fixed labels) ---- */
function Radar({ scores }) {
  const traits = Object.keys(TRAITS);
  const cx = 130, cy = 130;
  const maxR = 80;

  const points = traits.map((trait, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / traits.length;
    const radius = 30 + scores[trait] * 0.5;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg data-testid="soft-radar-chart" viewBox="0 0 260 260" style={{ width: "100%", maxWidth: 240, display: "block", margin: "0 auto" }}>
      {[70, 50, 30].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      ))}
      {traits.map((trait, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / traits.length;
        const lineX = cx + Math.cos(angle) * maxR;
        const lineY = cy + Math.sin(angle) * maxR;
        const labelR = maxR + 22;
        const labelX = cx + Math.cos(angle) * labelR;
        const labelY = cy + Math.sin(angle) * labelR;
        return (
          <g key={trait}>
            <line x1={cx} y1={cy} x2={lineX} y2={lineY} stroke="rgba(255,255,255,0.1)" />
            <text x={labelX} y={labelY} fill={TRAITS[trait].color} fontSize="9" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
              {TRAITS[trait].label}
            </text>
          </g>
        );
      })}
      <polygon points={points} fill="rgba(255,91,0,0.28)" stroke="#ff5b00" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r="2.5" fill="#e5ff00" />
    </svg>
  );
}

/* ---- Question Stage ---- */
function QuestionStage({ step, answers, onPick, onBack, sessionSeed }) {
  const question = QUESTIONS[step];

  // Перемешиваем варианты детерминированно (seed + step)
  const shuffledOptions = useMemo(() => {
    const indexed = question.options.map((opt, i) => ({ ...opt, originalIndex: i }));
    return seededShuffle(indexed, sessionSeed + step * 7919);
  }, [step, sessionSeed, question]);

  const handlePick = (shuffledIdx) => {
    // Передаём ОРИГИНАЛЬНЫЙ индекс для правильного подсчёта
    onPick(shuffledOptions[shuffledIdx].originalIndex);
  };

  return (
    <div data-testid="soft-question-stage" style={{ maxWidth: 980, margin: "0 auto", padding: "120px 28px 64px" }}>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 16, color: "var(--muted)", fontSize: 11, letterSpacing: "0.2em", marginBottom: 18, flexWrap: "wrap" }}>
        <span data-testid="soft-question-counter">СЦЕНАРИЙ {step + 1} / {QUESTIONS.length}</span>
        <span data-testid="soft-question-pressure" style={{ color: "#ff5b00" }}>{question.pressure}</span>
      </div>

      <ProgressBar current={step} total={QUESTIONS.length} />

      {/* Question block with FIXED height */}
      <div className="card-brutal" style={{ marginTop: 36, padding: 28, height: 240, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "#ff5b00", marginBottom: 18 }}>// WORKPLACE SIMULATION</div>
        <h1 data-testid="soft-question-text" className="display" style={{ fontSize: "clamp(26px, 4.5vw, 50px)", lineHeight: 0.98, color: "var(--fg)", maxWidth: 820, margin: 0 }}>
          {question.scene}
        </h1>
      </div>

      {/* Options - shuffled, always at the same vertical position */}
      <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }} className="soft-options-grid">
        {shuffledOptions.map((option, index) => (
          <button
            key={option.originalIndex}
            data-testid={`soft-option-${step}-${index}`}
            onClick={() => handlePick(index)}
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
          .soft-options-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ---- Result Stage (compact, fits viewport) ---- */
function ResultStage({ scores, onReset }) {
  const archetype = pickArchetype(scores);
  const signal = getSignal(scores);
  const average = Math.round(Object.values(scores).reduce((sum, value) => sum + value, 0) / Object.values(scores).length);

  return (
    <div data-testid="soft-result-stage" style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 28px 20px", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
      <div className="mono" style={{ color: "#ff5b00", letterSpacing: "0.22em", fontSize: 10, marginBottom: 10 }}>› SOFT SKILLS REPORT</div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: 24, alignItems: "start" }} className="soft-result-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title + Summary */}
          <div>
            <h1 data-testid="soft-archetype-title" className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)", margin: 0, lineHeight: 0.95, color: "var(--fg)" }}>
              {archetype.title}
            </h1>
            <p data-testid="soft-archetype-summary" style={{ marginTop: 8, color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.5, maxWidth: 640 }}>
              {archetype.summary}
            </p>
          </div>

          {/* Scores - compact */}
          <div style={{ border: "2px solid var(--fg)", background: "var(--card)", padding: "12px 16px" }}>
            {Object.entries(scores).map(([trait, value]) => <ScoreRow key={trait} trait={trait} value={value} />)}
          </div>

          {/* Strong + Weak pattern - inline */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="soft-insight-grid">
            <div data-testid="soft-strong-card" style={{ border: "2px solid var(--fg)", background: "var(--card)", padding: "12px 14px", boxShadow: "4px 4px 0 #24c57f" }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "#24c57f", marginBottom: 6 }}>СИЛЬНЫЙ ПАТТЕРН</div>
              <div className="display" style={{ fontSize: 22 }}>{TRAITS[signal.strongTrait].label}</div>
              <p style={{ marginTop: 6, color: "var(--fg-dim)", fontSize: 11, lineHeight: 1.45 }}>
                Твоя опора в командной работе.
              </p>
            </div>
            <div data-testid="soft-risk-card" style={{ border: "2px solid var(--fg)", background: "var(--card)", padding: "12px 14px", boxShadow: "4px 4px 0 #ff2d55" }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "#ff2d55", marginBottom: 6 }}>ЗОНА РИСКА</div>
              <div className="display" style={{ fontSize: 22 }}>{TRAITS[signal.weakTrait].label}</div>
              <p data-testid="soft-risk-script" style={{ marginTop: 6, color: "var(--fg-dim)", fontSize: 11, lineHeight: 1.45 }}>
                {signal.script}
              </p>
            </div>
          </div>

          {/* Interview phrase - compact */}
          <div data-testid="soft-interview-script" style={{ border: "2px solid var(--fg)", background: "var(--bg-2)", padding: "12px 16px" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "#e5ff00", marginBottom: 6 }}>ФРАЗА ДЛЯ СОБЕСЕДОВАНИЯ</div>
            <p style={{ color: "var(--fg)", fontSize: 12, lineHeight: 1.55, margin: 0 }}>
              "В сложных ситуациях я отделяю факты от эмоций: фиксирую статус, называю риск и предлагаю 2-3 варианта. Так команда быстрее приходит к решению."
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button data-testid="soft-restart-button" className="btn-brutal" onClick={onReset}>ПРОЙТИ ЕЩЁ РАЗ ↺</button>
            <Link data-testid="soft-result-tests-link" to="/tests" className="btn-ghost">К ТЕСТАМ →</Link>
          </div>
        </div>

        {/* RIGHT COLUMN - Radar + Total */}
        <aside style={{ position: "sticky", top: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }} className="soft-result-aside">
          <div data-testid="soft-radar-card" style={{ border: "2px solid var(--fg)", background: "#050505", padding: 14, boxShadow: "6px 6px 0 #ff5b00", width: "100%" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "#ff5b00", marginBottom: 8 }}>SOFT RADAR</div>
            <Radar scores={scores} />
          </div>

          <div data-testid="soft-total-card" style={{ border: "2px solid var(--fg)", background: "var(--card)", padding: "14px 18px", width: "100%", textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--muted)" }}>ОБЩИЙ ИНДЕКС</div>
            <div data-testid="soft-total-score" className="display" style={{ fontSize: 52, marginTop: 4, color: average >= 70 ? "#24c57f" : average >= 55 ? "#e5ff00" : "#ff5b00" }}>{average}</div>
            <p data-testid="soft-archetype-advice" style={{ color: "var(--fg-dim)", fontSize: 11, lineHeight: 1.45, marginTop: 6 }}>{archetype.advice}</p>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .soft-result-grid { grid-template-columns: 1fr !important; }
          .soft-result-aside { position: static !important; }
        }
        @media (max-width: 680px) {
          .soft-insight-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ---- Root ---- */
export default function SoftSkills() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  // Seed генерируется один раз при монтировании — порядок вариантов фиксирован на сессию
  const sessionSeed = useRef(Date.now()).current;

  const finished = step >= QUESTIONS.length;
  const scores = useMemo(() => buildScores(answers), [answers]);

  const pick = (originalIndex) => {
    setAnswers((prev) => [...prev, originalIndex]);
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
    : <QuestionStage step={step} answers={answers} onPick={pick} onBack={back} sessionSeed={sessionSeed} />;
}