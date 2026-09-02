import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { CONVERSION_URL, CONVERSION_LABEL } from "../lib/site";
import { PILLARS } from "../lib/content";

const authorityLinks = [
  { to: "/about", label: "About" },
  { to: "/frameworks", label: "Frameworks" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/speaking", label: "Speaking" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/90 backdrop-blur">
      <div className="container-tight flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <div className="group relative">
            <button className="font-heading text-sm font-medium text-text/80 hover:text-primary">
              Topics
            </button>
            <div className="invisible absolute left-0 top-full w-64 rounded-lg border border-border bg-surface p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
              {PILLARS.map((p) => (
                <Link
                  key={p.slug}
                  to={`/topics/${p.slug}`}
                  className="block rounded-md px-3 py-2 text-sm text-text/80 hover:bg-surface2 hover:text-primary"
                >
                  {p.title}
                </Link>
              ))}
              <Link
                to="/articles"
                className="mt-1 block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-surface2"
              >
                All articles
              </Link>
            </div>
          </div>
          {authorityLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-heading text-sm font-medium ${
                  isActive ? "text-primary" : "text-text/80 hover:text-primary"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a href={CONVERSION_URL} className="btn-cta !px-4 !py-2 text-xs" target="_blank" rel="noopener">
            {CONVERSION_LABEL}
          </a>
        </nav>

        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="container-tight flex flex-col gap-1 py-4" aria-label="Mobile">
            <span className="eyebrow mt-2">Topics</span>
            {PILLARS.map((p) => (
              <Link
                key={p.slug}
                to={`/topics/${p.slug}`}
                className="rounded-md px-2 py-2 text-sm text-text/80"
                onClick={() => setOpen(false)}
              >
                {p.title}
              </Link>
            ))}
            <Link to="/articles" className="rounded-md px-2 py-2 text-sm text-primary" onClick={() => setOpen(false)}>
              All articles
            </Link>
            <span className="eyebrow mt-3">More</span>
            {authorityLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-2 py-2 text-sm text-text/80"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a href={CONVERSION_URL} className="btn-cta mt-3" target="_blank" rel="noopener">
              {CONVERSION_LABEL}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
