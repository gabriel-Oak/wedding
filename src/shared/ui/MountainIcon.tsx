/* Small mountain silhouette */
export default function MountainIcon({ className = "" }: { className?: string }) {
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
