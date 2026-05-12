import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  keywords,
  pathname = "",
  ogImage = "https://preproom.ru/og-image.jpg",
  noindex = false,
}) {
  const siteUrl = "https://preproom.ru";
  const fullUrl = `${siteUrl}${pathname}`;
  const fullTitle = title ? `${title} — PREPROOM` : "PREPROOM — Подготовка к IT-собеседованиям";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
