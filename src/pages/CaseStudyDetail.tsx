import { useParams, Link, Navigate } from "react-router-dom";
import { useDocumentHead } from "../lib/head";
import { CASE_STUDIES } from "../lib/content";
import { Breadcrumbs, CTABand } from "../components/blocks";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const study = CASE_STUDIES.find((c) => c.slug === slug);

  useDocumentHead({
    title: study ? `Case Study: ${study.client}, ${study.company}` : "Case Study",
    description: study ? study.headline : "Case study",
    path: `/case-studies/${slug}`,
  });

  if (!study) return <Navigate to="/case-studies" replace />;

  return (
    <>
      <article className="container-tight max-w-3xl py-16">
        <Breadcrumbs
          trail={[
            { label: "Home", to: "/" },
            { label: "Case Studies", to: "/case-studies" },
            { label: study.client },
          ]}
        />
        <p className="eyebrow mt-6">{study.frameworkName}</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">{study.headline}</h1>
        <p className="mt-4 text-muted">
          {study.client}, {study.clientTitle} at {study.company}
          {study.location ? `, ${study.location}` : ""}
        </p>

        <h2 className="mt-12 text-2xl">Where things started</h2>
        <p className="mt-3 text-text/85">{study.before}</p>

        <h2 className="mt-10 text-2xl">What was done</h2>
        <p className="mt-3 text-text/85">{study.what_was_done}</p>

        <h2 className="mt-10 text-2xl">What changed</h2>
        <ul className="mt-3 space-y-2">
          {study.results.map((r) => (
            <li key={r} className="flex gap-3 text-text/85">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <blockquote className="mt-10 border-l-2 border-primary/60 pl-5 text-xl italic text-text">
          "{study.quote}"
          <span className="mt-2 block text-sm not-italic text-muted">{study.client}</span>
        </blockquote>

        <Link to="/frameworks" className="mt-10 inline-block text-sm text-accent hover:text-primary">
          Learn about {study.frameworkName}
        </Link>
      </article>
      <CTABand />
    </>
  );
}
