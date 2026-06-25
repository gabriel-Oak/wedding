/**
 * Escapes special characters in iCal property values per RFC 5545 (Section 3.3.11).
 * Characters: backslash, newline, semicolon, comma.
 */
function escapeIcalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Formats a Date to YYYYMMDDTHHMMSS (no timezone) for iCal DTSTART/DTEND.
 */
function formatIcalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

export interface IcsEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
}

/**
 * Generates a RFC 5545 compliant .ics file content as a string.
 */
export function generateIcs(event: IcsEvent): string {
  const lines: string[] = [];

  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//Wedding//PT-BR");
  lines.push("BEGIN:VEVENT");
  lines.push(`SUMMARY:${escapeIcalText(event.title)}`);
  lines.push(`DTSTART:${formatIcalDate(event.startDate)}`);
  lines.push(`DTEND:${formatIcalDate(event.endDate)}`);
  lines.push(`LOCATION:${escapeIcalText(event.location)}`);
  lines.push(`DESCRIPTION:${escapeIcalText(event.description)}`);
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}
