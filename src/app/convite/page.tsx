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
  // Get the raw phone from URL — handle various formats
  const rawPhone = params.guestPhone || '';
  
  // Normalize phone: ensure it has +55 prefix for Brazilian numbers
  let guestPhone = rawPhone.trim();
  
  // If phone starts with space, it was a + that got decoded by Next.js
  if (guestPhone.startsWith(' ')) {
    guestPhone = `+${guestPhone.slice(1)}`;
  }
  
  // If phone doesn't start with +, add +55 prefix (Brazilian format)
  if (guestPhone && !guestPhone.startsWith('+')) {
    // Only add +55 if it looks like a Brazilian number (starts with 55 or is 10-11 digits)
    // But DON'T add if it already starts with 55 (would duplicate)
    const startsWith55 = /^55\d{9,10}$/.test(guestPhone);
    const isPlainDigits = /^\d{10,11}$/.test(guestPhone);
    
    if (startsWith55) {
      // Already has 55 prefix, just add +
      guestPhone = `+${guestPhone}`;
    } else if (isPlainDigits) {
      // Plain digits, add +55
      guestPhone = `+55${guestPhone}`;
    }
  }

  const initialGuest: Guest | null = null;
  // Note: initialGuest is now loaded client-side via useGuest hook
  // to avoid Next.js Turbopack URL parsing issues with + in phone numbers

  return (
    <main className="min-h-screen bg-wedding-cream">
      <ConvitePageClient initialGuest={initialGuest} guestPhone={guestPhone ?? null} />
    </main>
  );
}
