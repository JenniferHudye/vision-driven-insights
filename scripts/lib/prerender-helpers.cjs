// Shared mechanics for every prerender script. Handles stripping the shell's
// og:/twitter:/canonical tags before injecting a page-specific set (exactly
// ONE set per page, hard requirement 1b), escaping attribute values, and
// injecting real body HTML into <div id="root">.
const fs = require("fs");
const path = require("path");

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Underscore-aware, single/double-quote-aware strip of og:/twitter: meta tags
// and the canonical link, so a page never ships two competing tag sets.
function stripPageHead(html) {
  let out = html;
  out = out.replace(/<meta\s+(?:property|name)=["'](?:og|twitter)[a-z_:]*["'][^>]*>\s*/gi, "");
  out = out.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
  out = out.replace(/<title>[\s\S]*?<\/title>/i, "");
  out = out.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "");
  return out;
}

function buildHeadTags({ title, description, canonical, ogImage, extraJsonLd = [] }) {
  const tags = [];
  tags.push(`<title>${escapeAttr(title)}</title>`);
  tags.push(`<meta name="description" content="${escapeAttr(description)}">`);
  tags.push(`<link rel="canonical" href="${escapeAttr(canonical)}">`);
  tags.push(`<meta property="og:type" content="article">`);
  tags.push(`<meta property="og:site_name" content="Vision Driven Insights">`);
  tags.push(`<meta property="og:title" content="${escapeAttr(title)}">`);
  tags.push(`<meta property="og:description" content="${escapeAttr(description)}">`);
  tags.push(`<meta property="og:url" content="${escapeAttr(canonical)}">`);
  tags.push(`<meta property="og:image" content="${escapeAttr(ogImage)}">`);
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  tags.push(`<meta name="twitter:title" content="${escapeAttr(title)}">`);
  tags.push(`<meta name="twitter:description" content="${escapeAttr(description)}">`);
  tags.push(`<meta name="twitter:image" content="${escapeAttr(ogImage)}">`);
  for (const block of extraJsonLd) {
    if (block) tags.push(`<script type="application/ld+json">${JSON.stringify(block)}</script>`);
  }
  return tags.join("\n    ");
}

function injectIntoHead(html, headTagsHtml) {
  return html.replace("</head>", `    ${headTagsHtml}\n  </head>`);
}

function injectIntoRoot(html, bodyHtml) {
  return html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`,
  );
}

function writeRouteFile(distDir, routePath, html) {
  const clean = routePath === "/" ? "/" : routePath.replace(/\/$/, "");
  const outDir = clean === "/" ? distDir : path.join(distDir, clean.replace(/^\//, ""));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
}

module.exports = {
  escapeAttr,
  stripPageHead,
  buildHeadTags,
  injectIntoHead,
  injectIntoRoot,
  writeRouteFile,
};
