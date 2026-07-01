/* Shared leaf icon — elongated leaf shape with visible veins */
export default function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Leaf body — pointed at both ends, elongated */}
      <path
        d="M12 1C12 1 18 6 19 13C20 19 16 23 12 23C8 23 4 19 5 13C6 6 12 1 12 1Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Stem */}
      <path
        d="M12 23V27"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Central vein */}
      <path
        d="M12 4V23"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.75"
      />
      {/* Left-side veins */}
      <path d="M12 8L8 10" stroke="currentColor" strokeWidth="0.8" opacity="0.6" fill="none" />
      <path d="M12 12L8 14" stroke="currentColor" strokeWidth="0.8" opacity="0.6" fill="none" />
      <path d="M12 16L8 18" stroke="currentColor" strokeWidth="0.8" opacity="0.6" fill="none" />
      {/* Right-side veins */}
      <path d="M12 8L16 10" stroke="currentColor" strokeWidth="0.8" opacity="0.6" fill="none" />
      <path d="M12 12L16 14" stroke="currentColor" strokeWidth="0.8" opacity="0.6" fill="none" />
      <path d="M12 16L16 18" stroke="currentColor" strokeWidth="0.8" opacity="0.6" fill="none" />
    </svg>
  );
}
