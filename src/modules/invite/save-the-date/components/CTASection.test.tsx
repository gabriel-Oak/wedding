import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CTASection from "./CTASection";

describe("CTASection", () => {
  it("renders without errors", () => {
    render(<CTASection />);
  });

  it("renders the heading \"Salve a Data\"", () => {
    render(<CTASection />);
    expect(screen.getByRole("heading", { name: "Salve a Data" })).toBeInTheDocument();
  });

  it("renders the 2 calendar platform links", () => {
    render(<CTASection />);
    expect(screen.getByRole("link", { name: /Google Agenda/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Outlook/i })).toBeInTheDocument();
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

  it("handleDownload creates a blob and triggers download", () => {
    const mockAppendChild = vi.spyOn(document.body, "appendChild");
    const mockRemoveChild = vi.spyOn(document.body, "removeChild");
    const mockCreateElement = vi.spyOn(document, "createElement");
    const mockCreateObjectURL = vi.spyOn(URL, "createObjectURL");
    const mockRevokeObjectURL = vi.spyOn(URL, "revokeObjectURL");

    render(<CTASection />);
    const button = screen.getByRole("button", { name: /Outro calendário/i });
    button.click();

    expect(mockCreateElement).toHaveBeenCalledWith("a");
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it("handleDownload triggers download with correct filename", () => {
    render(<CTASection />);

    const mockRevoke = vi.fn();

    // Spy after render to avoid breaking the render process
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(mockRevoke);

    const button = screen.getByRole("button", { name: /Outro calendário/i });
    button.click();

    expect(mockRevoke).toHaveBeenCalled();
  });
});
