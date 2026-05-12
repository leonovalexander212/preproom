import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DirectionQuestions from "./DirectionQuestions.jsx";

vi.mock("../lib/api.js", () => ({
  api: {
    getDirectionQuestions: vi.fn(),
  },
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    from: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

vi.mock("../components/AiChat.jsx", () => ({
  default: ({ questionText, onClose }) => (
    <div data-testid="ai-chat">{questionText}<button onClick={onClose}>Close</button></div>
  ),
}));

vi.mock("./Recordings.jsx", () => ({
  Pagination: ({ page, totalPages, onChange }) => (
    <div data-testid="pagination">
      Page {page} of {totalPages}
      <button onClick={() => onChange(page + 1)}>Next</button>
    </div>
  ),
}));

import { api } from "../lib/api.js";
const mockApi = api;

function renderWithRouter(slug = "python") {
  return render(
    <MemoryRouter initialEntries={[`/d/${slug}`]}>
      <Routes>
        <Route path="/d/:slug" element={<DirectionQuestions />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("DirectionQuestions", () => {
  const mockData = {
    direction: { name: "Python", slug: "python", totalInterviews: 5, hasDifficultyLevels: true },
    questions: [
      { id: "q1", text: "What is GIL?", difficulty: "JUNIOR", type: "TECHNICAL", answer: "Global Interpreter Lock", topic: { name: "Core", slug: "core" }, occurrences: 3, totalInterviews: 5, probability: 0.6 },
      { id: "q2", text: "Explain decorators", difficulty: "MIDDLE", type: "TECHNICAL", answer: "Decorators are...", topic: { name: "Advanced", slug: "advanced" }, occurrences: 2, totalInterviews: 5, probability: 0.4 },
      { id: "q3", text: "Tell me about yourself", difficulty: "JUNIOR", type: "BEHAVIORAL", answer: "...", topic: null, occurrences: 1, totalInterviews: 5, probability: 0.2 },
    ],
  };

  it("renders questions after load", async () => {
    mockApi.getDirectionQuestions.mockResolvedValue(mockData);
    renderWithRouter();
    await waitFor(() => expect(screen.getByText("What is GIL?")).toBeInTheDocument());
    expect(screen.getByText("Explain decorators")).toBeInTheDocument();
    expect(screen.getByTestId("dq-counter-number")).toBeInTheDocument();
    expect(screen.getByTestId("dq-counter-label")).toHaveTextContent(/ВОПРОСОВ/i);
  });

  it("filters by tab (TECHNICAL / BEHAVIORAL)", async () => {
    mockApi.getDirectionQuestions.mockResolvedValue(mockData);
    renderWithRouter();
    await waitFor(() => expect(screen.getByText("What is GIL?")).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("dq-tab-behavioral"));
    await waitFor(() => expect(screen.queryByText("What is GIL?")).not.toBeInTheDocument());
    expect(screen.getByText("Tell me about yourself")).toBeInTheDocument();
  });

  it("filters by difficulty level", async () => {
    mockApi.getDirectionQuestions.mockResolvedValue(mockData);
    renderWithRouter();
    await waitFor(() => expect(screen.getByText("What is GIL?")).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("dq-level-middle"));
    expect(mockApi.getDirectionQuestions).toHaveBeenCalledWith("python", { difficulty: "MIDDLE" });
  });

  it("handles error gracefully", async () => {
    mockApi.getDirectionQuestions.mockRejectedValue(new Error("Network error"));
    renderWithRouter();
    await waitFor(() => expect(mockApi.getDirectionQuestions).toHaveBeenCalled());
  });

  it("renders breadcrumb with correct link", async () => {
    mockApi.getDirectionQuestions.mockResolvedValue(mockData);
    renderWithRouter();
    await waitFor(() => expect(screen.getByText("What is GIL?")).toBeInTheDocument());
    const breadcrumb = screen.getByTestId("crumb-directions");
    expect(breadcrumb).toHaveAttribute("href", "/directions");
  });
});
