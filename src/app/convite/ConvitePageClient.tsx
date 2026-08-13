'use client';

import { useState } from 'react';
import { Guest } from '@/shared/types';
import ConviteHeroSection from '@/modules/invite/invite-page/components/ConviteHeroSection';
import { WeddingDayCard } from '@/modules/invite/invite-page/components/WeddingDayCard';
import { BacheloretteCard } from '@/modules/invite/invite-page/components/BacheloretteCard';
import { NatureCard } from '@/modules/invite/invite-page/components/NatureCard';
import { RSVPForm } from '@/modules/invite/invite-page/components/RSVPForm';
import { useGuest } from '@/modules/invite/hooks/useGuest';
import { useRSVPStatus } from '@/modules/invite/hooks/useRSVPStatus';
import { VenueSection } from '@/modules/invite/invite-page/components/VenueSection';
import CornerLeaf from '@/shared/ui/CornerLeaf';
import CornerEucalyptus from '@/shared/ui/CornerEucalyptus';
import VineDivider from '@/shared/ui/VineDivider';
import { useCountdown } from '@/shared/hooks/useCountdown';
import LeafIcon from '@/shared/ui/LeafIcon';

type InitialGuest = Guest | null;

function MinimalCountdown() {
  const { days, hours, minutes, seconds } = useCountdown("2026-11-08T16:00:00");
  const values = [days, hours, minutes, seconds];
  const labels = ["DIAS", "HORAS", "MINUTOS", "SEGUNDOS"];

  return (
    <section className="py-8">
      <div className="flex items-center justify-center gap-3 mb-4 text-wedding-gold/40">
        <LeafIcon className="h-4 w-4" />
        <p className="font-body text-xs uppercase tracking-widest text-wedding-wood/60">
          Contagem Regressiva
        </p>
        <LeafIcon className="h-4 w-4" />
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {values.map((value, index) => (
          <div key={labels[index]} className="text-center">
            <span className="font-heading text-3xl md:text-4xl font-bold text-wedding-wood">
              {value}
            </span>
            <p className="mt-1 text-xs uppercase tracking-wider text-wedding-gold-darker">
              {labels[index]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface ConvitePageClientProps {
  initialGuest: InitialGuest;
  guestPhone: string | null;
}

export default function ConvitePageClient({
  initialGuest,
  guestPhone,
}: ConvitePageClientProps) {
  const { guest, loading: guestLoading } = useGuest(guestPhone);
  const { rsvp_status, loading: rsvpLoading } = useRSVPStatus(guestPhone);
  const activeGuest = guest || initialGuest;

  const [mounted] = useState(true);

  if (!mounted || guestLoading || rsvpLoading) {
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

          <VineDivider className="text-wedding-gold/40 mx-auto" thin={false} />

          {/* Wedding Day Card - always visible */}
          <WeddingDayCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-cream">
      <ConviteHeroSection />

      <div className="relative max-w-5xl mx-auto px-4 mt-3 py-12">
        {/* Corner decorations */}
        <CornerLeaf className="absolute top-0 left-0 w-16 md:w-12 opacity-10 md:opacity-20 animate-sway" />
        <CornerEucalyptus className="absolute top-0 right-0 w-16 md:w-12 opacity-10 md:opacity-20 animate-sway" />

        {/* Countdown */}
        <MinimalCountdown />

        {/* Personalized greeting */}
        <div className="max-w-5xl mx-auto text-center py-6">
          <h2 className="font-heading text-3xl text-wedding-wood">
            Olá, {activeGuest.name}!
          </h2>
          <p className="font-body text-wedding-wood/70 text-sm mt-2">
            Estamos muito felizes em contar com a sua presença!
          </p>
        </div>

        {/* Timeline divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-px flex-1 bg-wedding-gold/30" />
          <span className="font-heading text-wedding-gold text-sm">Cronograma</span>
          <div className="h-px flex-1 bg-wedding-gold/30" />
        </div>

        {/* Event Cards - 1 col mobile, 2 cols md, 3 cols lg, always centered */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Conditional Bachelorette Card */}
          {activeGuest.is_hot_guest && (
            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)]">
              <BacheloretteCard />
            </div>
          )}

          {/* Conditional Nature Card */}
          {activeGuest.is_natural_guest && (
            <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)]">
              <NatureCard />
            </div>
          )}

          {/* Wedding Day Card - always visible */}
          <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)]">
            <WeddingDayCard />
          </div>
        </div>

        {/* Sessão Local do Evento */}
        <VineDivider className="text-wedding-gold/40 mx-auto my-8" thin={true} />
        <VenueSection />

        {/* RSVP Form - only for guests with phone and existing confirmation */}
        {guestPhone && rsvp_status !== null && (
          <>
            <VineDivider className="text-wedding-gold/40 mx-auto my-8" thin={true} />
            <div className="text-center">
              <h3 className="font-heading text-xl text-wedding-wood mb-4">
                Confirme sua presença
              </h3>
              <RSVPForm
                phone={guestPhone}
                initialStatus={rsvp_status}
                disabled={rsvp_status !== 'Pendente'}
              />
            </div>
          </>
        )}

        {/* Bottom decoration */}
        <VineDivider className="text-wedding-gold/30 mx-auto" thin={true} />
      </div>
    </div>
  );
}
