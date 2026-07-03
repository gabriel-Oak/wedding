'use client';

import { useState } from 'react';
import { Guest } from '@/shared/types';
import ConviteHeroSection from '@/modules/invite/invite-page/components/ConviteHeroSection';
import { WeddingDayCard } from '@/modules/invite/invite-page/components/WeddingDayCard';
import { BacheloretteCard } from '@/modules/invite/invite-page/components/BacheloretteCard';
import { NatureCard } from '@/modules/invite/invite-page/components/NatureCard';
import { RSVPForm } from '@/modules/invite/invite-page/components/RSVPForm';
import { useGuest } from '@/modules/invite/hooks/useGuest';
import CornerLeaf from '@/shared/ui/CornerLeaf';
import CornerEucalyptus from '@/shared/ui/CornerEucalyptus';
import VineDivider from '@/shared/ui/VineDivider';

type InitialGuest = Guest | null;

interface ConvitePageClientProps {
  initialGuest: InitialGuest;
  guestPhone: string | null;
}

export default function ConvitePageClient({
  initialGuest,
  guestPhone,
}: ConvitePageClientProps) {
  const { guest, loading } = useGuest(guestPhone);
  const activeGuest = guest || initialGuest;

  const [mounted] = useState(true);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-body text-wedding-wood/60 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!activeGuest) {
    return (
      <div className="min-h-screen bg-wedding-cream">
        <ConviteHeroSection />

        <div className="relative max-w-xl mx-auto px-4 py-16 space-y-8">
          {/* Corner decorations */}
          <CornerLeaf className="absolute top-0 left-0 w-32 opacity-40" />
          <CornerEucalyptus className="absolute top-0 right-0 w-32 opacity-40" />

          {/* Greeting */}
          <div className="text-center">
            <h2 className="font-heading text-3xl text-wedding-wood mb-2">
              Você foi convidado!
            </h2>
            <p className="font-body text-wedding-wood/70 text-sm">
              Acesse o convite com seu número de telefone para ver informações personalizadas.
            </p>
          </div>

          <VineDivider className="text-wedding-gold/40 mx-auto" />

          {/* Wedding Day Card - always visible */}
          <WeddingDayCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-cream">
      <ConviteHeroSection />

      <div className="relative max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Corner decorations */}
        <CornerLeaf className="absolute top-0 left-0 w-16 md:w-24 opacity-10 md:opacity-20 animate-sway" />
        <CornerEucalyptus className="absolute top-0 right-0 w-16 md:w-24 opacity-10 md:opacity-20 animate-sway" />

        {/* Personalized greeting */}
        <div className="max-w-md mx-auto text-center bg-wedding-blue rounded-2xl p-6 shadow-lg">
          <h2 className="font-heading text-2xl text-wedding-cream">
            Olá, {activeGuest.name}!
          </h2>
          <p className="font-body text-wedding-cream/70 text-sm mt-2">
            Estamos muito felizes em contar com a sua presença!
          </p>
        </div>

        {/* Timeline divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-wedding-gold/30" />
          <span className="font-heading text-wedding-gold text-sm">Cronograma</span>
          <div className="h-px flex-1 bg-wedding-gold/30" />
        </div>

        {/* Conditional Bachelorette Card */}
        {activeGuest.is_hot_guest && <BacheloretteCard />}

        {/* Conditional Nature Card */}
        {activeGuest.is_natural_guest && <NatureCard />}

        {/* Wedding Day Card - always visible */}
        <WeddingDayCard />

        {/* RSVP Form - only for guests with phone */}
        {guestPhone && activeGuest.rsvp_status !== null && (
          <>
            <VineDivider className="text-wedding-gold/40 mx-auto" />
            <div className="text-center">
              <h3 className="font-heading text-xl text-wedding-wood mb-4">
                Confirme sua presença
              </h3>
              <RSVPForm
                guestId={activeGuest.id}
                initialStatus={activeGuest.rsvp_status}
              />
            </div>
          </>
        )}

        {/* Bottom decoration */}
        <VineDivider className="text-wedding-gold/30 mx-auto" />
      </div>
    </div>
  );
}
