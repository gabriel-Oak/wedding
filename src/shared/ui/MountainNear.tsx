/* Mountain silhouette — near layer (darkest, foreground) */
export default function MountainNear({ className = "" }: { className?: string }) {
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
