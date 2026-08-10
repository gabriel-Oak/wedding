'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Guest } from '@/shared/types/guest';
import GuestsTable from './components/GuestsTable';

interface AdminDashboardClientProps {
  user: User | null;
}

export default function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/guests');
      if (!res.ok) throw new Error('Falha ao buscar convidados');
      const data: Guest[] = await res.json();
      setGuests(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGuests();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <p className="font-body text-wedding-wood text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-cream">
      {/* Header */}
      <header className="bg-wedding-blue shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="font-heading text-3xl text-white">Painel Admin</h1>
          <button
            onClick={() => alert('CreateGuest dialog coming in Task 4')}
            className="font-body bg-wedding-gold text-wedding-wood px-5 py-2 rounded-lg font-semibold hover:bg-wedding-gold/90 transition-colors"
          >
            Adicionar Convidado
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="font-body text-red-700">{error}</p>
            <button
              onClick={fetchGuests}
              className="mt-2 font-body text-sm text-wedding-blue underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <GuestsTable
          guests={guests}
          loading={false}
          onDelete={() => alert('DeleteConfirmModal coming in Task 5')}
        />
      </main>
    </div>
  );
}
