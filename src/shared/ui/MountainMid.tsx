/* Mountain silhouette — mid layer (darker, more prominent) */
export default function MountainMid({ className = "" }: { className?: string }) {
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
