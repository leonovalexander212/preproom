import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ROUTE_META = {
  "/": {
    title: "Подготовка к IT-собеседованиям",
    description:
      "Бесплатная платформа для подготовки к техническим собеседованиям. 1000+ вопросов с вероятностью встречаемости, мок-интервью с ИИ, видео-разборы.",
    keywords: "собеседование IT, технические вопросы, подготовка интервью, Python, Frontend, Java, QA",
  },
  "/directions": {
    title: "Направления",
    description: "Все IT-направления для подготовки к собеседованию: Python, Frontend, Java, QA, DevOps и другие.",
    keywords: "направления IT, Python, Frontend, Java, QA, DevOps, собеседование",
  },
  "/tests": {
    title: "Тесты",
    description: "Тест на определение IT-направления. Узнай, какая профессия тебе подходит.",
    keywords: "тест IT направление, профориентация, карьера в IT",
  },
  "/mock": {
    title: "Мок-интервью",
    description: "Пройди мок-собеседование с ИИ. Технические вопросы, лайвкодинг, оценка ответов.",
    keywords: "мок интервью, собеседование с ИИ, тренировка интервью",
  },
  "/recordings": {
    title: "Видео-собеседования",
    description: "Записи реальных технических собеседований. Разбор вопросов и ответов.",
    keywords: "видео собеседование, разбор интервью, техническое интервью",
  },
  "/docs": {
    title: "Документация",
    description: "Документация платформы PREPROOM.",
  },
  "/privacy": {
    title: "Политика конфиденциальности",
    description: "Политика конфиденциальности PREPROOM.",
    noindex: true,
  },
  "/terms": {
    title: "Условия использования",
    description: "Условия использования платформы PREPROOM.",
    noindex: true,
  },
  "/status": {
    title: "Статус",
    description: "Статус работы платформы PREPROOM.",
    noindex: true,
  },
  "/contact": {
    title: "Контакты",
    description: "Контактная информация PREPROOM.",
    noindex: true,
  },
};

function getMeta(pathname) {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];
  if (pathname.startsWith("/d/")) {
    const slug = pathname.replace("/d/", "");
    return {
      title: `Вопросы ${slug.toUpperCase()}`,
      description: `Технические вопросы по направлению ${slug.toUpperCase()} для подготовки к собеседованию.`,
      keywords: `${slug}, собеседование, технические вопросы`,
    };
  }
  if (pathname.startsWith("/mock/")) {
    return {
      title: "Мок-интервью",
      description: "Прохождение мок-собеседования с ИИ.",
      noindex: true,
    };
  }
  return {
    title: "PREPROOM",
    description: "Подготовка к IT-собеседованиям.",
  };
}

const DEFAULT_OG_IMAGE = "https://preproom.ru/og-image.jpg";

export default function RouteSEO() {
  const { pathname } = useLocation();
  const meta = useMemo(() => getMeta(pathname), [pathname]);
  const siteUrl = "https://preproom.ru";
  const fullUrl = `${siteUrl}${pathname}`;
  const fullTitle = meta.title ? `${meta.title} — PREPROOM` : "PREPROOM";
  const ogImage = DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <link rel="canonical" href={fullUrl} />
      {meta.noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={fullUrl} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />

      {pathname === "/" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "PREPROOM",
            url: "https://preproom.ru/",
            description: meta.description,
            potentialAction: {
              "@type": "SearchAction",
              target: "https://preproom.ru/directions",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      )}
    </Helmet>
  );
}
