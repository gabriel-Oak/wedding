/* Eucalyptus branch decoration */
export default function EucalyptusBranch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main stem */}
      <path
        d="M0 20C30 15 60 10 100 15C140 20 170 25 200 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Leaves */}
      <ellipse cx="20" cy="14" rx="8" ry="4" transform="rotate(-15 20 14)" fill="currentColor" opacity="0.2" />
      <ellipse cx="45" cy="12" rx="9" ry="4" transform="rotate(-10 45 12)" fill="currentColor" opacity="0.15" />
      <ellipse cx="70" cy="13" rx="8" ry="3.5" transform="rotate(-8 70 13)" fill="currentColor" opacity="0.2" />
      <ellipse cx="100" cy="15" rx="9" ry="4" transform="rotate(5 100 15)" fill="currentColor" opacity="0.15" />
      <ellipse cx="130" cy="18" rx="8" ry="3.5" transform="rotate(10 130 18)" fill="currentColor" opacity="0.2" />
      <ellipse cx="160" cy="20" rx="9" ry="4" transform="rotate(15 160 20)" fill="currentColor" opacity="0.15" />
      <ellipse cx="185" cy="21" rx="7" ry="3" transform="rotate(20 185 21)" fill="currentColor" opacity="0.2" />
    </svg>
  );
}
