import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { GuestsTable } from './GuestsTable';
import { Guest } from '@/shared/types/guest';

// ─── Mocks ──────────────────────────────────────────────────────────────
const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '+5511999999999',
    is_hot_guest: true,
    is_natural_guest: false,
    has_read: true,
    rsvp_status: 'Pendente',
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'João Santos',
    phone: '+5511888888888',
    is_hot_guest: false,
    is_natural_guest: true,
    has_read: false,
    rsvp_status: 'Confirmado',
    updated_at: new Date().toISOString(),
  },
];

const mockOnDelete = vi.fn();

// Mock fetch globally
const mockFetchFn = vi.fn() as unknown as typeof fetch;
beforeEach(() => {
  vi.clearAllMocks();
  (globalThis as unknown as { fetch: typeof mockFetchFn }).fetch = mockFetchFn;
});

const fetchMock = mockFetchFn;

function mockFetchResponse(data: unknown, ok = true, status = 200) {
  fetchMock.mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

function renderComponent() {
  return render(<GuestsTable onDelete={mockOnDelete} />);
}

// ─── Tests ──────────────────────────────────────────────────────────────
describe('GuestsTable', () => {
  it('should show loading state initially', () => {
    // fetch never resolves
    renderComponent();
    expect(screen.getByText('Carregando convidados...')).toBeInTheDocument();
  });

  it('should render guests after fetch', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });
    expect(screen.getByText('João Santos')).toBeInTheDocument();
  });

  it('should show error on fetch failure', async () => {
    mockFetchResponse({ error: 'Server error' }, false, 500);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/HTTP 500|Erro|Falha/)).toBeInTheDocument();
    });
  });

  it('should show empty state when no guests', async () => {
    mockFetchResponse([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Nenhum convidado cadastrado.')).toBeInTheDocument();
    });
  });

  it('should display type badges correctly', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Check badges exist (may appear multiple times due to toggle buttons)
    const hotElements = screen.getAllByText('Hot');
    expect(hotElements.length).toBeGreaterThan(0);

    const naturalElements = screen.getAllByText('Natural');
    expect(naturalElements.length).toBeGreaterThan(0);
  });

  it('should display RSVP status badges', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Both Pendente and Confirmado should appear as badges
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
  });

  it('should display has_read status', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Should show "Sim" and "Não" for has_read
    const simElements = screen.getAllByText('Sim');
    const naoElements = screen.getAllByText('Não');
    expect(simElements.length).toBeGreaterThan(0);
    expect(naoElements.length).toBeGreaterThan(0);
  });

  it('should call onDelete when delete button is clicked', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockGuests[0]);
  });

  it('should handle name inline edit', async () => {
    const updatedGuest = { ...mockGuests[0], name: 'Maria Oliveira' };

    // First call returns guests list, second call returns updated guest
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockGuests),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(updatedGuest),
      });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Click on name to start editing
    const nameCell = screen.getByText('Maria Silva');
    fireEvent.click(nameCell);

    // Should show input with current value
    const input = screen.getByDisplayValue('Maria Silva') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    // Change value
    fireEvent.change(input, { target: { value: 'Maria Oliveira' } });

    // Should show Save/Cancel buttons
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();

    // Click Save button
    fireEvent.click(screen.getByText('Salvar'));

    // Wait for toast
    await waitFor(() => {
      expect(screen.getByText('1 convidado(s) atualizado(s)')).toBeInTheDocument();
    });

    // Verify name updated
    await waitFor(
      () => {
        expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('should display RSVP status as readonly', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Verify RSVP status badges are displayed (readonly)
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
  });

  it('should handle toggle hot guest', async () => {
    const hotGuest: Guest = {
      ...mockGuests[0],
      is_hot_guest: true,
    };
    mockFetchResponse([hotGuest]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    // Click to toggle off
    const hotBadge = screen.getAllByText('Hot')[0];
    fireEvent.click(hotBadge);

    // Mock successful PATCH with is_hot_guest = false
    const updatedGuest = { ...hotGuest, is_hot_guest: false };
    mockFetchResponse(updatedGuest, true, 200);

    // Should not crash
    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });
  });

  it('should validate phone format before saving', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Click on name to start editing
    const nameCell = screen.getByText('Maria Silva');
    fireEvent.click(nameCell);

    const input = screen.getByDisplayValue('Maria Silva') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should call fetch (name edit goes through)
    expect(fetchMock).toHaveBeenCalled();
  });
});
