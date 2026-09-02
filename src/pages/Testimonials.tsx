import { Link } from "react-router-dom";
import { useDocumentHead } from "../lib/head";
import { TESTIMONIALS } from "../lib/content";
import { TestimonialCard, CTABand } from "../components/blocks";

export default function Testimonials() {
  useDocumentHead({
    title: "Client Results and Testimonials",
    description:
      "Founders on what changed after building their Vivid Vision with Jennifer Hudye: revenue and profit growth, a team that runs without them, and time back with family.",
    path: "/testimonials",
  });

  const stories = TESTIMONIALS.filter((t) => t.type !== "endorsement");
  const endorsements = TESTIMONIALS.filter((t) => t.type === "endorsement");

  return (
    <>
      <div className="container-tight py-16">
        <div className="max-w-3xl">
          <p className="eyebrow">Testimonials</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">What founders say</h1>
          <p className="mt-6 text-lg text-muted">
            Real names, real situations, real outcomes. Results vary, and anyone who guarantees them is
            not being straight with you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stories.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>

        {endorsements.length > 0 && (
          <>
            <h2 className="mt-16 text-2xl">Endorsements</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {endorsements.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
          </>
        )}

        <p className="mt-10 text-sm text-muted">
          Want the full story behind the numbers?{" "}
          <Link to="/case-studies" className="text-accent hover:text-primary">
            Read the case studies
          </Link>
          .
        </p>
      </div>
      <CTABand />
    </>
  );
}
