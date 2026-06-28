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

  it("returns an object with google, outlook, and ics keys", () => {
    const result = generateCalendarLinks(baseEvent);
    expect(result).toHaveProperty("google");
    expect(result).toHaveProperty("outlook");
    expect(result).toHaveProperty("ics");
  });

  it("returns strings for all keys", () => {
    const result = generateCalendarLinks(baseEvent);
    expect(typeof result.google).toBe("string");
    expect(typeof result.outlook).toBe("string");
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
    it("starts with the correct deep link URL", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.outlook).toMatch(/^https:\/\/outlook\.office\.com\/calendar\/0\/deeplink\/compose\?/);
    });

    it("includes path parameter", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.outlook).toContain("path=/calendar/action/compose");
    });

    it("includes subject, body, and location", () => {
      const result = generateCalendarLinks(baseEvent);
      expect(result.outlook).toContain("Casamento%20de%20Nome%20%26%20Nome");
      expect(result.outlook).toContain("Save%20the%20Date");
      expect(result.outlook).toContain("Local%20do%20Casamento");
    });

    it("includes startdt and enddt in ISO 8601 UTC format", () => {
      const result = generateCalendarLinks(baseEvent);
      // YYYY-MM-DDTHH:MM:SSZ format with colons and Z suffix
      expect(result.outlook).toMatch(/startdt=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
      expect(result.outlook).toMatch(/enddt=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
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
      // Outlook uses safeEncode: colons preserved, spaces become %20
      expect(result.outlook).toContain("Casamento%20%26%20Festa!!!");
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

  describe("formatDateForOutlook (via generateCalendarLinks)", () => {
    it("includes seconds in startdt and enddt", () => {
      const result = generateCalendarLinks(baseEvent);
      // YYYY-MM-DDTHH:MM:SSZ format with colons
      expect(result.outlook).toMatch(/startdt=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
      expect(result.outlook).toMatch(/enddt=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
    });

    it("handles year boundary (Dec 31 -> Jan 1)", () => {
      const yearBoundaryEvent: IcsEvent = {
        title: "Virada de Ano",
        startDate: new Date("2026-12-31T23:30:00-03:00"),
        endDate: new Date("2027-01-01T00:30:00-03:00"),
        location: "Copacabana",
        description: "Réveillon",
      };
      const result = generateCalendarLinks(yearBoundaryEvent);
      // startdt: Dec 31 23:30 -03:00 = Jan 1 02:30 UTC
      expect(result.outlook).toMatch(/startdt=2027-01-01T02:30:00Z/);
      // enddt: Jan 1 00:30 -03:00 = Jan 1 03:30 UTC
      expect(result.outlook).toMatch(/enddt=2027-01-01T03:30:00Z/);
    });

    it("handles leap year date (Feb 29)", () => {
      const leapYearEvent: IcsEvent = {
        title: "Carnaval",
        startDate: new Date("2024-02-29T12:00:00-03:00"),
        endDate: new Date("2024-02-29T18:00:00-03:00"),
        location: "Rio de Janeiro",
        description: "Dia de Carnaval",
      };
      const result = generateCalendarLinks(leapYearEvent);
      // startdt should be 2024-02-29 15:00 UTC (local 12:00 -03:00 → UTC +3)
      expect(result.outlook).toMatch(/startdt=2024-02-29T15:00:00Z/);
      // enddt should be 2024-02-29 21:00 UTC (local 18:00 -03:00 → UTC +3)
      expect(result.outlook).toMatch(/enddt=2024-02-29T21:00:00Z/);
    });
  });
});
