import React, { useState } from "react";

const ICON_FILES = {
  "go": "/icons/go.svg",
  "rust": "/icons/rust.svg",
  "csharp": "/icons/csharp.svg",
  "cpp": "/icons/cpp.svg",
  "android": "/icons/android.svg",
  "devops": "/icons/devops.svg",
  "aqa": "/icons/aqa.svg",
  "data-science": "/icons/data-science.svg",
  "data-analyst": "/icons/data-analyst.svg",
  "data-engineer": "/icons/data-engineer.svg",
  "ai-engineer": "/icons/ai-engineer.svg",
  "unity": "/icons/unity.svg",
  "3d-artist": "/icons/three-d.svg",
  "seo": "/icons/seo.svg",
  "product-manager": "/icons/product-manager.svg",
  "business-analyst": "/icons/business-analyst.svg",
  "reverse-engineer": "/icons/reverse-engineer.svg",
  "1c": "/icons/1c.svg",
};

const SVG_BASE = {
  width: 56, height: 56, viewBox: "0 0 64 64", fill: "none",
  stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round",
  strokeLinejoin: "round", overflow: "visible",
};

export default function DomainIcon({ slug, hasContent = true, size = 52 }) {
  const [errored, setErrored] = useState(false);
  const s = (slug || "").toLowerCase();

  if (!hasContent) return <UnknownIcon />;

  const fileSrc = ICON_FILES[s];
  if (fileSrc && !errored) {
    return (
      <span
        className="domain-icon domain-icon--mask"
        role="img"
        aria-label={slug}
        style={{
          width: size, height: size, display: "block",
          WebkitMaskImage: `url(${fileSrc})`, maskImage: `url(${fileSrc})`,
          WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
          WebkitMaskPosition: "center", maskPosition: "center",
          WebkitMaskSize: "contain", maskSize: "contain",
          transition: "transform 220ms ease, background-color 200ms ease",
        }}
      />
    );
  }

  if (s.includes("python")) return <PythonIcon />;
  if (s.includes("java") && !s.includes("script")) return <JavaIcon />;
  if (s.includes("php")) return <PhpIcon />;
  if (s === "qa" || s.includes("test")) return <QaIcon />;
  if (s.includes("front") || s.includes("react") || s === "js" || s.includes("javascript")) return <FrontendIcon />;

  return <UnknownIcon />;
}

function PythonIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--python">
      <rect x="8" y="10" width="30" height="22" rx="6" ry="6" />
      <rect x="26" y="32" width="30" height="22" rx="6" ry="6" />
      <circle className="py-eye py-eye--top" cx="14" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <circle className="py-eye py-eye--bot" cx="50" cy="48" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function JavaIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--java">
      <g className="java-steam">
        <path d="M20 12 q3 4 0 8 q-3 4 0 8" />
        <path d="M30 8  q3 4 0 8 q-3 4 0 8" className="java-steam--mid" />
        <path d="M40 12 q3 4 0 8 q-3 4 0 8" />
      </g>
      <path d="M14 32 h28 v12 a8 8 0 0 1 -8 8 H22 a8 8 0 0 1 -8 -8 z" />
      <path d="M42 36 h6 a5 5 0 0 1 0 10 h-6" />
      <path d="M10 56 h36" />
    </svg>
  );
}

function PhpIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--php">
      <ellipse cx="32" cy="32" rx="26" ry="14" transform="rotate(-8 32 32)" />
      <path d="M16 28 v10 M16 28 h5 a3 3 0 0 1 0 6 h-5" />
      <path d="M28 28 v10 M36 28 v10 M28 33 h8" />
      <path d="M40 28 v10 M40 28 h5 a3 3 0 0 1 0 6 h-5" />
    </svg>
  );
}

function QaIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--qa">
      <path className="qa-ant qa-ant--l" d="M22 14 l4 6" />
      <path className="qa-ant qa-ant--r" d="M42 14 l-4 6" />
      <ellipse cx="32" cy="22" rx="6" ry="4" />
      <rect x="22" y="24" width="20" height="22" rx="10" />
      <path d="M22 34 h20" />
      <path className="qa-leg qa-leg--l1" d="M22 28 l-8 -2" />
      <path className="qa-leg qa-leg--l2" d="M22 35 l-8  0" />
      <path className="qa-leg qa-leg--l3" d="M22 42 l-8  2" />
      <path className="qa-leg qa-leg--r1" d="M42 28 l8 -2" />
      <path className="qa-leg qa-leg--r2" d="M42 35 l8  0" />
      <path className="qa-leg qa-leg--r3" d="M42 42 l8  2" />
    </svg>
  );
}

function FrontendIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--frontend">
      <path className="fe-bracket" d="M20 18 L8 32 L20 46" />
      <path className="fe-bracket" d="M44 18 L56 32 L44 46" />
      <path className="fe-slash" d="M38 14 L26 50" />
    </svg>
  );
}

function UnknownIcon() {
  return (
    <svg {...SVG_BASE} className="domain-icon domain-icon--unknown">
      <text x="32" y="42" textAnchor="middle" fontFamily="monospace" fontSize="28" fontWeight="700" fill="currentColor" stroke="none">???</text>
    </svg>
  );
}