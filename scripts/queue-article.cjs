#!/usr/bin/env node
// Interactive CLI for adding a new article to the queue by hand (for
// Jennifer or a VA, without needing Claude Code). Run: npm run queue
// Validates title length, metaDescription length, FAQ count, and converts
// markdown to HTML via scripts/lib/md-to-html.cjs so nothing raw slips in.
const readline = require("readline");
const { getQueue, setQueue, getPillars } = require("./lib/site-data.cjs");
const { mdToHtml } = require("./lib/md-to-html.cjs");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function main() {
  console.log("Add a new article to the queue.\n");

  const title = await ask("Title: ");
  const pillars = getPillars();
  console.log("\nPillars:");
  pillars.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));
  const pillarIdx = parseInt(await ask("Pillar number: "), 10) - 1;
  const pillar = pillars[pillarIdx];
  if (!pillar) {
    console.error("Invalid pillar number.");
    process.exit(1);
  }

  const metaDescription = await ask("Meta description (<=155 chars): ");
  if (metaDescription.length > 155) {
    console.error(`Meta description is ${metaDescription.length} chars, must be 155 or fewer.`);
    process.exit(1);
  }

  console.log("\nPaste the article body (markdown or HTML). End with a blank line then 'END' on its own line:");
  const bodyLines = [];
  while (true) {
    const line = await ask("");
    if (line.trim() === "END") break;
    bodyLines.push(line);
  }
  const rawBody = bodyLines.join("\n");
  const looksLikeMarkdown = /^#{1,6}\s|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)/m.test(rawBody) && !/^<p>|^<h[1-6]>/.test(rawBody.trim());
  const body = looksLikeMarkdown ? mdToHtml(rawBody) : rawBody;

  console.log("\nFAQ (need at least 4). Enter question, blank to stop:");
  const faq = [];
  while (true) {
    const q = await ask(`Q${faq.length + 1} (blank to stop): `);
    if (!q.trim()) break;
    const a = await ask(`A${faq.length + 1}: `);
    faq.push({ q, a });
  }
  if (faq.length < 4) {
    console.error(`Only ${faq.length} FAQ entries. Need at least 4.`);
    process.exit(1);
  }

  const slug = slugify(title);
  const wordCount = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  const entry = {
    slug,
    title,
    metaTitle: title.length <= 60 ? title : title.slice(0, 57) + "...",
    metaDescription,
    description: metaDescription,
    category: pillar.title,
    pillarSlug: pillar.slug,
    keywords: [pillar.primaryKeyword],
    author: "Jennifer Hudye",
    publishedDate: "",
    modifiedDate: "",
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / 220)),
    body,
    faq,
    featuredImage: { src: "", alt: "" }, // filled by scripts/refresh-hero-images.cjs
  };

  const queue = getQueue();
  queue.push(entry);
  setQueue(queue);

  console.log(`\nAdded "${title}" (slug: ${slug}) to the queue.`);
  console.log(`Run "npm run build" once to generate its hero image, or "node scripts/refresh-hero-images.cjs" alone.`);
  rl.close();
}

main();
