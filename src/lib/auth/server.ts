import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

const AUTH_COOKIE = 'sb-wimlkdwoglckazfbzaej-auth-token';

interface SupabaseSession {
  access_token: string;
  refresh_token: string;
}

function extractSessionFromAuthCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): SupabaseSession | null {
  const raw = cookieStore.get(AUTH_COOKIE)?.value;
  if (!raw) return null;

  try {
    // Cookie value is URL-encoded JSON: %7B%22access_token%22...
    const decoded = decodeURIComponent(raw);
    const session: SupabaseSession = JSON.parse(decoded);
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = extractSessionFromAuthCookie(cookieStore);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  if (session) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user;
}
