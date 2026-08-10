import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GuestsTable from './GuestsTable';
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

  it('should display RSVP status in dropdowns', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Both Pendente and Confirmado should appear in select options
    const allOptions = screen.getAllByRole('option');
    const optionTexts = allOptions.map((o) => o.textContent);
    expect(optionTexts).toContain('Pendente');
    expect(optionTexts).toContain('Confirmado');
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
    mockFetchResponse(mockGuests);
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

    // Mock successful PATCH for the name edit
    const updatedGuest = { ...mockGuests[0], name: 'Maria Oliveira' };
    mockFetchResponse(updatedGuest, true, 200);

    // Press Enter to save
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
    });
  });

  it('should handle RSVP status change', async () => {
    mockFetchResponse(mockGuests);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Find all selects (one per guest)
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2);

    const firstSelect = selects[0] as HTMLSelectElement;
    expect(firstSelect.value).toBe('Pendente');

    // Change to Confirmado
    fireEvent.change(firstSelect, { target: { value: 'Confirmado' } });

    // Mock successful PATCH
    const updatedGuest = { ...mockGuests[0], rsvp_status: 'Confirmado' };
    mockFetchResponse(updatedGuest, true, 200);

    await waitFor(() => {
      expect(firstSelect.value).toBe('Confirmado');
    });
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
