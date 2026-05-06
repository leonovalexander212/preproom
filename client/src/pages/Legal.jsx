import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";

function Page({ title, kicker = "› ВСЯ ИНФА", children }) {
  return (
    <div style={{ paddingTop: 120, maxWidth: 880, margin: "0 auto", padding: "140px 28px 80px" }}>
      <div className="mono" style={{ color: "var(--accent-ink)", letterSpacing: "0.22em", fontSize: 11, marginBottom: 14 }}>
        {kicker}
      </div>
        <h1 className="display" style={{ fontSize: "clamp(40px, 5.6vw, 88px)", margin: 0, lineHeight: 0.95 }}>
        {title}
      </h1>
      <div style={{ marginTop: 30, color: "var(--fg-dim)", fontSize: 15, lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

const H3 = ({ children }) => (
  <h3 style={{ color: "var(--fg)", marginTop: 34, marginBottom: 10, fontSize: 20, letterSpacing: "0.02em" }}>
    {children}
  </h3>
);

const Meta = ({ children }) => (
  <div className="mono" style={{
    marginTop: 6, marginBottom: 20, fontSize: 11,
    letterSpacing: "0.22em", color: "var(--muted)"
  }}>{children}</div>
);

/* ==================== DOCS ==================== */
export const DocsPage = () => (
  <Page title="ДОКУМЕНТАЦИЯ">
    <Meta>PREPROOM · REST + SSE · OBSERVE-ONLY · NO AUTH</Meta>


    <H3>Базовый URL</H3>
    <ul>
      <li><b>Production:</b> <code>https://api.preproom.app</code></li>
      <li><b>Локально:</b> <code>http://localhost:4000</code> (Express + Prisma 7)</li>
    </ul>

    <H3>Rate limits</H3>
    <ul>
      <li>Общий лимит: <b>60 req/min на IP</b> для read-эндпоинтов.</li>
      <li>AI-мок (<code>/api/mock/*</code>): <b>3 сессии на IP за 7 дней</b>. Состояние — в <code>GET /api/mock/rate-limit</code>.</li>
      <li>AI-объяснение (<code>/api/ai/explain</code>): <b>20 запросов/час на IP</b>, т.к. под капотом платный OpenRouter.</li>
    </ul>

    <H3>Направления</H3>
    <ul>
      <li><code>GET /api/directions</code> — список всех направлений со счётчиками вопросов и интервью.</li>
      <li><code>GET /api/directions/:slug/questions</code> — вопросы направления. Процент вероятности считается <i>в контексте фильтров</i>: знаменатель сужается до интервью, где встречается выбранный грейд/тип.</li>
    </ul>
    <p>
      Параметры: <code>?type=TECHNICAL|BEHAVIORAL|LOGIC_PUZZLE</code>,{" "}
      <code>?level=JUNIOR|MIDDLE|SENIOR</code>,{" "}
      <code>?search=строка</code>,{" "}
      <code>?limit=50&offset=0</code>.
    </p>

    <H3>Вопросы</H3>
    <ul>
      <li><code>GET /api/questions/:id</code> — один вопрос с эталонным ответом и типом (TECHNICAL / BEHAVIORAL / LOGIC_PUZZLE).</li>
      <li><code>GET /api/questions/:id/video-answers</code> — таймкоды в YouTube-записях, где этот вопрос звучал.</li>
    </ul>

    <H3>Интервью (видео-источники)</H3>
    <ul>
      <li><code>GET /api/interviews</code> — список записей, из которых собрана база.</li>
    </ul>
    <p>
      Параметры: <code>?direction=slug</code>,{" "}
      <code>?difficulty=JUNIOR|MIDDLE|SENIOR</code>.
    </p>

    <H3>AI-объяснение («Уточнить у ИИ»)</H3>
    <p>
      <code>POST /api/ai/explain</code> — Server-Sent Events (text/event-stream). В теле:{" "}
      <code>{`{ questionId, messages: [{ role, content }] }`}</code>. Провайдер — OpenRouter,
      модель выбирается сервером. События формата:
    </p>
    <pre>{`event: chunk
data: {"type":"chunk","content":"..."}

event: done
data: {"type":"done","usage":{"promptTokens":...,"completionTokens":...}}`}</pre>

    <H3>AI Mock Interview</H3>
    <ul>
      <li><code>GET /api/mock/rate-limit</code> — <code>{`{ remaining, limit, resetAt }`}</code>.</li>
      <li><code>GET /api/mock/directions</code> — доступные пары <i>направление × грейд</i> (некоторые помечены <code>available: false</code>).</li>
      <li><code>POST /api/mock/start</code> — <code>{`{ direction, grade }`}</code>, возвращает <code>session</code> с первым вопросом.</li>
      <li><code>GET /api/mock/session/:id</code> — подтянуть текущее состояние (используется при F5).</li>
      <li><code>POST /api/mock/answer</code> — <code>{`{ sessionId, answer }`}</code>, сдвигает на следующий QA-вопрос или на coding-фазу.</li>
      <li><code>POST /api/mock/coding</code> — <code>{`{ sessionId, code }`}</code>, прогоняет скрытые тесты, возвращает <code>{`{ session, result: { testsPassed, testsTotal, errorSample } }`}</code>.</li>
      <li><code>POST /api/mock/finish</code> — финализирует сессию, возвращает <code>finalReport</code>.</li>
      <li><code>POST /api/mock/abort</code> — досрочное прерывание. Попытка <b>списывается</b>, но отчёт всё равно формируется по частичным данным.</li>
    </ul>

    <H3>Health</H3>
    <ul>
      <li><code>GET /api/health</code> — <code>{`{ status: "ok", uptime, version }`}</code>. Используется страницей <i>STATUS</i>, пингуется раз в 30с.</li>
    </ul>

    <H3>Примеры</H3>
    <pre>{`# список направлений
curl https://api.preproom.app/api/directions

# вопросы Java на MIDDLE
curl "https://api.preproom.app/api/directions/java/questions?level=MIDDLE&type=TECHNICAL"

# старт мока Python / JUNIOR
curl -X POST https://api.preproom.app/api/mock/start \\
  -H "Content-Type: application/json" \\
  -d '{"direction":"python","grade":"JUNIOR"}'

# SSE-стрим AI-объяснения
curl -N -X POST https://api.preproom.app/api/ai/explain \\
  -H "Content-Type: application/json" \\
  -d '{"questionId":"ckxyz...","messages":[{"role":"user","content":"объясни GIL"}]}'`}</pre>

    <H3>Ошибки</H3>
    <ul>
      <li><code>400</code> — неверные параметры или невалидное тело (Zod-валидация).</li>
      <li><code>404</code> — объект не найден (вопрос/направление/сессия).</li>
      <li><code>409</code> — конфликт состояния мока (например, ответ на уже завершённую сессию).</li>
      <li><code>429</code> — превышен rate-limit (см. заголовки <code>X-RateLimit-*</code>).</li>
      <li><code>500</code> — внутренняя ошибка (бывает при обрыве OpenRouter или падении раннера кода).</li>
    </ul>
    <p>
      Тело ошибки: <code>{`{ "error": "код", "message": "человекочитаемое описание" }`}</code>.
    </p>

    <H3>Стек и внутрянка</H3>
    <ul>
      <li><b>Backend:</b> Node.js 20 + Express + TypeScript, PostgreSQL 16 + Prisma 7 с driver adapter <code>@prisma/adapter-pg</code> (без Rust-движка).</li>
      <li><b>Embeddings:</b> Xenova multilingual-e5-small — локально, без внешнего API. Порог косинусной близости для дедупликации — <code>0.92</code>, union-find кластеризация.</li>
      <li><b>LLM:</b> OpenAI SDK в конфигурации OpenRouter</li>
      <li><b>Вероятность</b> вопросов считается на лету как <code>COUNT(DISTINCT interview_id) / total</code> с контекстным знаменателем под активные фильтры — цифра не «размывается» при сужении выборки.</li>
    </ul>
  </Page>
);
/* ==================== PRIVACY ==================== */
export const PrivacyPage = () => (
  <Page title="КОНФИДЕНЦИАЛЬНОСТЬ" kicker="› ВАЖНО">
    <Meta>Редакция от 04.05.2026</Meta>
    <p>
      Мы уважаем твою приватность. Этот документ объясняет простыми словами,
      какие данные PrepRoom обрабатывает, зачем и как ими распоряжается.
    </p>

    <H3>1. Какие данные мы собираем</H3>
    <p>
      PrepRoom — сервис без регистрации. Мы <strong>не храним</strong> персональные данные
      (имя, email, номер телефона). В <code>localStorage</code> твоего браузера
      сохраняются исключительно служебные настройки: выбранная тема (светлая/тёмная), таймстамп последнего визита.
    </p>

    <H3>2. Куки и аналитика</H3>
    <p>
      Сторонние куки не устанавливаются. Анонимная агрегированная статистика
      может собираться для диагностики (версия браузера, страна, время запроса)
      и не связывается с конкретным пользователем.
    </p>

    <H3>3. Обращения к внешним сервисам</H3>
    <p>
      Обращения к AI передаётся провайдеру LLM
      (OpenRouter) без идентификаторов пользователя. Превью к записям
      собеседований грузятся с серверов YouTube.
    </p>

    <H3>4. Права пользователя</H3>
    <p>
      Поскольку мы не храним персональных данных, запросы на удаление/экспорт
      не требуются. Очистить локальные настройки можно через очистку данных
      сайта в браузере.
    </p>

    <H3>5. Обратная связь</H3>
    <p>
      По любым вопросам о приватности пиши на{" "}
      <a href="mailto:awesome.boonar@yandex.ru" style={{ color: "var(--accent-ink)" }}>
        awesome.boonar@yandex.ru
      </a>.
    </p>
  </Page>
);

/* ==================== TERMS ==================== */
export const TermsPage = () => (
  <Page title="УСЛОВИЯ" kicker="› УСЛОВИЯ">
    <Meta>Редакция от 04.05.2026</Meta>
    <p>
      Используя PrepRoom, ты соглашаешься с условиями ниже. Если какой-либо пункт
      тебя не устраивает — просто не пользуйся сервисом.
    </p>

    <H3>1. Назначение сервиса</H3>
    <p>
      PrepRoom — образовательная платформа для самостоятельной подготовки
      к техническим интервью. Материалы носят справочный характер и не являются
      гарантией успешного прохождения реального собеседования.
    </p>

    <H3>2. Интеллектуальная собственность</H3>
    <p>
      Дизайн, код и структура платформы принадлежат автору. База вопросов
      формируется из публичных источников (YouTube-записей) с указанием
      таймкода и ссылки на оригинал. Ты можешь свободно использовать
      вопросы в учебных целях со ссылкой на PrepRoom.
    </p>

    <H3>3. AI-ответы</H3>
    <p>
      Ответы, сгенерированные ИИ, могут содержать неточности. Не принимай
      их как истину в последней инстанции — всегда перепроверяй критичные
      технические детали в первоисточниках.
    </p>

    <H3>4. Ограничение ответственности</H3>
    <p>
      Сервис предоставляется «как есть». Автор не несёт ответственности
      за возможные убытки, связанные с использованием или невозможностью
      использования платформы.
    </p>

    <H3>5. Изменения</H3>
    <p>
      Условия могут обновляться. Дата последней редакции всегда указана
      в начале документа.
    </p>
  </Page>
);

/* ==================== STATUS ==================== */
export const StatusPage = () => {
  const [state, setState] = useState("checking");
  const [latency, setLatency] = useState(null);
  const [checked, setChecked] = useState(null);

  const ping = async () => {
    setState("checking");
    const t0 = performance.now();
    try {
      const r = await fetch(`${api.base}/api/health`);
      if (!r.ok) throw new Error();
      await r.json();
      setLatency(Math.round(performance.now() - t0));
      setState("ok");
    } catch { setState("down"); }
    setChecked(new Date());
  };

  useEffect(() => { ping(); const id = setInterval(ping, 30000); return () => clearInterval(id); }, []);

  const color = state === "ok" ? "#24c57f" : state === "down" ? "#ff4d4d" : "#e5ff00";
  const label = state === "ok" ? "OPERATIONAL" : state === "down" ? "DOWNTIME" : "CHECKING...";

  return (
    <Page title="СТАТУС" kicker="› СТАТУС">
      <Meta>Автообновление каждые 30 секунд</Meta>

      <div style={{
        border: "2px solid var(--fg)", padding: 28, background: "var(--card)",
        boxShadow: `8px 8px 0 ${color}`, display: "flex",
        justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap",
      }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--muted)" }}>
            API ENDPOINT
          </div>
          <div className="display" style={{ fontSize: 32, color, marginTop: 4 }}>
            {label}
          </div>
          {state === "ok" && (
            <div className="mono" style={{ marginTop: 6, fontSize: 12, color: "var(--fg-dim)" }}>
              latency · {latency} ms
            </div>
          )}
        </div>
        <button onClick={ping} className="btn-brutal" data-testid="status-recheck">ПЕРЕПРОВЕРИТЬ ↻</button>
      </div>


      {checked && (
        <p className="mono" style={{ marginTop: 20, fontSize: 11, color: "var(--muted)", letterSpacing: "0.2em" }}>
          LAST CHECK · {checked.toLocaleTimeString()}
        </p>
      )}
    </Page>
  );
};

/* ==================== CONTACT ==================== */
export const ContactPage = () => (
  <Page title="КОНТАКТЫ" kicker="› CALL ME MAYBE">
    <p>
      Нашёл баг, есть идея или хочется обсудить сотрудничество — я на связи.

    </p>

    <div style={{
      marginTop: 28, display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14
    }}>
      <ContactCard label="EMAIL" value="awesome.boonar@yandex.ru"
        href="mailto:awesome.boonar@yandex.ru" testid="contact-email" />
      <ContactCard label="GITHUB" value="leonovalexander212"
        href="https://github.com/leonovalexander212" testid="contact-github" />
      <ContactCard label="TELEGRAM" value="Леонов Александр"
        href="https://t.me/qmnb446" testid="contact-telegram" />
    </div>

    <H3>О проекте</H3>
    <p>
      PrepRoom — пет-проект, запущенный в 2026 году. Развивается в open-source парадигме.
      Весь код доступен на GitHub.
    </p>


  </Page>
);

function ContactCard({ label, value, href, testid }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      data-testid={testid}
      style={{
        display: "block", padding: "18px 20px", color: "var(--fg)",
        border: "2px solid var(--fg)", background: "var(--card)",
        textDecoration: "none",
        transition: "background 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#e5ff00";
        e.currentTarget.style.color = "#000";
        e.currentTarget.style.transform = "translate(-2px,-2px)";
        e.currentTarget.style.boxShadow = "6px 6px 0 var(--fg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--card)";
        e.currentTarget.style.color = "var(--fg)";
        e.currentTarget.style.transform = "translate(0,0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--accent-ink)" }}>
        {label}
      </div>
      <div style={{
        marginTop: 8, fontSize: 15, lineHeight: 1.35, fontWeight: 600,
        wordBreak: "break-all", overflowWrap: "anywhere",
      }}>
        {value}
      </div>
      <div className="mono" style={{ marginTop: 10, fontSize: 10, letterSpacing: "0.2em", opacity: 0.6 }}>
        OPEN ↗
      </div>
    </a>
  );
}