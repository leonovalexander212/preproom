import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api } from "../lib/api.js";
import DomainIcon from "../components/DomainIcon.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function Directions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const root = useRef(null);

  useEffect(() => {
    api.getDirections().then(setItems).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".domain-card", { opacity: 0, y: 60, duration: 0.7, ease: "power3.out", stagger: 0.05 });
    }, root);
    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={root} className="directions-page" style={{ position: "relative", zIndex: 2, paddingTop: 120 }}>
      <style>{`
        .directions-page {
          overflow-x: clip;
        }

        .directions-grid,
        .directions-grid * {
          box-sizing: border-box;
        }

        .directions-grid {
          width: 100%;
          max-width: 100%;
          grid-auto-rows: 1fr;
        }

        .directions-grid .domain-card {
          min-width: 0;
        }

        .directions-card-meta {
          min-width: 0;
          gap: 12px;
        }

        .directions-card-count {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          line-height: 1.1;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        .directions-card-count-line {
          display: block;
        }

        .directions-card-title .display {
          max-width: 100%;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: normal;
        }

        @media (min-width: 832px) {
          .directions-card-title .display {
            font-size: clamp(26px, 3.2vw, 42px) !important;
            letter-spacing: -0.055em;
            line-height: 0.92;
          }

          .directions-card-title--long .display {
            font-size: clamp(22px, 2.55vw, 34px) !important;
            letter-spacing: -0.06em;
          }

          .directions-card-title--extra-long .display {
            font-size: clamp(18px, 2.05vw, 28px) !important;
            letter-spacing: -0.065em;
          }
        }

        @media (max-width: 831px) {
          .directions-grid .domain-card:hover {
            background: var(--card) !important;
            color: var(--fg) !important;
          }

          .directions-page {
            padding-top: 84px !important;
          }

          .directions-hero {
            padding: 34px 16px 20px !important;
          }

          .directions-lead {
            max-width: 100% !important;
            font-size: 12.5px !important;
            line-height: 1.65 !important;
          }

          .directions-grid-section {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 16px !important;
            overflow: hidden;
          }

          .directions-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            border: 2px solid var(--fg) !important;
            overflow: hidden;
          }

          .directions-grid .domain-card {
            width: auto !important;
            min-width: 0 !important;
            min-height: 136px !important;
            padding: 16px 12px 14px !important;
            border-right: 2px solid var(--fg) !important;
            border-bottom: 2px solid var(--fg) !important;
          }

          .directions-grid .domain-card:nth-child(3n) {
            border-right: none !important;
          }

          .directions-card-icon,
          .directions-card-desc {
            display: none !important;
          }

          .directions-card-number {
            font-size: 9px !important;
            letter-spacing: 0.12em !important;
          }

          .directions-card-count {
            font-size: 7px !important;
            letter-spacing: 0.08em !important;
            opacity: 0.65 !important;
          }

          .directions-card-title {
            min-height: 48px !important;
          }

          .directions-card-title .display {
            white-space: normal !important;
            overflow: visible !important;
            overflow-wrap: anywhere;
            word-break: normal;
            hyphens: auto;
            font-size: clamp(16px, 4vw, 28px) !important;
            line-height: 0.96 !important;
            letter-spacing: -0.06em;
          }

          .directions-card-title--long .display {
            font-size: clamp(13px, 3.25vw, 22px) !important;
          }

          .directions-card-title--extra-long .display {
            font-size: clamp(11px, 2.65vw, 18px) !important;
          }
        }

        @media (max-width: 560px) {
          .directions-page {
            padding-top: 82px !important;
          }

          .directions-hero {
            padding: 28px 14px 18px !important;
          }

          .directions-grid-section {
            padding: 0 14px !important;
          }

          .directions-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .directions-grid .domain-card,
          .directions-grid .domain-card:nth-child(3n) {
            min-height: 124px !important;
            padding: 14px 10px 12px !important;
            border-right: 2px solid var(--fg) !important;
            border-bottom: 2px solid var(--fg) !important;
          }

          .directions-grid .domain-card:nth-child(even) {
            border-right: none !important;
          }

          .directions-card-title {
            min-height: 44px !important;
          }

          .directions-card-title .display {
            font-size: clamp(17px, 6.5vw, 28px) !important;
          }

          .directions-card-title--long .display {
            font-size: clamp(12px, 5vw, 21px) !important;
          }

          .directions-card-title--extra-long .display {
            font-size: clamp(10px, 4.2vw, 18px) !important;
          }
        }

        @media (max-width: 380px) {
          .directions-grid-section,
          .directions-hero {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .directions-card-title .display {
            font-size: clamp(15px, 6vw, 24px) !important;
          }

          .directions-card-title--long .display {
            font-size: clamp(11px, 4.6vw, 19px) !important;
          }

          .directions-card-title--extra-long .display {
            font-size: clamp(9px, 3.75vw, 16px) !important;
          }
        }
      `}</style>

      <section className="directions-hero" style={{ padding: "60px 28px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="crumb-tag" data-testid="directions-kicker" style={{ marginBottom: 18 }}>ВЫБИРАЙ</div>

        <h1 className="display directions-page-title" style={{ fontSize: "clamp(56px, 9vw, 140px)", margin: 0, color: "var(--fg)" }}>
          <span className="glitch" data-text="НАПРАВЛЕНИЯ">НАПРАВЛЕНИЯ</span>
        </h1>

        <p className="directions-lead" data-testid="directions-lead" style={{ marginTop: 22, fontSize: 14, color: "var(--fg-dim)", maxWidth: 560, lineHeight: 1.6 }}>
          <span style={{ color: "var(--accent-ink)" }}>›</span> Каждое направление содержит вопросы, ранжированные по реальной частоте встречаемости в собеседованиях.
        </p>
      </section>

      <section className="directions-grid-section" style={{ padding: "0 28px", maxWidth: 1280, margin: "0 auto" }}>
        {error && (
          <div className="mono" style={{ color: "var(--danger)", padding: 24, border: "2px dashed var(--danger)" }}>
            // ОШИБКА: {error}
          </div>
        )}

        {!error && items.length === 0 && (
          <div className="mono" style={{ color: "var(--muted)", padding: 60, textAlign: "center", letterSpacing: "0.2em" }}>
            // ЗАГРУЗКА...
          </div>
        )}

        <div
          className="directions-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: items.length ? "2px solid var(--fg)" : "none",
          }}
        >
          {items.map((d, idx) => {
            const onLastRow = idx >= Math.floor((items.length - 1) / 3) * 3;
            const nameLength = (d.name || "").length;
            const titleSizeClass = nameLength >= 18
              ? "directions-card-title--extra-long"
              : nameLength >= 12
                ? "directions-card-title--long"
                : "";

            return (
              <Link
                key={d.id}
                to={`/d/${d.slug}`}
                data-testid={`direction-${d.slug}`}
                className="domain-card"
                style={{
                  position: "relative",
                  padding: "36px 28px 28px",
                  borderRight: idx % 3 !== 2 ? "2px solid var(--fg)" : "none",
                  borderBottom: !onLastRow ? "2px solid var(--fg)" : "none",
                  background: "var(--card)",
                  color: "var(--fg)",
                  minHeight: 240,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  transition: "background 180ms ease, color 180ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!window.matchMedia("(hover: hover)").matches) return;
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--card)";
                  e.currentTarget.style.color = "var(--fg)";
                }}
              >
                <div className="directions-card-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div
                    className="mono directions-card-number"
                    data-testid={`direction-number-${d.slug}`}
                    style={{ fontSize: 11, letterSpacing: "0.2em", opacity: 0.7 }}
                  >
                    N°{String(idx + 1).padStart(2, "0")}
                  </div>

                  <div
                    className="mono directions-card-count"
                    data-testid={`direction-count-${d.slug}`}
                    style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.55 }}
                  >
                    <span className="directions-card-count-line">{d._count.questions} ВОПР</span>
                    <span className="directions-card-count-line">{d._count.interviews} ВИДЕО</span>
                  </div>
                </div>

                <div className="directions-card-icon" style={{ position: "absolute", bottom: 18, right: 18, opacity: 0.85, pointerEvents: "none" }}>
                  <DomainIcon slug={d.slug} hasContent={(d._count?.questions ?? 0) > 0} />
                </div>

                <div>
                  <div className={`directions-card-title ${titleSizeClass}`} style={{ minHeight: 96, display: "flex", alignItems: "flex-end" }}>
                    <div
                      className="display"
                      data-testid={`direction-title-${d.slug}`}
                      style={{ fontSize: 48, lineHeight: 0.9, margin: 0 }}
                    >
                      {d.name}
                    </div>
                  </div>

                  <p
                    className="directions-card-desc"
                    data-testid={`direction-description-${d.slug}`}
                    style={{
                      marginTop: 14,
                      fontSize: 12.5,
                      lineHeight: 1.55,
                      opacity: 0.85,
                      maxWidth: "75%",
                      minHeight: 40,
                      marginBottom: 0,
                    }}
                  >
                    {d.description || ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}