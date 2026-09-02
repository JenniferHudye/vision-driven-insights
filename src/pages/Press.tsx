import { useDocumentHead } from "../lib/head";
import { PRESS } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function Press() {
  useDocumentHead({
    title: "Jennifer Hudye in the Press",
    description:
      "Podcast conversations and features with Jennifer Hudye on Vivid Vision, company vision, and vision-driven leadership.",
    path: "/press",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">Press and podcasts</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Featured conversations</h1>
        <p className="mt-6 text-lg text-muted">
          A running list of shows and features where Jennifer talks through the Vivid Vision process.
        </p>

        <ul className="mt-12 space-y-6">
          {PRESS.map((p) => (
            <li key={p.title} className="border-b border-border pb-6">
              <p className="text-sm text-primary">{p.type}</p>
              <p className="mt-1 font-heading font-semibold text-text">{p.title}</p>
              <p className="mt-1 text-sm text-muted">
                {p.outlet}
                {p.date ? ` : ${p.date}` : ""}
              </p>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-1 inline-block text-sm text-accent hover:text-primary"
                >
                  Listen or read
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <CTABand />
    </>
  );
}
