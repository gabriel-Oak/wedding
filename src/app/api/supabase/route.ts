import { validatePhone, formatPhoneError } from "./middleware";

async function handleProxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  const table = url.searchParams.get("table");

  // Validate phone
  const validatedPhone = validatePhone(phone);
  if (!validatedPhone) {
    return formatPhoneError("Invalid or missing phone number");
  }

  // Validate table
  if (!table) {
    return formatPhoneError("Missing 'table' query parameter");
  }

  // Placeholder: return ready message
  return new Response(
    JSON.stringify({ message: "API proxy ready", route: "/api/supabase" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

export async function GET(request: Request): Promise<Response> {
  return handleProxy(request);
}

export async function POST(request: Request): Promise<Response> {
  return handleProxy(request);
}

export async function PUT(request: Request): Promise<Response> {
  return handleProxy(request);
}

export async function PATCH(request: Request): Promise<Response> {
  return handleProxy(request);
}

export async function DELETE(request: Request): Promise<Response> {
  return handleProxy(request);
}
