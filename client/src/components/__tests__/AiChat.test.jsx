import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AiChat from "../AiChat.jsx";

// мокаем fetch — реальный SSE нам не нужен в юнит-тестах
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    body: { getReader: () => ({ read: () => Promise.resolve({ done: true, value: undefined }) }) },
  });
});

describe("AiChat", () => {
  it("монтируется в document.body через портал (не внутрь parent-контейнера)", () => {
    const parent = document.createElement("div");
    parent.id = "transformed-parent";
    parent.style.transform = "translate3d(0,0,0)"; // имитация Lenis/GSAP
    document.body.appendChild(parent);

    render(<AiChat questionId="q1" questionText="Тестовый вопрос" onClose={() => {}} />, {
      container: parent,
    });

    const chat = screen.getByTestId("ai-chat");
    // ключевая проверка: чат НЕ внутри трансформированного предка
    expect(parent.contains(chat)).toBe(false);
    expect(document.body.contains(chat)).toBe(true);
  });

  it("использует position:fixed и занимает весь viewport", () => {
    render(<AiChat questionId="q1" questionText="?" onClose={() => {}} />);
    const chat = screen.getByTestId("ai-chat");
    const style = chat.style;
    expect(style.position).toBe("fixed");
    expect(style.width).toBe("100vw");
    expect(style.height).toBe("100vh");
  });

  it("закрывается по Escape", () => {
    const onClose = vi.fn();
    render(<AiChat questionId="q1" questionText="?" onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("закрывается по клику на overlay, но НЕ по клику на панель", () => {
    const onClose = vi.fn();
    render(<AiChat questionId="q1" questionText="?" onClose={onClose} />);
    fireEvent.click(screen.getByTestId("ai-chat-panel"));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("ai-chat"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("кнопка ESC ✕ вызывает onClose", () => {
    const onClose = vi.fn();
    render(<AiChat questionId="q1" questionText="?" onClose={onClose} />);
    fireEvent.click(screen.getByTestId("ai-chat-close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("показывает текст вопроса", () => {
    render(<AiChat questionId="q1" questionText="Что такое замыкание?" onClose={() => {}} />);
    expect(screen.getByText("Что такое замыкание?")).toBeInTheDocument();
  });

  it("блокирует body overflow на время жизни и восстанавливает после размонтирования", () => {
    document.body.style.overflow = "auto";
    const { unmount } = render(<AiChat questionId="q1" questionText="?" onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});