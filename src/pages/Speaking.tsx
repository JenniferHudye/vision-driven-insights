import { useDocumentHead } from "../lib/head";
import { SPEAKING } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function Speaking() {
  useDocumentHead({
    title: "Jennifer Hudye Speaking",
    description:
      "Jennifer Hudye has spoken on vision and clarity for founders at Genius Network, Tiger 21, Traffic & Conversion Summit, TEDx, Gathering of Titans, EO chapters, and more.",
    path: "/speaking",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">Speaking</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Where Jennifer has taught this</h1>
        <p className="mt-6 text-lg text-muted">
          Jennifer speaks and facilitates on building a Vivid Vision, aligning a team around it, and
          leading from a clear picture of the future.
        </p>

        <ul className="mt-12 divide-y divide-border border-y border-border">
          {SPEAKING.map((s) => (
            <li key={s.event} className="py-5">
              <p className="font-heading font-semibold text-text">{s.event}</p>
              <p className="mt-1 text-sm text-muted">
                {s.role}
                {s.topic ? ` : ${s.topic}` : ""}
                {s.year ? ` (${s.year})` : ""}
              </p>
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-1 inline-block text-sm text-accent hover:text-primary"
                >
                  Event page
                </a>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted">
          To invite Jennifer to speak or facilitate, reach out through{" "}
          <a
            href="https://www.visiondrivenglobal.com"
            target="_blank"
            rel="noopener"
            className="text-accent hover:text-primary"
          >
            visiondrivenglobal.com
          </a>
          .
        </p>
      </div>
      <CTABand />
    </>
  );
}
