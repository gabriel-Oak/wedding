import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  it("renders without errors", () => {
    render(<HeroSection />);
  });

  it("renders the \"SAVE THE DATE\" label", () => {
    render(<HeroSection />);
    expect(screen.getByText("SAVE THE DATE")).toBeInTheDocument();
  });

  it("renders the main heading \"Gabriel & Mariana\"", () => {
    render(<HeroSection />);
    expect(screen.getByText("Gabriel & Mariana")).toBeInTheDocument();
  });

  it('renders the date badge "08 . 11 . 2026"', () => {
    render(<HeroSection />);
    expect(screen.getByText("08 . 11 . 2026")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        /A nossa história ganha um novo capítulo no lugar onde o azul do céu encontra o nosso amor/i
      )
    ).toBeInTheDocument();
  });

  it("has the min-h-screen class on the section", () => {
    render(<HeroSection />);
    const section = screen.getByRole("heading", { name: "Gabriel & Mariana" })
      .closest("section") as HTMLElement;
    expect(section).toHaveClass("min-h-screen");
  });
});
