import { useState } from "react";
import { useDocumentHead } from "../lib/head";
import { POSTS, PILLARS } from "../lib/content";
import { ArticleCard, CTABand, SectionHeading } from "../components/blocks";

export default function Articles() {
  useDocumentHead({
    title: "All Articles",
    description:
      "Every article from Jennifer Hudye on building a Vivid Vision, turning it into a plan, becoming a vision-driven entrepreneur, and integrating business and life.",
    path: "/articles",
  });

  const [filter, setFilter] = useState<string>("all");
  const shown = filter === "all" ? POSTS : POSTS.filter((p) => p.pillarSlug === filter);

  return (
    <>
      <div className="container-tight py-16">
        <SectionHeading
          eyebrow="Library"
          title="All articles"
          intro="Filter by topic, or read straight through."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              filter === "all" ? "border-primary bg-primary text-brand-black" : "border-border text-text/75"
            }`}
          >
            All ({POSTS.length})
          </button>
          {PILLARS.map((p) => {
            const count = POSTS.filter((x) => x.pillarSlug === p.slug).length;
            return (
              <button
                key={p.slug}
                onClick={() => setFilter(p.slug)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  filter === p.slug
                    ? "border-primary bg-primary text-brand-black"
                    : "border-border text-text/75"
                }`}
              >
                {p.title} ({count})
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="mt-16 text-muted">Articles are on the way. Check back shortly.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
      <CTABand />
    </>
  );
}
