import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            headers.set('set-cookie', `${name}=${value}; ${options.path ? `Path=${options.path};` : ''} ${options.sameSite ? `SameSite=${options.sameSite};` : ''} ${options.secure ? 'Secure;' : ''}`);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  const response = NextResponse.next({ request });
  return response;
}
