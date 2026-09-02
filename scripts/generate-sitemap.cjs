#!/usr/bin/env node
// Writes sitemap.xml (to dist/ during a full build, and to public/ as the
// git-tracked source of truth). See scripts/lib/site-artifacts.cjs.
const { buildSitemap, writeBoth } = require("./lib/site-artifacts.cjs");

const { xml, count } = buildSitemap();
writeBoth("sitemap.xml", xml);
console.log(`generate-sitemap: wrote sitemap.xml with ${count} URLs.`);
