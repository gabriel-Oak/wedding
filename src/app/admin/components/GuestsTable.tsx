'use client';

import { Guest } from '@/shared/types/guest';

interface GuestsTableProps {
  guests: Guest[];
  loading: boolean;
  onDelete: (guest: Guest) => void;
}

export default function GuestsTable({ guests, loading, onDelete }: GuestsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-body text-wedding-wood">Carregando convidados...</p>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-body text-wedding-wood text-lg">
          Nenhum convidado cadastrado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
              <tr key={guest.id} className="hover:bg-wedding-cream/50 transition-colors">
                <td className="px-6 py-4 font-body text-wedding-wood">{guest.name}</td>
                <td className="px-6 py-4 font-body text-wedding-wood">{guest.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {guest.is_hot_guest && (
                      <span className="font-body text-xs bg-wedding-gold text-wedding-wood px-2 py-0.5 rounded-full">
                        Hot
                      </span>
                    )}
                    {guest.is_natural_guest && (
                      <span className="font-body text-xs bg-wedding-blue text-white px-2 py-0.5 rounded-full">
                        Natural
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-body text-wedding-wood">
                  {guest.rsvp_status ?? '—'}
                </td>
                <td className="px-6 py-4 font-body text-wedding-wood">
                  {guest.has_read ? 'Sim' : 'Não'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(guest)}
                    className="font-body text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
