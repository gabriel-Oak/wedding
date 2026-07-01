/* Small stars for night sky */
export default function Stars({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 800"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <circle cx="150" cy="80" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="320" cy="120" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="480" cy="60" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="650" cy="150" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="800" cy="90" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="950" cy="50" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1100" cy="130" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="1250" cy="70" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1350" cy="110" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="80" cy="200" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="400" cy="180" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="700" cy="220" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1000" cy="190" r="1.5" fill="white" className="animate-twinkle" />
      <circle cx="1200" cy="210" r="1" fill="white" className="animate-twinkle-delay" />
      <circle cx="1380" cy="160" r="1.5" fill="white" className="animate-twinkle" />
    </svg>
  );
}
