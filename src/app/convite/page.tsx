import ConvitePageClient from './ConvitePageClient';

type SearchParams = Promise<{ guestPhone?: string }>;

export default async function ConvitePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const guestPhone = params.guestPhone;

  let initialGuest = null;
  if (guestPhone) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    const { data } = await supabase
      .from('guests')
      .select('*')
      .eq('phone', guestPhone)
      .single();
    initialGuest = data;
  }

  return (
    <main className="min-h-screen bg-wedding-cream">
      <ConvitePageClient initialGuest={initialGuest} guestPhone={guestPhone ?? null} />
    </main>
  );
}
