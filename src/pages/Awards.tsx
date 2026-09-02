import { useDocumentHead } from "../lib/head";
import { AWARDS } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function Awards() {
  useDocumentHead({
    title: "Recognition and Credentials",
    description:
      "Jennifer Hudye's credentials and recognized work in the vision and messaging space.",
    path: "/awards",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">Recognition</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Credentials and recognition</h1>

        {AWARDS.awards.length > 0 && (
          <ul className="mt-10 space-y-4">
            {AWARDS.awards.map((a) => (
              <li key={a.name} className="card">
                <p className="font-heading font-semibold text-primary">{a.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {a.issuer}
                  {a.year ? ` : ${a.year}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-10 text-2xl">What she is known for</h2>
        <ul className="mt-4 space-y-3">
          {AWARDS.credentials.map((c) => (
            <li key={c} className="flex gap-3 text-text/85">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
      <CTABand />
    </>
  );
}
