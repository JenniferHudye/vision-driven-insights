#!/usr/bin/env node
// Runs after `vite build`, before the prerender scripts. Injects a build
// fingerprint (HTML comment + meta tags) into the built shell so every
// prerendered page inherits it, and writes dist/.well-known/build-manifest.json.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { ROOT, getSite } = require("./lib/site-data.cjs");

const DIST = path.join(ROOT, "dist");

function main() {
  const site = getSite();
  const shellPath = path.join(DIST, "index.html");
  if (!fs.existsSync(shellPath)) {
    console.error("inject-watermark: dist/index.html not found. Run `vite build` first.");
    process.exit(1);
  }

  const timestamp = new Date().toISOString();
  const buildSha = crypto.createHash("sha256").update(`${site.domain}-${timestamp}`).digest("hex").slice(0, 12);
  const preimage = `${site.copyrightHolder}|${site.domain}|${timestamp}|${buildSha}`;
  const fingerprint = crypto.createHash("sha256").update(preimage).digest("hex");

  let html = fs.readFileSync(shellPath, "utf8");
  const comment = `<!-- Build ${buildSha} | ${timestamp} | Copyright ${site.copyrightHolder} | DMCA: ${site.dmcaEmail} -->`;
  const metaTags = [
    `<meta name="x-content-fingerprint" content="${fingerprint}">`,
    `<meta name="x-build-id" content="${buildSha}">`,
  ].join("\n    ");

  html = html.replace("</head>", `    ${metaTags}\n  </head>`);
  html = html.replace("<body>", `<body>\n  ${comment}`);
  fs.writeFileSync(shellPath, html, "utf8");

  const manifestDir = path.join(DIST, ".well-known");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(
    path.join(manifestDir, "build-manifest.json"),
    JSON.stringify({ buildSha, timestamp, copyrightHolder: site.copyrightHolder, dmcaEmail: site.dmcaEmail, fingerprint }, null, 2),
    "utf8",
  );

  console.log(`inject-watermark: build ${buildSha} stamped at ${timestamp}.`);
}

main();
