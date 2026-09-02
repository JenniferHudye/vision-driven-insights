import { Link } from "react-router-dom";
import { CONVERSION_URL, CONVERSION_LABEL, site } from "../lib/site";
import type { BlogPost, Framework, Testimonial, FaqEntry } from "../lib/content";
import { PILLARS } from "../lib/content";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
    </div>
  );
}

export function CTABand({
  heading = "Ready to build your Vivid Vision?",
  body = "Book a Vivid Vision Consult. If it is a fit, you will leave with a clear next step. If it is not, you will still leave with a clearer view of what you are building.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="container-tight my-20">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-surface2 to-surface p-8 sm:p-12">
        <p className="eyebrow">Work with Jennifer</p>
        <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl">{heading}</h2>
        <p className="mt-4 max-w-2xl text-muted">{body}</p>
        <a href={CONVERSION_URL} className="btn-cta mt-7" target="_blank" rel="noopener">
          {CONVERSION_LABEL}
        </a>
      </div>
    </section>
  );
}

export function ProofBar() {
  return (
    <div className="border-y border-border bg-surface">
      <div className="container-tight grid gap-6 py-8 text-center sm:grid-cols-3">
        <div>
          <p className="font-heading text-2xl font-semibold text-primary">550+</p>
          <p className="mt-1 text-sm text-muted">companies guided through the Vivid Vision process</p>
        </div>
        <div>
          <p className="font-heading text-2xl font-semibold text-primary">Since 2016</p>
          <p className="mt-1 text-sm text-muted">partnered with Cameron Herold on Vivid Vision</p>
        </div>
        <div>
          <p className="font-heading text-2xl font-semibold text-primary">100,000</p>
          <p className="mt-1 text-sm text-muted">entrepreneurs the mission aims to reach by 2030</p>
        </div>
      </div>
    </div>
  );
}

export function ArticleCard({ post }: { post: BlogPost }) {
  const pillar = PILLARS.find((p) => p.slug === post.pillarSlug);
  return (
    <article className="card flex flex-col">
      <img
        src={post.featuredImage.src}
        alt={post.featuredImage.alt}
        width={1200}
        height={675}
        loading="lazy"
        className="mb-4 aspect-[16/9] w-full rounded-md border border-border object-cover"
      />
      {pillar && <p className="eyebrow">{pillar.brandLabel}</p>}
      <h3 className="mt-2 text-lg leading-snug">
        <Link to={`/articles/${post.slug}`} className="hover:text-primary">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted">{post.description}</p>
      <p className="mt-4 text-xs uppercase tracking-wide text-muted">
        {post.readingMinutes} min read
      </p>
    </article>
  );
}

export function FrameworkCard({ f }: { f: Framework }) {
  return (
    <div className="card">
      <h3 className="text-lg text-primary">{f.name}</h3>
      <p className="mt-2 text-sm text-text/85">{f.definition}</p>
      <p className="mt-3 text-sm text-muted">
        <span className="font-semibold text-text/80">Why it works: </span>
        {f.principle}
      </p>
    </div>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="card">
      <blockquote className="text-text/90">
        {t.quote ? `"${t.quote}"` : t.factNote}
      </blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-semibold text-text">{t.name}</span>
        <span className="block text-muted">
          {[t.title, t.company].filter(Boolean).join(", ")}
          {t.location ? ` (${t.location})` : ""}
        </span>
      </figcaption>
      {t.outcome && t.type !== "endorsement" && (
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
          <span className="font-semibold text-primary">Result: </span>
          {t.outcome}
        </p>
      )}
    </figure>
  );
}

export function FAQBlock({ items, heading = "Frequently asked questions" }: { items: FaqEntry[]; heading?: string }) {
  return (
    <section className="my-14">
      <h2 className="text-2xl sm:text-3xl">{heading}</h2>
      <dl className="mt-6 divide-y divide-border border-y border-border">
        {items.map((it) => (
          <div key={it.q} className="py-5">
            <dt className="font-heading text-base font-semibold text-text">{it.q}</dt>
            <dd className="mt-2 text-text/80">{it.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function KeyTakeaway({ points }: { points: string[] }) {
  return (
    <aside className="my-8 rounded-lg border border-primary/30 bg-surface2 p-6">
      <p className="eyebrow">The short version</p>
      <ul className="mt-3 space-y-2 text-text/90">
        {points.map((p) => (
          <li key={p} className="flex gap-3">
            <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function AuthorBox() {
  return (
    <aside className="my-12 flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center">
      <img
        src="/assets/jennifer-hudye.png"
        alt="Jennifer Hudye, founder of Vision Driven"
        width={96}
        height={96}
        loading="lazy"
        className="h-20 w-20 rounded-full border border-primary/40 object-cover"
      />
      <div>
        <p className="font-heading font-semibold text-text">Jennifer Hudye</p>
        <p className="mt-1 text-sm text-muted">
          Founder of Vision Driven. She helps 7- and 8-figure founders build a Vivid Vision for their
          business and life, then a plan they will actually follow. Her rule: {site.tagline.toLowerCase()}
        </p>
        <Link to="/about" className="mt-2 inline-block text-sm text-accent hover:text-primary">
          More about Jennifer
        </Link>
      </div>
    </aside>
  );
}

export function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {c.to ? (
              <Link to={c.to} className="hover:text-primary">
                {c.label}
              </Link>
            ) : (
              <span className="text-text/70">{c.label}</span>
            )}
            {i < trail.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
