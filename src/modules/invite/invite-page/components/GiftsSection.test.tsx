import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GiftsSection } from "./GiftsSection";

describe("GiftsSection", () => {
  it("renders the label 'Lista de Presentes'", () => {
    render(<GiftsSection />);
    expect(screen.getByText("Lista de Presentes")).toBeInTheDocument();
  });

  it("renders the Amazon wishlist link with correct href", () => {
    render(<GiftsSection />);
    const link = screen.getByRole("link", { name: /lista na Amazon/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.amazon.com.br/hz/wishlist/ls/1OE1ZE6ZHOH57?ref_=wl_share"
    );
  });

  it("renders the Amazon link with target blank and rel noopener", () => {
    render(<GiftsSection />);
    const link = screen.getByRole("link", { name: /lista na Amazon/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("renders the support text about presence being the best gift", () => {
    render(<GiftsSection />);
    expect(
      screen.getByText(/Sua presença já é o nosso maior presente/i)
    ).toBeInTheDocument();
  });
});
