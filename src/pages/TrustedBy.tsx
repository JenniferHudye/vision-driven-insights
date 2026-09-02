import { useDocumentHead } from "../lib/head";
import { TRUSTED_BY } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function TrustedBy() {
  useDocumentHead({
    title: "Trusted By",
    description:
      "Founders and companies Jennifer Hudye has worked with through Vision Driven and Conscious Copy & Co.",
    path: "/trusted-by",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">Trusted by</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Who Jennifer has worked with</h1>
        <p className="mt-6 text-lg text-muted">{TRUSTED_BY.intro}</p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {TRUSTED_BY.names.map((n) => (
            <li key={n} className="rounded-md border border-border bg-surface px-4 py-3 text-text/85">
              {n}
            </li>
          ))}
        </ul>

        <p className="mt-8 font-heading text-lg text-primary">{TRUSTED_BY.stat}</p>
      </div>
      <CTABand />
    </>
  );
}
