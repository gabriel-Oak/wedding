import { describe, it, expect, vi } from 'vitest';

// Mock the supabase server module
vi.mock('@/lib/supabase/server', () => ({
  createSupabaseClient: vi.fn(),
}));

// Import after mocking
import { getAdminSession } from './server';

describe('getAdminSession', () => {
  it('should return null when no user', async () => {
    const { createSupabaseClient } = await import('@/lib/supabase/server');
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    };
    createSupabaseClient.mockReturnValue(mockClient);
    
    const result = await getAdminSession();
    expect(result).toBeNull();
  });

  it('should return null for non-admin email', async () => {
    const { createSupabaseClient } = await import('@/lib/supabase/server');
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ 
          data: { user: { email: 'wrong@email.com' } }, 
          error: null 
        }),
      },
    };
    createSupabaseClient.mockReturnValue(mockClient);
    
    const result = await getAdminSession();
    expect(result).toBeNull();
  });

  it('should return user for admin email', async () => {
    const { createSupabaseClient } = await import('@/lib/supabase/server');
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ 
          data: { user: { email: 'gabrielcarvalhocosta@live.com' } }, 
          error: null 
        }),
      },
    };
    createSupabaseClient.mockReturnValue(mockClient);
    
    const result = await getAdminSession();
    expect(result).not.toBeNull();
    expect(result?.email).toBe('gabrielcarvalhocosta@live.com');
  });

  it('should return null when getUser returns an error', async () => {
    const { createSupabaseClient } = await import('@/lib/supabase/server');
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ 
          data: { user: null }, 
          error: new Error('Auth error') 
        }),
      },
    };
    createSupabaseClient.mockReturnValue(mockClient);
    
    const result = await getAdminSession();
    expect(result).toBeNull();
  });
});
