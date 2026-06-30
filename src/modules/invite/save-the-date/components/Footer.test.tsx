import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders without errors", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("displays the romantic phrase", () => {
    render(<Footer />);
    expect(
      screen.getByText("Nos vemos em 08 de novembro de 2026 💍"),
    ).toBeInTheDocument();
  });

  it("displays the RSVP subtext", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        "O convite com mais informações será enviado em breve.",
      ),
    ).toBeInTheDocument();
  });

  it("has the gold decorative line", () => {
    const { container } = render(<Footer />);
    const borderLine = container.querySelector(".border-wedding-gold");
    expect(borderLine).toBeInTheDocument();
  });
});
