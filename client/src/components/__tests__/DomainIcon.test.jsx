import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DomainIcon from "../DomainIcon.jsx";

describe("DomainIcon", () => {
  it.each([
    ["python",   "domain-icon--python"],
    ["java",     "domain-icon--java"],
    ["php",      "domain-icon--php"],
    ["qa",       "domain-icon--qa"],
    ["frontend", "domain-icon--frontend"],
  ])("рендерит иконку '%s' когда hasContent=true", (slug, klass) => {
    const { container } = render(<DomainIcon slug={slug} hasContent />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg.className.baseVal).toContain(klass);
  });

  it("рендерит ??? когда hasContent=false (даже если slug известен)", () => {
    const { container } = render(<DomainIcon slug="python" hasContent={false} />);
    const svg = container.querySelector("svg");
    expect(svg.className.baseVal).toContain("domain-icon--unknown");
    expect(container.textContent).toContain("?");
  });

  it("рендерит ??? для неизвестного slug", () => {
    const { container } = render(<DomainIcon slug="haskell" hasContent />);
    const svg = container.querySelector("svg");
    expect(svg.className.baseVal).toContain("domain-icon--unknown");
  });

  it("в иконке ??? три знака вопроса", () => {
    const { container } = render(<DomainIcon slug="haskell" hasContent />);
    const text = container.querySelector("text").textContent;
    expect(text).toBe("???");
  });
});