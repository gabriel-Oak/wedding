import {
  formatPhoneError,
  validatePhone,
} from "@/lib/phone-validation";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;

function getSupabaseHeaders() {
  return {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };
}

async function forwardToSupabase(method: string, url: string, body?: unknown): Promise<Response> {
  try {
    const response = await fetch(url, {
      method,
      headers: getSupabaseHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || data.error || "Supabase API error" }),
        { status: response.status, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    return new Response(
      JSON.stringify({ error: `Internal server error: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const phone = validatePhone(url.searchParams.get("phone"));
  if (!phone) return formatPhoneError("Invalid or missing phone number");

  const supabaseUrl = `${SUPABASE_REST_URL}/confirmations?phone=eq.${encodeURIComponent(phone)}`;
  return forwardToSupabase("GET", supabaseUrl);
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return formatPhoneError("Invalid JSON body");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return formatPhoneError("Request body must be a JSON object");
  }

  return forwardToSupabase("POST", `${SUPABASE_REST_URL}/confirmations`, body as Record<string, unknown>);
}

export async function PATCH(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const phone = validatePhone(url.searchParams.get("phone"));
  if (!phone) return formatPhoneError("Invalid or missing phone number");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return formatPhoneError("Invalid JSON body");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return formatPhoneError("Request body must be a JSON object");
  }

  const supabaseUrl = `${SUPABASE_REST_URL}/confirmations?phone=eq.${encodeURIComponent(phone)}`;
  return forwardToSupabase("PATCH", supabaseUrl, body as Record<string, unknown>);
}
