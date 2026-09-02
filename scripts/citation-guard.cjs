#!/usr/bin/env node
// Standalone citation guard CLI. Checks every entry in data/blog/queue.json
// and data/blog/posts.json for uncited stats and the fabrication pattern
// (a named source + month/year + a stat, without a real source link).
// Exits non-zero on any violation. Also wired into scripts/publish-batch.cjs
// via scripts/lib/content-guards.cjs so every entry is checked before it
// ever goes live, not just at CLI-run time.
const { checkCitation } = require("./lib/content-guards.cjs");
const { getPosts, getQueue } = require("./lib/site-data.cjs");

function auditEntry(entry) {
  const violations = checkCitation(entry.body || "").map((v) => ({ guard: "citation", detail: v }));
  if (entry.faq) {
    for (const f of entry.faq) {
      const faqV = checkCitation(`<p>${f.a}</p>`);
      violations.push(...faqV.map((v) => ({ guard: "citation-faq", detail: v })));
    }
  }
  return violations;
}

function main() {
  const entries = [...getQueue(), ...getPosts()];
  let failed = 0;
  for (const entry of entries) {
    const violations = auditEntry(entry);
    if (violations.length) {
      failed++;
      console.error(`\nCITATION GUARD FAILED: ${entry.slug}`);
      for (const v of violations) console.error(`  [${v.guard}] ${v.detail}`);
    }
  }
  if (failed) {
    console.error(`\n${failed} entr${failed === 1 ? "y" : "ies"} failed the citation guard.`);
    process.exit(1);
  }
  console.log(`citation-guard: ${entries.length} entries checked, all clean.`);
}

main();
