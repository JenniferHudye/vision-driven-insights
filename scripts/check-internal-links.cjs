#!/usr/bin/env node
// Fails the build if any post body contains a bare-slug internal link or a
// link to an article slug that does not exist. Valid internal hrefs:
//   /articles/<slug>   where slug exists in data/blog/posts.json
//   a static route from config/static-routes.json, or /topics/<pillarSlug>
//   external URLs (http/https), anchors (#...), mailto:, tel:
const { readJson, getPosts, getQueue } = require("./lib/site-data.cjs");

const staticRoutes = new Set(readJson("config/static-routes.json"));
const pillars = readJson("data/pillars.json");
for (const p of pillars) staticRoutes.add(`/topics/${p.slug}`);
staticRoutes.add("/privacy");
staticRoutes.add("/terms");

function extractHrefs(html) {
  const re = /<a\s+[^>]*href=["']([^"']+)["']/gi;
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function isValidInternal(href, validSlugs) {
  if (href.startsWith("/articles/")) {
    const slug = href.replace("/articles/", "").split(/[?#]/)[0];
    return validSlugs.has(slug);
  }
  const clean = href.split(/[?#]/)[0];
  return staticRoutes.has(clean);
}

function main() {
  const posts = getPosts();
  const queue = getQueue();
  const all = [...posts, ...queue];
  const validSlugs = new Set(all.map((p) => p.slug));

  const errors = [];
  for (const entry of all) {
    const hrefs = extractHrefs(entry.body || "");
    for (const href of hrefs) {
      if (/^https?:\/\//.test(href)) continue; // external, ownership checked by content-guards
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
      if (!href.startsWith("/")) {
        errors.push(`${entry.slug}: bare-slug link not allowed: "${href}"`);
        continue;
      }
      if (!isValidInternal(href, validSlugs)) {
        errors.push(`${entry.slug}: internal link points at a route/slug that does not exist: "${href}"`);
      }
    }
  }

  if (errors.length) {
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error(`\ncheck-internal-links: ${errors.length} broken internal link(s).`);
    console.error(`Run "node scripts/fix-internal-links.cjs" to attempt an automatic repair.`);
    process.exit(1);
  }
  console.log(`check-internal-links: ${all.length} entries, all internal links resolve.`);
}

main();
