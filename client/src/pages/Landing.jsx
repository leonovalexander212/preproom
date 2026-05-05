import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DomainIcon from "../components/DomainIcon.jsx";
import { api } from "../lib/api.js";

gsap.registerPlugin(ScrollTrigger);

const DOMAINS = [
  { id: "python",   name: "PYTHON",   no: "01", desc: "Backend, data science, автоматизация." },
  { id: "frontend", name: "FRONTEND", no: "02", desc: "React, TypeScript, интерфейсы." },
  { id: "java",     name: "JAVA",     no: "03", desc: "Enterprise разработка, Spring." },
  { id: "php",      name: "PHP",      no: "04", desc: "Веб-бэкенд, Laravel, Symfony." },
  { id: "qa",       name: "QA",       no: "05", desc: "Тестирование, автоматизация, качество." },
  { id: "more",     name: "ЕЩЁ",      no: "06", desc: "Все доступные направления платформы.", muted: true },
];

const FEATURES = [
  "Тестовое мок-собеседование с ИИ",
  "Интерактивный терминал",
  "Моментальный результат прохождения",
];

export default function Landing() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const ctaRef = useRef(null);
  const [stats, setStats] = useState({ questions: 0, interviews: 0, directions: 0 });

  useEffect(() => {
    api.getDirections().then((dirs) => {
      const questions   = dirs.reduce((s, d) => s + (d._count?.questions   || 0), 0);
      const interviews  = dirs.reduce((s, d) => s + (d._count?.interviews  || 0), 0);
      setStats({ questions, interviews, directions: dirs.length });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.1 });
      gsap.from(".hero-meta", { opacity: 0, y: 20, duration: 0.8, delay: 0.6, stagger: 0.08 });
      gsap.from(".domain-card", {
        scrollTrigger: { trigger: ".domain-grid", start: "top 80%" },
        opacity: 0, y: 60, duration: 0.7, ease: "power3.out", stagger: 0.07,
      });
      gsap.utils.toArray(".reveal-title").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          opacity: 0, y: 40, duration: 0.8, ease: "power3.out",
        });
      });
      gsap.from(".code-block", {
        scrollTrigger: { trigger: ".code-block", start: "top 80%" },
        opacity: 0, scale: 0.96, rotateX: 10, duration: 0.9, ease: "power3.out",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: "power3.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const fmt = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ");

  const statItems = [
    { v: fmt(stats.questions),  l: "ВОПРОСОВ" },
    { v: fmt(stats.interviews), l: "СОБЕСЕДОВАНИЙ" },
    { v: fmt(stats.directions), l: "НАПРАВЛЕНИЯ" },
  ];

  return (
    <div ref={heroRef} style={{ position: "relative", zIndex: 2 }}>
      <section style={{ padding: "180px 28px 60px", maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div className="hero-meta mono" style={{
          fontSize: 11, color: "var(--accent)", letterSpacing: "0.24em",
          marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 12,
          border: "1px solid var(--line)", padding: "6px 12px",
        }}>
          <span style={{ width: 8, height: 8, background: "var(--accent)", display: "inline-block" }} />
          NEW · 2026 · BUILD #0015
        </div>

        <h1 className="display" style={{ fontSize: "clamp(56px, 11vw, 168px)", color: "var(--fg)", margin: 0 }}>
          <div style={{ overflow: "hidden", paddingTop: "0.18em" }}>
            <div className="hero-line">ПРОЙДИ</div>
          </div>
          <div style={{ overflow: "hidden", paddingTop: "0.18em" }}>
            <div className="hero-line" ref={titleRef}>
              <span className="glitch" data-text="ЛЮБОЙ">ЛЮБОЙ</span>
            </div>
          </div>
          <div style={{ overflow: "hidden", paddingTop: "0.18em" }}>
            <div className="hero-line" style={{ color: "var(--accent)" }}>СОБЕС</div>
          </div>
        </h1>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40, alignItems: "end" }}>
          <p className="hero-meta" style={{ fontSize: 16, color: "var(--fg-dim)", lineHeight: 1.55, maxWidth: 540, margin: 0 }}>
            <span style={{ color: "var(--accent)" }}>›</span>{" "}
            Платформа для подготовки к самым требовательным инженерным собеседованиям.
          </p>
          <div className="hero-meta" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Link to="/directions" ref={ctaRef} className="btn-brutal" data-testid="hero-cta-start">
              НАЧАТЬ ПОДГОТОВКУ ↗
            </Link>
          </div>
        </div>

        <div className="hero-meta" style={{
          marginTop: 80, border: "2px solid var(--fg)",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: "var(--card)",
        }}>
          {statItems.map((s, i, arr) => (
            <div key={s.l} style={{ padding: "26px 22px", borderRight: i < arr.length - 1 ? "2px solid var(--fg)" : "none" }}>
              <div className="display" style={{ fontSize: 38, color: "var(--fg)" }} data-testid={`stat-${s.l}`}>{s.v}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.2em", marginTop: 6 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="domains" style={{ padding: "120px 28px 0", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 50, gap: 24 }}>
          <div>
            <div className="mono reveal-title" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.24em", marginBottom: 18 }}>
              › ВЫБЕРИ СТЕК
            </div>
            <h2 className="display reveal-title" style={{ fontSize: "clamp(48px, 7vw, 120px)", margin: 0, color: "var(--fg)" }}>
              НАПРАВЛЕНИЯ
            </h2>
          </div>
          <p className="reveal-title mono" style={{ color: "var(--muted)", fontSize: 12, maxWidth: 280, lineHeight: 1.7 }}>
            Твой личный билет в мир IT-технологий.<br/>
            БЕЗ РЕКЛАМЫ. БЕЗ ПОДПИСОК. ТОЛЬКО ПОДГОТОВКА.
          </p>
        </div>

        <div className="domain-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "2px solid var(--fg)",
        }}>
          {DOMAINS.map((d, idx) => (
            <Link
              key={d.id}
              to={d.id === "more" ? "/directions" : `/d/${d.id}`}
              data-testid={`domain-${d.id}`}
              className="domain-card"
              style={{
                position: "relative", padding: "36px 28px 28px",
                borderRight: (idx % 3 !== 2) ? "2px solid var(--fg)" : "none",
                borderBottom: idx < 3 ? "2px solid var(--fg)" : "none",
                background: d.muted ? "var(--card-muted)" : "var(--card)",
                color: "var(--fg)", minHeight: 240,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                overflow: "hidden", transition: "background 180ms ease, color 180ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e5ff00"; e.currentTarget.style.color = "#000"; }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = d.muted ? "var(--card-muted)" : "var(--card)";
                e.currentTarget.style.color = "var(--fg)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", opacity: 0.7 }}>N°{d.no}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.55 }}>
                  {d.muted ? "ALL ↗" : "OPEN ↗"}
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 18, right: 18, opacity: 0.85, pointerEvents: "none" }}>
                <DomainIcon slug={d.id} />
              </div>

              <div>
                <div className="display" style={{ fontSize: 56, lineHeight: 0.9 }}>{d.name}</div>
                <p style={{ marginTop: 16, fontSize: 12.5, lineHeight: 1.55, opacity: 0.85, maxWidth: "75%" }}>
                  {d.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="simulator" style={{ padding: "160px 28px 0", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "start" }}>
          <div>
            <div className="mono reveal-title" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.24em", marginBottom: 18 }}>
              › СИМУЛЯТОР
            </div>
            <h2 className="display reveal-title" style={{ fontSize: "clamp(44px, 6.4vw, 104px)", margin: 0, color: "var(--fg)" }}>
              MOCK<br/>
              <span style={{ color: "var(--accent)" }}>interview</span>
            </h2>
            <p className="reveal-title" style={{ marginTop: 28, color: "var(--fg-dim)", lineHeight: 1.6, fontSize: 14, maxWidth: 460 }}>
              Наш симулятор позволяет получить опыт прохождения
              мок-собеседования абсолютно бесплатно.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0", display: "grid", gap: 14 }}>
              {FEATURES.map((f, i) => (
                <li key={f} className="reveal-title" style={{
                  display: "flex", alignItems: "center", gap: 16,
                  borderBottom: "1px solid var(--line)", paddingBottom: 14,
                }}>
                  <span className="mono" style={{ color: "var(--accent)", fontSize: 12, minWidth: 28 }}>0{i+1}</span>
                  <span style={{ color: "var(--fg)", fontSize: 15 }}>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/mock" className="btn-ghost reveal-title" style={{ marginTop: 36 }} data-testid="sim-cta">
              ПОПРОБОВАТЬ →
            </Link>
          </div>
          <CodeBlock />
        </div>
      </section>

      <section style={{ marginTop: 140, padding: "20px 0", borderTop: "2px solid var(--fg)", borderBottom: "2px solid var(--fg)", background: "var(--accent)" }}>
        <div className="marquee">
          <div className="marquee-track" style={{ fontFamily: "'Archivo Black'", fontSize: 56, color: "#000", letterSpacing: "-0.03em" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="marquee-seg" style={{ display: "inline-block" }}>
                WORK&nbsp;<span style={{ color: "#000000", margin: "0 28px" }}>✦</span>&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// --- CodeBlock (без изменений) ---
const SCENARIOS = [
  {
    file: "binary_search.py",
    src: [
      [["k","class"], ["s"," "], ["c","Solution:"]],
      [["s","    "], ["c","# Оптимизированный бинарный поиск"]],
      [["s","    "], ["k","def"], ["s"," "], ["fn","search"], ["s","(self, nums, target):"]],
      [["s","        left, right = 0, "], ["nm","len"], ["s","(nums) - 1"]],
      [["s","        "], ["k","while"], ["s"," left <= right:"]],
      [["s","            mid = (left + right) // 2"]],
      [["s","            "], ["k","if"], ["s"," nums[mid] == target:"]],
      [["s","                "], ["k","return"], ["s"," mid"]],
      [["s","            "], ["k","elif"], ["s"," nums[mid] < target:"]],
      [["s","                left = mid + 1"]],
      [["s","            "], ["k","else"], ["s",": right = mid - 1"]],
      [["s","        "], ["k","return"], ["s"," -1"]],
    ],
    term: ["$ python binary_search.py", "Тест 1: ПРОЙДЕН (2ms)", "Тест 2: ПРОЙДЕН (1ms)", "Сложность: O(log n) — OK"],
  },
  {
    file: "two_sum.py",
    src: [
      [["k","def"], ["s"," "], ["fn","two_sum"], ["s","(nums, target):"]],
      [["s","    "], ["c","# хэш-таблица: значение → индекс"]],
      [["s","    seen = {}"]],
      [["s","    "], ["k","for"], ["s"," i, x "], ["k","in"], ["s"," "], ["nm","enumerate"], ["s","(nums):"]],
      [["s","        need = target - x"]],
      [["s","        "], ["k","if"], ["s"," need "], ["k","in"], ["s"," seen:"]],
      [["s","            "], ["k","return"], ["s"," [seen[need], i]"]],
      [["s","        seen[x] = i"]],
      [["s","    "], ["k","return"], ["s"," []"]],
    ],
    term: ["$ pytest two_sum.py -q", "....                    [100%]", "4 passed in 0.08s", "Память: 14.2 MB"],
  },
];
const COLOR = { k: "#ff5b00", c: "#5e5e5e", fn: "#e5ff00", ty: "#fbbf24", nm: "#34d399", s: "#cfcfcf" };

function CodeBlock() {
  const [run, setRun] = useState(0);
  const [typed, setTyped] = useState(0);
  const [termTyped, setTermTyped] = useState(0);
  const scenario = SCENARIOS[run % SCENARIOS.length];
  const fullSrc = scenario.src.map(parts => parts.map(p => p[1]).join("")).join("\n");
  const fullTerm = scenario.term.join("\n");

  useEffect(() => {
    setTyped(0); setTermTyped(0);
    const id = setInterval(() => {
      setTyped(t => { if (t >= fullSrc.length) { clearInterval(id); return t; } return t + 2; });
    }, 22);
    return () => clearInterval(id);
  }, [run, fullSrc.length]);

  useEffect(() => {
    if (typed < fullSrc.length) return;
    const id = setInterval(() => {
      setTermTyped(t => { if (t >= fullTerm.length) { clearInterval(id); return t; } return t + 2; });
    }, 26);
    return () => clearInterval(id);
  }, [typed, fullSrc.length, fullTerm.length]);

  useEffect(() => {
    if (termTyped < fullTerm.length) return;
    const id = setTimeout(() => setRun(r => r + 1), 4500);
    return () => clearTimeout(id);
  }, [termTyped, fullTerm.length]);

  let consumed = 0;
  const visible = scenario.src.map((parts, i) => {
    const lineStr = parts.map(p => p[1]).join("");
    const lineLen = lineStr.length + (i < scenario.src.length - 1 ? 1 : 0);
    const startsAt = consumed; consumed += lineLen;
    const remaining = Math.max(0, typed - startsAt);
    if (remaining <= 0) return { content: null, idx: i };
    let need = Math.min(remaining, lineStr.length);
    const out = [];
    for (let j = 0; j < parts.length; j++) {
      const [kind, str] = parts[j];
      if (need <= 0) break;
      const take = str.slice(0, need);
      out.push(<span key={j} style={{ color: COLOR[kind] || "#cfcfcf", fontStyle: kind === "c" ? "italic" : "normal" }}>{take}</span>);
      need -= take.length;
    }
    return { content: out, idx: i };
  });

  return (
    <div className="code-block" style={{
      border: "2px solid var(--fg)", background: "#000",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
      boxShadow: "10px 10px 0 var(--accent)",
    }} data-testid="code-block">
      <div style={{
        padding: "12px 16px", background: "#fff", color: "#000",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: "2px solid #fff",
        fontWeight: 700, letterSpacing: "0.18em", fontSize: 11, textTransform: "uppercase",
      }}>
        <span style={{ width: 12, height: 12, background: "#ff2d55" }}/>
        <span style={{ width: 12, height: 12, background: "#e5ff00" }}/>
        <span style={{ width: 12, height: 12, background: "#34d399" }}/>
        <span style={{ marginLeft: 12 }}>{scenario.file}</span>
        <span style={{ marginLeft: "auto", color: typed >= fullSrc.length ? "#34d399" : "#ff5b00" }}>
          {typed >= fullSrc.length ? "● READY" : "● TYPING"}
        </span>
      </div>
      <div style={{ padding: "20px 18px", color: "#cfcfcf", lineHeight: 1.7, height: 320, overflow: "hidden" }}>
        {scenario.src.map((_, i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <span style={{ color: "#3a3a3a", width: 24, textAlign: "right", flexShrink: 0 }}>{i+1}</span>
            <span style={{ whiteSpace: "pre" }}>{visible[i] ? visible[i].content : null}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "2px solid #1f1f1f", padding: "14px 18px", background: "#0a0a0a", color: "#888", height: 130, overflow: "hidden" }}>
        <div style={{ color: "#e5ff00", fontSize: 10, letterSpacing: "0.2em", marginBottom: 6 }}>// TERMINAL</div>
        {fullTerm.slice(0, termTyped).split("\n").map((line, i) => (
          <div key={i} style={{ whiteSpace: "pre" }}>
            {line.startsWith("$") ? (<><span style={{ color: "#e5ff00" }}>$</span>{line.slice(1)}</>) :
             line.includes("ПРОЙДЕН") ? <span style={{ color: "#34d399" }}>{line}</span> : line}
          </div>
        ))}
      </div>
    </div>
  );
}