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
        d="M17 8C8 10 5.9 16.17 3.82 21.34C5.67 21.74 7.59 21.37 9.25 20.69C11.11 21.86 13.23 22.19 15.2 21.56C17.61 20.81 19.54 18.96 20.5 16.5C21.53 13.86 20.77 10.53 17 8Z"
        fill="currentColor"
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
    <section className="bg-wedding-cream py-16 md:py-24">
      <div className="flex flex-col items-center justify-center">
        <h2 className="font-heading text-3xl font-bold text-wedding-wood md:text-4xl">
          <span className="mr-2 inline-block text-wedding-gold">
            <LeafIcon className="h-5 w-5 md:h-6 md:w-6" />
          </span>
          Contagem Regressiva
        </h2>
        <p className="font-body mb-10 text-lg opacity-70 text-wedding-wood">
          Um dia especial à beira da natureza
        </p>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
