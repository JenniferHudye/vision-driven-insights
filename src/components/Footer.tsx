import { Link } from "react-router-dom";
import { site, CONVERSION_URL, CONVERSION_LABEL } from "../lib/site";
import { PILLARS } from "../lib/content";
import Logo from "./Logo";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-tight grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{site.tagline}</p>
          <a href={CONVERSION_URL} className="btn-cta mt-5 !px-4 !py-2 text-xs" target="_blank" rel="noopener">
            {CONVERSION_LABEL}
          </a>
        </div>

        <div>
          <p className="eyebrow">Topics</p>
          <ul className="mt-4 space-y-2 text-sm">
            {PILLARS.map((p) => (
              <li key={p.slug}>
                <Link to={`/topics/${p.slug}`} className="text-text/75 hover:text-primary">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Jennifer Hudye</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="text-text/75 hover:text-primary">About</Link></li>
            <li><Link to="/frameworks" className="text-text/75 hover:text-primary">Frameworks</Link></li>
            <li><Link to="/case-studies" className="text-text/75 hover:text-primary">Case Studies</Link></li>
            <li><Link to="/testimonials" className="text-text/75 hover:text-primary">Testimonials</Link></li>
            <li><Link to="/speaking" className="text-text/75 hover:text-primary">Speaking</Link></li>
            <li><Link to="/press" className="text-text/75 hover:text-primary">Press</Link></li>
            <li><Link to="/courses" className="text-text/75 hover:text-primary">Programs</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">More</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={site.mainWebsite} className="text-text/75 hover:text-primary" target="_blank" rel="noopener">Main site: visiondrivenglobal.com</a></li>
            <li><a href="https://www.linkedin.com/in/jenniferhudye/" className="text-text/75 hover:text-primary" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><Link to="/faq" className="text-text/75 hover:text-primary">FAQ</Link></li>
            <li><Link to="/privacy" className="text-text/75 hover:text-primary">Privacy</Link></li>
            <li><Link to="/terms" className="text-text/75 hover:text-primary">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-tight flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {year} {site.copyrightHolder}. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            The content on this site is protected by United States copyright law and the Digital
            Millennium Copyright Act. Unauthorized reproduction, scraping, or redistribution is
            prohibited. See <Link to="/terms" className="underline hover:text-primary">Terms</Link> and{" "}
            <a href="/license.txt" className="underline hover:text-primary">license.txt</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
