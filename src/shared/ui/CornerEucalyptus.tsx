/* Eucalyptus branch for corners */
export default function CornerEucalyptus({ className = "" }: { className?: string }) {
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
