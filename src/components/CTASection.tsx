"use client";

import { WEDDING_EVENT } from "@/utils/eventConfig";
import { generateCalendarLinks } from "@/utils/calendarLinks";
import { generateIcs } from "@/utils/generateIcs";

import LeafIcon from "@/components/ui/LeafIcon";

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
        opacity="0.7"
      />
      <path
        d="M10 30C15 20 25 10 35 5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/* Eucalyptus branch for corners */
function CornerEucalyptus({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        d="M0 30C20 25 40 20 60 25C80 30 90 35 100 30"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      {/* Leaves */}
      <ellipse cx="15" cy="24" rx="6" ry="3" transform="rotate(-10 15 24)" fill="currentColor" opacity="0.15" />
      <ellipse cx="35" cy="22" rx="7" ry="3" transform="rotate(-5 35 22)" fill="currentColor" opacity="0.12" />
      <ellipse cx="55" cy="24" rx="6" ry="2.5" transform="rotate(5 55 24)" fill="currentColor" opacity="0.15" />
      <ellipse cx="75" cy="27" rx="7" ry="3" transform="rotate(10 75 27)" fill="currentColor" opacity="0.12" />
      <ellipse cx="90" cy="30" rx="5" ry="2.5" transform="rotate(15 90 30)" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

/* Small mountain silhouette */
function MountainIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 30"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 2L5 28H35L20 2Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        opacity="0.1"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="5" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="currentColor"
        fontSize="8"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        G
      </text>
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="currentColor"
        fontSize="8"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        O
      </text>
    </svg>
  );
}



const calendarPlatforms: Array<{
  key: "google" | "outlook";
  label: string;
  icon: React.ComponentType;
}> = [
  { key: "google", label: "Google Agenda", icon: GoogleIcon },
  { key: "outlook", label: "Outlook", icon: OutlookIcon },
];

export default function CTASection() {
  const handleAddToCalendar = (platform: "google" | "outlook") => {
    const links = generateCalendarLinks(WEDDING_EVENT);
    const url = links[platform];
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const icsContent = generateIcs(WEDDING_EVENT);
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
    <section className="relative bg-wedding-blue py-16 md:py-24 overflow-hidden">
      {/* Decorative corner leaves */}
      <div className="absolute left-0 top-1 h-16 w-16 md:h-20 md:w-20">
        <CornerLeaf className="h-full w-full animate-corner-float text-white" />
      </div>
      <div className="absolute right-0 bottom-1 h-16 w-16 rotate-180 md:h-20 md:w-20">
        <CornerLeaf className="h-full w-full animate-corner-float text-white" />
      </div>

      {/* Eucalyptus branches in corners */}
      <CornerEucalyptus className="absolute left-0 top-8 h-12 w-32 animate-eucalyptus-float text-white/10 rotate-12" />
      <CornerEucalyptus className="absolute right-0 bottom-8 h-12 w-32 animate-eucalyptus-float text-white/10 -rotate-12" />

      {/* Mountain silhouettes at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <MountainIcon className="absolute bottom-0 left-10 h-8 w-10 text-white/5" />
        <MountainIcon className="absolute bottom-0 left-24 h-6 w-8 text-white/3" />
        <MountainIcon className="absolute bottom-0 right-10 h-8 w-10 text-white/5" />
        <MountainIcon className="absolute bottom-0 right-24 h-6 w-8 text-white/3" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Nature-themed decorative element above title */}
        <div className="mb-4 flex items-center gap-2 text-white/20">
          <MountainIcon className="h-5 w-6" />
          <div className="h-px w-8 bg-white/20" />
          <LeafIcon className="h-3 w-3" />
          <div className="h-px w-8 bg-white/20" />
          <MountainIcon className="h-5 w-6" />
        </div>

        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          Salve a Data
        </h2>

        <p className="font-body mt-6 max-w-xl text-lg text-white opacity-80">
          Adicione o evento ao seu calendário para não esquecer este dia tão
          especial.
        </p>

        {/* Calendar platform buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
          {calendarPlatforms.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleAddToCalendar(key)}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-wedding-blue px-6 py-3 font-body text-base font-semibold text-white shadow-lg transition-all hover:bg-wedding-gold sm:w-auto"
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ICS fallback button */}
        <button
          onClick={handleDownload}
          className="group mt-4 flex cursor-pointer items-center gap-2 rounded-full border-2 border-wedding-gold px-6 py-3 font-body text-base font-semibold text-wedding-gold transition-all hover:bg-wedding-gold hover:text-white sm:mt-6"
        >
          <LeafIcon className="h-4 w-4 transition-transform group-hover:rotate-12" />
          Outro calendário
          <LeafIcon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
        </button>

      </div>
    </section>
  );
}
