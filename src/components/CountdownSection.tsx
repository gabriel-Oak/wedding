"use client";

import { useCountdown } from "@/hooks/useCountdown";

/* Small leaf SVG for decorative accents */
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C12 2 4 8 4 15C4 19.42 7.58 23 12 23C16.42 23 20 19.42 20 15C20 8 12 2 12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 6V21"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <path
        d="M12 10C10 10 8 11 7 13"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M12 14C14 14 15.5 15 16.5 16.5"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.3"
        fill="none"
      />
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
      {/* Main stem */}
      <path
        d="M0 20C30 15 60 10 100 15C140 20 170 25 200 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Leaves */}
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
function MiniMountain({ className = "" }: { className?: string }) {
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
        opacity="0.2"
      />
    </svg>
  );
}

/* Small camping tent icon */
function MiniTent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 25"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 2L2 23H28L15 2Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        opacity="0.15"
      />
    </svg>
  );
}

const targetDate = "2026-11-08T16:00:00";

const labels = ["DIAS", "HORAS", "MINUTOS", "SEGUNDOS"];

export default function CountdownSection() {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="relative bg-wedding-cream py-16 md:py-24 overflow-hidden">
      {/* Background eucalyptus branch top-left (wedding palette) */}
      <div className="pointer-events-none absolute left-0 top-0 overflow-hidden">
        <EucalyptusBranch className="h-16 w-40 text-wedding-gold/20 -rotate-90" />
      </div>

      {/* Background eucalyptus branch bottom-right (wedding palette) */}
      <div className="pointer-events-none absolute bottom-0 right-0 overflow-hidden">
        <EucalyptusBranch className="h-16 w-40 text-wedding-gold/20 rotate-90" />
      </div>

      {/* Small mountain accents (wedding palette) */}
      <div className="pointer-events-none absolute bottom-4 left-8 text-wedding-wood/20">
        <MiniMountain className="h-6 w-8" />
      </div>
      <div className="pointer-events-none absolute bottom-6 left-20 text-wedding-wood/15">
        <MiniMountain className="h-4 w-6" />
      </div>

      <div className="pointer-events-none absolute bottom-4 right-8 text-wedding-wood/20">
        <MiniMountain className="h-6 w-8" />
      </div>
      <div className="pointer-events-none absolute bottom-6 right-20 text-wedding-wood/15">
        <MiniMountain className="h-4 w-6" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Decorative eucalyptus above title (wedding palette) */}
        <div className="mb-6 text-wedding-gold/20">
          <EucalyptusBranch className="h-8 w-48" />
        </div>

        <h2 className="font-heading text-3xl font-bold text-wedding-wood md:text-4xl">
          <span className="mr-2 inline-block text-wedding-gold">
            <LeafIcon className="h-5 w-5 md:h-6 md:w-6" />
          </span>
          Contagem Regressiva
        </h2>
        <p className="font-body mb-10 text-lg opacity-70 text-wedding-wood">
          Um dia especial à beira da natureza
        </p>

        {/* Decorative divider (wedding palette) */}
        <div className="mb-10 flex items-center gap-3 text-wedding-gold/20">
          <MiniMountain className="h-4 w-5" />
          <div className="h-px w-16 bg-wedding-gold/20" />
          <LeafIcon className="h-3 w-3 text-wedding-gold/30" />
          <div className="h-px w-16 bg-wedding-gold/20" />
          <MiniMountain className="h-4 w-5" />
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {values.map((value, index) => (
            <div key={labels[index]} className="flex flex-col items-center">
              <span className="font-heading text-5xl font-bold text-wedding-blue md:text-6xl">
                {value}
              </span>
              <span className="mt-2 text-sm uppercase tracking-widest text-wedding-gold md:text-base">
                {labels[index]}
              </span>
              {/* Decorative leaf accent below each block */}
              <LeafIcon className="mt-1 h-3 w-3 text-wedding-gold/30" />
              {/* Tiny mountain under each block */}
              <MiniMountain className="mt-0.5 h-2 w-3 text-wedding-wood/15" />
            </div>
          ))}
        </div>

        {/* Decorative elements at bottom (wedding palette) */}
        <div className="mt-12 flex items-center gap-6 text-wedding-gold/15">
          <MiniTent className="h-5 w-5" />
          <MiniMountain className="h-4 w-6" />
          <LeafIcon className="h-3 w-3" />
          <MiniMountain className="h-4 w-6" />
          <MiniTent className="h-5 w-5" />
        </div>
      </div>
    </section>
  );
}
