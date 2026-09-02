# AEO/GEO Build Standard: the non-negotiable checklist for your site

> This is the single source of truth for what a correct AEO/GEO site must do. The builder prompt conforms to it. The guardrails below make the most common failures impossible to ship.

---

## The root lesson

This site is a React single-page app (SPA). The HTML a browser shows *after* JavaScript runs is NOT the HTML a crawler or an LLM fetches. **Google's two-wave rendering is slow and unreliable; GPTBot / ClaudeBot / PerplexityBot mostly don't run JavaScript at all.** So everything that must be seen, body text, schema, share tags, has to be in the *static* prerendered HTML, not just the React render. Every requirement below is downstream of that one fact.

---

## Requirements (every site must pass all of these)

### 1. Every route ships full crawlable HTML: the #1 rule (articles AND static pages)
The prerender step must inject the **real visible body content** into `<div id="root">` for EVERY route, not just `<head>` tags. An empty `<div id="root"></div>` body = invisible to LLMs and slow/at-risk on Google.
- **Articles:** the actual article body (h1, byline, body with its in-content links, CTA, FAQ).
- **Homepage + every static page** (about, services/cities, FAQ, testimonials, contact, privacy, terms): h1, real descriptive copy, service-area list, proof, CTA, sourced from the same config/data the React components render, so the static HTML and the SPA never say different things. **The homepage is the single most important URL: it's what an LLM resolves when someone asks "who's the best [profession] in [city]?" A site with crawlable articles but an empty homepage is invisible exactly where it matters most.** Privacy and Terms are not exceptions: they get the same treatment as every other route.
- **Verify:** fetch a live article, the live homepage, and `/privacy` and `/terms` as Googlebot/GPTBot; every body must contain real `<p>`/`<h1>` text, not ~20 chars or an empty shell.
- **Guardrail:** `scripts/verify-prerender.cjs` runs LAST in the build and HALTS it if any article body is < 1200 chars, any static-route body is < 400 chars, or any checked page is missing h1/JSON-LD/og:title.

