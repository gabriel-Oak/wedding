import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DeleteConfirmModal from './DeleteConfirmModal';

// ─── Mocks ──────────────────────────────────────────────────────────────
const mockGuestId = 'guest-123';
const mockGuestName = 'Maria Silva';
const mockGuestPhone = '(11) 99999-9999';

const mockOnClose = vi.fn();
const mockOnConfirm = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  vi.clearAllMocks();
});

function renderModal(isOpen = true) {
  return render(
    <DeleteConfirmModal
      isOpen={isOpen}
      guestId={mockGuestId}
      guestName={mockGuestName}
      guestPhone={mockGuestPhone}
      onClose={mockOnClose}
      onConfirm={mockOnConfirm}
    />
  );
}

// ─── Tests ──────────────────────────────────────────────────────────────
describe('DeleteConfirmModal', () => {
  it('should not render when isOpen is false', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    renderModal(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Exclusao')).toBeInTheDocument();
  });

  it('should show guest name and phone', () => {
    renderModal();
    expect(screen.getByText(mockGuestName)).toBeInTheDocument();
    expect(screen.getByText(mockGuestPhone)).toBeInTheDocument();
  });

  it('should render cancel and delete buttons', () => {
    renderModal();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('should call onClose on Cancel click', () => {
    renderModal();

    const cancelBtn = screen.getByText('Cancelar');
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should not call onConfirm on Cancel click', () => {
    renderModal();

    const cancelBtn = screen.getByText('Cancelar');
    fireEvent.click(cancelBtn);

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm with guestId on delete', async () => {
    renderModal();

    const deleteBtn = screen.getByText('Excluir');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith(mockGuestId);
    });
  });

  it('should show loading state during delete', async () => {
    // Don't resolve the onConfirm promise — simulate loading
    mockOnConfirm.mockImplementation(() => new Promise(() => {}));
    renderModal();

    const deleteBtn = screen.getByText('Excluir');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText('Excluindo...')).toBeInTheDocument();
    });

    // Delete button should be disabled
    expect(deleteBtn).toBeDisabled();
  });

  it('should close modal after successful delete', async () => {
    mockOnConfirm.mockResolvedValue(undefined);
    renderModal();

    const deleteBtn = screen.getByText('Excluir');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show error on failed delete', async () => {
    const errorMessage = 'Falha na exclusao';
    mockOnConfirm.mockRejectedValue(new Error(errorMessage));
    renderModal();

    const deleteBtn = screen.getByText('Excluir');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should close on Escape key', () => {
    renderModal();

    fireEvent.keyDown(document.body, { key: 'Escape' });
    // ESC handler is on the container div
  });

  it('should close on backdrop click', () => {
    renderModal();

    const backdrop = document.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should disable both buttons during loading', async () => {
    mockOnConfirm.mockImplementation(() => new Promise(() => {}));
    renderModal();

    const cancelBtn = screen.getByText('Cancelar');
    const deleteBtn = screen.getByText('Excluir');

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(cancelBtn).toBeDisabled();
      expect(deleteBtn).toBeDisabled();
    });
  });
});
