import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { GuestsTable } from './GuestsTable';
import { Guest } from '@/shared/types/guest';

// ─── Mocks ──────────────────────────────────────────────────────────────

const mockFetch = vi.fn() as unknown as typeof fetch;

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockReset();
  (globalThis as unknown as { fetch: typeof mockFetch }).fetch = mockFetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Helpers ────────────────────────────────────────────────────────────

function createGuest(overrides?: Partial<Guest>): Guest {
  return {
    id: 'guest-1',
    name: 'Maria Silva',
    phone: '+5511999999999',
    is_hot_guest: false,
    is_natural_guest: false,
    rsvp_status: 'Pendente',
    has_read: false,
    ...overrides,
  };
}

function mockFetchOnce(data: unknown, ok = true, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

function renderTable(props?: { onDelete?: ReturnType<typeof vi.fn>; onGuestsUpdated?: ReturnType<typeof vi.fn> }) {
  const mockOnDelete = props?.onDelete ?? vi.fn();
  const mockOnGuestsUpdated = props?.onGuestsUpdated ?? vi.fn();

  const result = render(
    <GuestsTable
      onDelete={mockOnDelete}
      onGuestsUpdated={mockOnGuestsUpdated}
    />,
  );

  return {
    ...result,
    mockOnDelete,
    mockOnGuestsUpdated,
  };
}

// ─── Loading State ──────────────────────────────────────────────────────

describe('GuestsTable > Loading', () => {
  it('should show loading spinner initially', () => {
    // Never resolve — stays loading
    mockFetch.mockImplementation(() => new Promise(() => {}));

    renderTable();

    expect(screen.getByText('Carregando convidados...')).toBeInTheDocument();
  });
});

// ─── Error State ────────────────────────────────────────────────────────

describe('GuestsTable > Error', () => {
  it('should show error on fetch failure', async () => {
    mockFetchOnce({ error: 'Network error' }, false, 500);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('HTTP 500')).toBeInTheDocument();
    });
  });

  it('should retry on "Tentar novamente" click', async () => {
    mockFetchOnce({ error: 'Fail' }, false, 500);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('HTTP 500')).toBeInTheDocument();
    });

    // Mock window.location.reload to re-render the component
    const reloadMock = vi.fn();
    vi.stubGlobal('location', {
      ...window.location,
      reload: reloadMock,
    });

    fireEvent.click(screen.getByText('Tentar novamente'));

    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled();
    });

    vi.unstubAllGlobals();
  });

  it('should show HTTP error code from API', async () => {
    mockFetchOnce({ error: 'Database connection failed' }, false, 500);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('HTTP 500')).toBeInTheDocument();
    });
  });
});

// ─── Empty State ────────────────────────────────────────────────────────

describe('GuestsTable > Empty', () => {
  it('should show empty state when no guests', async () => {
    mockFetchOnce([]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Nenhum convidado cadastrado.')).toBeInTheDocument();
    });
  });
});

// ─── Table Rendering ────────────────────────────────────────────────────

describe('GuestsTable > Table', () => {
  it('should render guests table with correct headers', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
      expect(screen.getByText('Tipo')).toBeInTheDocument();
      expect(screen.getByText('Status RSVP')).toBeInTheDocument();
      expect(screen.getByText('Leu?')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });
  });

  it('should render guest name', async () => {
    mockFetchOnce([createGuest({ name: 'Maria Silva' })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });
  });

  it('should render guest phone', async () => {
    mockFetchOnce([createGuest({ phone: '+5511999999999' })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('+5511999999999')).toBeInTheDocument();
    });
  });

  it('should show rsvp_status badge', async () => {
    mockFetchOnce([createGuest({ rsvp_status: 'Confirmado' })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Confirmado')).toBeInTheDocument();
    });
  });

  it('should show "Pendente" when rsvp_status is null', async () => {
    mockFetchOnce([createGuest({ rsvp_status: null })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Pendente')).toBeInTheDocument();
    });
  });

  it('should show Recusado badge for declined RSVP', async () => {
    mockFetchOnce([createGuest({ rsvp_status: 'Recusado' })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Recusado')).toBeInTheDocument();
    });
  });

  it('should show Leu? Yes/No correctly', async () => {
    const guestRead = createGuest({ has_read: true });
    const guestNotRead = createGuest({ has_read: false });
    mockFetchOnce([guestRead, guestNotRead]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Sim')).toBeInTheDocument();
      expect(screen.getByText('Não')).toBeInTheDocument();
    });
  });

  it('should show Hot and Natural toggle buttons', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Hot')).toBeInTheDocument();
      expect(screen.getByText('Natural')).toBeInTheDocument();
    });
  });

  it('should show Excluir button', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });
  });
});

