"use client";

import { generateIcs } from "@/utils/generateIcs";

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
    <section className="bg-wedding-blue py-16 md:py-24">
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          Salve a Data
        </h2>

        <p className="font-body mt-6 max-w-xl text-lg text-white opacity-80">
          Adicione o evento ao seu calendário para não esquecer este dia tão
          especial.
        </p>

        <button
          onClick={handleDownload}
          className="mt-10 cursor-pointer rounded-full bg-wedding-gold px-8 py-3 font-body text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#c49f2a]"
        >
          Salve a Data
        </button>
      </div>
    </section>
  );
}
