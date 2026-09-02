import { Link } from "react-router-dom";
import { useDocumentHead } from "../lib/head";
import { CASE_STUDIES } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function CaseStudies() {
  useDocumentHead({
    title: "Case Studies",
    description:
      "Long-form client stories: how founders used the Vivid Vision process to grow revenue and profit, align their teams, and get their time back.",
    path: "/case-studies",
  });

  return (
    <>
      <div className="container-tight py-16">
        <div className="max-w-3xl">
          <p className="eyebrow">Case studies</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">The full stories</h1>
          <p className="mt-6 text-lg text-muted">
            Each one follows the same shape: where the founder started, what process was run, and what
            actually changed.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {CASE_STUDIES.map((c) => (
            <Link
              key={c.slug}
              to={`/case-studies/${c.slug}`}
              className="card block"
            >
              <p className="eyebrow">{c.frameworkName}</p>
              <h2 className="mt-2 text-2xl hover:text-primary">{c.headline}</h2>
              <p className="mt-2 text-sm text-muted">
                {c.client}, {c.clientTitle} at {c.company}
                {c.location ? `, ${c.location}` : ""}
              </p>
              <p className="mt-3 text-text/80">{c.before}</p>
              <span className="mt-4 inline-block text-sm text-accent">Read the full story</span>
            </Link>
          ))}
        </div>
      </div>
      <CTABand />
    </>
  );
}
