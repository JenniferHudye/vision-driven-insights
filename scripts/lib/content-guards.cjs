// Content provenance + link ownership + citation guards.
// Wired into scripts/publish-batch.cjs. Any failure quarantines the entry
// (it does not publish). See AEO-GEO-Build-Standard.md requirement 12.
const { getSite, getTestimonials, getCaseStudies, getTrustedBy, getAwards, getFrameworks } = require("./site-data.cjs");

const RANKING_PHRASES = [
  "award-winning",
  "#1",
  "number one",
  "top 1%",
  "industry-leading",
  "world-renowned",
  "voted best",
  "best-selling",
  "certified",
];

const RESEARCH_TRIGGERS = /\b(studies show|according to|research finds|research shows|data shows|a study found)\b/i;
const STAT_PATTERN = /(\d{1,3}(\.\d+)?\s?%|\b\d+\s+out\s+of\s+\d+\b|\b\d+x\b)/i;
const HEDGE_PATTERN = /\b(in my experience|roughly|ballpark|i've found|i have found|about \d)\b/i;

const ALLOWED_REFERENCE_SUFFIXES = [".gov", ".edu", ".mil", "wikipedia.org"];

function buildAllowedClaims() {
  const site = getSite();
  const claims = new Set();
  claims.add("550+");
  claims.add("550");
  for (const t of getTestimonials()) {
    if (t.name) claims.add(t.name.toLowerCase());
    if (t.company) claims.add(t.company.toLowerCase());
  }
  for (const c of getCaseStudies()) {
    claims.add(c.client.toLowerCase());
    claims.add(c.company.toLowerCase());
  }
  const trustedBy = getTrustedBy();
  for (const n of trustedBy.names || []) claims.add(n.toLowerCase());
  const awards = getAwards();
  for (const c of awards.credentials || []) claims.add(c.toLowerCase());
  for (const f of getFrameworks()) claims.add(f.name.toLowerCase());
  claims.add(site.person.name.toLowerCase());
  claims.add(site.organization.name.toLowerCase());
  return claims;
}

function buildAllowedDomains() {
  const site = getSite();
  const domains = new Set();
  const add = (url) => {
    try {
      domains.add(new URL(url).hostname.replace(/^www\./, ""));
    } catch {
      /* ignore */
    }
  };
  add(site.url);
  add(site.mainWebsite);
  add(site.conversionUrl);
  for (const s of site.organization.sameAs || []) add(s);
  for (const s of site.person.sameAs || []) add(s);
  domains.add("linkedin.com");
  return domains;
}

function extractLinks(html) {
  const links = [];
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) links.push(m[1]);
  return links;
}

function extractBlocks(html) {
  const re = /<(p|li|h2|h3)[^>]*>[\s\S]*?<\/\1>/gi;
  return html.match(re) || [];
}

/** Provenance guard: flags ranking/award language not backed by the brief. */
function checkProvenance(body) {
  const allowed = buildAllowedClaims();
  const violations = [];
  const lower = body.toLowerCase();
  for (const phrase of RANKING_PHRASES) {
    if (lower.includes(phrase)) {
      const backed = [...allowed].some((c) => lower.includes(c));
      if (!backed) violations.push(`Unbacked ranking/award phrase: "${phrase}"`);
    }
  }
  return violations;
}

/** No-unowned-link guard: every link must point at an owned domain, or be a
 * verified citation-safe domain, and never a single video/post URL. */
function checkNoUnownedLink(body) {
  const allowedDomains = buildAllowedDomains();
  const violations = [];
  const links = extractLinks(body);

  for (const href of links) {
    if (href.startsWith("/") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }
    let url;
    try {
      url = new URL(href);
    } catch {
      violations.push(`Unparseable link: ${href}`);
      continue;
    }
    const host = url.hostname.replace(/^www\./, "");

    // A single video/post URL is never provably owned, even on an owned channel.
    if (/watch\?v=|youtu\.be\/|\/reel\/|\/p\/[A-Za-z0-9_-]+\/?$|\/status\//.test(href)) {
      violations.push(`Link to a specific video/post is not allowed: ${href}`);
      continue;
    }

    const isOwned = allowedDomains.has(host);
    const isReferenceSafe =
      ALLOWED_REFERENCE_SUFFIXES.some((suf) => host.endsWith(suf)) || [...allowedDomains].includes(host);

    if (!isOwned && !isReferenceSafe) {
      violations.push(`Link to unverified domain: ${host} (${href})`);
    }
  }
  return violations;
}

/** Citation guard: any stat must have a real source link in the same block. */
function checkCitation(body) {
  const violations = [];
  const blocks = extractBlocks(body);
  for (const block of blocks) {
    const hasStat = STAT_PATTERN.test(block);
    const hasTrigger = RESEARCH_TRIGGERS.test(block);
    if (!hasStat && !hasTrigger) continue;
    if (HEDGE_PATTERN.test(block)) continue; // hedged first-person language is allowed
    const links = extractLinks(block);
    const hasRealLink = links.some((href) => /^https?:\/\//.test(href));
    if (!hasRealLink) {
      violations.push(`Stat or research claim without a same-block source link: "${block.slice(0, 120)}..."`);
    }
  }
  return violations;
}

function runGuards(entry) {
  const body = entry.body || "";
  const violations = [
    ...checkProvenance(body).map((v) => ({ guard: "provenance", detail: v })),
    ...checkNoUnownedLink(body).map((v) => ({ guard: "no-unowned-link", detail: v })),
    ...checkCitation(body).map((v) => ({ guard: "citation", detail: v })),
  ];
  if (entry.faq) {
    for (const f of entry.faq) {
      const faqViolations = checkCitation(`<p>${f.a}</p>`);
      violations.push(...faqViolations.map((v) => ({ guard: "citation-faq", detail: v })));
    }
  }
  return { pass: violations.length === 0, violations };
}

module.exports = { runGuards, checkProvenance, checkNoUnownedLink, checkCitation };
