import type { IcsEvent } from "@/shared/types/ics-event";

export type { IcsEvent };

/**
 * Central configuration for the wedding event.
 *
 * All event metadata (title, dates, location, description) is defined
 * in a single source of truth so that every component and utility
 * (CTA, countdown, ICS generation, calendar links) uses consistent data.
 *
 * Timezone: America/Sao_Paulo (UTC-3, no DST in November).
 */
export const WEDDING_EVENT: IcsEvent = {
  title: "Casamento — Gabriel & Mariana",
  description: "Save the Date — Nos vemos lá!",
  startDate: new Date("2026-11-08T12:00:00-03:00"),
  endDate: new Date("2026-11-08T20:00:00-03:00"),
  location: "Casamento de Gabriel & Mariana — 08/11/2026 às 12h",
};
