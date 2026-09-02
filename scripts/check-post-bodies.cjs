#!/usr/bin/env node
// Fails the build if any post body still contains raw markdown syntax.
// Articles are stored as HTML; markdown that slipped through must quarantine.
const { getPosts, getQueue } = require("./lib/site-data.cjs");

const MARKDOWN_PATTERNS = [
  { name: "heading (#)", re: /^#{1,6}\s/m },
  { name: "bold (**)", re: /\*\*[^*]+\*\*/ },
  { name: "markdown link ([..](..))", re: /\[[^\]]+\]\([^)]+\)/ },
  { name: "bullet (- )", re: /^[-*]\s+\S/m },
];

function checkBody(slug, body) {
  const violations = [];
  for (const p of MARKDOWN_PATTERNS) {
    if (p.re.test(body)) violations.push(`${slug}: looks like raw markdown (${p.name})`);
  }
  return violations;
}

function main() {
  const entries = [...getPosts(), ...getQueue()];
  const violations = entries.flatMap((e) => checkBody(e.slug, e.body || ""));
  if (violations.length) {
    violations.forEach((v) => console.error(`  - ${v}`));
    console.error(`\ncheck-post-bodies: ${violations.length} entr(y/ies) have raw markdown.`);
    process.exit(1);
  }
  console.log(`check-post-bodies: ${entries.length} entries are clean HTML.`);
}

main();
