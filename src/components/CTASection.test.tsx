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

  it("renders the 3 calendar platform buttons", () => {
    render(<CTASection />);
    expect(screen.getByRole("button", { name: /Google Agenda/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Outlook/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Apple Calendar/i })).toBeInTheDocument();
  });

  it("renders the ICS fallback button", () => {
    render(<CTASection />);
    expect(screen.getByRole("button", { name: /Outro calendário/i })).toBeInTheDocument();
  });

  it("renders the subtitle text", () => {
    render(<CTASection />);
    expect(
      screen.getByText(/Adicione o evento ao seu calendário/i)
    ).toBeInTheDocument();
  });
});
