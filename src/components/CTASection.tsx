"use client";

import { generateIcs } from "@/utils/generateIcs";

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

/* Corner leaf accent */
function CornerLeaf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 40C0 20 10 0 40 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M10 30C15 20 25 10 35 5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
}

export default function CTASection() {
  const handleDownload = () => {
    const event = {
      title: "Casamento — 08 de Novembro de 2026",
      startDate: new Date("2026-11-08T16:00:00"),
      endDate: new Date("2026-11-08T23:00:00"),
      location: "Casamento",
      description: "Save the Date — Nos vemos lá!",
    };

    const icsContent = generateIcs(event);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "save-the-date.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative bg-wedding-blue py-16 md:py-24">
      {/* Decorative corner leaves */}
      <CornerLeaf className="absolute left-0 top-0 h-16 w-16 text-white md:h-20 md:w-20" />
      <CornerLeaf className="absolute right-0 bottom-0 h-16 w-16 rotate-180 text-white md:h-20 md:w-20" />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          Salve a Data
        </h2>

        <p className="font-body mt-6 max-w-xl text-lg text-white opacity-80">
          Adicione o evento ao seu calendário para não esquecer este dia tão
          especial.
        </p>

        <button
          onClick={handleDownload}
          className="mt-10 flex cursor-pointer items-center gap-2 rounded-full bg-wedding-gold px-8 py-3 font-body text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#c49f2a]"
        >
          <LeafIcon className="h-4 w-4" />
          Salve a Data
        </button>
      </div>
    </section>
  );
}
