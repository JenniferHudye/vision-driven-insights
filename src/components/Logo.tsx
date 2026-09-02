import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="Vision Driven Insights, home"
    >
      <svg
        viewBox="0 0 64 48"
        className="h-8 w-auto shrink-0"
        role="img"
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <linearGradient id="vd-gem" x1="0" y1="0" x2="64" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E4C878" />
            <stop offset="0.5" stopColor="#D0AA44" />
            <stop offset="1" stopColor="#A9832F" />
          </linearGradient>
        </defs>
        <path
          d="M4 16 L14 4 H50 L60 16 L32 46 Z"
          stroke="url(#vd-gem)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M4 16 H60 M14 4 L22 16 L32 46 M50 4 L42 16 L32 46 M22 16 L32 4 L42 16 M32 16 V46" stroke="url(#vd-gem)" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
      <span className="font-heading text-base font-semibold uppercase tracking-[0.22em] text-text">
        Vision Driven
        <span className="block text-[0.62rem] font-medium tracking-[0.34em] text-primary">
          Insights
        </span>
      </span>
    </Link>
  );
}
