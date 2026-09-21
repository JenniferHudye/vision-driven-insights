import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="Vision Driven Insights, home"
    >
      <img
        src="/assets/vision-driven-logo-transparent.png"
        alt="Vision Driven"
        width={500}
        height={149}
        className="h-9 w-auto shrink-0 sm:h-10"
      />
    </Link>
  );
}
