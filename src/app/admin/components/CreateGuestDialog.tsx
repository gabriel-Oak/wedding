'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { validatePhone } from '@/lib/phone-validation';

interface CreateGuestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
}

export default function CreateGuestDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateGuestDialogProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isHotGuest, setIsHotGuest] = useState(false);
  const [isNaturalGuest, setIsNaturalGuest] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setPhone('');
    setIsHotGuest(false);
    setIsNaturalGuest(false);
    setErrors({});
    setApiError(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const normalized = validatePhone(phone);
      if (!normalized) {
        newErrors.phone = 'Telefone inválido. Use formato: (11) 99999-9999';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: validatePhone(phone)!,
          is_hot_guest: isHotGuest,
          is_natural_guest: isNaturalGuest,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro ao criar convidado');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
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

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Adicionar convidado"
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-wedding-blue px-6 py-4">
          <h2 className="font-heading text-xl text-white">Adicionar Convidado</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* API Error */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="font-body text-red-700 text-sm">{apiError}</p>
            </div>
          )}

          {/* Nome */}
          <div>
            <label htmlFor="guest-name" className="block font-body text-sm font-medium text-wedding-wood mb-1">
              Nome
            </label>
            <input
              id="guest-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full px-3 py-2 border rounded-lg font-body text-sm outline-none transition-colors ${
                errors.name
                  ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:border-wedding-blue focus:ring-2 focus:ring-wedding-blue/30'
              }`}
              placeholder="Nome do convidado"
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-red-600 text-xs font-body">{errors.name}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="guest-phone" className="block font-body text-sm font-medium text-wedding-wood mb-1">
              Telefone
            </label>
            <input
              id="guest-phone"
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              className={`w-full px-3 py-2 border rounded-lg font-body text-sm outline-none transition-colors ${
                errors.phone
                  ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:border-wedding-blue focus:ring-2 focus:ring-wedding-blue/30'
              }`}
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p className="mt-1 text-red-600 text-xs font-body">{errors.phone}</p>
            )}
          </div>

          {/* Hot Guest Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-body text-sm text-wedding-wood">Hot guest</span>
            <ToggleSwitch
              checked={isHotGuest}
              onChange={(val) => setIsHotGuest(val)}
            />
          </div>

          {/* Natural Guest Toggle */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-body text-sm text-wedding-wood">Natural guest</span>
            <ToggleSwitch
              checked={isNaturalGuest}
              onChange={(val) => setIsNaturalGuest(val)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-body text-sm text-wedding-wood hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-wedding-blue text-white rounded-lg font-body text-sm font-semibold hover:bg-wedding-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
              {loading ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Toggle Switch ──────────────────────────────────────────────────── */

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-wedding-blue/50 ${
        checked ? 'bg-wedding-blue' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
