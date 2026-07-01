/* Pine tree silhouette */
export default function PineTree({
  className = "",
  height = 120,
  width = 60,
}: {
  className?: string;
  height?: number;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 60 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      {/* Trunk */}
      <rect x="26" y="90" width="8" height="30" fill="currentColor" opacity="0.5" />
      {/* Tree layers */}
      <path
        d="M30 5L10 45L20 40L5 70L18 65L5 100L55 100L42 65L55 70L40 40L50 45L30 5Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Snow on top */}
      <path
        d="M30 5L25 18L30 15L35 18L30 5Z"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
}
