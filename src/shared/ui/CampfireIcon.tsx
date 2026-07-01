/* Campfire icon */
export default function CampfireIcon({ className = "" }: { className?: string }) {
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
