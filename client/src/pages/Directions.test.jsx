import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Directions from "./Directions.jsx";

vi.mock("../lib/api.js", () => ({
  api: {
    getDirections: vi.fn(),
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

import { api } from "../lib/api.js";

const mockApi = api;

describe("Directions", () => {
  it("renders loading state initially", () => {
    mockApi.getDirections.mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <Directions />
      </MemoryRouter>
    );
    expect(screen.getByText(/ЗАГРУЗКА/i)).toBeInTheDocument();
  });

  it("renders directions after load", async () => {
    mockApi.getDirections.mockResolvedValue([
      { id: "1", slug: "python", name: "Python", description: "Backend", _count: { questions: 42, interviews: 3 } },
      { id: "2", slug: "frontend", name: "Frontend", description: "Web", _count: { questions: 30, interviews: 2 } },
    ]);
    render(
      <MemoryRouter>
        <Directions />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("Python")).toBeInTheDocument());
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText(/42 ВОПР/i)).toBeInTheDocument();
  });

  it("renders error state on failure", async () => {
    mockApi.getDirections.mockRejectedValue(new Error("Network error"));
    render(
      <MemoryRouter>
        <Directions />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/ОШИБКА/i)).toBeInTheDocument());
  });
});
