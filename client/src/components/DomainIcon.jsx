import React from "react";

const KNOWN = ["python", "sql", "ml", "frontend", "java"];

// маппинг slug → визуальный id
function pickId(slug = "") {
  const s = slug.toLowerCase();
  if (s.includes("python")) return "python";
  if (s.includes("c#") || s.includes("csharp") || s.includes("dotnet") || s.includes(".net")) return "csharp";
  if (s.includes("c++") || s.includes("cpp")) return "cpp";
  if (s.includes("go") || s.includes("golang")) return "go";
  if (s.includes("rust")) return "rust";
  if (s.includes("kotlin")) return "kotlin";
  if (s.includes("java") || s.includes("spring")) return "java";
  if (s.includes("front") || s.includes("react") || s.includes("js") || s.includes("ts")) return "frontend";
  if (s.includes("sql") || s.includes("postgres") || s.includes("db")) return "sql";
  if (s.includes("ml") || s.includes("ai") || s.includes("data")) return "ml";
  return "more";
}

export default function DomainIcon({ slug }) {
  const id = KNOWN.includes(slug) ? slug : pickId(slug);
  const props = {
    width: 44, height: 44, viewBox: "0 0 48 48", fill: "none",
    stroke: "currentColor", strokeWidth: 2.2,
    strokeLinecap: "square", strokeLinejoin: "miter",
    className: `domain-icon domain-icon--${id}`,
  };

  if (id === "python") return (
    <svg {...props}>
      <path d="M14 10 h14 a4 4 0 0 1 4 4 v10 h-18 a4 4 0 0 0 -4 4 v6"/>
      <path d="M34 38 h-14 a4 4 0 0 1 -4 -4 v-10 h18 a4 4 0 0 0 4 -4 v-6"/>
      <circle cx="18" cy="14" r="1.4" fill="currentColor" stroke="none"/>
      <circle cx="30" cy="34" r="1.4" fill="currentColor" stroke="none"/>
    </svg>);

  if (id === "sql") return (
    <svg {...props}>
      <ellipse cx="24" cy="12" rx="14" ry="4"/>
      <path d="M10 12 v10 c0 2.2 6.3 4 14 4 s14 -1.8 14 -4 v-10"/>
      <path d="M10 22 v10 c0 2.2 6.3 4 14 4 s14 -1.8 14 -4 v-10"/>
    </svg>);

  if (id === "ml") return (
    <svg {...props}>
      <circle cx="10" cy="12" r="3"/><circle cx="10" cy="24" r="3"/><circle cx="10" cy="36" r="3"/>
      <circle cx="24" cy="18" r="3"/><circle cx="24" cy="30" r="3"/><circle cx="38" cy="24" r="3"/>
      <path d="M13 12 L21 18 M13 24 L21 18 M13 24 L21 30 M13 36 L21 30 M27 18 L35 24 M27 30 L35 24"/>
    </svg>);

  if (id === "frontend") return (
    <svg {...props}>
      <path d="M16 14 L6 24 L16 34"/><path d="M32 14 L42 24 L32 34"/><path d="M28 10 L20 38"/>
    </svg>);

  if (id === "java") return (
    <svg {...props}>
      <path d="M12 20 h22 v12 a6 6 0 0 1 -6 6 h-10 a6 6 0 0 1 -6 -6 z"/>
      <path d="M34 22 h4 a4 4 0 0 1 0 8 h-4"/>
      <path d="M18 10 q2 3 0 6" className="steam"/>
      <path d="M24 8 q2 3 0 6" className="steam"/>
      <path d="M30 10 q2 3 0 6" className="steam"/>
    </svg>);

  if (id === "csharp") return (
    <svg {...props}>
      <path d="M10 24 q4 -10 14 -10 q5 0 8 3"/>
      <path d="M10 24 q4 10 14 10 q5 0 8 -3"/>
      <path d="M30 14 v8 M34 14 v8 M28 18 h8 M28 22 h8"/>
    </svg>);

  if (id === "cpp") return (
    <svg {...props}>
      <path d="M30 14 a14 14 0 1 0 0 20"/>
      <path d="M36 18 v6 M40 18 v6 M34 21 h8 M38 26 h8 M42 26 v6 M46 26 v6 M40 29 h8"/>
    </svg>);

  if (id === "go") return (
    <svg {...props}>
      <circle cx="20" cy="24" r="3" fill="currentColor"/>
      <circle cx="32" cy="24" r="3" fill="currentColor"/>
      <path d="M6 20 h10 M6 24 h8 M6 28 h10"/>
      <path d="M38 24 q4 4 0 8"/>
    </svg>);

  if (id === "rust") return (
    <svg {...props}>
      <circle cx="24" cy="24" r="12"/>
      <path d="M24 8 v6 M24 34 v6 M8 24 h6 M34 24 h6 M14 14 l4 4 M30 30 l4 4 M30 18 l4 -4 M14 34 l4 -4"/>
    </svg>);

  if (id === "kotlin") return (
    <svg {...props}>
      <path d="M10 10 h28 L10 38 z"/>
      <path d="M10 10 L24 24 L10 38"/>
    </svg>);

  return (
    <svg {...props}>
      <path d="M24 10 v28 M10 24 h28"/>
      <circle cx="24" cy="24" r="16" strokeDasharray="4 4"/>
    </svg>);
}