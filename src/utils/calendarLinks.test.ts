import { describe, expect, it } from "vitest";
import { generateCalendarLinks } from "./calendarLinks";
import type { IcsEvent } from "./generateIcs";

describe("generateCalendarLinks", () => {
  const baseEvent: IcsEvent = {
    title: "Casamento de Nome & Nome",
    startDate: new Date("2026-11-08T16:00:00"),
    endDate: new Date("2026-11-08T23:00:00"),
    location: "Local do Casamento",
    description: "Save the Date",
  };

  it("returns an object with google, outlook, apple, and ics keys", () => {
    const result = generateCalendarLinks(baseEvent);
    expect(result).toHaveProperty("google");
    expect(result).toHaveProperty("outlook");
    expect(result).toHaveProperty("apple");
    expect(result).toHaveProperty("ics");
  });

  it("returns strings for all keys", () => {
    const result = generateCalendarLinks(baseEvent);
    expect(typeof result.google).toBe("string");
    expect(typeof result.outlook).toBe("string");
    expect(typeof result.apple).toBe("string");
    expect(typeof result.ics).toBe("string");
  });

  describe("Google Calendar URL", () => {
    it("starts with the correct base URL and question mark", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.google).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/render\?/);
    });

    it("includes action=TEMPLATE", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.google).toContain("action=TEMPLATE");
    });

    it("includes the event title", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.google).toContain(encodeURIComponent("Casamento de Nome & Nome"));
    });

    it("includes dates in YYYYMMDDTHHMMSSZ format (UTC)", () => {
      const result = generateCalendarLinks(baseEvent);
      // The dates should be in UTC (local 16:00 -03:00 = 19:00 UTC)
      expect(result.google).toMatch(/dates=\d{8}T\d{6}Z\/\d{8}T\d{6}Z/);
    });

    it("includes details and location", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.google).toContain(encodeURIComponent("Save the Date"));
      expect(result.google).toContain(encodeURIComponent("Local do Casamento"));
    });
  });

  describe("Outlook URL", () => {
    it("starts with the correct base URL", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.outlook).toMatch(/^https:\/\/outlook\.live\.com\/calendar\/0\/compose\?/);
    });

    it("includes rru=addevent", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.outlook).toContain("rru=addevent");
    });

    it("includes subject, body, and location", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.outlook).toContain(encodeURIComponent("Casamento de Nome & Nome"));
      expect(result.outlook).toContain(encodeURIComponent("Save the Date"));
      expect(result.outlook).toContain(encodeURIComponent("Local do Casamento"));
    });

    it("includes dtstart and dtend with timezone offset", () => {
      const result = generateCalendarLinks(baseEvent);
      // Should contain ISO 8601 dates with offset like -03:00
      // Colons are URL-encoded as %3A
      expect(result.outlook).toMatch(/dtstart=\d{4}-\d{2}-\d{2}T\d{2}%3A\d{2}%3A\d{2}-03%3A00/);
      expect(result.outlook).toMatch(/dtend=\d{4}-\d{2}-\d{2}T\d{2}%3A\d{2}%3A\d{2}-03%3A00/);
    });
  });

  describe("Apple Calendar URL", () => {
    it("returns a data URI containing ICS content", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.apple).toMatch(/^data:text\/calendar;charset=utf-8,/);
      expect(result.apple).toContain("BEGIN%3AVEVENT");
    });
  });

  describe("ICS URL", () => {
    it("returns a blob URL", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.ics).toMatch(/^blob:/);
    });
  });

  describe("Purity", () => {
    it("returns the same URLs for the same event (except blob URLs)", () => {
      const result1 = generateCalendarLinks(baseEvent);
      const result2 = generateCalendarLinks(baseEvent);
      expect(result1.google).toBe(result2.google);
      expect(result1.outlook).toBe(result2.outlook);
    });
  });

  describe("Special characters", () => {
    it("encodes special characters in title", () => {
      const event: IcsEvent = {
        ...baseEvent,
        title: "Casamento & Festa!!!",
      };
      const result = generateCalendarLinks(event);
      expect(result.google).toContain(encodeURIComponent("Casamento & Festa!!!"));
      expect(result.outlook).toContain(encodeURIComponent("Casamento & Festa!!!"));
    });

    it("encodes special characters in description", () => {
      const event: IcsEvent = {
        ...baseEvent,
        description: "Line1\nLine2",
      };
      const result = generateCalendarLinks(event);
      expect(result.google).toContain(encodeURIComponent("Line1\nLine2"));
    });
  });
});
