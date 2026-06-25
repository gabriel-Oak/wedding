"use client";

export default function Footer() {
  return (
    <footer className="bg-wedding-blue py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="border-t-2 border-wedding-gold mb-6" />
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-heading text-white text-xl md:text-2xl font-semibold mb-3">
            Nos vemos em 08 de Novembro de 2026 💍
          </p>
          <p className="font-body text-white opacity-70 text-sm md:text-base font-light text-center">
            O convite oficial com horário, local exato e RSVP será enviado em
            breve.
          </p>
        </div>
      </div>
    </footer>
  );
}
