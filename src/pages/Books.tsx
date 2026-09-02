import { useDocumentHead } from "../lib/head";
import { BOOKS } from "../lib/content";
import { CTABand } from "../components/blocks";

export default function Books() {
  useDocumentHead({
    title: "Books and Reading",
    description:
      "Jennifer Hudye's work is built on the Vivid Vision process she runs with Cameron Herold, author of Vivid Vision.",
    path: "/books",
  });

  return (
    <>
      <div className="container-tight max-w-3xl py-16">
        <p className="eyebrow">Books and reading</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">What to read</h1>

        {BOOKS.length > 0 ? (
          <ul className="mt-10 space-y-8">
            {BOOKS.map((b) => (
              <li key={b.title} className="card">
                <p className="font-heading text-lg text-primary"><u>{b.title}</u></p>
                <p className="mt-1 text-sm text-muted">{b.year}</p>
                {b.url && (
                  <a href={b.url} target="_blank" rel="noopener" className="mt-2 inline-block text-sm text-accent hover:text-primary">
                    Where to buy
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 space-y-4 text-text/80">
            <p>
              Jennifer has not published her own book yet. Her work builds directly on{" "}
              <u>Vivid Vision</u> by Cameron Herold, her partner on the Vivid Vision process since
              2016.
            </p>
            <p>
              If you want the process itself, start with the{" "}
              <a href="/frameworks" className="text-accent hover:text-primary">
                Frameworks page
              </a>{" "}
              or the{" "}
              <a href="/articles" className="text-accent hover:text-primary">
                articles
              </a>
              .
            </p>
          </div>
        )}
      </div>
      <CTABand />
    </>
  );
}
