"use client";

import LeafIcon from "@/shared/ui/LeafIcon";

/* Decorative vine divider */
function VineDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 10C20 10 20 2 40 2C60 2 60 18 80 18C100 18 100 2 120 2C140 2 140 10 160 10C180 10 180 2 200 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="40" cy="2" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="120" cy="2" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/* Eucalyptus branch decoration */
function EucalyptusBranch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 20C30 15 60 10 100 15C140 20 170 25 200 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <ellipse cx="20" cy="14" rx="8" ry="4" transform="rotate(-15 20 14)" fill="currentColor" opacity="0.2" />
      <ellipse cx="45" cy="12" rx="9" ry="4" transform="rotate(-10 45 12)" fill="currentColor" opacity="0.15" />
      <ellipse cx="70" cy="13" rx="8" ry="3.5" transform="rotate(-8 70 13)" fill="currentColor" opacity="0.2" />
      <ellipse cx="100" cy="15" rx="9" ry="4" transform="rotate(5 100 15)" fill="currentColor" opacity="0.15" />
      <ellipse cx="130" cy="18" rx="8" ry="3.5" transform="rotate(10 130 18)" fill="currentColor" opacity="0.2" />
      <ellipse cx="160" cy="20" rx="9" ry="4" transform="rotate(15 160 20)" fill="currentColor" opacity="0.15" />
      <ellipse cx="185" cy="21" rx="7" ry="3" transform="rotate(20 185 21)" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

/* Small mountain silhouette */
function MountainIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 30"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 2L5 28H35L20 2Z"
        fill="currentColor"
        opacity="0.15"
      />
    </svg>
  );
}

/* Pine tree */
function PineTree({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 50"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 3L5 20L10 18L2 35L12 32L2 50H28L18 32L28 35L20 18L25 20L15 3Z"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-wedding-blue py-8 md:py-12 overflow-hidden">
      {/* Eucalyptus branch at top */}
      <div className="flex justify-center mb-4 text-wedding-gold/40">
        <EucalyptusBranch className="h-6 w-40" />
      </div>

      {/* Mountain silhouettes at top edge */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 overflow-hidden">
        <div className="flex justify-center gap-2 text-white/5">
          <MountainIcon className="h-6 w-8" />
          <MountainIcon className="h-4 w-6" />
          <MountainIcon className="h-8 w-10" />
          <MountainIcon className="h-5 w-7" />
          <MountainIcon className="h-6 w-8" />
          <MountainIcon className="h-4 w-6" />
          <MountainIcon className="h-7 w-9" />
          <MountainIcon className="h-5 w-7" />
          <MountainIcon className="h-6 w-8" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4">
        {/* Decorative vine at top */}
        <div className="flex justify-center mb-4 text-wedding-gold">
          <VineDivider className="h-4 w-20 md:h-5 md:w-28" />
        </div>

        <div className="border-t-2 border-wedding-gold mb-6" />
        <div className="flex flex-col items-center justify-center text-center">
          {/* Nature-themed decorative line */}
          <div className="mb-4 flex items-center gap-2 text-wedding-gold/30">
            <PineTree className="h-6 w-4" />
            <div className="h-px w-12 bg-wedding-gold/20" />
            <LeafIcon className="h-3 w-3" />
            <div className="h-px w-12 bg-wedding-gold/20" />
            <PineTree className="h-6 w-4" />
          </div>

          <p className="font-heading text-white text-xl md:text-2xl font-semibold mb-3">
            Nos vemos em 08 de novembro de 2026 💍
          </p>
          <p className="font-body text-white opacity-70 text-sm md:text-base font-light text-center">
            O convite com mais informações será enviado em breve.
          </p>
          {/* Small nature elements at bottom */}
          <div className="mt-4 flex items-center gap-3 text-wedding-gold/40">
            <LeafIcon className="h-3 w-3" />
            <MountainIcon className="h-4 w-5" />
            <LeafIcon className="h-3 w-3" />
          </div>
        </div>
      </div>
    </footer>
  );
}
