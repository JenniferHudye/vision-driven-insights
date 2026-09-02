#!/usr/bin/env node
// Fails the build if config/voice-profile.md is missing this buyer's name or
// business, or contains a different business's name. This failure class (a
// voice file carried over from a prior template) shipped 3 times in
// production; the check is cheap, so it runs on every build.
const fs = require("fs");
const path = require("path");
const { ROOT, getSite } = require("./lib/site-data.cjs");

const KNOWN_OTHER_BUSINESSES = ["Krista Mashore", "925Move"];

function main() {
  const filePath = path.join(ROOT, "config/voice-profile.md");
  if (!fs.existsSync(filePath)) {
    console.error("check-voice-fingerprint: config/voice-profile.md is missing.");
    process.exit(1);
  }
  const text = fs.readFileSync(filePath, "utf8");
  const site = getSite();
  const name = site.person.name;
  const business = site.organization.name;

  const errors = [];
  if (!text.includes(name)) errors.push(`voice-profile.md does not mention buyer name "${name}"`);
  if (!text.includes(business)) errors.push(`voice-profile.md does not mention business "${business}"`);
  for (const other of KNOWN_OTHER_BUSINESSES) {
    if (text.includes(other)) errors.push(`voice-profile.md contains a DIFFERENT business/name: "${other}"`);
  }

  if (errors.length) {
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`check-voice-fingerprint: config/voice-profile.md names ${name} / ${business} only.`);
}

main();
