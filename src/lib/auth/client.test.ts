import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { type Session, type User } from '@supabase/supabase-js';
import { useAuth } from './client';

const ADMIN_EMAIL = 'gabrielcarvalhocosta@live.com';

// Use vi.fn() in factory so we can reconfigure per test
let mockGetUser: ReturnType<typeof vi.fn>;
let mockOnAuthStateChange: ReturnType<typeof vi.fn>;

vi.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: () => ({
    auth: {
      getUser: mockGetUser ?? vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: mockOnAuthStateChange ?? vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  }),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default: no user
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    mockOnAuthStateChange = vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  function configureSupabase(getUserResult: { data: { user: User | null }; error: unknown }) {
    mockGetUser = vi.fn().mockResolvedValue(getUserResult);
  }

  it('should return null user when not authenticated', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBeNull();
  });

  it('should return user when email matches admin email', async () => {
    configureSupabase({
      data: { user: { email: ADMIN_EMAIL, id: '123' } },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe(ADMIN_EMAIL);
  });

  it('should return null when email does not match admin email', async () => {
    configureSupabase({
      data: { user: { email: 'other@email.com', id: '456' } },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBeNull();
  });

  it('should update user via onAuthStateChange listener', async () => {
    let authStateCallback: ((event: string, session: Session | null) => void) | null = null;

    mockOnAuthStateChange = vi.fn().mockImplementation((callback: (event: string, session: Session | null) => void) => {
      authStateCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    configureSupabase({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBeNull();

    // Simulate auth state change: user logs in as admin
    if (authStateCallback) {
      authStateCallback('SIGNED_IN', {
        user: { email: ADMIN_EMAIL, id: '789' },
      });
    }

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe(ADMIN_EMAIL);
    });
  });
});
