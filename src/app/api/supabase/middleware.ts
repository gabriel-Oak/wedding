const PHONE_REGEX = /^\+55\d{10,11}$/;

const CLEAN_PHONE_REGEX = /[\s\-\(\)]/g;

/**
 * Validate and normalize a phone number.
 * Must match the pattern +55 followed by 10 or 11 digits.
 * Returns null if invalid.
 */
export function validatePhone(phone: string | null): string | null {
  if (!phone) return null;

  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(CLEAN_PHONE_REGEX, "");

  if (!PHONE_REGEX.test(cleaned)) return null;

  return cleaned;
}

/**
 * Format a phone number for error responses.
 * Returns a 400 JSON response.
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
