/* Convite Hero — versão genérica para a página de convite */
'use client';

import EucalyptusBranch from '@/shared/ui/EucalyptusBranch';
import LeafIcon from '@/shared/ui/LeafIcon';
import VineDivider from '@/shared/ui/VineDivider';

export default function ConviteHeroSection() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] overflow-hidden bg-wedding-blue">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-wedding-blue via-[#2a5a9a] to-wedding-gold/30" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[50vh] md:min-h-[60vh] items-center justify-center px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          {/* Label */}
          <div className="flex items-center gap-3 animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-100">
            <LeafIcon className="h-4 w-4 text-wedding-gold md:h-5 md:w-5" />
            <p className="font-heading text-sm text-wedding-gold uppercase tracking-widest md:text-base">
              CONVITE DE CASAMENTO
            </p>
            <LeafIcon className="h-4 w-4 text-wedding-gold md:h-5 md:w-5" />
          </div>

          {/* Main heading */}
          <h1 className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-200 font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Gabriel & Mariana
          </h1>

          {/* Date */}
          <p className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-300 font-heading text-xl md:text-2xl text-wedding-gold tracking-widest">
            08 . 11 . 2026
          </p>

          {/* Subtitle */}
          <p className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-500 font-body mt-4 max-w-lg text-center text-sm md:text-base text-white/90">
            Venha celebrar conosco este momento especial. Sua presença é o nosso maior presente.
          </p>
        </div>
      </div>

      {/* Decorative branches */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <EucalyptusBranch className="absolute top-0 left-0 h-16 w-40 text-wedding-gold/30 rotate-45" />
        <EucalyptusBranch className="absolute bottom-0 right-0 h-16 w-40 text-wedding-gold/30 -rotate-135" />
      </div>
    </section>
  );
}
