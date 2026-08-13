import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

// Mock supabase client
let mockSignInWithOtp: ReturnType<typeof vi.fn>;
let mockGetUser: ReturnType<typeof vi.fn>;
let mockOnAuthStateChange: ReturnType<typeof vi.fn>;

vi.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: () => ({
    auth: {
      signInWithOtp: mockSignInWithOtp ?? vi.fn(),
      getUser: mockGetUser ?? vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: mockOnAuthStateChange ?? vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  }),
}));

// Import the component
import AdminLoginPage from './page';

const ADMIN_EMAIL = 'gabrielcarvalhocosta@live.com';

describe('AdminLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: not authenticated
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    mockSignInWithOtp = vi.fn().mockResolvedValue({ error: null });
    mockOnAuthStateChange = vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should render login form', async () => {
    render(<AdminLoginPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Acesso exclusivo')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('admin@email.com')).toBeInTheDocument();
      expect(screen.getByText('Enviar Magic Link')).toBeInTheDocument();
    });
  });

  it('should render empty email input', async () => {
    render(<AdminLoginPage />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('admin@email.com') as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  it('should show checking state initially', async () => {
    // Make getUser take time to resolve
    mockGetUser = vi.fn().mockReturnValue(new Promise(() => {})); // never resolves
    
    render(<AdminLoginPage />);
    
    expect(screen.getByText('Verificando autenticação...')).toBeInTheDocument();
  });

  it('should show success message after sending magic link', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    
    render(<AdminLoginPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Enviar Magic Link')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Enviar Magic Link'));
    
    await waitFor(() => {
      expect(screen.getByText('Magic link enviado.')).toBeInTheDocument();
      expect(screen.getByText('Verifique sua caixa de entrada.')).toBeInTheDocument();
    });
  });

  it('should show error on failed send', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: new Error('Test error') });
    
    render(<AdminLoginPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Enviar Magic Link')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Enviar Magic Link'));
    
    await waitFor(() => {
      expect(screen.getByText('Não foi possível enviar o link. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('should disable button while submitting', async () => {
    mockSignInWithOtp.mockReturnValue(new Promise(() => {})); // never resolves
    
    render(<AdminLoginPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Enviar Magic Link')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Enviar Magic Link'));
    
    await waitFor(() => {
      expect(screen.getByText('Enviando...')).toBeInTheDocument();
    });
  });

  it('should show checking state when authenticated', async () => {
    mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { email: ADMIN_EMAIL } },
      error: null,
    });
    
    render(<AdminLoginPage />);
    
    // Component shows "Verificando autenticação..." while checking
    expect(screen.getByText('Verificando autenticação...')).toBeInTheDocument();
  });
});
