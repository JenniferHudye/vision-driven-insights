#!/usr/bin/env node
// One-shot repair for scripts/check-internal-links.cjs failures. Rewrites
// bare-slug links to /articles/<slug> when the target exists, and unwraps
// <a> tags whose target can't be resolved to any real slug or static route
// (leaves the text, drops the link, so nothing 404s).
const { readJson, getPosts, getQueue, setPosts, setQueue } = require("./lib/site-data.cjs");

const staticRoutes = new Set(readJson("config/static-routes.json"));
const pillars = readJson("data/pillars.json");
for (const p of pillars) staticRoutes.add(`/topics/${p.slug}`);
staticRoutes.add("/privacy");
staticRoutes.add("/terms");

function fixBody(body, validSlugs) {
  let changed = false;
  let out = body.replace(/<a\s+([^>]*?)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi, (full, pre, href, post, label) => {
    if (/^https?:\/\//.test(href)) return full;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return full;

    let clean = href.split(/[?#]/)[0];

    // Bare slug (no leading slash) that matches a real article slug: rewrite.
    if (!href.startsWith("/") && validSlugs.has(clean)) {
      changed = true;
      return `<a ${pre}href="/articles/${clean}"${post}>${label}</a>`;
    }

    if (href.startsWith("/articles/")) {
      const slug = clean.replace("/articles/", "");
      if (validSlugs.has(slug)) return full;
      changed = true;
      return label; // unwrap: target doesn't exist
    }

    if (href.startsWith("/") && staticRoutes.has(clean)) return full;

    // Unknown target: unwrap the link, keep the text.
    changed = true;
    return label;
  });
  return { out, changed };
}

function main() {
  const posts = getPosts();
  const queue = getQueue();
  const validSlugs = new Set([...posts, ...queue].map((p) => p.slug));

  let totalChanged = 0;

  const fixedPosts = posts.map((p) => {
    const { out, changed } = fixBody(p.body || "", validSlugs);
    if (changed) totalChanged++;
    return { ...p, body: out };
  });
  const fixedQueue = queue.map((p) => {
    const { out, changed } = fixBody(p.body || "", validSlugs);
    if (changed) totalChanged++;
    return { ...p, body: out };
  });

  setPosts(fixedPosts);
  setQueue(fixedQueue);
  console.log(`fix-internal-links: repaired links in ${totalChanged} entr(y/ies).`);
}

main();
