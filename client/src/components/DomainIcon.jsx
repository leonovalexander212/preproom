import React from "react";

/**
 * Возвращает визуальный id по slug направления.
 * Поддерживаем то, что реально есть в БД: python, java, php, qa, frontend.
 */
function pickId(slug = "") {
  const s = slug.toLowerCase();
  if (s.includes("python")) return "python";
  if (s.includes("java") && !s.includes("javascript") && !s.includes("script")) return "java";
  if (s.includes("php")) return "php";
  if (s === "qa" || s.includes("qa") || s.includes("test")) return "qa";
  if (
    s.includes("front") ||
    s.includes("react") ||
    s === "js" ||
    s.includes("javascript") ||
    s.includes("typescript") ||
    s === "ts"
  )
    return "frontend";
  return "unknown";
}

const SVG_BASE = {
  width: 56,
  height: 56,
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  overflow: "visible",
};

export default function DomainIcon({ slug, hasContent = true }) {
  if (!hasContent) return <UnknownIcon />;

  const id = pickId(slug);
  if (id === "python") return <PythonIcon />;
  if (id === "java") return <JavaIcon />;
  if (id === "php") return <PhpIcon />;
  if (id === "qa") return <QaIcon />;
  if (id === "frontend") return <FrontendIcon />;
  return <UnknownIcon />;
}

/* ============ Python: два смещённых rounded-rect ============ */
function PythonIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--python">
      {/* верхняя долька — голова сверху-слева */}
      <rect x="8"  y="10" width="30" height="22" rx="6" ry="6" />
      {/* нижняя долька — хвост снизу-справа */}
      <rect x="26" y="32" width="30" height="22" rx="6" ry="6" />
      {/* глазки — по центру каждой дольки, мигают по очереди */}
      <circle className="py-eye py-eye--top" cx="14" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <circle className="py-eye py-eye--bot" cx="50" cy="48" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ============ Java: кружка с паром ============ */
function JavaIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--java">
      {/* пар */}
      <g className="java-steam">
        <path d="M20 12 q3 4 0 8 q-3 4 0 8" />
        <path d="M30 8  q3 4 0 8 q-3 4 0 8" className="java-steam--mid" />
        <path d="M40 12 q3 4 0 8 q-3 4 0 8" />
      </g>
      {/* кружка */}
      <path d="M14 32 h28 v12 a8 8 0 0 1 -8 8 H22 a8 8 0 0 1 -8 -8 z" />
      {/* ручка */}
      <path d="M42 36 h6 a5 5 0 0 1 0 10 h-6" />
      {/* блюдце */}
      <path d="M10 56 h36" />
    </svg>
  );
}

/* ============ PHP: наклонный овал-вордмарк ============ */
function PhpIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--php">
      <ellipse cx="32" cy="32" rx="26" ry="14" transform="rotate(-8 32 32)" />
      {/* P */}
      <path d="M16 28 v10 M16 28 h5 a3 3 0 0 1 0 6 h-5" />
      {/* H */}
      <path d="M28 28 v10 M36 28 v10 M28 33 h8" />
      {/* P */}
      <path d="M40 28 v10 M40 28 h5 a3 3 0 0 1 0 6 h-5" />
    </svg>
  );
}

/* ============ QA: жук + сканер (тот же цвет, что иконка) ============ */
function QaIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--qa">
      {/* антенны */}
      <path className="qa-ant qa-ant--l" d="M22 14 l4 6" />
      <path className="qa-ant qa-ant--r" d="M42 14 l-4 6" />
      {/* голова */}
      <ellipse cx="32" cy="22" rx="6" ry="4" />
      {/* тело */}
      <rect x="22" y="24" width="20" height="22" rx="10" />
      {/* сегмент */}
      <path d="M22 34 h20" />
      {/* левые лапки */}
      <path className="qa-leg qa-leg--l1" d="M22 28 l-8 -2" />
      <path className="qa-leg qa-leg--l2" d="M22 35 l-8  0" />
      <path className="qa-leg qa-leg--l3" d="M22 42 l-8  2" />
      {/* правые лапки */}
      <path className="qa-leg qa-leg--r1" d="M42 28 l8 -2" />
      <path className="qa-leg qa-leg--r2" d="M42 35 l8  0" />
      <path className="qa-leg qa-leg--r3" d="M42 42 l8  2" />
    </svg>
  );
}

/* ============ Frontend: </> без курсора, с пульсом ============ */
function FrontendIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--frontend">
      {/* < */}
      <path className="fe-bracket" d="M20 18 L8 32 L20 46" />
      {/* > */}
      <path className="fe-bracket" d="M44 18 L56 32 L44 46" />
      {/* / */}
      <path className="fe-slash" d="M38 14 L26 50" />
    </svg>
  );
}

/* ============ ??? — загадочное направление ============ */
function UnknownIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--unknown">
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="'Space Mono', ui-monospace, monospace"
        fontSize="28"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        <tspan className="qm qm--1">?</tspan>
        <tspan className="qm qm--2" dx="2">?</tspan>
        <tspan className="qm qm--3" dx="2">?</tspan>
      </text>
    </svg>
  );
}