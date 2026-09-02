import { useDocumentHead } from "../lib/head";
import { site } from "../lib/site";

export default function Terms() {
  useDocumentHead({
    title: "Terms of Use",
    description: "Terms of use for Vision Driven Insights.",
    path: "/terms",
  });

  return (
    <article className="container-tight max-w-3xl py-16">
      <h1 className="text-4xl">Terms of Use</h1>
      <p className="mt-4 text-sm text-muted">Last updated September 1, 2026.</p>

      <div className="prose-article mt-10">
        <p>
          These Terms of Use govern your access to and use of {site.domain} ("the Site"), operated by{" "}
          {site.copyrightHolder} ("Vision Driven," "we," "us"). By using the Site, you agree to these
          terms.
        </p>

        <h2>The content on this Site</h2>
        <p>
          All articles, frameworks, graphics, and other content on the Site are the property of{" "}
          {site.copyrightHolder} unless otherwise credited, and are protected by United States
          copyright law and international treaties. Named frameworks referenced on this Site,
          including Vivid Vision, the Vision Driven Method, and the Vivid Vision Method, are the
          intellectual property of Vision Driven.
        </p>

        <h2>Permitted use</h2>
        <p>
          You may read, share links to, and quote brief excerpts of the Site's content for
          non-commercial purposes, with clear attribution and a link back to the original page.
        </p>

        <h2>Prohibited use</h2>
        <ul>
          <li>Reproducing, republishing, or redistributing substantial portions of the Site's content without written permission.</li>
          <li>Scraping, harvesting, or automated bulk-downloading of the Site's content, except as expressly permitted for AI and search crawlers under <a href="/robots.txt">robots.txt</a>.</li>
          <li>Using the Site's content to train a commercial product without a license.</li>
          <li>Impersonating Vision Driven or Jennifer Hudye, or misrepresenting your affiliation with either.</li>
        </ul>

        <h2>No guarantee of results</h2>
        <p>
          Case studies and testimonials on this Site describe real client experiences and outcomes.
          Individual results vary, and nothing on this Site is a guarantee of any specific business or
          financial outcome.
        </p>

        <h2>DMCA notice and takedown</h2>
        <p>
          If you believe content on this Site infringes your copyright, send a notice to our
          designated DMCA agent at <a href={`mailto:${site.dmcaEmail}`}>{site.dmcaEmail}</a>, including:
          (1) a description of the copyrighted work, (2) the URL of the allegedly infringing material,
          (3) your contact information, (4) a statement of good-faith belief that the use is
          unauthorized, and (5) a statement, under penalty of perjury, that the notice is accurate and
          you are authorized to act on the copyright owner's behalf. We will respond in accordance with
          17 U.S.C. Section 512.
        </p>

        <h2>Disclaimer and limitation of liability</h2>
        <p>
          The Site and its content are provided "as is" without warranties of any kind. To the fullest
          extent permitted by law, {site.copyrightHolder} is not liable for any indirect, incidental,
          or consequential damages arising from your use of the Site.
        </p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of the {site.jurisdiction}, without regard to conflict-of-law principles.</p>

        <h2>Changes</h2>
        <p>We may update these terms from time to time. Continued use of the Site after a change means you accept the updated terms.</p>

        <h2>Contact</h2>
        <p>
          <a href={`mailto:${site.dmcaEmail}`}>{site.dmcaEmail}</a>
        </p>
      </div>
    </article>
  );
}
