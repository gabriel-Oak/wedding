"use client";

/* Small leaf SVG component */
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

/* Decorative vine divider SVG */
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

/* Subtle background leaf motif */
function BackgroundLeaf({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 5C40 5 65 20 65 45C65 60 55 70 40 70C25 70 15 60 15 45C15 20 40 5 40 5Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M40 15V65"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-gradient-to-b from-wedding-blue to-[#0d3a6e]">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Subtle background leaf motifs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <BackgroundLeaf className="absolute -left-10 top-1/4 h-40 w-40 text-white animate-leaf-float" />
        <BackgroundLeaf className="absolute -right-10 top-1/2 h-36 w-36 text-white animate-leaf-float-slow" />
        <BackgroundLeaf className="absolute left-1/4 bottom-1/4 h-28 w-28 text-white animate-leaf-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-2">
          {/* Small gold label with leaf accents */}
          <div className="flex items-center gap-3 animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-100">
            <LeafIcon className="h-4 w-4 text-wedding-gold md:h-5 md:w-5 animate-leaf-float" />
            <p
              className="font-heading text-sm text-wedding-gold uppercase tracking-widest transition-opacity md:text-base"
              aria-label="Save the Date label"
            >
              SAVE THE DATE
            </p>
            <LeafIcon className="h-4 w-4 text-wedding-gold md:h-5 md:w-5 animate-leaf-float" />
          </div>

          {/* Main heading */}
          <h1
            className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-200 font-heading text-5xl font-bold text-white transition-opacity md:text-6xl lg:text-7xl"
          >
            Save the Date
          </h1>

          {/* Date badge */}
          <p
            className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-300 font-heading text-2xl text-wedding-gold tracking-widest transition-opacity md:text-3xl"
          >
            08 . 11 . 2026
          </p>

          {/* Decorative vine divider */}
          <div
            className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-400 mt-2 text-wedding-gold"
          >
            <VineDivider className="h-4 w-24 md:h-5 md:w-32" />
          </div>

          {/* Subtitle */}
          <p
            className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-500 font-body mt-4 max-w-2xl text-center text-lg font-light text-white transition-opacity md:text-xl"
          >
            A nossa história ganha um novo capítulo no lugar onde o azul do céu
            encontra o nosso amor.
          </p>
        </div>
      </div>
    </section>
  );
}
