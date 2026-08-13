import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

vi.mock('@supabase/supabase-js');
vi.mock('next/headers');

const mockCookieStore = vi.hoisted(() => ({
  get: vi.fn(),
}));

const mockSupabase = vi.hoisted(() => ({
  auth: {
    setSession: vi.fn().mockResolvedValue({ error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({
    get: mockCookieStore.get,
  });
  mockCookieStore.get.mockReturnValue(undefined);
  (createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
});

describe('getAdminSession', () => {
  it('should return null when no auth token cookie', async () => {
    const { getAdminSession } = await import('./server');
    const result = await getAdminSession();
    expect(result).toBeNull();
  });

  it('should parse URL-encoded JSON auth token and return user', async () => {
    const mockSession = {
      access_token: 'eyJ...',
      refresh_token: 'aqnf7hq3ut6n',
    };
    const mockUser = { id: '1', email: 'gabriel@live.com' };

    mockCookieStore.get.mockImplementation((name: string) => {
      if (name === 'sb-wimlkdwoglckazfbzaej-auth-token') {
        return { value: encodeURIComponent(JSON.stringify(mockSession)) };
      }
      return undefined;
    });

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const { getAdminSession } = await import('./server');
    const result = await getAdminSession();

    expect(result).toEqual(mockUser);
    expect(mockSupabase.auth.setSession).toHaveBeenCalledWith(mockSession);
  });

  it('should return null when getUser returns error', async () => {
    const mockSession = {
      access_token: 'eyJ...',
      refresh_token: 'aqnf7hq3ut6n',
    };

    mockCookieStore.get.mockImplementation((name: string) => {
      if (name === 'sb-wimlkdwoglckazfbzaej-auth-token') {
        return { value: encodeURIComponent(JSON.stringify(mockSession)) };
      }
      return undefined;
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Auth error'),
    });

    const { getAdminSession } = await import('./server');
    const result = await getAdminSession();
    expect(result).toBeNull();
  });

  it('should return null when auth token cookie is invalid JSON', async () => {
    mockCookieStore.get.mockImplementation((name: string) => {
      if (name === 'sb-wimlkdwoglckazfbzaej-auth-token') {
        return { value: 'not-valid-json' };
      }
      return undefined;
    });

    const { getAdminSession } = await import('./server');
    const result = await getAdminSession();
    expect(result).toBeNull();
  });
});
