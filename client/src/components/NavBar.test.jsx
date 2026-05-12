import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar.jsx";

describe("NavBar", () => {
  it("renders logo and nav links", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText("PREPROOM")).toBeInTheDocument();
    expect(screen.getAllByText("НАПРАВЛЕНИЯ").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("НАЧАТЬ →").length).toBeGreaterThanOrEqual(1);
  });

  it("toggles mobile sidebar on burger click", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    const burger = screen.getByTestId("burger-btn");
    fireEvent.click(burger);
    expect(screen.getByTestId("mobile-sidebar")).toHaveClass("is-open");
  });
});
