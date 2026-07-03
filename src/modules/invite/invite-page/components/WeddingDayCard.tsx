import VineDivider from '@/shared/ui/VineDivider';
import EucalyptusBranch from '@/shared/ui/EucalyptusBranch';

export function WeddingDayCard() {
  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl bg-wedding-blue shadow-xl border-2 border-wedding-gold/40">
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

        <h3 className="font-heading text-2xl text-wedding-gold mb-1">
          O Grande Dia
        </h3>

        {/* Date */}
        <p className="font-heading text-4xl text-wedding-cream font-bold mb-4 tracking-wide">
          08/11
        </p>

        {/* Location */}
        <p className="font-body text-wedding-cream/80 text-sm leading-relaxed mb-4">
          Rancho Vista Alegre, KM 12, Estrada de Peixoto - Delfinópolis/MG
        </p>

        {/* Decorative vine */}
        <VineDivider className="text-wedding-gold/40" />
      </div>

      {/* Decorative corner */}
      <EucalyptusBranch className="absolute bottom-0 left-0 w-32 opacity-20 text-wedding-cream pointer-events-none" />
    </div>
  );
}
