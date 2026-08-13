'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { Guest } from '@/shared/types/guest';
import { validatePhone } from '@/lib/phone-validation';

type RsvpStatus = 'Pendente' | 'Confirmado' | 'Recusado';

interface GuestsTableProps {
  onDelete: (guest: Guest) => void;
  onGuestsUpdated?: () => void;
}

const RSVP_OPTIONS: RsvpStatus[] = ['Pendente', 'Confirmado', 'Recusado'];

const API_URL = '/api/admin/guests';

function patchGuest(
  id: string,
  updates: Record<string, unknown>,
): Promise<Guest> {
  return fetch(API_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json() as Promise<Guest>;
  });
}

export const GuestsTable = forwardRef<{ refresh: () => void }, GuestsTableProps>(
  function GuestsTable({ onDelete }, ref) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{
    guestId: string;
    field: 'name' | 'phone';
    value: string;
  } | null>(null);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  // Batch edits: acumula alterações até salvar
  const [pendingEdits, setPendingEdits] = useState<
    Record<string, { name?: string; phone?: string }>
  >({});

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as Guest[];
      setGuests(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar convidados');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch guests initially
  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose refresh function to parent
  useImperativeHandle(ref, () => ({
    refresh: fetchGuests,
  }));

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
      return () => { if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current); };
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  // ─── Batch Edit: Name ─────────────────────────────────────────────
  const handleNameEdit = async (guest: Guest, newName: string) => {
    if (!newName.trim()) return;

    // Add to pending edits
    setPendingEdits((prev) => ({
      ...prev,
      [guest.id]: { ...prev[guest.id], name: newName.trim() },
    }));
  };

  // ─── Batch Edit: Phone ────────────────────────────────────────────
  const handlePhoneEdit = async (guest: Guest, newPhone: string) => {
    const normalized = validatePhone(newPhone);
    if (!normalized) {
      showToast('Telefone inválido. Formato: +55XX... ou XX...', 'error');
      return;
    }

    // Add to pending edits
    setPendingEdits((prev) => ({
      ...prev,
      [guest.id]: { ...prev[guest.id], phone: normalized },
    }));
  };

  // ─── Save All Pending Edits ───────────────────────────────────────
  const handleSaveAllEdits = async () => {
    const edits = Object.entries(pendingEdits);
    if (edits.length === 0) return;

    // Optimistic update: apply all changes
    const updatedGuests = guests.map((g) => {
      const edit = pendingEdits[g.id];
      if (!edit) return g;
      return { ...g, ...edit };
    });
    setGuests(updatedGuests);

    try {
      // Save all edits in parallel
      const savePromises = edits.map(([guestId, updates]) =>
        patchGuest(guestId, updates),
      );
      await Promise.all(savePromises);

      showToast(`${edits.length} convidado(s) atualizado(s)`, 'success');
      setPendingEdits({});
    } catch (e) {
      // Rollback on error
      setGuests(guests);
      const msg = e instanceof Error ? e.message : 'Erro ao atualizar convidados';
      showToast(msg, 'error');
    }
  };



  // ─── Cancel Edits ─────────────────────────────────────────────────
  const handleCancelEdits = () => {
    setPendingEdits({});
    setEditingCell(null);
  };

  // ─── Toggle: Hot/Natural ───────────────────────────────────────────
  const handleToggleType = async (
    guest: Guest,
    field: 'is_hot_guest' | 'is_natural_guest',
    value: boolean,
  ) => {
    setToggling((prev) => new Set(prev).add(guest.id));

    const oldState = { is_hot_guest: guest.is_hot_guest, is_natural_guest: guest.is_natural_guest };
    const fieldKey = field === 'is_hot_guest' ? 'is_hot_guest' : 'is_natural_guest';

    // Optimistic update
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guest.id ? { ...g, [fieldKey]: value } : g,
      ),
    );

    try {
      const updated = await patchGuest(guest.id, { [field]: value });
      setGuests((prev) =>
        prev.map((g) => (g.id === updated.id ? updated : g)),
      );
    } catch (e) {
      setGuests((prev) =>
        prev.map((g) => (g.id === guest.id ? { ...g, ...oldState } : g)),
      );
      const msg = e instanceof Error ? e.message : 'Erro ao atualizar tipo';
      showToast(msg, 'error');
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(guest.id);
        return next;
      });
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-wedding-wood">Carregando convidados...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="font-body text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 font-body text-sm text-wedding-blue underline hover:text-wedding-blue/80 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty State ───────────────────────────────────────────────────
  if (guests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="font-body text-wedding-wood text-lg">
          Nenhum convidado cadastrado.
        </p>
      </div>
    );
  }

  // ─── Table ─────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 font-body text-sm px-4 py-2 rounded-lg shadow-lg text-white transition-opacity ${
            toast.type === 'success'
              ? 'bg-wedding-blue'
              : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-wedding-blue">
            <tr>
              <th className="font-heading text-white text-left px-6 py-3">Nome</th>
              <th className="font-heading text-white text-left px-6 py-3">Telefone</th>
              <th className="font-heading text-white text-left px-6 py-3">Tipo</th>
              <th className="font-heading text-white text-left px-6 py-3">Status RSVP</th>
              <th className="font-heading text-white text-left px-6 py-3">Leu?</th>
              <th className="font-heading text-white text-right px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wedding-wood/10">
            {guests.map((guest) => (
              <GuestRow
                key={guest.id}
                guest={guest}
                isEditing={editingCell?.guestId === guest.id}
                editField={editingCell?.field}
                editValue={editingCell?.value ?? ''}
                isToggling={toggling.has(guest.id)}
                onStartEdit={(field) =>
                  setEditingCell({
                    guestId: guest.id,
                    field,
                    value: field === 'name' ? guest.name : guest.phone,
                  })
                }
                onNameChange={(name) => handleNameEdit(guest, name)}
                onPhoneChange={(phone) => handlePhoneEdit(guest, phone)}
                onEditValueChange={(value) =>
                  setEditingCell((prev) =>
                    prev?.guestId === guest.id ? { ...prev, value } : prev,
                  )
                }
                onToggleHot={(val) => handleToggleType(guest, 'is_hot_guest', val)}
                onToggleNatural={(val) => handleToggleType(guest, 'is_natural_guest', val)}
                onDelete={() => onDelete(guest)}
                hasPendingEdits={!!pendingEdits[guest.id]}
                onSaveAll={handleSaveAllEdits}
                onCancel={handleCancelEdits}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// ─── Guest Row Component ───────────────────────────────────────────────────
interface GuestRowProps {
  guest: Guest;
  isEditing: boolean;
  editField?: 'name' | 'phone';
  editValue: string;
  isToggling: boolean;
  onStartEdit: (field: 'name' | 'phone') => void;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onEditValueChange: (value: string) => void;
  onToggleHot: (val: boolean) => void;
  onToggleNatural: (val: boolean) => void;
  onDelete: () => void;
  hasPendingEdits: boolean;
  onSaveAll: () => void;
  onCancel: () => void;
}

function GuestRow({
  guest,
  isEditing,
  editField,
  editValue,
  isToggling,
  onStartEdit,
  onNameChange,
  onPhoneChange,
  onEditValueChange,
  onToggleHot,
  onToggleNatural,
  onDelete,
  hasPendingEdits,
  onSaveAll,
  onCancel,
}: GuestRowProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editField === 'name' && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing, editField]);

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSaveAll();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSaveAll();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <tr className="hover:bg-wedding-cream/50 transition-colors">
      {/* Nome */}
      <td className="px-6 py-4">
        {isEditing && editField === 'name' ? (
          <input
            ref={nameInputRef}
            type="text"
            value={editValue}
            onChange={(e) => {
              onNameChange(e.target.value);
              onEditValueChange(e.target.value);
            }}
            onKeyDown={handleNameKeyDown}
            className="font-body text-wedding-wood border border-wedding-blue rounded px-2 py-1 w-full"
          />
        ) : (
          <button
            onClick={() => onStartEdit('name')}
            className="font-body text-wedding-wood hover:text-wedding-blue transition-colors text-left block w-full cursor-text"
          >
            {guest.name}
          </button>
        )}
      </td>

      {/* Telefone */}
      <td className="px-6 py-4">
        {isEditing && editField === 'phone' ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => {
              onPhoneChange(e.target.value);
              onEditValueChange(e.target.value);
            }}
            onKeyDown={handlePhoneKeyDown}
            placeholder="+55XX..."
            className="font-body text-wedding-wood border border-wedding-blue rounded px-2 py-1 w-full"
          />
        ) : (
          <button
            onClick={() => onStartEdit('phone')}
            className="font-body text-wedding-wood hover:text-wedding-blue transition-colors text-left block w-full cursor-text"
          >
            {guest.phone}
          </button>
        )}
      </td>

      {/* Tipo */}
      <td className="px-6 py-4">
        <div className="flex gap-1.5 items-center">
          <ToggleSwitch
            label="Hot"
            checked={guest.is_hot_guest}
            onChange={(val) => onToggleHot(val)}
            disabled={isToggling}
            activeBg="bg-wedding-gold"
            activeText="text-wedding-wood"
          />
          <ToggleSwitch
            label="Natural"
            checked={guest.is_natural_guest}
            onChange={(val) => onToggleNatural(val)}
            disabled={isToggling}
            activeBg="bg-wedding-blue"
            activeText="text-white"
          />
        </div>
      </td>

      {/* Status RSVP (readonly) */}
      <td className="px-6 py-4">
        <span
          className={`font-body text-sm px-2 py-1 rounded-full inline-block ${
            guest.rsvp_status === 'Confirmado'
              ? 'bg-green-100 text-green-700'
              : guest.rsvp_status === 'Recusado'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {guest.rsvp_status ?? 'Pendente'}
        </span>
      </td>

      {/* Leu? */}
      <td className="px-6 py-4">
        <span
          className={`font-body text-sm px-2 py-0.5 rounded-full ${
            guest.has_read
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {guest.has_read ? 'Sim' : 'Não'}
        </span>
      </td>

      {/* Ações */}
      <td className="px-6 py-4 text-right">
        {hasPendingEdits ? (
          <div className="flex gap-2 justify-end">
            <button
              onClick={onSaveAll}
              className="font-body text-sm bg-wedding-blue text-white px-3 py-1 rounded hover:bg-wedding-blue/80 transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={onCancel}
              className="font-body text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={onDelete}
            className="font-body text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Excluir
          </button>
        )}
      </td>
    </tr>
  );
}

// ─── Toggle Switch Component ───────────────────────────────────────────────
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
  activeBg: string;
  activeText: string;
}

function ToggleSwitch({ label, checked, onChange, disabled, activeBg, activeText }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-body transition-all ${
        checked ? `${activeBg} ${activeText}` : 'bg-gray-100 text-gray-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
    >
      <span
        className={`w-3 h-3 rounded-full transition-colors ${
          checked ? 'bg-current' : 'bg-gray-300'
        }`}
      />
      {label}
    </button>
  );
}
