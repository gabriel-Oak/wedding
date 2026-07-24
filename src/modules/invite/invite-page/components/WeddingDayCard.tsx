import Image from 'next/image';
import VineDivider from '@/shared/ui/VineDivider';
import EucalyptusBranch from '@/shared/ui/EucalyptusBranch';

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);

export function WeddingDayCard() {
  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl bg-wedding-blue shadow-xl border-0">
      {/* Image section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/quiosque_ensolarado.png"
          alt="Rancho Casa Azul"
          fill
          className="object-cover"
          sizes="100%"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wedding-blue via-transparent to-transparent" />
      </div>

      {/* Decorative top branch */}
      <EucalyptusBranch className="absolute top-0 right-0 w-32 opacity-20 text-wedding-cream pointer-events-none" />

      {/* Content */}
      <div className="relative p-6 pt-8">
        {/* Gold divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-wedding-gold/40" />
          <div className="w-2 h-2 rounded-full bg-wedding-gold" />
          <div className="h-px flex-1 bg-wedding-gold/40" />
        </div>

        <h3 className="font-heading text-2xl text-wedding-gold mb-2">
          O Grande Dia
        </h3>
        <p className="font-body text-wedding-cream/80 text-sm leading-relaxed mb-4">
          Uma celebração inesquecível para unir duas famílias. Venha compartilhar esse momento especial conosco.
        </p>

        {/* Date badge */}
        <div className="flex items-center gap-2 text-wedding-gold font-body text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>08 de Novembro</span>
        </div>

        {/* Location */}
        <div className="mt-4 space-y-2">
          <p className="font-body text-wedding-cream font-semibold text-base">
            Rancho Casa Azul
          </p>
          <p className="font-body text-wedding-cream/80 text-sm leading-relaxed">
            Estrada Não-Identificada, Ibiraci, MG{' '}
            <a
              href="https://maps.app.goo.gl/bTiGgPg2TKULLF7L7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wedding-gold hover:underline inline-flex items-center gap-1 transition-colors"
            >
              Ver no Maps
              <MapPinIcon />
            </a>
          </p>
        </div>

        {/* Decorative vine */}
        <VineDivider className="text-wedding-gold/40" thin={true} />
      </div>

      {/* Decorative corner */}
      <EucalyptusBranch className="absolute bottom-0 left-0 w-32 opacity-20 text-wedding-cream pointer-events-none" />
    </div>
  );
}
