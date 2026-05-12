import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Recordings, { Pagination } from "./Recordings.jsx";

vi.mock("../lib/api.js", () => ({
  api: {
    getInterviews: vi.fn(),
    getDirections: vi.fn(),
  },
}));

import { api } from "../lib/api.js";
const mockApi = api;

describe("Recordings", () => {
  it("renders interviews after load", async () => {
    mockApi.getInterviews.mockResolvedValue([
      { id: "1", title: "Python Interview", videoUrl: "https://youtube.com/watch?v=abc", directionName: "Python", questionCount: 15 },
    ]);
    mockApi.getDirections.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("Python Interview")).toBeInTheDocument());
  });

  it("renders error state", async () => {
    mockApi.getInterviews.mockRejectedValue(new Error("fail"));
    mockApi.getDirections.mockResolvedValue([]);
    render(
      <MemoryRouter>
        <Recordings />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/ОШИБКА/i)).toBeInTheDocument());
  });
});

describe("Pagination", () => {
  it("renders page numbers", () => {
    render(<Pagination page={1} totalPages={3} onChange={vi.fn()} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("←")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("calls onChange when clicking next", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onChange={onChange} />);
    fireEvent.click(screen.getByText(/→/i));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
