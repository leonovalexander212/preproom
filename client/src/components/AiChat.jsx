import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import { api } from "../lib/api.js";

export default function AiChat({ questionId, questionText, onClose }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const sentInitial = useRef(false);
  const scroller = useRef(null);

  // Esc для закрытия
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Лочим скролл страницы и прячем NavBar
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const nav = document.querySelector('header[data-testid="nav-bar"]');

    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPadRight: body.style.paddingRight,
      navVisibility: nav ? nav.style.visibility : "",
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    if (nav) nav.style.visibility = "hidden";

    if (window.__lenis) window.__lenis.stop();

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPadRight;
      if (nav) nav.style.visibility = prev.navVisibility;
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: opts.firstWithContext ? questionId : undefined,
          messages: next,
        }),
      });

      if (!res.ok || !res.body) throw new Error("AI request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const ev of events) {
          const line = ev.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;

          try {
            const p = JSON.parse(line.slice(5).trim());

            if (p.type === "chunk") {
              setMessages((prev) => {
                const c = [...prev];
                c[c.length - 1] = {
                  role: "assistant",
                  content: c[c.length - 1].content + p.content,
                };
                return c;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const c = [...prev];
        c[c.length - 1] = {
          role: "assistant",
          content: "// СБОЙ: " + e.message,
        };
        return c;
      });
    } finally {
      setStreaming(false);
    }
  };

  useEffect(() => {
    if (sentInitial.current) return;
    sentInitial.current = true;
    send("Объясни этот вопрос.", { firstWithContext: true });
  }, []);

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [messages]);

  // === КЛЮЧЕВОЙ ФИКС ===
  // Рендерим ВНЕ любого трансформированного предка — прямо в document.body.
  // Это решает проблему "окно в миллиметр" из-за transform на родителях
  // (Lenis / GSAP / scroll-trigger), которые ломают position:fixed.
  const ui = (
    <div
      data-testid="ai-chat"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
        // важно: исключаем любые transform-наследия
        transform: "none",
        contain: "layout paint",
      }}
    >
      <div
        data-testid="ai-chat-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(640px, 100%)",
          height: "100vh",
          background: "var(--bg)",
          borderLeft: "2px solid var(--fg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: "none",
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            padding: "18px 20px",
            background: "var(--accent)",
            color: "#000",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #000",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              fontWeight: 700,
            }}
          >
            // AI · ОБЪЯСНЕНИЕ
          </span>

          <button
            onClick={onClose}
            data-testid="ai-chat-close"
            className="mono"
            style={{
              background: "#000",
              color: "var(--accent)",
              border: "2px solid #000",
              padding: "8px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              cursor: "pointer",
            }}
          >
            ESC ✕
          </button>
        </div>

        <div
          style={{
            flex: "0 0 auto",
            padding: "16px 22px",
            borderBottom: "2px solid var(--line)",
            color: "var(--fg-dim)",
            fontSize: 13,
          }}
        >
          <span
            className="mono"
            style={{
              color: "var(--accent-ink)",
              fontSize: 10,
              letterSpacing: "0.2em",
            }}
          >
            ВОПРОС
          </span>
          <div style={{ marginTop: 6 }}>{questionText}</div>
        </div>

        <div
          ref={scroller}
          data-lenis-prevent
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {messages
            .filter((m) => m.role === "assistant")
            .map((m, i) => (
              <div
                key={i}
                className="markdown-body"
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  background: "var(--bg-2)",
                  color: "var(--fg)",
                  border: "2px solid var(--fg)",
                  padding: "12px 14px",
                }}
              >
                <ReactMarkdown>{m.content || "▌"}</ReactMarkdown>
              </div>
            ))}
        </div>

        <div
          style={{
            flex: "0 0 auto",
            borderTop: "2px solid var(--fg)",
            padding: 14,
            background: "var(--bg)",
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "var(--muted)",
            }}
          >
            // ЗАКРЫТЬ: ESC ИЛИ КЛИК ВНЕ ОКНА
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}