"use client";

import { useCountdown } from "@/hooks/useCountdown";

const targetDate = "2026-11-08T16:00:00";

const labels = ["DIAS", "HORAS", "MINUTOS", "SEGUNDOS"];

export default function CountdownSection() {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="bg-wedding-cream py-16 md:py-24">
      <div className="flex flex-col items-center justify-center">
        <h2 className="font-heading text-3xl font-bold text-wedding-wood md:text-4xl">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
