// Writes sitemap.xml / llms.txt / llms-full.txt to public/ (source of truth,
// committed to git) and, if dist/ exists (a full `npm run build` ran), also
// to dist/ so the deployed build matches. Shared by generate-sitemap.cjs,
// generate-llms-txt.cjs, and publish-batch.cjs (the daily cron only touches
// public/, since it never runs a full vite build).
const fs = require("fs");
const path = require("path");
const { ROOT, getSite, getPosts, getPillars, getCaseStudies } = require("./site-data.cjs");

function writeBoth(filename, contents) {
  fs.writeFileSync(path.join(ROOT, "public", filename), contents, "utf8");
  const distDir = path.join(ROOT, "dist");
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, filename), contents, "utf8");
  }
}

function buildSitemap() {
  const site = getSite();
  const posts = getPosts();
  const pillars = getPillars();
  const caseStudies = getCaseStudies();

  const staticRoutes = [
    "/", "/about", "/frameworks", "/books", "/courses", "/speaking", "/press",
    "/testimonials", "/case-studies", "/awards", "/trusted-by", "/faq", "/articles",
    "/privacy", "/terms",
  ];

  const urls = [
    ...staticRoutes.map((p) => ({ loc: p, priority: p === "/" ? "1.0" : "0.7" })),
    ...pillars.map((p) => ({ loc: `/topics/${p.slug}`, priority: "0.8" })),
    ...caseStudies.map((c) => ({ loc: `/case-studies/${c.slug}`, priority: "0.7" })),
    ...posts.map((p) => ({ loc: `/articles/${p.slug}`, priority: "0.7", lastmod: p.modifiedDate || p.publishedDate })),
  ];

  return {
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${site.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`)
      .join("\n")}\n</urlset>\n`,
    count: urls.length,
  };
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function buildLlmsTxt() {
  const site = getSite();
  const posts = getPosts();
  const pillars = getPillars();

  const lines = [
    `# ${site.siteName}`,
    "",
    `> ${site.description}`,
    "",
    `Author: ${site.person.name}, founder of ${site.organization.name}.`,
    `Main site: ${site.mainWebsite}`,
    "",
    "## Topics",
    ...pillars.map((p) => `- [${p.title}](${site.url}/topics/${p.slug}): ${p.tagline}`),
    "",
    "## Articles",
    ...posts.map((post) => `- [${post.title}](${site.url}/articles/${post.slug}): ${post.description}`),
    "",
    "## Key pages",
    `- [About](${site.url}/about)`,
    `- [Frameworks](${site.url}/frameworks)`,
    `- [Case Studies](${site.url}/case-studies)`,
    `- [Testimonials](${site.url}/testimonials)`,
  ];
  const llmsTxt = lines.join("\n") + "\n";

  const fullParts = [`# ${site.siteName}: full article text\n`];
  for (const post of posts) {
    fullParts.push(
      `\n---\n\n## ${post.title}\n\nURL: ${site.url}/articles/${post.slug}\nAuthor: ${post.author}\nPublished: ${post.publishedDate}\n\n${stripHtml(post.body)}\n`,
    );
  }
  return { llmsTxt, llmsFullTxt: fullParts.join(""), count: posts.length };
}

function refreshSitemapAndLlms() {
  const { xml, count: urlCount } = buildSitemap();
  writeBoth("sitemap.xml", xml);
  const { llmsTxt, llmsFullTxt, count: articleCount } = buildLlmsTxt();
  writeBoth("llms.txt", llmsTxt);
  writeBoth("llms-full.txt", llmsFullTxt);
  return { urlCount, articleCount };
}

module.exports = { buildSitemap, buildLlmsTxt, refreshSitemapAndLlms, writeBoth };
