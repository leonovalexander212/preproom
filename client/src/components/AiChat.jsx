import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../lib/api.js";

export default function AiChat({ questionId, questionText, onClose }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const sentInitial = useRef(false);
  const scroller = useRef(null);

  // ESC закрывает
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Лочим скролл страницы и Lenis
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    return () => {
      document.body.style.overflow = prev;
      if (window.__lenis) window.__lenis.start();
    };
  }, []);

  const send = async (text, opts = {}) => {
    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const res = await fetch(`${api.base}/api/ai/explain`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: opts.firstWithContext ? questionId : undefined, messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("AI request failed");
      const reader = res.body.getReader(); const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n"); buffer = events.pop() || "";
        for (const ev of events) {
          const line = ev.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          try {
            const p = JSON.parse(line.slice(5).trim());
            if (p.type === "chunk") setMessages((prev) => { const c = [...prev]; c[c.length-1] = { role: "assistant", content: c[c.length-1].content + p.content }; return c; });
          } catch {}
        }
      }
    } catch (e) {
      setMessages((prev) => { const c=[...prev]; c[c.length-1]={ role:"assistant", content:"// СБОЙ: "+e.message }; return c; });
    } finally { setStreaming(false); }
  };

  useEffect(() => {
    if (sentInitial.current) return;
    sentInitial.current = true;
    send("Объясни этот вопрос.", { firstWithContext: true });
  }, []);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages]);

  return (
    <div data-testid="ai-chat" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: "min(640px, 100%)", height: "100%", background: "var(--bg)", borderLeft: "2px solid var(--fg)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 22px", borderBottom: "2px solid var(--fg)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--accent)" }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "#000", fontWeight: 700 }}>// AI · ОБЪЯСНЕНИЕ</div>
          <button onClick={onClose} className="mono" style={{ background: "#000", color: "var(--accent)", border: "2px solid #000", padding: "6px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", cursor: "pointer" }}>ESC ✕</button>
        </div>
        <div style={{ padding: "16px 22px", borderBottom: "2px solid var(--line)", color: "var(--fg-dim)", fontSize: 13 }}>
          <span className="mono" style={{ color: "var(--accent-ink)", fontSize: 10, letterSpacing: "0.2em" }}>ВОПРОС</span>
          <div style={{ marginTop: 6 }}>{questionText}</div>
        </div>
        <div ref={scroller} onWheel={(e) => e.stopPropagation()}
          style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.filter(m => m.role === "assistant").map((m, i) => (
            <div key={i} className="markdown-body" style={{ fontSize: 14, lineHeight: 1.6, background: "var(--bg-2)", color: "var(--fg)", border: "2px solid var(--fg)", padding: "12px 14px" }}>
              <ReactMarkdown>{m.content || "▌"}</ReactMarkdown>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "2px solid var(--fg)", padding: 14, background: "var(--bg)", textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--muted)" }}>
            // ВВОД ЗАБЛОКИРОВАН — ЗАКРОЙ ПО ESC ИЛИ КЛИКОМ ВНЕ ОКНА
          </div>
        </div>
      </div>
    </div>
  );
}