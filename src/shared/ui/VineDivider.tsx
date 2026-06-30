/* Decorative vine divider SVG */
export default function VineDivider({ className = "" }: { className?: string }) {
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