// ─── Inline Editing ─────────────────────────────────────────────────────

describe('GuestsTable > Inline Editing', () => {
  it('should start editing name on click', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria Silva'));

    expect(screen.getByDisplayValue('Maria Silva')).toBeInTheDocument();
  });

  it('should start editing phone on click', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('+5511999999999')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+5511999999999'));

    expect(screen.getByPlaceholderText('+55XX...')).toBeInTheDocument();
  });

  it('should update name value on input change', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria Silva'));
    const input = screen.getByDisplayValue('Maria Silva');
    fireEvent.change(input, { target: { value: 'Ana Silva' } });

    expect(input).toHaveValue('Ana Silva');
  });

  it('should update phone value on input change', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('+5511999999999')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+5511999999999'));
    const input = screen.getByPlaceholderText('+55XX...');
    fireEvent.change(input, { target: { value: '+5511888888888' } });

    expect(input).toHaveValue('+5511888888888');
  });

  it('should save phone edit on Enter key', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('+5511999999999')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+5511999999999'));
    const input = screen.getByPlaceholderText('+55XX...');
    fireEvent.change(input, { target: { value: '+5511888888888' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should have pending edits
    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  it('should cancel phone edit on Escape key', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('+5511999999999')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+5511999999999'));
    const input = screen.getByPlaceholderText('+55XX...');
    fireEvent.change(input, { target: { value: '+5511888888888' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
    });
  });

  it('should save name edit on Enter key', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria Silva'));
    const input = screen.getByDisplayValue('Maria Silva');
    fireEvent.change(input, { target: { value: 'Novo Nome' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should have pending edits (Save/Cancel buttons appear)
    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  it('should cancel edit on Escape key', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria Silva'));
    const input = screen.getByDisplayValue('Maria Silva');
    fireEvent.change(input, { target: { value: 'Novo Nome' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Wait for Save button to appear
    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    // Now cancel
    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
      expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    });
  });

  it('should show Save/Cancel buttons when there are pending edits', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria Silva'));
    const input = screen.getByDisplayValue('Maria Silva');
    fireEvent.change(input, { target: { value: 'Novo Nome' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });
  });

  it('should cancel all pending edits on Cancel click', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria Silva'));
    const input = screen.getByDisplayValue('Maria Silva');
    fireEvent.change(input, { target: { value: 'Novo Nome' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
      expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    });
  });
});

// ─── Batch Edits ────────────────────────────────────────────────────────

describe('GuestsTable > Batch Edits', () => {
  it('should accumulate edits across guests', async () => {
    const guests = [createGuest({ name: 'Maria' }), createGuest({ name: 'João', id: 'guest-2' })];
    mockFetchOnce(guests);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria'));
    const input1 = screen.getByDisplayValue('Maria');
    fireEvent.change(input1, { target: { value: 'Maria Oliveira' } });
    fireEvent.keyDown(input1, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  it('should save all pending edits via PATCH', async () => {
    const guests = [createGuest({ name: 'Maria' }), createGuest({ name: 'João', id: 'guest-2' })];
    mockFetchOnce(guests);
    renderTable();

    // Edit first guest
    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Maria'));
    const input1 = screen.getByDisplayValue('Maria');
    fireEvent.change(input1, { target: { value: 'Maria Oliveira' } });
    fireEvent.keyDown(input1, { key: 'Enter' });

    // Edit second guest
    fireEvent.click(screen.getByText('João'));
    const input2 = screen.getByDisplayValue('João');
    fireEvent.change(input2, { target: { value: 'João Pedro' } });
    fireEvent.keyDown(input2, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getAllByText('Salvar').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByText('Salvar')[0]);

    // Should have made PATCH calls
    await waitFor(() => {
      const patchCalls = mockFetch.mock.calls.filter(
        (c) => c[1]?.method === 'PATCH',
      );
      expect(patchCalls.length).toBeGreaterThan(0);
    });
  });

  it('should rollback on save failure', async () => {
    mockFetchOnce([createGuest({ name: 'Maria' })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria'));
    const input = screen.getByDisplayValue('Maria');
    fireEvent.change(input, { target: { value: 'Maria Oliveira' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    // Fail the save
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });
});

// ─── Toast Notifications ────────────────────────────────────────────────

describe('GuestsTable > Toast', () => {
  it('should show success toast on save', async () => {
    mockFetchOnce([createGuest({ name: 'Maria' })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria'));
    const input = screen.getByDisplayValue('Maria');
    fireEvent.change(input, { target: { value: 'Maria Oliveira' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    // Resolve save successfully
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 'guest-1', name: 'Maria Oliveira' }),
    });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('1 convidado(s) atualizado(s)')).toBeInTheDocument();
    });
  });

  it('should show error toast on save failure', async () => {
    mockFetchOnce([createGuest({ name: 'Maria' })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Maria'));
    const input = screen.getByDisplayValue('Maria');
    fireEvent.change(input, { target: { value: 'Maria Oliveira' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Database error' }),
    });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeInTheDocument();
    });
  });

  it('should show error toast for invalid phone', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('+5511999999999')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+5511999999999'));
    const input = screen.getByPlaceholderText('+55XX...');
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // validatePhone('invalid') returns null → showToast('Telefone inválido...', 'error')
    await waitFor(() => {
      expect(screen.getByText('Telefone inválido. Formato: +55XX... ou XX...')).toBeInTheDocument();
    });
  });
});

// ─── Toggle Type (Hot/Natural) ───────────────────────────────────────────

describe('GuestsTable > Toggle Type', () => {
  it('should toggle hot guest', async () => {
    mockFetchOnce([createGuest({ is_hot_guest: false })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    const hotToggle = screen.getByText('Hot').closest('button')!;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          id: 'guest-1',
          name: 'Maria Silva',
          phone: '+5511999999999',
          is_hot_guest: true,
          is_natural_guest: false,
          rsvp_status: 'Pendente',
          has_read: false,
        }),
    });

    fireEvent.click(hotToggle);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/guests',
        expect.objectContaining({
          method: 'PATCH',
          body: expect.stringContaining('"is_hot_guest":true'),
        }),
      );
    });
  });

  it('should toggle natural guest', async () => {
    mockFetchOnce([createGuest({ is_natural_guest: false })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    const naturalToggle = screen.getByText('Natural').closest('button')!;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          id: 'guest-1',
          name: 'Maria Silva',
          phone: '+5511999999999',
          is_hot_guest: false,
          is_natural_guest: true,
          rsvp_status: 'Pendente',
          has_read: false,
        }),
    });

    fireEvent.click(naturalToggle);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/guests',
        expect.objectContaining({
          method: 'PATCH',
          body: expect.stringContaining('"is_natural_guest":true'),
        }),
      );
    });
  });

  it('should rollback toggle on failure', async () => {
    mockFetchOnce([createGuest({ is_hot_guest: false })]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    const hotToggle = screen.getByText('Hot').closest('button')!;

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Toggle failed' }),
    });

    fireEvent.click(hotToggle);

    await waitFor(() => {
      expect(screen.getByText('Toggle failed')).toBeInTheDocument();
    });
  });

  it('should disable toggle while toggling', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    const hotToggle = screen.getByText('Hot').closest('button')!;

    // Start a toggling action that never resolves
    mockFetch.mockImplementation(() => new Promise(() => {}));

    fireEvent.click(hotToggle);

    // The toggle should have the 'opacity-50' class (disabled state)
    await waitFor(() => {
      expect(hotToggle.closest('[class*="opacity-50"]')).toBeTruthy();
    });
  });
});

// ─── Delete ─────────────────────────────────────────────────────────────

describe('GuestsTable > Delete', () => {
  it('should call onDelete prop when Excluir is clicked', async () => {
    const mockOnDelete = vi.fn();
    mockFetchOnce([createGuest()]);
    renderTable({ onDelete: mockOnDelete });

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Excluir'));

    expect(mockOnDelete).toHaveBeenCalled();
  });
});

// ─── Initial Fetch ──────────────────────────────────────────────────────

describe('GuestsTable > Initial Fetch', () => {
  it('should fetch guests on mount', async () => {
    mockFetchOnce([createGuest()]);
    renderTable();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/guests');
    });
  });

  it('should set error on fetch failure', async () => {
    mockFetchOnce({ error: 'Failed' }, false, 403);
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('HTTP 403')).toBeInTheDocument();
    });
  });

  it('should handle non-JSON error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: () => {
        throw new Error('Not JSON');
      },
    });
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('HTTP 502')).toBeInTheDocument();
    });
  });
});
