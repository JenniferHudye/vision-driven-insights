#!/usr/bin/env node
// Injects real, crawlable article HTML (h1, byline, full body, FAQ, CTA)
// into <div id="root"> for every published article, plus the per-article
// head (title/description/canonical/og/twitter + BlogPosting/FAQPage/
// BreadcrumbList/ImageObject JSON-LD). This is hard requirement #1: a React
// SPA that only prerenders <head> ships an empty body, invisible to bots
// that do not run JavaScript.
const fs = require("fs");
const path = require("path");
const { ROOT, getSite, getPosts, getPillars } = require("./lib/site-data.cjs");
const {
  stripPageHead,
  buildHeadTags,
  injectIntoHead,
  injectIntoRoot,
  writeRouteFile,
} = require("./lib/prerender-helpers.cjs");
const {
  ogImageUrl,
  personSchema,
  organizationSchema,
  breadcrumbSchema,
  faqPageSchema,
  blogPostingSchema,
  imageObjectSchema,
} = require("./lib/schema.cjs");

const DIST = path.join(ROOT, "dist");

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function renderArticleBody(site, post, pillar) {
  return `
<article>
  <nav aria-label="Breadcrumb">
    <a href="/">Home</a> / ${pillar ? `<a href="/topics/${pillar.slug}">${pillar.title}</a> / ` : ""}<span>${post.title}</span>
  </nav>
  <header>
    ${pillar ? `<p>${pillar.brandLabel}</p>` : ""}
    <h1>${post.title}</h1>
    <p>By ${post.author} &middot; ${fmtDate(post.publishedDate)} &middot; ${post.readingMinutes} min read</p>
  </header>
  <img src="${post.featuredImage.src}" alt="${post.featuredImage.alt}" width="1200" height="675">
  <div>${post.body}</div>
  ${
    post.faq && post.faq.length
      ? `<section>
    <h2>Frequently asked questions</h2>
    <dl>
      ${post.faq.map((f) => `<div><dt>${f.q}</dt><dd>${f.a}</dd></div>`).join("\n      ")}
    </dl>
  </section>`
      : ""
  }
  <section>
    <p>Ready to build your own Vivid Vision?</p>
    <a href="${site.conversionUrl}">${site.conversionLabel}</a>
  </section>
  <aside>
    <p>Jennifer Hudye</p>
    <p>Founder of Vision Driven. She helps 7- and 8-figure founders build a Vivid Vision for their business and life, then a plan they will actually follow.</p>
    <a href="/about">More about Jennifer</a>
  </aside>
</article>`;
}

function main() {
  const site = getSite();
  const posts = getPosts();
  const pillars = getPillars();
  const shellPath = path.join(DIST, "index.html");
  if (!fs.existsSync(shellPath)) {
    console.error("prerender-blog: dist/index.html not found. Run `vite build` first.");
    process.exit(1);
  }
  const shell = fs.readFileSync(shellPath, "utf8");

  let count = 0;
  for (const post of posts) {
    const pillar = pillars.find((p) => p.slug === post.pillarSlug);
    const canonical = `${site.url}/articles/${post.slug}`;

    const jsonLd = [
      blogPostingSchema(site, post),
      breadcrumbSchema(site, [
        { name: "Home", path: "/" },
        ...(pillar ? [{ name: pillar.title, path: `/topics/${pillar.slug}` }] : []),
        { name: post.title, path: `/articles/${post.slug}` },
      ]),
      faqPageSchema(post.faq),
      imageObjectSchema(site, post),
    ];

    const headTags = buildHeadTags({
      title: post.metaTitle,
      description: post.metaDescription,
      canonical,
      ogImage: ogImageUrl(site),
      extraJsonLd: jsonLd,
    });

    let html = stripPageHead(shell);
    html = injectIntoHead(html, headTags);
    html = injectIntoRoot(html, renderArticleBody(site, post, pillar));

    writeRouteFile(DIST, `/articles/${post.slug}`, html);
    count++;
  }

  console.log(`prerender-blog: wrote ${count} article page(s).`);
}

main();
