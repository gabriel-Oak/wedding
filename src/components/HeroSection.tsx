"use client";

/* Wedding palette gradient background */
function WeddingGradient() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-wedding-blue via-[#2a5a9a] to-wedding-gold/30" />
  );
}

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

/* Mountain silhouette — far layer (lighter, smaller) */
function MountainFar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 220L48 215C96 210 192 200 288 190C384 180 480 170 576 185C672 200 768 240 864 245C960 250 1056 220 1152 200C1248 180 1344 170 1392 165L1440 160V320H1392C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320H0Z"
        fill="currentColor"
        opacity="0.15"
      />
      {/* Snow caps */}
      <path
        d="M576 185L590 170L604 185H576Z"
        fill="white"
        opacity="0.2"
      />
      <path
        d="M864 245L878 230L892 245H864Z"
        fill="white"
        opacity="0.2"
      />
    </svg>
  );
}

/* Mountain silhouette — mid layer (darker, more prominent) */
function MountainMid({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 260L60 250C120 240 240 220 360 210C480 200 600 200 720 220C840 240 960 280 1080 280C1200 280 1320 240 1380 220L1440 200V320H1380C1320 320 1200 320 1080 320C960 320 840 320 720 320C600 320 480 320 360 320C240 320 120 320 60 320H0Z"
        fill="currentColor"
        opacity="0.25"
      />
      {/* Snow caps */}
      <path
        d="M720 220L738 200L756 220H720Z"
        fill="white"
        opacity="0.25"
      />
      <path
        d="M1080 280L1098 265L1116 280H1080Z"
        fill="white"
        opacity="0.15"
      />
    </svg>
  );
}

/* Mountain silhouette — near layer (darkest, foreground) */
function MountainNear({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 290L80 280C160 270 320 250 480 250C640 250 800 270 960 275C1120 280 1280 270 1360 265L1440 260V320H1360C1280 320 1120 320 960 320C800 320 640 320 480 320C320 320 160 320 80 320H0Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

/* Pine tree silhouette */
function PineTree({
  className = "",
  height = 120,
  width = 60,
}: {
  className?: string;
  height?: number;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 60 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      {/* Trunk */}
      <rect x="26" y="90" width="8" height="30" fill="currentColor" opacity="0.5" />
      {/* Tree layers */}
      <path
        d="M30 5L10 45L20 40L5 70L18 65L5 100L55 100L42 65L55 70L40 40L50 45L30 5Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Snow on top */}
      <path
        d="M30 5L25 18L30 15L35 18L30 5Z"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
}

/* Eucalyptus branch with leaves */
function EucalyptusBranch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main branch */}
      <path
        d="M0 40C30 35 60 30 100 35C140 40 170 45 200 40"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Leaves */}
      <ellipse cx="25" cy="30" rx="10" ry="5" transform="rotate(-20 25 30)" fill="currentColor" opacity="0.3" />
      <ellipse cx="50" cy="25" rx="12" ry="5" transform="rotate(-15 50 25)" fill="currentColor" opacity="0.25" />
      <ellipse cx="80" cy="28" rx="11" ry="4.5" transform="rotate(-10 80 28)" fill="currentColor" opacity="0.3" />
      <ellipse cx="110" cy="32" rx="10" ry="4" transform="rotate(5 110 32)" fill="currentColor" opacity="0.25" />
      <ellipse cx="140" cy="38" rx="12" ry="5" transform="rotate(15 140 38)" fill="currentColor" opacity="0.3" />
      <ellipse cx="170" cy="42" rx="10" ry="4" transform="rotate(20 170 42)" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

/* Small stars for night sky */
function Stars({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 800"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <circle cx="150" cy="80" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="320" cy="120" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="480" cy="60" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="650" cy="150" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="800" cy="90" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="950" cy="50" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1100" cy="130" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="1250" cy="70" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1350" cy="110" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="80" cy="200" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="400" cy="180" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="700" cy="220" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1000" cy="190" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="1200" cy="210" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1380" cy="160" r="1.5" fill="white" className="animate-twinkle" />
    </svg>
  );
}

/* Tent / camping icon */
function TentIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 50"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tent body */}
      <path
        d="M30 5L5 45H55L30 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.2"
      />
      {/* Tent door */}
      <path
        d="M22 45L30 20L38 45"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Tent poles */}
      <line x1="5" y1="45" x2="3" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="55" y1="45" x2="57" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* Campfire icon */
function CampfireIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 50"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Logs */}
      <line x1="15" y1="40" x2="45" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      <line x1="18" y1="38" x2="42" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      {/* Flames */}
      <path
        d="M30 5C30 5 20 15 22 25C24 32 28 30 30 28C32 30 36 32 38 25C40 15 30 5 30 5Z"
        fill="currentColor"
        opacity="0.5"
        className="animate-fire"
      />
      <path
        d="M30 10C30 10 25 18 26 24C27 28 29 27 30 26C31 27 33 28 34 24C35 18 30 10 30 10Z"
        fill="currentColor"
        opacity="0.3"
        className="animate-fire"
      />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Wedding palette gradient background */}
      <WeddingGradient />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Subtle sparkle effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Stars className="absolute inset-0" />
      </div>

      {/* Subtle background leaf motifs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <BackgroundLeaf className="absolute -left-10 top-1/4 h-40 w-40 text-wedding-gold/20 animate-leaf-float" />
        <BackgroundLeaf className="absolute -right-10 top-1/2 h-36 w-36 text-wedding-gold/20 animate-leaf-float-slow" />
        <BackgroundLeaf className="absolute left-1/4 bottom-1/4 h-28 w-28 text-wedding-gold/20 animate-leaf-float" />
      </div>

      {/* Mountain layers — far (wedding palette) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <MountainFar className="absolute bottom-0 w-full text-wedding-wood" />
      </div>

      {/* Mountain layers — mid (wedding palette) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <MountainMid className="absolute bottom-0 w-full text-wedding-wood/90" />
      </div>

      {/* Mountain layers — near (wedding palette) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <MountainNear className="absolute bottom-0 w-full text-wedding-wood/80" />
      </div>

      {/* Pine trees — left side (wedding palette) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <PineTree
          className="absolute bottom-0 -left-4 text-wedding-wood/60 animate-sway"
          height={180}
          width={90}
        />
        <PineTree
          className="absolute bottom-0 left-[5%] text-wedding-wood/50 animate-sway"
          height={140}
          width={70}
        />
      </div>

      {/* Pine trees — right side (wedding palette) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <PineTree
          className="absolute bottom-0 -right-4 text-wedding-wood/60 animate-sway"
          height={170}
          width={85}
        />
        <PineTree
          className="absolute bottom-0 right-[5%] text-wedding-wood/50 animate-sway"
          height={130}
          width={65}
        />
      </div>

      {/* Eucalyptus branches — corners (wedding palette) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-branch-float">
          <EucalyptusBranch className="absolute top-0 left-0 h-16 w-40 text-wedding-gold/40 rotate-45" />
        </div>
        <div className="animate-branch-float">
          <EucalyptusBranch className="absolute bottom-0 right-0 h-16 w-40 text-wedding-gold/40 -rotate-135" />
        </div>
      </div>

      {/* Decorative camping elements (wedding palette) */}
      <div className="pointer-events-none absolute bottom-8 left-8 text-wedding-gold/20 animate-sway">
        <TentIcon className="h-10 w-10" />
      </div>
      <div className="pointer-events-none absolute bottom-12 right-12 text-wedding-gold/20 animate-fire">
        <CampfireIcon className="h-10 w-10" />
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
