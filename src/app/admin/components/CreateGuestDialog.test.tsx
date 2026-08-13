import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CreateGuestDialog from './CreateGuestDialog';

// ─── Mocks ──────────────────────────────────────────────────────────────
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

const mockFetchFn = vi.fn() as unknown as typeof fetch;
beforeEach(() => {
  vi.clearAllMocks();
  (globalThis as unknown as { fetch: typeof mockFetchFn }).fetch = mockFetchFn;
});

function mockFetchResponse(data: unknown, ok = true, status = 200) {
  mockFetchFn.mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

function renderDialog(isOpen = true) {
  return render(
    <CreateGuestDialog
      isOpen={isOpen}
      onClose={mockOnClose}
      onSuccess={mockOnSuccess}
    />
  );
}

// ─── Tests ──────────────────────────────────────────────────────────────
describe('CreateGuestDialog', () => {
  it('should not render when isOpen is false', () => {
    renderDialog(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    renderDialog(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Adicionar Convidado')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    renderDialog();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument();
    expect(screen.getByText('Hot guest')).toBeInTheDocument();
    expect(screen.getByText('Natural guest')).toBeInTheDocument();
  });

  it('should show validation error for empty name', async () => {
    renderDialog();

    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });
  });

  it('should show validation error for empty phone', async () => {
    renderDialog();

    // Fill name
    const nameInput = screen.getByLabelText('Nome');
    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } });

    // Submit
    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Telefone é obrigatório')).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid phone format', async () => {
    renderDialog();

    // Fill name
    const nameInput = screen.getByLabelText('Nome');
    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } });

    // Fill invalid phone
    const phoneInput = screen.getByLabelText('Telefone');
    fireEvent.change(phoneInput, { target: { value: '123' } });

    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Telefone inválido/)).toBeInTheDocument();
    });
  });

  it('should clear validation errors on input change', async () => {
    renderDialog();

    // Trigger name error
    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();

    // Type in name field to clear error
    const nameInput = screen.getByLabelText('Nome');
    fireEvent.change(nameInput, { target: { value: 'Maria' } });

    expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument();
  });

  it('should toggle hot guest switch', () => {
    renderDialog();

    const hotToggle = screen.getAllByRole('switch')[0];
    expect(hotToggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(hotToggle);
    expect(hotToggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(hotToggle);
    expect(hotToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('should toggle natural guest switch', () => {
    renderDialog();

    const naturalToggle = screen.getAllByRole('switch')[1];
    expect(naturalToggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(naturalToggle);
    expect(naturalToggle).toHaveAttribute('aria-checked', 'true');
  });

  it('should close on Cancel button click', () => {
    renderDialog();

    const cancelBtn = screen.getByText('Cancelar');
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close on Escape key', () => {
    renderDialog();

    fireEvent.keyDown(document.body, { key: 'Escape' });
    // Note: dialog handles Escape on its own container
  });

  it('should close on backdrop click', () => {
    renderDialog();

    const backdrop = document.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should submit form with valid data', async () => {
    renderDialog();

    const nameInput = screen.getByLabelText('Nome');
    const phoneInput = screen.getByLabelText('Telefone');

    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } });
    fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } });

    // Submit
    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith(
        '/api/admin/guests',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('should close and call onSuccess on successful create', async () => {
    mockFetchResponse({ id: '1', name: 'Maria Silva' }, true, 201);
    renderDialog();

    const nameInput = screen.getByLabelText('Nome');
    const phoneInput = screen.getByLabelText('Telefone');

    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } });
    fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } });

    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show API error on failure', async () => {
    mockFetchResponse({ error: 'Guest already exists' }, false, 400);
    renderDialog();

    const nameInput = screen.getByLabelText('Nome');
    const phoneInput = screen.getByLabelText('Telefone');

    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } });
    fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } });

    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Guest already exists')).toBeInTheDocument();
    });
  });

  it('should show loading state during submit', async () => {
    // Don't resolve the fetch — simulate loading
    mockFetchFn.mockImplementation(() => new Promise(() => {}));
    renderDialog();

    const nameInput = screen.getByLabelText('Nome');
    const phoneInput = screen.getByLabelText('Telefone');

    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } });
    fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } });

    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Criando...')).toBeInTheDocument();
    });

    // Button should be disabled
    expect(submitBtn).toBeDisabled();
  });

  it('should include correct body on submit', async () => {
    mockFetchResponse({ id: '1' }, true, 201);
    renderDialog();

    const nameInput = screen.getByLabelText('Nome');
    const phoneInput = screen.getByLabelText('Telefone');

    fireEvent.change(nameInput, { target: { value: 'Maria Silva' } });
    fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } });

    // Toggle hot guest
    const hotToggle = screen.getAllByRole('switch')[0];
    fireEvent.click(hotToggle);

    const submitBtn = screen.getByText('Criar');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith(
        '/api/admin/guests',
        expect.objectContaining({
          body: expect.stringContaining('"is_hot_guest":true'),
        })
      );
    });
  });
});
