import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CountdownSection from "./CountdownSection";

describe("CountdownSection", () => {
  it("renders without errors", () => {
    render(<CountdownSection />);
  });

  it("renders the section title", () => {
    render(<CountdownSection />);
    expect(
      screen.getByText("Contagem Regressiva")
    ).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<CountdownSection />);
    expect(
      screen.getByText("Um dia especial à beira do Rio Grande")
    ).toBeInTheDocument();
  });

  it("renders all countdown labels", () => {
    render(<CountdownSection />);
    expect(screen.getByText("DIAS")).toBeInTheDocument();
    expect(screen.getByText("HORAS")).toBeInTheDocument();
    expect(screen.getByText("MINUTOS")).toBeInTheDocument();
    expect(screen.getByText("SEGUNDOS")).toBeInTheDocument();
  });

  it("renders countdown numbers", () => {
    render(<CountdownSection />);
    // The hook returns numbers, verify all 4 values are rendered
    const numberElements = screen.getAllByText(/\d+/);
    expect(numberElements).toHaveLength(4);
  });
});
