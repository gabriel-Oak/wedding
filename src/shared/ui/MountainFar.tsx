/* Mountain silhouette — far layer (lighter, smaller) */
export default function MountainFar({ className = "" }: { className?: string }) {
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
