// Generates the single branded raster OG/share image (1200x630 PNG) used by
// og:image, twitter:image, and every schema image reference. Run by hand
// whenever the brand look changes: `node scripts/generate-og-image.cjs`.
const path = require("path");
const sharp = require("sharp");
const { ROOT, getSite } = require("./lib/site-data.cjs");

const site = getSite();

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#170C1C"/>
      <stop offset="1" stop-color="#0B0710"/>
    </linearGradient>
    <linearGradient id="gem" x1="0" y1="0" x2="220" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#E4C878"/>
      <stop offset="0.5" stop-color="#D0AA44"/>
      <stop offset="1" stop-color="#A9832F"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0" stop-color="#4B0082" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#4B0082" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(90,90)">
    <path d="M0 40 L35 0 H125 L160 40 L80 150 Z" stroke="url(#gem)" stroke-width="6" fill="none" stroke-linejoin="round"/>
    <path d="M0 40 H160 M35 0 L57 40 L80 150 M125 0 L103 40 L80 150 M57 40 L80 0 L103 40 M80 40 V150" stroke="url(#gem)" stroke-width="4" stroke-linejoin="round"/>
  </g>
  <text x="90" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="10" fill="#D0AA44">VISION DRIVEN</text>
  <text x="90" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="62" font-weight="600" fill="#F5F1EA">Insights</text>
  <text x="90" y="470" font-family="Georgia, 'Times New Roman', serif" font-size="27" fill="#B7A9C4">Jennifer Hudye on building a Vivid Vision</text>
  <rect x="90" y="540" width="70" height="3" fill="#D0AA44"/>
</svg>`;

async function main() {
  const outDir = path.join(ROOT, "public");
  await sharp(Buffer.from(svg)).resize(1200, 630).png().toFile(path.join(outDir, "og-default.png"));
  console.log("Wrote public/og-default.png (1200x630)");
}

main().catch((e) => {
  console.error("generate-og-image failed:", e.message);
  process.exit(1);
});
