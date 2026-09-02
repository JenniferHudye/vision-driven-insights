import { useDocumentHead } from "../lib/head";
import { site } from "../lib/site";

export default function Privacy() {
  useDocumentHead({
    title: "Privacy Policy",
    description: "Privacy policy for Vision Driven Insights.",
    path: "/privacy",
  });

  return (
    <article className="container-tight max-w-3xl py-16">
      <h1 className="text-4xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated September 1, 2026.</p>

      <div className="prose-article mt-10">
        <p>
          This Privacy Policy explains how {site.copyrightHolder} ("Vision Driven," "we," "us")
          handles information when you visit {site.domain} ("the Site").
        </p>

        <h2>Information we collect</h2>
        <p>
          We collect information automatically through analytics tools, and information you give us
          directly if you fill out a form or opt in to an email list.
        </p>
        <ul>
          <li>
            <strong>Automatic data:</strong> pages visited, time on page, general location (city or
            region level), device and browser type, and referring site. Collected through Google
            Analytics 4 and Microsoft Clarity.
          </li>
          <li>
            <strong>Data you provide:</strong> your name and email address if you subscribe to updates
            or fill out a contact form.
          </li>
        </ul>

        <h2>Cookies and tracking</h2>
        <p>
          The Site uses cookies and similar technologies through Google Analytics 4 and Microsoft
          Clarity to understand how visitors use the Site. Google Analytics 4 records anonymized usage
          statistics. Microsoft Clarity records session behavior such as scrolling and clicks to help
          us see what is working and what is confusing on the Site; it does not collect passwords or
          payment details. You can disable cookies in your browser settings, though some Site features
          may not work as well as a result.
        </p>

        <h2>How we use information</h2>
        <p>
          We use the information we collect to operate and improve the Site, to understand which
          articles are useful, and, if you opt in, to send you updates by email. We do not sell your
          personal information.
        </p>

        <h2>Sharing</h2>
        <p>
          We share information with service providers who help us run the Site (hosting, analytics,
          email delivery) under agreements that limit their use of your data to providing that
          service. We do not share your information with third parties for their own marketing
          purposes.
        </p>

        <h2>Your choices</h2>
        <p>
          You can opt out of marketing emails at any time using the unsubscribe link in any email. You
          can control cookies through your browser settings. To request access to or deletion of your
          personal information, contact us at{" "}
          <a href={`mailto:${site.dmcaEmail}`}>{site.dmcaEmail}</a>.
        </p>

        <h2>Children's privacy</h2>
        <p>The Site is not directed at children under 13, and we do not knowingly collect information from children under 13.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. The date at the top of this page reflects the most recent revision.</p>

        <h2>Contact</h2>
        <p>
          Questions about this policy: <a href={`mailto:${site.dmcaEmail}`}>{site.dmcaEmail}</a>.
        </p>
      </div>
    </article>
  );
}
