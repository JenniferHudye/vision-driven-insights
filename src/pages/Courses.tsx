import { useDocumentHead } from "../lib/head";
import { COURSES } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function Courses() {
  useDocumentHead({
    title: "Programs and Ways to Work With Jennifer Hudye",
    description:
      "Ways to build your Vivid Vision with Jennifer Hudye and Vision Driven: Done-For-You, the Retreat, the Vision Driven Quest course, a VIP day, and Vision Amplifier.",
    path: "/courses",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">Programs</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Ways to build your Vivid Vision</h1>
        <p className="mt-6 text-lg text-muted">
          Same process, different levels of support. Pick the one that fits how you like to work.
        </p>

        <div className="mt-12 space-y-8">
          {COURSES.map((c) => (
            <section key={c.slug} className="card">
              <h2 className="text-xl text-primary">{c.name}</h2>
              <p className="mt-3 text-text/85">
                <span className="font-semibold text-text">Who it is for: </span>
                {c.for}
              </p>
              <p className="mt-2 text-text/85">
                <span className="font-semibold text-text">What it covers: </span>
                {c.covers}
              </p>
              {c.priceNote && <p className="mt-2 text-sm text-muted">{c.priceNote}</p>}
              <a
                href={c.url}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-block text-sm text-accent hover:text-primary"
              >
                Learn more
              </a>
            </section>
          ))}
        </div>
      </div>
      <CTABand />
    </>
  );
}
