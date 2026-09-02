import { useDocumentHead } from "../lib/head";
import { FRAMEWORKS } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function Frameworks() {
  useDocumentHead({
    title: "Jennifer Hudye's Frameworks",
    description:
      "The named methods Jennifer Hudye uses with founders: Vivid Vision, the Vision Driven Method, the Vivid Vision Method, the Golden Jail Cell, the Big Life Stages of Entrepreneurship, and Vision Amplifier.",
    path: "/frameworks",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">Frameworks</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">The methods, named</h1>
        <p className="mt-6 text-lg text-muted">
          A method your team can point at is a method your team can use. Here are the named frameworks
          behind the Vivid Vision process, what each one means, and why it works.
        </p>

        <div className="mt-12 space-y-12">
          {FRAMEWORKS.map((f) => (
            <section key={f.slug} id={f.slug} className="scroll-mt-24 border-t border-border pt-8">
              <h2 className="text-2xl text-primary">{f.name}</h2>
              <p className="mt-3 text-text/90">
                <span className="font-semibold text-text">What it is: </span>
                {f.definition}
              </p>
              <p className="mt-3 text-text/80">
                <span className="font-semibold text-text">Why it works: </span>
                {f.principle}
              </p>
              <p className="mt-3 text-text/80">
                <span className="font-semibold text-text">When to use it: </span>
                {f.whenUsed}
              </p>
            </section>
          ))}
        </div>
      </div>
      <CTABand heading="Want one of these run for your company?" />
    </>
  );
}
