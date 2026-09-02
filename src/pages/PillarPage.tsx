import { useParams, Navigate, Link } from "react-router-dom";
import { useDocumentHead } from "../lib/head";
import { getPillar, postsByPillar, PILLARS } from "../lib/content";
import { ArticleCard, CTABand, Breadcrumbs } from "../components/blocks";

export default function PillarPage() {
  const { slug } = useParams();
  const pillar = slug ? getPillar(slug) : undefined;

  useDocumentHead({
    title: pillar ? pillar.title : "Topic",
    description: pillar ? pillar.description : "Topic",
    path: `/topics/${slug}`,
  });

  if (!pillar) return <Navigate to="/articles" replace />;

  const posts = postsByPillar(pillar.slug);
  const cornerstone = posts.find((p) => p.isCornerstone);
  const rest = posts.filter((p) => !p.isCornerstone);

  return (
    <>
      <div className="container-tight py-16">
        <Breadcrumbs
          trail={[
            { label: "Home", to: "/" },
            { label: "Topics", to: "/articles" },
            { label: pillar.title },
          ]}
        />
        <p className="eyebrow mt-6">{pillar.brandLabel}</p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl">{pillar.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">{pillar.description}</p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted">
          {pillar.subtopics.map((s) => (
            <span key={s} className="rounded-full border border-border px-3 py-1">
              {s}
            </span>
          ))}
        </div>

        {cornerstone && (
          <Link
            to={`/articles/${cornerstone.slug}`}
            className="mt-12 block rounded-xl border border-primary/40 bg-surface2 p-6 sm:p-8"
          >
            <p className="eyebrow">Start with the guide</p>
            <h2 className="mt-2 text-2xl hover:text-primary">{cornerstone.title}</h2>
            <p className="mt-2 text-muted">{cornerstone.description}</p>
            <span className="mt-4 inline-block text-sm text-accent">
              Read the full guide ({cornerstone.readingMinutes} min)
            </span>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="mt-12 text-muted">Articles for this topic are on the way.</p>
        )}

        <div className="mt-16 border-t border-border pt-8">
          <p className="eyebrow">Other topics</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {PILLARS.filter((p) => p.slug !== pillar.slug).map((p) => (
              <Link
                key={p.slug}
                to={`/topics/${p.slug}`}
                className="text-sm text-accent hover:text-primary"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <CTABand />
    </>
  );
}
