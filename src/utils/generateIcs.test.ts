import { describe, expect, it } from "vitest";
import { generateIcs } from "./generateIcs";

describe("generateIcs", () => {
  const baseEvent = {
    title: "Casamento de Nome & Nome",
    startDate: new Date("2026-11-08T16:00:00"),
    endDate: new Date("2026-11-08T23:00:00"),
    location: "Local do Casamento",
    description: "Save the Date",
  };

  it("returns a string", () => {
    const result = generateIcs(baseEvent);
    expect(typeof result).toBe("string");
  });

  it("starts with BEGIN:VCALENDAR and ends with END:VCALENDAR", () => {
    const result = generateIcs(baseEvent);
    expect(result).toMatch(/^BEGIN:VCALENDAR/);
    expect(result).toMatch(/END:VCALENDAR$/);
  });

  it("contains BEGIN:VEVENT and END:VEVENT", () => {
    const result = generateIcs(baseEvent);
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain("END:VEVENT");
  });

  it("includes SUMMARY with the event title", () => {
    const result = generateIcs(baseEvent);
    expect(result).toContain("SUMMARY:Casamento de Nome & Nome");
  });

  it("formats dates correctly as YYYYMMDDTHHMMSS", () => {
    const result = generateIcs(baseEvent);
    expect(result).toContain("DTSTART:20261108T160000");
    expect(result).toContain("DTEND:20261108T230000");
  });

  it("includes LOCATION", () => {
    const result = generateIcs(baseEvent);
    expect(result).toContain("LOCATION:Local do Casamento");
  });

  it("includes DESCRIPTION", () => {
    const result = generateIcs(baseEvent);
    expect(result).toContain("DESCRIPTION:Save the Date");
  });

  it("escapes backslashes in strings", () => {
    const event = { ...baseEvent, title: "Test \\ Backslash" };
    const result = generateIcs(event);
    expect(result).toContain("SUMMARY:Test \\\\ Backslash");
  });

  it("escapes semicolons in strings", () => {
    const event = { ...baseEvent, title: "Test ; Semicolon" };
    const result = generateIcs(event);
    expect(result).toContain("SUMMARY:Test \\; Semicolon");
  });

  it("escapes commas in strings", () => {
    const event = { ...baseEvent, title: "Test, Comma" };
    const result = generateIcs(event);
    expect(result).toContain("SUMMARY:Test\\, Comma");
  });

  it("escapes newlines in strings", () => {
    const event = { ...baseEvent, description: "Line1\nLine2" };
    const result = generateIcs(event);
    expect(result).toContain("DESCRIPTION:Line1\\nLine2");
  });

  it("includes PRODID and VERSION", () => {
    const result = generateIcs(baseEvent);
    expect(result).toContain("PRODID:-//Wedding//PT-BR");
    expect(result).toContain("VERSION:2.0");
  });

  it("uses CRLF line endings", () => {
    const result = generateIcs(baseEvent);
    const lines = result.split("\r\n");
    expect(lines.length).toBeGreaterThan(1);
    // Each line should not contain bare \n
    for (const line of lines) {
      expect(line).not.toContain("\n");
    }
  });
});
