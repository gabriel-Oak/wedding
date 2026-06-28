import type { IcsEvent } from "@/utils/eventConfig";
import { generateIcs } from "@/utils/generateIcs";

export interface CalendarLinks {
  google: string;
  outlook: string;
  ics: string;
}

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
 * Formats a Date to UTC string in YYYYMMDDTHHMMSSZ format for Outlook.com.
 * Outlook.com expects UTC timestamps without colons and with a Z suffix.
 */
function formatDateForOutlook(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
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

  // Outlook (web) — uses UTC timestamp in YYYYMMDDTHHMMSSZ format
  const startOutlook = formatDateForOutlook(startDate);
  const endOutlook = formatDateForOutlook(endDate);
  const outlookParams = [
    `rru=addevent`,
    `subject=${safeEncode(title)}`,
    `dtstart=${startOutlook}`,
    `dtend=${endOutlook}`,
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
