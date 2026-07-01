/* Tent / camping icon */
export default function TentIcon({ className = "" }: { className?: string }) {
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
