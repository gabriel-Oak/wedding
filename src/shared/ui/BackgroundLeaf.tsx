/* Subtle background leaf motif */
export default function BackgroundLeaf({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 3C40 3 60 15 62 40C64 60 50 73 40 73C30 73 16 60 18 40C20 15 40 3 40 3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d="M40 10V73"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}
