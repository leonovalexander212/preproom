import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import { api } from "../lib/api.js";

export default function AiChat({ questionId, questionText, onClose }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const sentInitial = useRef(false);
  const scroller = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      className="ai-chat-overlay"
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
      <style>{`
        .ai-chat-overlay,
        .ai-chat-panel,
        .ai-chat-panel * {
          box-sizing: border-box;
        }

        .ai-chat-panel {
          box-shadow: -10px 0 0 var(--accent), -18px 0 40px rgba(0,0,0,0.36);
        }

        .ai-chat-markdown pre,
        .ai-chat-markdown code {
          white-space: pre-wrap;
          word-break: break-word;
        }

        .ai-chat-question-text,
        .ai-chat-markdown {
          overflow-wrap: anywhere;
        }

        @media (max-width: 1024px) {
          .ai-chat-overlay {
            justify-content: center !important;
            align-items: flex-end !important;
            padding: 18px !important;
            background: rgba(0,0,0,0.62) !important;
          }

          .ai-chat-panel {
            width: min(760px, 100%) !important;
            height: min(82dvh, 760px) !important;
            max-height: calc(100dvh - 36px) !important;
            border: 2px solid var(--fg) !important;
            border-left: 2px solid var(--fg) !important;
            box-shadow: 8px 8px 0 var(--accent), 0 20px 60px rgba(0,0,0,0.45) !important;
          }

          .ai-chat-header {
            padding: 14px 16px !important;
          }

          .ai-chat-question {
            padding: 14px 16px !important;
          }

          .ai-chat-scroller {
            padding: 16px !important;
          }
        }

        @media (max-width: 560px) {
          .ai-chat-overlay {
            padding: 10px !important;
            align-items: flex-end !important;
          }

          .ai-chat-panel {
            width: 100% !important;
            height: min(86dvh, 620px) !important;
            max-height: calc(100dvh - 20px) !important;
            box-shadow: 5px 5px 0 var(--accent), 0 14px 38px rgba(0,0,0,0.42) !important;
          }

          .ai-chat-header {
            padding: 12px 12px !important;
            gap: 10px;
          }

          .ai-chat-title {
            font-size: 9px !important;
            letter-spacing: 0.16em !important;
          }

          .ai-chat-close {
            padding: 8px 10px !important;
            font-size: 10px !important;
            letter-spacing: 0.12em !important;
          }

          .ai-chat-question {
            padding: 12px 14px !important;
            font-size: 12px !important;
            max-height: 132px;
            overflow-y: auto;
          }

          .ai-chat-scroller {
            padding: 14px !important;
            gap: 14px !important;
          }

          .ai-chat-markdown {
            font-size: 13px !important;
            line-height: 1.55 !important;
            padding: 12px !important;
          }

          .ai-chat-footer {
            padding: 10px !important;
          }

          .ai-chat-footer .mono {
            font-size: 8px !important;
            letter-spacing: 0.14em !important;
          }
        }
      `}</style>

      <div
        data-testid="ai-chat-panel"
        className="ai-chat-panel"
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
          className="ai-chat-header"
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
            className="mono ai-chat-title"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              fontWeight: 700,
            }}
          >
            // ОБЪЯСНЕНИЕ
          </span>

          <button
            onClick={onClose}
            data-testid="ai-chat-close"
            className="mono ai-chat-close"
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
          className="ai-chat-question"
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
          <div className="ai-chat-question-text" style={{ marginTop: 6 }}>{questionText}</div>
        </div>

        <div
          ref={scroller}
          className="ai-chat-scroller"
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
                className="markdown-body ai-chat-markdown"
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
          className="ai-chat-footer"
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