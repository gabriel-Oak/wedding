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
