"use client";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-gradient-to-b from-wedding-blue to-[#0d3a6e]">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Small gold label */}
          <p
            className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-100 font-heading text-sm text-wedding-gold uppercase tracking-widest transition-opacity md:text-base"
            aria-label="Save the Date label"
          >
            SAVE THE DATE
          </p>

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

          {/* Subtitle */}
          <p
            className="animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0 delay-500 font-body mt-6 max-w-2xl text-center text-lg font-light text-white transition-opacity md:text-xl"
          >
            A nossa história ganha um novo capítulo no lugar onde o azul do céu
            encontra o nosso amor.
          </p>
        </div>
      </div>
    </section>
  );
}
