'use client';

import { useState, KeyboardEvent } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  guestId: string;
  guestName: string;
  guestPhone: string;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteConfirmModal({
  isOpen,
  guestId,
  guestName,
  guestPhone,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await onConfirm(guestId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir convidado');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar exclusao"
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Warning header */}
        <div className="bg-red-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <WarningIcon />
            <h2 className="font-heading text-xl text-white">
              Confirmar Exclusao
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="font-body text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Warning message */}
          <p className="font-body text-sm text-wedding-wood leading-relaxed">
            Tem certeza que deseja excluir este convidado? Esta acao nao pode
            ser desfeita. Todos os dados do convidado serao removidos.
          </p>

          {/* Guest info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="font-body text-sm font-semibold text-wedding-wood">
              {guestName}
            </p>
            <p className="font-body text-sm text-gray-500">{guestPhone}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-body text-sm text-wedding-wood hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-body text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Warning Icon ───────────────────────────────────────────────────── */

function WarningIcon() {
  return (
    <svg
      className="w-7 h-7 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}
