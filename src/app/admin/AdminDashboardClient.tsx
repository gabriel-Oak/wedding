'use client';

import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Guest } from '@/shared/types/guest';
import { GuestsTable } from './components/GuestsTable';
import CreateGuestDialog from './components/CreateGuestDialog';
import DeleteConfirmModal from './components/DeleteConfirmModal';

interface AdminDashboardClientProps {
  user: User | null;
}

export default function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tableRef = useRef<{ refresh: () => void }>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/admin/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-wedding-cream">
      {/* Header */}
      <header className="bg-wedding-blue shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="font-heading text-3xl text-white">Painel Admin</h1>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="font-body bg-wedding-gold text-wedding-wood px-5 py-2 rounded-lg font-semibold hover:bg-wedding-gold/90 transition-colors"
          >
            Adicionar Convidado
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <p className="text-red-700 font-body">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <GuestsTable
          ref={tableRef}
          onDelete={(guest) => setDeletingGuest(guest)}
        />

        {showCreateDialog && (
          <CreateGuestDialog
            isOpen={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onSuccess={() => {
              setShowCreateDialog(false);
              tableRef.current?.refresh();
            }}
          />
        )}

        {deletingGuest && (
          <DeleteConfirmModal
            guestId={deletingGuest.id}
            guestName={deletingGuest.name}
            guestPhone={deletingGuest.phone}
            isOpen={true}
            onClose={() => setDeletingGuest(null)}
            onConfirm={async (id) => {
              try {
                const res = await fetch(`/api/admin/guests/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Falha ao excluir convidado');
                setDeletingGuest(null);
                tableRef.current?.refresh();
              } catch (e) {
                console.error('Erro ao excluir convidado:', e);
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
