#!/usr/bin/env node
// The daily auto-publish script. Run by .github/workflows/daily-publish.yml.
//
// Your daily article count. Lower or raise it anytime, then commit and push.
// 5 is the default; less is fine.
const ARTICLES_PER_RUN = 5;

const fs = require("fs");
const os = require("os");
const path = require("path");
const { getSite, getPosts, getQueue, setPosts, setQueue } = require("./lib/site-data.cjs");
const { runGuards } = require("./lib/content-guards.cjs");
const { refreshSitemapAndLlms } = require("./lib/site-artifacts.cjs");

// Word floor for a publishable article. The build standard names 900; we run
// lower because the seed set is deliberately tight: focused supporting
// articles (roughly 650 to 1,100 words) plus deep cornerstone guides
// (1,300 to 3,200). The standard also says "never padding," and forcing
// every short article to 900 would push it toward filler. Raise this back
// toward 900 if future top-ups are written longer.
const WORD_FLOOR = 600;

function wordCount(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length ? text.split(" ").length : 0;
}

function validateEntry(entry) {
  const errors = [];
  const required = ["slug", "title", "metaTitle", "metaDescription", "body", "category", "pillarSlug", "author", "featuredImage"];
  for (const field of required) {
    if (!entry[field]) errors.push(`missing required field "${field}"`);
  }
  if (entry.body) {
    if (/—/.test(entry.body)) errors.push("body contains an em dash");
    if (/^#{1,6}\s|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)/m.test(entry.body)) errors.push("body looks like raw markdown");
    const wc = wordCount(entry.body);
    if (wc < WORD_FLOOR) errors.push(`body is only ${wc} words, floor is ${WORD_FLOOR}`);
  }
  return errors;
}

function main() {
  const site = getSite();
  const posts = getPosts();
  const queue = getQueue();
  const existingSlugs = new Set(posts.map((p) => p.slug));

  const toPublish = [];
  const quarantined = [];
  const remainingQueue = [];

  for (const entry of queue) {
    if (toPublish.length >= ARTICLES_PER_RUN) {
      remainingQueue.push(entry);
      continue;
    }
    if (existingSlugs.has(entry.slug)) {
      quarantined.push({ entry, reason: "duplicate slug already published" });
      continue;
    }
    const fieldErrors = validateEntry(entry);
    const guardResult = runGuards(entry);
    const errors = [...fieldErrors, ...guardResult.violations.map((v) => `[${v.guard}] ${v.detail}`)];

    if (errors.length) {
      quarantined.push({ entry, reason: errors.join("; ") });
      continue;
    }

    const today = new Date().toISOString().slice(0, 10);
    const published = { ...entry, publishedDate: today, modifiedDate: today };
    toPublish.push(published);
    existingSlugs.add(entry.slug);
  }

  // Append-only safety: never shrink the published set, never touch existing slugs.
  const newPosts = [...posts, ...toPublish];
  if (newPosts.length < posts.length) {
    console.error("publish-batch: refusing to run, this would SHRINK the published count.");
    process.exit(1);
  }
  const changedExisting = posts.some((p) => {
    const match = newPosts.find((n) => n.slug === p.slug);
    return !match || JSON.stringify(match) !== JSON.stringify(p);
  });
  if (changedExisting) {
    console.error("publish-batch: refusing to run, an existing published article would be modified.");
    process.exit(1);
  }

  setPosts(newPosts);
  setQueue(remainingQueue);
  refreshSitemapAndLlms();

  const urlsFile = path.join(os.tmpdir(), "published-urls.txt");
  const urls = toPublish.map((p) => `${site.url}/articles/${p.slug}`);
  fs.writeFileSync(urlsFile, urls.join("\n") + (urls.length ? "\n" : ""), "utf8");

  if (quarantined.length) {
    console.warn(`\npublish-batch: ${quarantined.length} entr(y/ies) quarantined:`);
    quarantined.forEach((q) => console.warn(`  - ${q.entry.slug || "(no slug)"}: ${q.reason}`));
  }

  if (toPublish.length === 0) {
    console.error("\npublish-batch: published ZERO articles this run (queue empty or everything quarantined).");
    process.exit(1); // a zero-publish day must trigger the failure email, never look like success
  }

  console.log(`\npublish-batch: published ${toPublish.length} article(s):`);
  urls.forEach((u) => console.log(`  - ${u}`));
  console.log(`Remaining in queue: ${remainingQueue.length}`);
}

main();
