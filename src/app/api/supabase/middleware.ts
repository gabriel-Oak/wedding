const PHONE_REGEX = /^\+55\d{10,11}$/;
const CLEAN_PHONE_REGEX = /[\s\-\(\)]/g;

/**
 * Validate and normalize a phone number.
 * Removes spaces, dashes, and parentheses, then checks
 * the normalized number matches +55 followed by 10 or 11 digits.
 * Returns the normalized phone string, or null if invalid.
 */
export function validatePhone(phone: string | null): string | null {
  if (!phone) return null;

  // Remove spaces, dashes, parentheses, and other whitespace characters
  const cleaned = phone.replace(CLEAN_PHONE_REGEX, "");

  // Verify the cleaned phone matches the Brazilian format: +55 + 10 or 11 digits
  if (!PHONE_REGEX.test(cleaned)) return null;

  return cleaned;
}

/**
 * Format a phone number for error responses.
 * Returns a 400 JSON response (invalid format).
 */
export function formatPhoneError(message: string): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/**
 * Format a phone number for forbidden responses.
 * Returns a 403 JSON response (missing phone parameter).
 */
export function formatPhoneForbidden(message: string): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/**
 * Format a phone number for not-found responses.
 * Returns a 404 JSON response (phone not found in database).
 */
export function formatPhoneNotFound(message: string): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/**
 * Log a validation failure with timestamp and optional phone number.
 * Uses console.error for Next.js API route logging support.
 */
export function logValidationFailure(reason: string, phone?: string): void {
  const timestamp = new Date().toISOString();
  const phoneInfo = phone ? ` (phone: ${phone})` : "";
  console.error(`[Phone Validation] ${timestamp} - ${reason}${phoneInfo}`);
}

/**
 * Extract and validate a phone number from a URL string.
 * Parses the URL, retrieves the `phone` query parameter,
 * and passes it through validatePhone for normalization.
 * Returns the normalized phone string, or null if invalid.
 */
export function extractPhoneFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const phone = parsed.searchParams.get("phone");
    return validatePhone(phone);
  } catch {
    return null;
  }
}
