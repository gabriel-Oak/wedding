import type { Metadata } from 'next';
import type { Guest } from '@/shared/types';
import ConvitePageClient from './ConvitePageClient';

type SearchParams = Promise<{ guestPhone?: string }>;

export const metadata: Metadata = {
  title: 'Convite de Casamento',
  description: 'Confirme sua presença no casamento de Gabriel e Mariana',
};

export default async function ConvitePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const guestPhone = params.guestPhone;

  let initialGuest: Guest | null = null;
  if (guestPhone) {
    const res = await fetch(`/api/guests?phone=${encodeURIComponent(guestPhone)}`);
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      initialGuest = json.data[0];
    }
  }

  return (
    <main className="min-h-screen bg-wedding-cream">
      <ConvitePageClient initialGuest={initialGuest} guestPhone={guestPhone ?? null} />
    </main>
  );
}
