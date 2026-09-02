import { Link } from "react-router-dom";
import { useDocumentHead } from "../lib/head";
import { CONVERSION_URL, CONVERSION_LABEL } from "../lib/site";
import { FRAMEWORKS, SPEAKING } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function About() {
  useDocumentHead({
    title: "About Jennifer Hudye",
    description:
      "Jennifer Hudye is a vision and messaging expert who helps 7- and 8-figure founders build a Vivid Vision for their business and their life, then a plan they will actually follow.",
    path: "/about",
  });

  return (
    <>
      <article className="container-tight max-w-3xl py-16">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">The point of view</h1>

        <p className="mt-8 text-xl leading-relaxed text-text/90">
          Most planning either fixes your business or your personal life, but rarely both at once. That
          is exactly why it never sticks. When you fuse personal clarity and business strategy into one
          vision, every decision starts moving you toward the life <em>and</em> the business you
          actually want.
        </p>

        <p className="mt-6 text-text/80">
          That belief is the whole reason Vision Driven exists. Jennifer Hudye has watched hundreds of
          founders hit their revenue targets and still feel stuck, because the plan on the wall was
          about the company and said nothing about the life the company was supposed to fund.
        </p>

        <h2 className="mt-12 text-2xl">The short story</h2>
        <p className="mt-4 text-text/80">
          Jennifer grew up in an entrepreneurial family and started her first company at 13. By 19 she
          had sold two companies, one for six figures and one for seven. In her early twenties she
          built Conscious Copy &amp; Co. into a top messaging agency in the business and personal
          development world, writing for names like Tony Robbins, Joe Polish, and JJ Virgin.
        </p>
        <p className="mt-4 text-text/80">
          In 2016 she partnered with Cameron Herold, the author of <u>Vivid Vision</u>, to bring the
          Vivid Vision process to founders directly. Since then her team has guided more than 550
          companies through it. The goal she is building toward: helping 100,000 entrepreneurs
          communicate their vision by 2030.
        </p>

        <h2 className="mt-12 text-2xl">What she actually does</h2>
        <p className="mt-4 text-text/80">
          She helps 7- and 8-figure entrepreneurs and CEOs clarify a three-year Vivid Vision for their
          business and their life, written in the present tense as if it has already happened. Then she
          helps them turn it into a 90-day plan they will actually follow, and roll it out so the whole
          team can see the same future.
        </p>

        <h2 className="mt-12 text-2xl">The frameworks</h2>
        <ul className="mt-4 space-y-4">
          {FRAMEWORKS.map((f) => (
            <li key={f.slug}>
              <span className="font-semibold text-primary">{f.name}. </span>
              <span className="text-text/80">{f.definition}</span>
            </li>
          ))}
        </ul>
        <Link to="/frameworks" className="mt-6 inline-block text-sm text-accent hover:text-primary">
          Full breakdown of the frameworks
        </Link>

        <h2 className="mt-12 text-2xl">Where she has taught this</h2>
        <p className="mt-4 text-text/80">
          {SPEAKING.map((s) => s.event).join(", ")}.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href={CONVERSION_URL} className="btn-cta" target="_blank" rel="noopener">
            {CONVERSION_LABEL}
          </a>
          <Link to="/case-studies" className="btn-ghost">
            See client results
          </Link>
        </div>
      </article>
      <CTABand />
    </>
  );
}
