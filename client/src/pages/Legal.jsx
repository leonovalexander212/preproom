import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";

function Page({ title, kicker = "› ИНФОРМАЦИЯ", children }) {
  return (
    <div style={{ paddingTop: 120, maxWidth: 880, margin: "0 auto", padding: "140px 28px 80px" }}>
      <div className="mono" style={{ color: "var(--accent-ink)", letterSpacing: "0.22em", fontSize: 11, marginBottom: 14 }}>
        {kicker}
      </div>
      <h1 className="display" style={{ fontSize: "clamp(48px, 7vw, 110px)", margin: 0, lineHeight: 0.95 }}>
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
  <Page title="ДОКУМЕНТАЦИЯ" kicker="› ДОКУМЕНТАЦИЯ">
    <Meta>PREPROOM · REST API · V1</Meta>
    <p>
      PrepRoom предоставляет открытый REST API без авторизации. Все эндпоинты
      находятся под префиксом <code>/api</code>, формат обмена — JSON (UTF-8).
      Rate-limit по умолчанию — 60 запросов в минуту на IP.
    </p>

    <H3>Базовый URL</H3>
    <p><code>https://api.preproom.app</code> (или локально <code>http://localhost:8001</code>)</p>

    <H3>Направления</H3>
    <ul>
      <li><code>GET /api/directions</code> — список всех направлений со счётчиками вопросов</li>
      <li><code>GET /api/directions/:slug/questions</code> — вопросы выбранного направления</li>
    </ul>
    <p>Параметры фильтрации: <code>?type=TECHNICAL|BEHAVIORAL</code>, <code>?level=JUNIOR|MIDDLE|SENIOR</code>.</p>

    <H3>Вопросы</H3>
    <ul>
      <li><code>GET /api/questions/:id</code> — один вопрос с эталонным ответом</li>
      <li><code>GET /api/questions/:id/video-answers</code> — список таймкодов из YouTube</li>
    </ul>

    <H3>Интервью</H3>
    <ul>
      <li><code>GET /api/interviews</code> — список записей собеседований</li>
      <li>Поддерживает фильтры: <code>?direction=slug</code>, <code>?difficulty=JUNIOR</code></li>
    </ul>

    <H3>AI-объяснения</H3>
    <p>
      <code>POST /api/ai/explain</code> — стримовый (SSE) ответ. В теле передаётся{" "}
      <code>{`{ questionId, messages }`}</code>. Возвращает события вида{" "}
      <code>{`{ type: "chunk", content: "..." }`}</code>.
    </p>

    <H3>Примеры</H3>
    <pre style={{
      background: "var(--bg-2)", border: "2px solid var(--line)",
      padding: 14, fontSize: 12, overflowX: "auto"
    }}>
{`curl https://api.preproom.app/api/directions
curl https://api.preproom.app/api/directions/java/questions?level=MIDDLE`}
    </pre>

    <H3>Ошибки</H3>
    <p>
      Стандартные HTTP-коды: <code>400</code> — неверные параметры,{" "}
      <code>404</code> — объект не найден, <code>429</code> — превышен rate-limit,{" "}
      <code>500</code> — внутренняя ошибка.
    </p>
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
      сохраняются исключительно служебные настройки: выбранная тема (светлая/тёмная),
      факт показа приветственного попапа, таймстамп последнего визита
      (чтобы не показывать экран загрузки чаще одного раза в 5 минут).
    </p>

    <H3>2. Куки и аналитика</H3>
    <p>
      Сторонние куки не устанавливаются. Анонимная агрегированная статистика
      может собираться для диагностики (версия браузера, страна, время запроса)
      и не связывается с конкретным пользователем.
    </p>

    <H3>3. Обращения к внешним сервисам</H3>
    <p>
      При нажатии «Уточнить у ИИ» твой вопрос передаётся провайдеру LLM
      (OpenRouter) без идентификаторов пользователя. Превью к записям
      собеседований грузятся с серверов YouTube — это стандартное поведение
      встраиваемого плеера.
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
    <Page title="СТАТУС" kicker="›СТАТУС">
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
      PrepRoom — пет-проект, запущенный в 2026 году как часть
      выпускной работы в СибГУТИ. Развивается в open-source парадигме:
      база вопросов пополняется из публичных YouTube-интервью,
      весь код доступен на GitHub.
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