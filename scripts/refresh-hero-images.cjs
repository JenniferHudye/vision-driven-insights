#!/usr/bin/env node
// Generates a branded SVG hero (1200x675) for every article that lacks one.
// This is the PRIMARY image source, not a fallback: no article ships
// imageless. Strips ?query strings before checking file existence.
const fs = require("fs");
const path = require("path");
const { ROOT, getPosts, getQueue, setPosts, setQueue, getPillars } = require("./lib/site-data.cjs");

const HERO_DIR = path.join(ROOT, "public", "articles", "hero");
fs.mkdirSync(HERO_DIR, { recursive: true });

const pillars = getPillars();

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(title, maxCharsPerLine = 26, maxLines = 4) {
  const words = title.split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > maxCharsPerLine) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines.slice(0, maxLines);
}

function heroSvg(title, brandLabel) {
  const lines = wrapText(title);
  const lineHeight = 66;
  const startY = 675 / 2 - ((lines.length - 1) * lineHeight) / 2 + 10;

  const textLines = lines
    .map(
      (l, i) =>
        `<text x="90" y="${startY + i * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="600" fill="#F5F1EA">${escapeXml(l)}</text>`,
    )
    .join("\n    ");

  return `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#170C1C"/>
      <stop offset="1" stop-color="#0B0710"/>
    </linearGradient>
    <linearGradient id="gem" x1="0" y1="0" x2="150" y2="110" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#E4C878"/>
      <stop offset="0.5" stop-color="#D0AA44"/>
      <stop offset="1" stop-color="#A9832F"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.88" cy="0.12" r="0.55">
      <stop offset="0" stop-color="#4B0082" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#4B0082" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  <text x="90" y="120" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="8" fill="#D0AA44">${escapeXml(brandLabel.toUpperCase())}</text>
  <rect x="90" y="145" width="60" height="3" fill="#D0AA44"/>
  ${textLines}
  <g transform="translate(1000,540)" opacity="0.9">
    <path d="M0 30 L26 0 H94 L120 30 L60 112 Z" stroke="url(#gem)" stroke-width="4" fill="none" stroke-linejoin="round"/>
  </g>
</svg>`;
}

function stripQuery(src) {
  return src.split("?")[0];
}

function ensureHero(entry) {
  const brandLabel = pillars.find((p) => p.slug === entry.pillarSlug)?.brandLabel || "VISION DRIVEN";
  const filename = `${entry.slug}.svg`;
  const filePath = path.join(HERO_DIR, filename);
  const publicSrc = `/articles/hero/${filename}`;

  const existingSrc = entry.featuredImage && entry.featuredImage.src ? stripQuery(entry.featuredImage.src) : null;
  const existingFile = existingSrc ? path.join(ROOT, "public", existingSrc.replace(/^\//, "")) : null;
  const hasRealExisting = existingFile && fs.existsSync(existingFile);

  if (!hasRealExisting) {
    fs.writeFileSync(filePath, heroSvg(entry.title, brandLabel), "utf8");
    entry.featuredImage = {
      src: publicSrc,
      alt: `${entry.title}. Article by Jennifer Hudye of Vision Driven.`,
    };
    return true;
  }
  return false;
}

function main() {
  const posts = getPosts();
  const queue = getQueue();
  let generated = 0;

  for (const entry of posts) if (ensureHero(entry)) generated++;
  for (const entry of queue) if (ensureHero(entry)) generated++;

  setPosts(posts);
  setQueue(queue);

  console.log(`refresh-hero-images: ${generated} hero(es) generated/verified across ${posts.length + queue.length} entries.`);
}

main();