### 2. Open Graph + Twitter tags in the static head
`og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `twitter:card/title/description/image` injected into prerendered HTML (not just react-helmet client-side).
- **Share image:** a real raster `og-default.png` (1200×630, brand palette). NEVER point `og:image` at an SVG (most platforms + LLM fetchers won't render it).
- **Exactly ONE set per page.** The prerender step must STRIP the homepage shell's og:/twitter: tags (and canonical link) before injecting the page-specific set. Duplicate competing tag sets make parsers show the sitewide tagline instead of the page title.
- **Escape every meta attribute value** (an `escapeAttr` helper), or a quote in a title corrupts the head.
- **Verify:** live article head contains exactly one og:title and 6 `og:` + 4 `twitter:` tags total; `og-default.png` returns `200 image/png`; the homepage carries og:image too.

### 3. Structured data, crawler-visible
Per article: `BlogPosting` + `FAQPage` + `BreadcrumbList` baked into the static head. Sitewide: `Person` + `Organization` + `WebSite` with stable `@id` cross-refs and `sameAs`. Each named methodology gets a `DefinedTerm` node so LLMs cite it as a defined entity.
- Person carries `award` + `hasCredential`; prerendered `BlogPosting` includes `author.url`.
- **No schema points at a 404** (no headshot/logo URL unless the file exists).
- **No schema image is ever an SVG.** Google Rich Results rejects SVG images in structured data. `BlogPosting.image` and every schema `ImageObject` must point at `og-default.png` or another raster (PNG/JPEG/WebP), never at the auto-generated SVG hero, even though the on-page hero is an SVG.
- **Verify:** every JSON-LD block parses; referenced image URLs resolve; no schema image URL ends in `.svg`.

### 4. No fabricated stats, ever
Auto-published articles run a citation guard before publish. It flags uncited stats AND catches the high-risk fabrication pattern: a stat citing a specific named source plus a month/year (e.g., "[Source]'s May 2026 data showed…") that links to an invented URL.
- **Guardrail:** `scripts/citation-guard.cjs` gates the publish path. A flagged article quarantines, does not publish.
- Use only verified figures. Cite a real, checkable source URL in the same paragraph, or cut the stat.

### 5. No thin content
Floor of 900 words per article; target 1,200-1,500 of real substance (never padding).
- **Guardrail:** a word-count gate in the publish path quarantines any new article under 900 words.

### 6. metaTitle carries the primary keyword
The generator must place `keywords[0]` in the metaTitle, naturally, toward the front (without making it read badly). It's the strongest on-page ranking lever.

### 7. Internal links live in the body
Articles weave 5+ in-content links to sibling articles + pillar pages, in `post.body`, so they survive prerender. (Requirement #1 covers the prerender part.)

### 8. SPA rewrite must NOT catch asset paths (cache-poison guard)
`vercel.json`'s SPA fallback must be `"source": "/((?!.*\\.).*)"`, only extensionless routes rewrite to `/index.html`. NEVER use `"/(.*)"`. Reason: with the catch-all, a request to a `.png`/`.xml` asset BEFORE it finishes deploying hits the SPA fallback, gets `index.html` back, and the `.png` `immutable` cache-control rule pins that wrong HTML for a year. With the exclusion, a missing asset 404s cleanly and is never cached as immutable HTML.

### 9. Copyright-safe images only
Per `IMAGE-SOURCING-RULE.md` in this kit, approved sources only, face/logo/brand screen on every image. Already embedded in the builder prompt; keep it.

### 10. Publishing cadence
Your site launches with 30 articles, then publishes 5 new articles per day at 6 AM local time, 7 days per week, by default. Because you own the site and pay its costs, the daily number is yours to change anytime: it lives in one constant (`ARTICLES_PER_RUN`) in the publish script. Doing less is fine; the build must tell you plainly how to change it.

### 11. Every article has an auto-generated hero, and every referenced image resolves
A branded SVG hero is auto-generated for EVERY article (the primary image source, not a fallback), so no article ships imageless. Strip `?query` strings before any image file-existence check (`url.split("?")[0]`), or references like `hero.svg?v=2` silently miss the file `hero.svg`. `verify-prerender.cjs` must confirm every `featuredImage.src`, every schema `image`/`logo` URL, and `og-default.png` actually resolve (200), and halt the build if any 404s. This is what prevents the "missing pictures" failure.

### 12. Content provenance and link ownership
The publish path runs `scripts/lib/content-guards.cjs` before anything goes live. It quarantines (does not publish): any credential, award, ranking, or named client NOT present in the brief (provenance); any link to a domain or social handle NOT in the brief (no-unowned-link, which also kills the "linked a competitor's video" failure); any persuasion stat without a real source URL in the same block (citation). A YouTube link pointing at a specific video (`watch?v=`) or a specific post/reel on any social platform is ALWAYS rejected, even if the channel itself is owned: a single video/post can never be proven "owned." The build must never invent authority the person didn't supply, and never link off to anyone but the person's own properties or a verified citation source.

### 13. No raw markdown reaches a page
Articles are stored as HTML. `scripts/lib/md-to-html.cjs` converts, `scripts/check-post-bodies.cjs` fails the build if any body still contains markdown syntax. A body that slipped through as markdown quarantines.

### 14. Voice-profile fingerprint: your site, your voice file only
`config/voice-profile.md` must contain YOUR name or business, and must contain NONE of: a different business's name, or Krista Mashore's / 925Move's identifiers. If you started from a template or a prior draft, this is the file most likely to still carry someone else's name: check it by hand before launch even if the automated check passes.
- **Guardrail:** a fingerprint check runs in the build chain and confirms `voice-profile.md` names you and nobody else.
- **Verify:** open `config/voice-profile.md` and confirm every name in it is yours.

---

## The guardrails that must travel with every site

A site isn't "to standard" until these are present and wired:

1. **`verify-prerender.cjs`**: final build step; halts the build on any empty/short article OR static-route shell (homepage, privacy, terms, etc.) AND any image URL that 404s.
2. **`citation-guard.cjs`**: gates the publish path; quarantines fabricated/uncited stats.
3. **`content-guards.cjs`** (provenance + no-unowned-link + citation): gates the publish path; quarantines fabricated authority and unowned links.
4. **`refresh-hero-images.cjs`**: auto-generates a branded hero for every article so none ships imageless.
5. **Word-count gate** in the publish path: quarantines sub-900-word articles.
6. **Voice-profile fingerprint check**: confirms `config/voice-profile.md` names you and nobody else.

If a site lacks any of these, it is not done.

---

## Verify-it-worked checklist (run before you call the build done)
- [ ] Live article fetched as a plain GET shows real body text (not ~20 chars / empty shell)
- [ ] Live HOMEPAGE, `/privacy`, and `/terms` fetched as a plain GET show real body text, not an empty root div
- [ ] Exactly one og:title per page head; no schema image URL ends in `.svg`
- [ ] 6 og: + 4 twitter: tags in static head; og-default.png is 200 image/png
- [ ] Every article's hero image loads; all JSON-LD parses; no 404 image refs anywhere
- [ ] No raw markdown visible on any live page
- [ ] No credential, award, stat, or outbound link on the site that isn't backed by the brief
- [ ] No link to a specific YouTube video or social post anywhere (channel links only, and only your own)
- [ ] `config/voice-profile.md` names only you, no other business or Krista Mashore/925Move
- [ ] `npm run build` passes incl. `verify-prerender` (with image-resolve check)
- [ ] citation-guard + content-guards + word-count gate present in the publish path
