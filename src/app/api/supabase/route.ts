import { validatePhone, formatPhoneError } from "./middleware";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;

// Whitelist de tabelas permitidas — impede acesso a tabelas arbitrarias
const ALLOWED_TABLES = new Set(["guests", "events", "rsvps"]);

function isAllowedTable(table: string): boolean {
  return ALLOWED_TABLES.has(table);
}

function getSupabaseHeaders(): Record<string, string> {
  return {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };
}

async function forwardToSupabase(
  method: string,
  url: string,
  body?: unknown,
): Promise<Response> {
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
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    return new Response(
      JSON.stringify({ error: `Internal server error: ${message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

function addPhoneFilter(searchParams: URLSearchParams, phone: string): void {
  const currentFilter = searchParams.get("filter");
  const newFilter = `phone=eq.${phone}`;

  if (currentFilter) {
    searchParams.set("filter", `${currentFilter}+and+(${newFilter})`);
  } else {
    searchParams.set("filter", newFilter);
  }
}

async function handleRequest(request: Request): Promise<Response> {
  // Parse query params from request URL — handle both absolute and relative URLs
  const urlStr = request.url.startsWith("http") ? request.url : `http://localhost${request.url}`;
  const requestUrl = new URL(urlStr);
  const phone = requestUrl.searchParams.get("phone");
  const table = requestUrl.searchParams.get("table");

  // Validate phone
  const validatedPhone = validatePhone(phone);
  if (!validatedPhone) {
    return formatPhoneError("Invalid or missing phone number");
  }

  // Validate table
  if (!table) {
    return formatPhoneError("Missing 'table' query parameter");
  }
  if (!isAllowedTable(table)) {
    return formatPhoneError(`Table '${table}' is not allowed`);
  }

  const supabaseUrl = `${SUPABASE_REST_URL}/${table}`;

  switch (request.method) {
    case "GET": {
      addPhoneFilter(requestUrl.searchParams, validatedPhone);
      const fullUrl = `${supabaseUrl}?${requestUrl.searchParams.toString()}`;
      return forwardToSupabase("GET", fullUrl);
    }

    case "POST": {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return formatPhoneError("Invalid JSON body");
      }

      if (typeof body !== "object" || body === null) {
        return formatPhoneError("Request body must be a JSON object");
      }

      const record = { ...(body as Record<string, unknown>) };
      record.phone = validatedPhone;

      return forwardToSupabase("POST", supabaseUrl, record);
    }

    case "PUT": {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return formatPhoneError("Invalid JSON body");
      }

      if (typeof body !== "object" || body === null) {
        return formatPhoneError("Request body must be a JSON object");
      }

      const supabaseUrlWithFilter = `${supabaseUrl}?phone=eq.${encodeURIComponent(validatedPhone)}`;
      return forwardToSupabase("PUT", supabaseUrlWithFilter, body);
    }

    case "PATCH": {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return formatPhoneError("Invalid JSON body");
      }

      if (typeof body !== "object" || body === null) {
        return formatPhoneError("Request body must be a JSON object");
      }

      const supabaseUrlWithFilter = `${supabaseUrl}?phone=eq.${encodeURIComponent(validatedPhone)}`;
      return forwardToSupabase("PATCH", supabaseUrlWithFilter, body);
    }

    case "DELETE": {
      const supabaseUrlWithFilter = `${supabaseUrl}?phone=eq.${encodeURIComponent(validatedPhone)}`;
      return forwardToSupabase("DELETE", supabaseUrlWithFilter);
    }

    default:
      return new Response(
        JSON.stringify({ error: `Method ${request.method} not allowed` }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        },
      );
  }
}

export async function GET(request: Request): Promise<Response> {
  return handleRequest(request);
}

export async function POST(request: Request): Promise<Response> {
  return handleRequest(request);
}

export async function PUT(request: Request): Promise<Response> {
  return handleRequest(request);
}

export async function PATCH(request: Request): Promise<Response> {
  return handleRequest(request);
}

export async function DELETE(request: Request): Promise<Response> {
  return handleRequest(request);
}
