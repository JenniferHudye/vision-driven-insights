#!/usr/bin/env node
// LAST step of the build. Halts the build if any article body is too short,
// any static-route body is too short or missing its h1, any page is missing
// h1/article/JSON-LD/og:title, any page head has a duplicate og:/twitter:
// tag, any schema image is an SVG, or any referenced image 404s. An empty
// shell must never deploy.
const fs = require("fs");
const path = require("path");
const { ROOT, getPosts, getPillars, getCaseStudies } = require("./lib/site-data.cjs");

const DIST = path.join(ROOT, "dist");

const ARTICLE_MIN_CHARS = 1200;
const STATIC_MIN_CHARS = 400;

let errors = [];
let checkedImages = new Set();

function readRoute(routePath) {
  const clean = routePath === "/" ? "/" : routePath.replace(/\/$/, "");
  const file = clean === "/" ? path.join(DIST, "index.html") : path.join(DIST, clean.replace(/^\//, ""), "index.html");
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

function rootBodyText(html) {
  // Greedy match: the injected content can itself contain nested </div> tags
  // (footer, header, cards), so match up to the LAST </div> immediately
  // before </body>. Vite's production build moves the bundle <script> tag
  // into <head>, so the root div's closing tag is followed by </body>, not
  // a <script> tag.
  const m = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
  const inner = m ? m[1] : "";
  return inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countTag(html, re) {
  const m = html.match(re);
  return m ? m.length : 0;
}

function checkImageRef(src) {
  if (!src || checkedImages.has(src)) return;
  checkedImages.add(src);
  if (src.startsWith("http")) return; // external, can't check on disk cheaply; skip
  const filePath = path.join(DIST, src.split("?")[0].replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing image on disk: ${src} (expected ${filePath})`);
  }
}

function verifyRoute(routePath, { minChars, requireArticleTag }) {
  const html = readRoute(routePath);
  if (!html) {
    errors.push(`${routePath}: route file missing from dist/`);
    return;
  }

  const bodyText = rootBodyText(html);
  if (bodyText.length < minChars) {
    errors.push(`${routePath}: body too short (${bodyText.length} chars, need ${minChars}+). Possible empty shell.`);
  }
  if (!/<h1[\s>]/i.test(html)) {
    errors.push(`${routePath}: missing <h1>`);
  }
  if (requireArticleTag && !/<article[\s>]/i.test(html)) {
    errors.push(`${routePath}: missing <article> wrapper`);
  }
  if (!/application\/ld\+json/.test(html)) {
    errors.push(`${routePath}: missing JSON-LD`);
  }
  const ogTitleCount = countTag(html, /<meta\s+property=["']og:title["']/gi);
  if (ogTitleCount === 0) errors.push(`${routePath}: missing og:title`);
  if (ogTitleCount > 1) errors.push(`${routePath}: DUPLICATE og:title (${ogTitleCount} found)`);

  // Any duplicate og:/twitter: property at all (underscore-aware).
  const propMatches = [...html.matchAll(/<meta\s+(?:property|name)=["']((?:og|twitter)[a-z_:]*)["']/gi)].map((m) => m[1]);
  const seen = new Map();
  for (const p of propMatches) seen.set(p, (seen.get(p) || 0) + 1);
  for (const [p, n] of seen) {
    if (n > 1) errors.push(`${routePath}: duplicate meta tag "${p}" (${n} occurrences)`);
  }

  // No schema image may be an SVG.
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [, raw] of jsonLdBlocks) {
    try {
      const obj = JSON.parse(raw);
      const flat = JSON.stringify(obj);
      const svgRefs = flat.match(/https?:\/\/[^"]+\.svg/g);
      if (svgRefs) errors.push(`${routePath}: schema references an SVG image: ${svgRefs.join(", ")}`);
    } catch {
      errors.push(`${routePath}: a JSON-LD block failed to parse`);
    }
  }

  // Resolve every <img src="...">
  const imgs = [...html.matchAll(/<img\s+[^>]*src=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const src of imgs) checkImageRef(src);
}

function main() {
  const posts = getPosts();
  const pillars = getPillars();
  const caseStudies = getCaseStudies();

  for (const post of posts) {
    verifyRoute(`/articles/${post.slug}`, { minChars: ARTICLE_MIN_CHARS, requireArticleTag: true });
    checkImageRef(post.featuredImage.src);
  }

  const staticRoutes = [
    "/",
    "/about",
    "/frameworks",
    "/books",
    "/courses",
    "/speaking",
    "/press",
    "/testimonials",
    "/case-studies",
    "/awards",
    "/trusted-by",
    "/faq",
    "/articles",
    "/privacy",
    "/terms",
    ...pillars.map((p) => `/topics/${p.slug}`),
    ...caseStudies.map((c) => `/case-studies/${c.slug}`),
  ];

  for (const route of staticRoutes) {
    verifyRoute(route, { minChars: STATIC_MIN_CHARS, requireArticleTag: route !== "/" });
  }

  checkImageRef("/og-default.png");

  if (errors.length) {
    console.error(`\nverify-prerender FAILED with ${errors.length} error(s):\n`);
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error("\nAn empty shell or broken image must never deploy. Fix the above before building again.");
    process.exit(1);
  }

  console.log(
    `verify-prerender: OK. ${posts.length} article(s) + ${staticRoutes.length} static route(s) verified, ${checkedImages.size} image ref(s) resolved.`,
  );
}

main();
