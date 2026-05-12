import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import QuizDirection from "./QuizDirection.jsx";

vi.mock("../lib/api.js", () => ({
  api: {
    getDirections: vi.fn().mockResolvedValue([]),
  },
}));

describe("QuizDirection", () => {
  it("shows first question immediately", async () => {
    render(
      <MemoryRouter>
        <QuizDirection />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/ВОПРОС/i)).toBeInTheDocument());
    expect(screen.getByText(/1 \//i)).toBeInTheDocument();
  });

  it("navigates through questions and shows result", async () => {
    render(
      <MemoryRouter>
        <QuizDirection />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/ВОПРОС/i)).toBeInTheDocument());

    for (let i = 0; i < 10; i++) {
      const buttons = screen.getAllByTestId("quiz-circle-btn");
      expect(buttons.length).toBe(7); 
      fireEvent.click(buttons[2]); 
    }


    await waitFor(() => expect(screen.getByText(/РЕЗУЛЬТАТ/i)).toBeInTheDocument());
  });
});
