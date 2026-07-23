import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

// Mock useAuth
vi.mock('@/lib/auth/client', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/lib/auth/client';
import AdminPage from './page';

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render placeholder when authenticated', () => {
    (useAuth as vi.Mock).mockReturnValue({ user: { email: 'test@test.com' }, loading: false });
    
    render(<AdminPage />);
    
    expect(screen.getByText('Área Admin')).toBeInTheDocument();
    expect(screen.getByText('Em breve.')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    (useAuth as vi.Mock).mockReturnValue({ user: null, loading: false });
    
    render(<AdminPage />);
    
    // Should not render admin content
    expect(screen.queryByText('Área Admin')).not.toBeInTheDocument();
  });
});
