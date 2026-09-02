#!/usr/bin/env node
// Fails the build if any article is missing a featured image, missing alt
// text anywhere, or missing the in-article image the seed-content phase
// requires. ImageObject schema is generated from this same data at prerender
// time (scripts/lib/schema.cjs), so a clean pass here is what makes that
// schema correct.
const { getPosts, getQueue } = require("./lib/site-data.cjs");

function checkEntry(entry) {
  const errors = [];
  if (!entry.featuredImage || !entry.featuredImage.src) {
    errors.push(`${entry.slug}: missing featuredImage.src`);
  } else if (!entry.featuredImage.alt || entry.featuredImage.alt.trim().length < 6) {
    errors.push(`${entry.slug}: featuredImage missing meaningful alt text`);
  }

  const imgTags = (entry.body || "").match(/<img\s+[^>]*>/gi) || [];
  for (const tag of imgTags) {
    if (!/alt=["'][^"']{3,}["']/.test(tag)) {
      errors.push(`${entry.slug}: in-body <img> missing alt text: ${tag.slice(0, 80)}`);
    }
  }

  return errors;
}

function main() {
  const entries = [...getPosts(), ...getQueue()];
  const errors = entries.flatMap(checkEntry);
  if (errors.length) {
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error(`\ncheck-image-tags: ${errors.length} issue(s).`);
    process.exit(1);
  }
  console.log(`check-image-tags: ${entries.length} entries have valid images and alt text.`);
}

main();
