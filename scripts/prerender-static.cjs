#!/usr/bin/env node
// Injects real, crawlable body HTML for the homepage and EVERY static route
// (about, frameworks, books, courses, speaking, press, testimonials,
// case studies + each case study detail, awards, trusted-by, faq, articles
// index, each pillar topic page, privacy, terms). Sourced from the same
// data/*.json the React pages render, so the static HTML and the SPA never
// disagree. Hard requirement 1a: the homepage is the single most important
// URL, and privacy/terms are not exceptions.
const fs = require("fs");
const path = require("path");
const {
  ROOT,
  getSite,
  getPosts,
  getPillars,
  getFrameworks,
  getTestimonials,
  getCaseStudies,
  getSpeaking,
  getPress,
  getBooks,
  getCourses,
  getAwards,
  getTrustedBy,
  getFaq,
} = require("./lib/site-data.cjs");
const {
  stripPageHead,
  buildHeadTags,
  injectIntoHead,
  injectIntoRoot,
  writeRouteFile,
} = require("./lib/prerender-helpers.cjs");
const {
  ogImageUrl,
  breadcrumbSchema,
  faqPageSchema,
  courseSchema,
  eventSchema,
  bookSchema,
  reviewSchema,
  definedTermSchema,
  caseStudyArticleSchema,
} = require("./lib/schema.cjs");

const DIST = path.join(ROOT, "dist");

function page(html, canonicalPath, { title, description, extraJsonLd = [] }, shell) {
  const canonical = `${getSite().url}${canonicalPath}`;
  const headTags = buildHeadTags({
    title,
    description,
    canonical,
    ogImage: ogImageUrl(getSite()),
    extraJsonLd,
  });
  let out = stripPageHead(shell);
  out = injectIntoHead(out, headTags);
  out = injectIntoRoot(out, html);
  writeRouteFile(DIST, canonicalPath, out);
}

