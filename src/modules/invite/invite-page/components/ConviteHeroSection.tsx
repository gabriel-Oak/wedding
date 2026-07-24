/* Convite Hero — versão genérica para a página de convite */
'use client';

import Image from 'next/image';
import EucalyptusBranch from '@/shared/ui/EucalyptusBranch';
import LeafIcon from '@/shared/ui/LeafIcon';

export default function ConviteHeroSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-wedding-blue">
      {/* Photo background */}
      <div className="absolute inset-0">
        <Image
          src="/images/por_do_sol_serra.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-wedding-blue/80 via-wedding-blue/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-screen items-center justify-center px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          {/* Label */}
          <div className="flex items-center gap-3 animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-100">
            <LeafIcon className="h-4 w-4 text-wedding-gold-darker md:h-5 md:w-5" />
            <p className="font-heading text-sm text-wedding-gold-darker uppercase tracking-widest md:text-base">
              CONVITE DE CASAMENTO
            </p>
            <LeafIcon className="h-4 w-4 text-wedding-gold-darker md:h-5 md:w-5" />
          </div>

          {/* Main heading */}
          <h1 className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-200 font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Gabriel & Mariana
          </h1>

          {/* Date */}
          <p className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-300 font-heading text-xl md:text-2xl text-wedding-gold-darker tracking-widest">
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
        <EucalyptusBranch className="absolute top-0 left-0 h-16 w-40 text-wedding-gold-darker/30 rotate-45" />
        <EucalyptusBranch className="absolute bottom-0 right-0 h-16 w-40 text-wedding-gold-darker/30 -rotate-135" />
      </div>
    </section>
  );
}
