import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
}));

import { User } from '@supabase/supabase-js';
import AdminDashboardClient from './AdminDashboardClient';

describe('AdminDashboardClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when authenticated', async () => {
    // Mock fetch to return empty guests array
    globalThis.fetch = vi.fn(() =>
      Promise.resolve<Response>({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<AdminDashboardClient user={{ email: 'test@test.com', id: 'test' } as User} />);

    // Wait for loading to complete and content to appear
    await screen.findByText('Painel Admin');
    expect(screen.getByText('Painel Admin')).toBeInTheDocument();
    expect(screen.getByText('Adicionar Convidado')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', async () => {
    render(<AdminDashboardClient user={null} />);

    expect(mockReplace).toHaveBeenCalledWith('/admin/login');
  });
});
