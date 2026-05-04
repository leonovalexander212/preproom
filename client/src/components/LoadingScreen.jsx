import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LINES = [
  "ИНИЦИАЛИЗАЦИЯ ЯДРА...",
  "ЗАГРУЗКА БАЗЫ ВОПРОСОВ...",
  "КОМПИЛЯЦИЯ WEBGL-СЦЕНЫ...",
  "ПРОВЕРКА АЛГОРИТМОВ ОЦЕНКИ...",
  "СИСТЕМА ГОТОВА.",
];

export default function LoadingScreen({ onDone }) {
  const root = useRef(null); const bar = useRef(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(root.current, { yPercent: -100, duration: 0.6, ease: "power3.inOut", onComplete: () => onDone && onDone() });
      },
    });
    tl.to(bar.current, { width: "100%", duration: 2.0, ease: "power2.inOut" });
    LINES.forEach((_, i) => tl.call(() => setStep(i + 1), null, i * 0.32));
    const fallback = setTimeout(() => onDone && onDone(), 4500);
    return () => { tl.kill(); clearTimeout(fallback); };
  }, [onDone]);

  return (
    <div ref={root} className="boot" data-testid="loading-screen">
      <div style={{ width: 320, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "#e5ff00", marginBottom: 14 }}>
          PREPROOM // BOOTING
        </div>
        <div className="boot-bar"><i ref={bar} style={{ width: 0 }} /></div>
        <div className="mono" style={{ marginTop: 18, fontSize: 11, color: "#888", lineHeight: 1.7, minHeight: 130 }}>
          {LINES.slice(0, step).map((l, i) => (
            <div key={i}><span style={{ color: "#e5ff00" }}>›</span> {l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}