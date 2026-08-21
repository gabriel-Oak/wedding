import Image from 'next/image';
import VineDivider from '@/shared/ui/VineDivider';
import EucalyptusBranch from '@/shared/ui/EucalyptusBranch';

export function BacheloretteCard() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white text-wedding-wood shadow-lg border-0">
      {/* Decorative top branch */}
      <EucalyptusBranch className="absolute top-0 left-0 w-32 opacity-40 text-wedding-gold pointer-events-none animate-sway" />

      {/* Image section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/rancho_azul_arvores.png"
          alt="Rancho Casa Azul"
          fill
          className="object-cover"
          sizes="100%"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-6 pt-8">
        {/* Gold divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-wedding-gold/40" />
          <div className="w-2 h-2 rounded-full bg-wedding-gold" />
          <div className="h-px flex-1 bg-wedding-gold/40" />
        </div>

        <h3 className="font-heading text-2xl text-wedding-wood mb-2">
          Despedida de Solteiro
        </h3>
        <p className="font-body text-wedding-wood/80 text-sm leading-relaxed mb-4">
          Uma noite inesquecível de descontração e diversão antes do grande dia. Prepare-se para celebrar com as melhores amigas!
        </p>

        {/* Date badge */}
        <div className="flex items-center gap-2 text-wedding-wood font-body text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>Sexta, 06 de Novembro</span>
        </div>

        {/* Decorative bottom vine */}
        <VineDivider className="mt-4 text-wedding-gold/40" thin={true} />
      </div>

      {/* Decorative corner */}
      <EucalyptusBranch className="absolute bottom-0 right-0 w-32 opacity-30 text-wedding-gold pointer-events-none animate-sway" />
    </div>
  );
}
