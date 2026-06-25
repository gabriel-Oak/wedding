"use client";

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

export default function Footer() {
  return (
    <footer className="relative bg-wedding-blue py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Decorative vine at top */}
        <div className="flex justify-center mb-4 text-wedding-gold">
          <VineDivider className="h-4 w-20 md:h-5 md:w-28" />
        </div>

        <div className="border-t-2 border-wedding-gold mb-6" />
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-heading text-white text-xl md:text-2xl font-semibold mb-3">
            Nos vemos em 08 de Novembro de 2026 💍
          </p>
          <p className="font-body text-white opacity-70 text-sm md:text-base font-light text-center">
            O convite oficial com horário, local exato e RSVP será enviado em
            breve.
          </p>
          {/* Small leaf accent at bottom */}
          <div className="mt-4 text-wedding-gold opacity-40">
            <LeafIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
