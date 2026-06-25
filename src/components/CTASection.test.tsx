import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CTASection from "./CTASection";

describe("CTASection", () => {
  it("renders without errors", () => {
    render(<CTASection />);
  });

  it("renders the heading \"Salve a Data\"", () => {
    render(<CTASection />);
    expect(screen.getByRole("heading", { name: "Salve a Data" })).toBeInTheDocument();
  });

  it("renders the download button", () => {
    render(<CTASection />);
    expect(screen.getByRole("button", { name: /Salve a Data/i })).toBeInTheDocument();
  });

  it("renders the subtitle text", () => {
    render(<CTASection />);
    expect(
      screen.getByText(/Adicione o evento ao seu calendário/i)
    ).toBeInTheDocument();
  });
});
