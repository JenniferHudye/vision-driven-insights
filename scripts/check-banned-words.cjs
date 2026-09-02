#!/usr/bin/env node
// Fails the build if any post body, FAQ answer, or title uses a banned word,
// an em dash, or a banned construction ("not only X but also Y", "it's not
// X, it's Y"). Union of the build prompt's banned list, the buyer's own
// additions, and the special constructions called out in the voice guide.
const path = require("path");
const { ROOT, readJson, getPosts, getQueue } = require("./lib/site-data.cjs");

const bannedWords = readJson("config/banned-words.json");
let extraWords = [];
try {
  const brief = require("fs").readFileSync(path.join(ROOT, "client-brief.md"), "utf8");
  const match = brief.match(/Strictly prohibited word list[\s\S]*?:\s*\n?([\s\S]*?)\n\n/);
  if (match) {
    extraWords = match[1]
      .split(/[,\n]/)
      .map((w) => w.replace(/[.*_`]/g, "").trim())
      .filter(Boolean);
  }
} catch {
  /* client-brief.md always exists at this point in the build; ignore if not */
}

const allBanned = Array.from(new Set([...bannedWords, ...extraWords].map((w) => w.toLowerCase())));

const CONSTRUCTIONS = [
  { name: "em dash", re: /—|–—|--(?!>)/ },
  { name: '"not only X but also Y"', re: /not only\b[\s\S]{0,80}\bbut also\b/i },
  { name: '"it\'s not X, it\'s Y"', re: /it'?s not\b[\s\S]{0,60}\bit'?s\b/i },
];

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ");
}

function checkText(label, text) {
  const violations = [];
  const plain = stripTags(text);
  const lower = plain.toLowerCase();
  for (const word of allBanned) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) violations.push(`banned word "${word}" in ${label}`);
  }
  for (const c of CONSTRUCTIONS) {
    if (c.re.test(text)) violations.push(`banned construction ${c.name} in ${label}`);
  }
  return violations;
}

function checkEntry(entry) {
  const violations = [];
  violations.push(...checkText(`${entry.slug} title`, entry.title || ""));
  violations.push(...checkText(`${entry.slug} metaTitle`, entry.metaTitle || ""));
  violations.push(...checkText(`${entry.slug} metaDescription`, entry.metaDescription || ""));
  violations.push(...checkText(`${entry.slug} body`, entry.body || ""));
  for (const f of entry.faq || []) {
    violations.push(...checkText(`${entry.slug} FAQ`, `${f.q} ${f.a}`));
  }
  return violations;
}

function main() {
  const entries = [...getPosts(), ...getQueue()];
  let total = 0;
  for (const entry of entries) {
    const v = checkEntry(entry);
    if (v.length) {
      total += v.length;
      console.error(`\n${entry.slug}:`);
      v.forEach((x) => console.error(`  - ${x}`));
    }
  }
  if (total > 0) {
    console.error(`\ncheck-banned-words: ${total} violation(s) across ${entries.length} entries.`);
    process.exit(1);
  }
  console.log(`check-banned-words: ${entries.length} entries clean.`);
}

main();