function main() {
  const site = getSite();
  const posts = getPosts();
  const pillars = getPillars();
  const frameworks = getFrameworks();
  const testimonials = getTestimonials();
  const caseStudies = getCaseStudies();
  const speaking = getSpeaking();
  const press = getPress();
  const books = getBooks();
  const courses = getCourses();
  const awards = getAwards();
  const trustedBy = getTrustedBy();
  const faq = getFaq();

  const shellPath = path.join(DIST, "index.html");
  if (!fs.existsSync(shellPath)) {
    console.error("prerender-static: dist/index.html not found. Run `vite build` first.");
    process.exit(1);
  }
  const shell = fs.readFileSync(shellPath, "utf8");
  let count = 0;

  // Homepage
  {
    const html = `
<main>
  <h1>Build a vision for the business and the life you actually want</h1>
  <p>${site.description}</p>
  <p>Jennifer Hudye, founder of Vision Driven, has guided 550+ companies through the Vivid Vision process since partnering with Cameron Herold in 2016.</p>
  <nav>
    ${pillars.map((p) => `<a href="/topics/${p.slug}">${p.title}</a>: ${p.tagline}`).join("<br>")}
  </nav>
  <section>
    <h2>Recent articles</h2>
    ${posts
      .slice(0, 6)
      .map((p) => `<article><h3><a href="/articles/${p.slug}">${p.title}</a></h3><p>${p.description}</p></article>`)
      .join("\n    ")}
  </section>
  <section>
    <h2>Named frameworks</h2>
    ${frameworks.map((f) => `<h3>${f.name}</h3><p>${f.definition}</p>`).join("\n    ")}
  </section>
  <section>
    <h2>What founders say</h2>
    ${testimonials
      .filter((t) => t.featured)
      .map((t) => `<blockquote>${t.quote}<footer>${t.name}, ${t.company}</footer></blockquote>`)
      .join("\n    ")}
  </section>
  <a href="${site.conversionUrl}">${site.conversionLabel}</a>
</main>`;
    page(html, "/", { title: `Vision Driven Insights | Jennifer Hudye on Vivid Vision`, description: site.description }, shell);
    count++;
  }

  // About
  {
    const html = `
<article>
  <h1>The point of view</h1>
  <p>Most planning either fixes your business or your personal life, but rarely both at once. That is exactly why it never sticks. When you fuse personal clarity and business strategy into one vision, every decision starts moving you toward the life and the business you actually want.</p>
  <h2>The short story</h2>
  <p>Jennifer Hudye grew up in an entrepreneurial family and started her first company at 13. By 19 she had sold two companies. In her early twenties she built Conscious Copy &amp; Co. into a top messaging agency in the business and personal development world. In 2016 she partnered with Cameron Herold, author of Vivid Vision, to bring the process to founders directly. Her team has since guided 550+ companies through it.</p>
  <h2>Frameworks</h2>
  ${frameworks.map((f) => `<h3>${f.name}</h3><p>${f.definition}</p>`).join("\n  ")}
  <h2>Speaking</h2>
  <p>${speaking.map((s) => s.event).join(", ")}.</p>
  <a href="${site.conversionUrl}">${site.conversionLabel}</a>
</article>`;
    page(
      html,
      "/about",
      {
        title: "About Jennifer Hudye",
        description: site.person.identityLine,
      },
      shell,
    );
    count++;
  }

  // Frameworks
  {
    const html = `
<article>
  <h1>The methods, named</h1>
  <p>The named frameworks behind the Vivid Vision process.</p>
  ${frameworks
    .map(
      (f) =>
        `<section id="${f.slug}"><h2>${f.name}</h2><p>${f.definition}</p><p>${f.principle}</p><p>${f.whenUsed}</p></section>`,
    )
    .join("\n  ")}
</article>`;
    page(
      html,
      "/frameworks",
      {
        title: "Jennifer Hudye's Frameworks",
        description: "The named methods Jennifer Hudye uses with founders: Vivid Vision, the Vision Driven OS, and more.",
        extraJsonLd: frameworks.map((f) => definedTermSchema(site, f)),
      },
      shell,
    );
    count++;
  }

  // Books
  {
    const hasBooks = books.length > 0;
    const html = `
<article>
  <h1>What to read</h1>
  ${
    hasBooks
      ? books.map((b) => `<h2>${b.title}</h2><p>${b.year}</p>`).join("\n  ")
      : `<p>Jennifer has not published her own book yet. Her work builds directly on <em>Vivid Vision</em> by Cameron Herold, her partner on the Vivid Vision process since 2016. That book is the foundation of everything Jennifer and her team run with founders: a three-year, present-tense picture of your company written so specifically that your team can see it and move toward it.</p><p>If you want the process itself rather than the book, start with the <a href="/frameworks">Frameworks page</a>, where every named method Jennifer uses is defined in plain language, or browse the <a href="/articles">articles</a> for the practical side of building and rolling out your own Vivid Vision.</p>`
  }
</article>`;
    page(
      html,
      "/books",
      { title: "Books and Reading", description: "Reading recommendations from Jennifer Hudye.", extraJsonLd: books.map((b) => bookSchema(site, b)) },
      shell,
    );
    count++;
  }

  // Courses
  {
    const html = `
<article>
  <h1>Ways to build your Vivid Vision</h1>
  ${courses
    .map((c) => `<section><h2>${c.name}</h2><p>${c.for}</p><p>${c.covers}</p><a href="${c.url}">Learn more</a></section>`)
    .join("\n  ")}
</article>`;
    page(
      html,
      "/courses",
      {
        title: "Programs and Ways to Work With Jennifer Hudye",
        description: "Done-For-You, the Retreat, the Vision Driven Quest, VIP days, and Vision Amplifier.",
        extraJsonLd: courses.map((c) => courseSchema(site, c)),
      },
      shell,
    );
    count++;
  }

  // Speaking
  {
    const html = `
<article>
  <h1>Where Jennifer has taught this</h1>
  <ul>
  ${speaking.map((s) => `<li><h2>${s.event}</h2><p>${s.role}: ${s.topic}</p></li>`).join("\n  ")}
  </ul>
</article>`;
    page(
      html,
      "/speaking",
      {
        title: "Jennifer Hudye Speaking",
        description: "Jennifer Hudye has spoken at Genius Network, Tiger 21, Traffic & Conversion Summit, TEDx, and more.",
        extraJsonLd: speaking.map((s) => eventSchema(site, s)),
      },
      shell,
    );
    count++;
  }

  // Press
  {
    const html = `
<article>
  <h1>Featured conversations</h1>
  <ul>
  ${press.map((p) => `<li><h2>${p.title}</h2><p>${p.outlet}${p.date ? `, ${p.date}` : ""}</p></li>`).join("\n  ")}
  </ul>
</article>`;
    page(html, "/press", { title: "Jennifer Hudye in the Press", description: "Podcast conversations and features with Jennifer Hudye." }, shell);
    count++;
  }

  // Testimonials
  {
    const stories = testimonials.filter((t) => t.type !== "endorsement");
    const endorsements = testimonials.filter((t) => t.type === "endorsement");
    const html = `
<article>
  <h1>What founders say</h1>
  ${stories.map((t) => `<blockquote><p>${t.quote}</p><footer>${t.name}, ${t.title}, ${t.company}</footer><p>${t.outcome}</p></blockquote>`).join("\n  ")}
  <h2>Endorsements</h2>
  ${endorsements.map((t) => `<blockquote><p>${t.quote || t.factNote}</p><footer>${t.name}, ${t.title}</footer></blockquote>`).join("\n  ")}
</article>`;
    page(
      html,
      "/testimonials",
      {
        title: "Client Results and Testimonials",
        description: "Founders on what changed after building their Vivid Vision with Jennifer Hudye.",
        extraJsonLd: testimonials.map((t) => reviewSchema(site, t)),
      },
      shell,
    );
    count++;
  }

  // Case studies index
  {
    const html = `
<article>
  <h1>The full stories</h1>
  ${caseStudies
    .map(
      (c) =>
        `<section><h2><a href="/case-studies/${c.slug}">${c.headline}</a></h2><p>${c.client}, ${c.clientTitle} at ${c.company}</p><p>${c.before}</p></section>`,
    )
    .join("\n  ")}
</article>`;
    page(html, "/case-studies", { title: "Case Studies", description: "Long-form client stories from the Vivid Vision process." }, shell);
    count++;
  }

  // Case study details
  for (const c of caseStudies) {
    const html = `
<article>
  <h1>${c.headline}</h1>
  <p>${c.client}, ${c.clientTitle} at ${c.company}${c.location ? `, ${c.location}` : ""}</p>
  <h2>Where things started</h2>
  <p>${c.before}</p>
  <h2>What was done</h2>
  <p>${c.what_was_done}</p>
  <h2>What changed</h2>
  <ul>${c.results.map((r) => `<li>${r}</li>`).join("")}</ul>
  <blockquote>${c.quote}<footer>${c.client}</footer></blockquote>
</article>`;
    page(
      html,
      `/case-studies/${c.slug}`,
      {
        title: `Case Study: ${c.client}, ${c.company}`,
        description: c.headline,
        extraJsonLd: [caseStudyArticleSchema(site, c)],
      },
      shell,
    );
    count++;
  }

  // Awards
  {
    const html = `
<article>
  <h1>Credentials and recognition</h1>
  ${awards.awards.map((a) => `<h2>${a.name}</h2><p>${a.issuer}${a.year ? `, ${a.year}` : ""}</p>`).join("\n  ")}
  <h2>What she is known for</h2>
  <ul>${awards.credentials.map((c) => `<li>${c}</li>`).join("")}</ul>
</article>`;
    page(html, "/awards", { title: "Recognition and Credentials", description: "Jennifer Hudye's credentials and recognized work." }, shell);
    count++;
  }

  // Trusted By
  {
    const html = `
<article>
  <h1>Who Jennifer has worked with</h1>
  <p>${trustedBy.intro}</p>
  <ul>${trustedBy.names.map((n) => `<li>${n}</li>`).join("")}</ul>
  <p>${trustedBy.stat} That work spans two decades, starting with Conscious Copy &amp; Co. and continuing today through Vision Driven and the Vivid Vision process Jennifer runs in partnership with Cameron Herold.</p>
  <p>See what specific clients say about the results in <a href="/testimonials">Testimonials</a> and <a href="/case-studies">Case Studies</a>.</p>
</article>`;
    page(html, "/trusted-by", { title: "Trusted By", description: trustedBy.intro }, shell);
    count++;
  }

  // FAQ
  {
    const html = `
<article>
  <h1>Questions about Vivid Vision</h1>
  <dl>${faq.map((f) => `<div><dt>${f.q}</dt><dd>${f.a}</dd></div>`).join("")}</dl>
</article>`;
    page(
      html,
      "/faq",
      {
        title: "Vivid Vision FAQ",
        description: "Common questions about Vivid Vision.",
        extraJsonLd: [faqPageSchema(faq)],
      },
      shell,
    );
    count++;
  }

  // Articles index
  {
    const html = `
<article>
  <h1>All articles</h1>
  <p>Everything Jennifer Hudye has written on building a Vivid Vision, turning it into a plan, becoming a vision-driven entrepreneur, and integrating business and life. Organized under four topics: ${pillars.map((p) => p.title).join(", ")}.</p>
  ${posts.length ? posts.map((p) => `<h2><a href="/articles/${p.slug}">${p.title}</a></h2><p>${p.description}</p>`).join("\n  ") : "<p>New articles publish every morning. Check back shortly, or start with the topic pages above.</p>"}
</article>`;
    page(html, "/articles", { title: "All Articles", description: "Every article from Jennifer Hudye on building a Vivid Vision." }, shell);
    count++;
  }

  // Pillar topic pages
  for (const pillar of pillars) {
    const pillarPosts = posts.filter((p) => p.pillarSlug === pillar.slug);
    const html = `
<article>
  <h1>${pillar.title}</h1>
  <p>${pillar.description}</p>
  <p>${pillar.tagline} This topic covers: ${pillar.subtopics.join(", ")}.</p>
  ${pillarPosts.length ? pillarPosts.map((p) => `<h2><a href="/articles/${p.slug}">${p.title}</a></h2><p>${p.description}</p>`).join("\n  ") : "<p>Articles on this topic publish soon. In the meantime, see the <a href=\"/frameworks\">Frameworks page</a> and <a href=\"/about\">About Jennifer</a>.</p>"}
</article>`;
    page(html, `/topics/${pillar.slug}`, { title: pillar.title, description: pillar.description }, shell);
    count++;
  }

  // Privacy
  {
    const html = `
<article>
  <h1>Privacy Policy</h1>
  <p>Last updated September 1, 2026.</p>
  <p>This Privacy Policy explains how ${site.copyrightHolder} handles information when you visit ${site.domain}.</p>
  <h2>Information we collect</h2>
  <p>We collect automatic data (pages visited, general location, device and browser type) through analytics tools, and information you give us directly if you fill out a form or opt in to an email list.</p>
  <h2>Cookies and tracking</h2>
  <p>The Site uses cookies through Google Analytics 4 and Microsoft Clarity to understand how visitors use the Site. Microsoft Clarity records session behavior such as scrolling and clicks; it does not collect passwords or payment details. You can disable cookies in your browser settings.</p>
  <h2>How we use information</h2>
  <p>We use the information we collect to operate and improve the Site and to understand which articles are useful. We do not sell your personal information.</p>
  <h2>Your choices</h2>
  <p>You can opt out of marketing emails at any time. To request access to or deletion of your personal information, contact us below.</p>
  <h2>Contact</h2>
  <p><a href="mailto:${site.dmcaEmail}">${site.dmcaEmail}</a></p>
</article>`;
    page(html, "/privacy", { title: "Privacy Policy", description: "Privacy policy for Vision Driven Insights." }, shell);
    count++;
  }

  // Terms
  {
    const html = `
<article>
  <h1>Terms of Use</h1>
  <p>Last updated September 1, 2026.</p>
  <p>These Terms of Use govern your access to and use of ${site.domain}, operated by ${site.copyrightHolder}.</p>
  <h2>The content on this site</h2>
  <p>All articles, images, graphics, and named frameworks referenced on this Site, including Vivid Vision, the Vision Driven OS, and the Vivid Vision Method, are the intellectual property of Vision Driven and are protected by United States copyright law.</p>
  <h2>Permitted and prohibited use</h2>
  <p>You may read, share links to, and quote brief excerpts of the Site's content with attribution. You may not reproduce, republish, or scrape substantial portions of the content without written permission. See <a href="/license.txt">license.txt</a> for the full terms.</p>
  <h2>No guarantee of results</h2>
  <p>Case studies and testimonials on this Site describe real client experiences. Individual results vary, and nothing on this Site is a guarantee of any specific outcome.</p>
  <h2>DMCA notice and takedown</h2>
  <p>Send infringement notices to <a href="mailto:${site.dmcaEmail}">${site.dmcaEmail}</a>.</p>
  <h2>Governing law</h2>
  <p>These terms are governed by the laws of the ${site.jurisdiction}.</p>
</article>`;
    page(html, "/terms", { title: "Terms of Use", description: "Terms of use for Vision Driven Insights." }, shell);
    count++;
  }

  console.log(`prerender-static: wrote ${count} static page(s).`);
}

main();
