#!/usr/bin/env node
// Writes llms.txt and llms-full.txt (to dist/ during a full build, and to
// public/ as the git-tracked source of truth). See scripts/lib/site-artifacts.cjs.
const { buildLlmsTxt, writeBoth } = require("./lib/site-artifacts.cjs");

const { llmsTxt, llmsFullTxt, count } = buildLlmsTxt();
writeBoth("llms.txt", llmsTxt);
writeBoth("llms-full.txt", llmsFullTxt);
console.log(`generate-llms-txt: wrote llms.txt (${count} articles) and llms-full.txt.`);
