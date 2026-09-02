import { Link } from "react-router-dom";
import { useDocumentHead } from "../lib/head";

export default function NotFound() {
  useDocumentHead({
    title: "Page Not Found",
    description: "This page could not be found.",
    path: "/404",
  });

  return (
    <div className="container-tight flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl">We couldn't find that page</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you're looking for may have moved. Try the articles, or head back home.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/" className="btn-cta">Home</Link>
        <Link to="/articles" className="btn-ghost">All articles</Link>
      </div>
    </div>
  );
}
