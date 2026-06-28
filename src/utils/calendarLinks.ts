import type { IcsEvent } from "@/utils/eventConfig";
import { generateIcs } from "@/utils/generateIcs";

export interface CalendarLinks {
  google: string;
  outlook: string;
  ics: string;
}

const TIMEZONE = "America/Sao_Paulo";

/**
 * Formats a Date to UTC string in YYYYMMDDTHHMMSSZ format for Google Calendar.
 */
function formatDateForGoogle(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Formats a Date to ISO 8601 string with timezone offset for Outlook (e.g. 2026-11-08T16:00:00-03:00).
 */
function formatDateForOutlook(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");
  const offset = getTimezoneOffset(date, TIMEZONE);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
}

/**
 * Gets the timezone offset string (e.g. "-03:00") for a date in a given timezone.
 */
function getTimezoneOffset(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  });
  const parts = formatter.formatToParts(date);
  const tzPart = parts.find((p) => p.type === "timeZoneName");
  if (tzPart) {
    const offset = tzPart.value;
    // Format: "UTC-03:00" → "-03:00"
    const match = offset.match(/([+-]\d{2}:\d{2})/);
    if (match) {
      return match[1];
    }
  }
  return "-03:00";
}

function safeEncode(str: string): string {
  return encodeURIComponent(str).replace(/%3A/gi, ":");
}

/**
 * Generates calendar platform URLs for a given event.
 *
 * Returns links for Google Calendar, Outlook (web),
 * and a direct ICS download link.
 */
export function generateCalendarLinks(event: IcsEvent): CalendarLinks {
  const { title, description, startDate, endDate, location } = event;

  // Google Calendar — uses UTC dates
  const googleStart = formatDateForGoogle(startDate);
  const googleEnd = formatDateForGoogle(endDate);
  const googleParams = [
    `action=TEMPLATE`,
    `text=${encodeURIComponent(title)}`,
    `dates=${googleStart}/${googleEnd}`,
    `details=${encodeURIComponent(description)}`,
    `location=${encodeURIComponent(location)}`,
  ].join("&");
  const googleUrl = `https://calendar.google.com/calendar/render?${googleParams}`;

  // Outlook (web) — uses ISO 8601 with timezone offset
  // safeEncode preserves colons in datetime (e.g. 2026-11-08T16:00:00)
  const startISO = formatDateForOutlook(startDate);
  const endISO = formatDateForOutlook(endDate);
  const outlookParams = [
    `rru=addevent`,
    `subject=${safeEncode(title)}`,
    `dtstart=${safeEncode(startISO)}`,
    `dtend=${safeEncode(endISO)}`,
    `body=${safeEncode(description)}`,
    `location=${safeEncode(location)}`,
  ].join("&");
  const outlookUrl = `https://outlook.live.com/calendar/action/compose?${outlookParams}`;

  // ICS download — blob URL (works within same tab)
  const icsContent = generateIcs(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const icsUrl = URL.createObjectURL(blob);

  return {
    google: googleUrl,
    outlook: outlookUrl,
    ics: icsUrl,
  };
}
