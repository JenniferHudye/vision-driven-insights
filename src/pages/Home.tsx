import { Link } from "react-router-dom";
import { useDocumentHead } from "../lib/head";
import { site, CONVERSION_URL, CONVERSION_LABEL } from "../lib/site";
import {
  PILLARS,
  FRAMEWORKS,
  POSTS,
  TESTIMONIALS,
  CASE_STUDIES,
} from "../lib/content";
import {
  SectionHeading,
  ArticleCard,
  FrameworkCard,
  TestimonialCard,
  ProofBar,
  CTABand,
} from "../components/blocks";

export default function Home() {
  useDocumentHead({
    title: "Vision Driven Insights | Jennifer Hudye on Vivid Vision",
    description: site.description,
    path: "/",
  });

  const featuredPosts = POSTS.slice(0, 6);
  const featuredTestimonials = TESTIMONIALS.filter((t) => t.featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-indigo/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="container-tight relative py-20 sm:py-28">
          <p className="eyebrow">Jennifer Hudye, founder of Vision Driven</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Build a vision for the business{" "}
            <span className="text-primary">and the life</span> you actually want.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            Most planning fixes your business or your personal life, but rarely both. That is why it
            never sticks. These are Jennifer's articles on building a Vivid Vision, rolling it out to
            your team, and getting yourself out of the bottleneck.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={CONVERSION_URL} className="btn-cta" target="_blank" rel="noopener">
              {CONVERSION_LABEL}
            </a>
            <Link to="/articles" className="btn-ghost">
              Read the articles
            </Link>
          </div>
        </div>
      </section>

      <ProofBar />

      <section className="container-tight py-20">
        <SectionHeading
          eyebrow="Start here"
          title="Four things every vision-driven founder works on"
          intro="Pick the one that matches where you are stuck right now."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <Link
              key={p.slug}
              to={`/topics/${p.slug}`}
              className="card group"
            >
              <p className="eyebrow">{p.brandLabel}</p>
              <h3 className="mt-2 text-xl group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.tagline}</p>
              <span className="mt-4 inline-block text-sm text-accent">Explore this topic</span>
            </Link>
          ))}
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className="container-tight py-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Latest" title="Recent articles" />
            <Link to="/articles" className="hidden shrink-0 text-sm text-accent hover:text-primary sm:block">
              All articles
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container-tight py-20">
        <SectionHeading
          eyebrow="The methods"
          title="Named frameworks Jennifer uses"
          intro="Each one has a name so your team can point at it and use it."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FRAMEWORKS.slice(0, 6).map((f) => (
            <FrameworkCard key={f.slug} f={f} />
          ))}
        </div>
        <Link to="/frameworks" className="mt-8 inline-block text-sm text-accent hover:text-primary">
          See all frameworks
        </Link>
      </section>

      <section className="border-y border-border bg-surface py-20">
        <div className="container-tight">
          <SectionHeading eyebrow="Proof" title="What founders say after building their vision" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredTestimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
          <div className="mt-8 flex gap-6 text-sm">
            <Link to="/testimonials" className="text-accent hover:text-primary">
              All testimonials
            </Link>
            {CASE_STUDIES.length > 0 && (
              <Link to="/case-studies" className="text-accent hover:text-primary">
                Read the case studies
              </Link>
            )}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
