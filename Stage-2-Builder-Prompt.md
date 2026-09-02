# Authority AEO/GEO Site Build: Stage 2: Builder

**Paste this entire file as your first message to Claude Code, running in the SAME folder where Stage 1 produced `client-brief.md`.**

---

## Role: for Claude Code

You are Claude Code. The person at this machine is a real estate agent, mortgage lender, service provider, entrepreneur, coach, consultant, or expert. Stage 1 (the intake) ran earlier and produced `client-brief.md` in this folder. That file is your source of truth. Read it first. Build everything that follows from what it says.

Your job in **Stage 2** is to build, deploy, and wire daily auto-publishing for an AEO/GEO/SEO content site. Works on Mac, Windows, or Linux: the deploy and the daily publish run in the cloud.

Use `TaskCreate` (or whatever task-tracking tool is available) to seed a checklist of build phases. Mark each phase complete as you finish it.

---

## What you're building

A production-grade content website for a real estate agent, lender, service provider, entrepreneur, coach, consultant, or expert, engineered around three layers AI uses to decide whether to recommend someone by name. For real estate and lending the articles lean local-market (city, neighborhoods, local process); for everyone else, category authority. Same engine either way. One extra rule for real estate: never rank neighborhoods as "good," "bad," "best," "safe," or "sketchy" (Fair Housing exposure; it can read as steering). Compare on facts instead: schools, commute times, price trends, walkability, amenities.

| Layer | What this build delivers |
|---|---|
| **Recognition** | JSON-LD schema on every page (Person, Organization, Service), `sameAs` links to every social profile in the brief, headshot in Person.image, full credentials in `hasCredential`, Person ↔ Organization linkage, Course schema per program. |
| **Reputation** | Frameworks page surfacing every named methodology from the brief (DefinedTerm schema), Books page (Book schema), POV-led About page (their distinctive stance from the brief), named frameworks woven into every cornerstone article. |
| **Recommendation** | Testimonials page with full attribution (Review schema linking framework → outcome), Case Studies page, Press page, Speaking page (Event schema), Awards page, Trusted-By page, citation list. Two ongoing audit docs (`REPUTATION-AUDIT.md`, `SOCIAL-PROOF-AUDIT.md`) shipped in `docs/` so the person can keep the proof stack current. |

The site is **separate** from the person's main marketing site or CRM funnel. This content site is the front door that brings traffic and AI citations in. Their existing CRM stays the conversion engine.

**Stack:** Vite 6 + React 19 + TypeScript 5 + Tailwind 3 + React Router 7. JSON-as-CMS for blog posts. Schema baked into static HTML via prerender. Daily auto-publish runs in the cloud via GitHub Actions. Site hosted on Vercel.

---

## Hard rules

- **READ `client-brief.md` BEFORE TOUCHING ANY CODE.** If the brief is missing, stop and tell the person to run Stage 1 first. If sections marked `[NEEDS:]` are still unfilled, surface them now and ask the person to fill or accept they'll be skipped.
- **REPUTATION GATE CHECK:** Confirm brief Section 3 has (a) one clean distinctive POV sentence and (b) at least 2 named frameworks with definitions. If either is missing, stop and send them back to Stage 1 to complete that batch. AI doesn't recommend hollow authority sites. The Reputation foundation has to be on paper before the build runs.
- **Do NOT switch the stack.** Stay on Vite + React 19 + TypeScript + Tailwind 3 + React Router 7.
- **Verify every statistic with WebSearch before it goes in any article.** If you can't verify a claim, drop it. Don't soften with "studies show" to launder uncertainty.
- **Schema must validate in Google's Rich Results Test before launch.**
- **Mobile Lighthouse score must be 90+ before declaring done.**
- **Every article must have a featured image AND at least one in-article image, both with proper file naming and alt text.**
- **Daily publish runs via GitHub Actions, not local cron.**
- **You are NOT the person's coach. You are their builder.**
- **YOU do the topic research.** Don't ask "what questions does your audience ask?" That's your job. Use WebSearch, Reddit threads in their niche (use the audience platforms in brief Section 2 as your map), Google "People Also Ask," and direct queries to ChatGPT to find what people in their space are actually asking. The brief's POV and frameworks tell you which questions to lean into.
- **YOU write all the articles.** AI drafts, AI publishes, the person reviews live and requests edits later.
- **Banned words in all generated content:** "leverage," "unlock," "unleash," "navigate" (metaphorical), "robust," "elevate," "delve," "embark," "in today's landscape," "groundbreaking," "It is worth noting," "In conclusion," "transformative," "seamless," "optimize," "utilize," "let's explore," "it's important to note," "the reality is," "here's the truth," "not only X but also Y." Plus any words listed in Section 1 of the brief under "Banned words." Use periods, commas, or "..." instead of em-dashes.
- **The folder you're working in IS the project.** Don't create files outside it.

### AEO/GEO Build Standard: HARD REQUIREMENTS (these prevent bugs the blog shipped 2026-06)

Conform to `AEO-GEO-Build-Standard.md`. Non-negotiable, verify each:

1. **Prerender the article BODY, not just the head.** `prerender-blog.cjs` must inject the full visible article markup (h1, byline, the article body HTML with its in-content links, CTA, FAQ) into `<div id="root">`, NOT only `<title>`/meta/JSON-LD. A React SPA that prerenders head-only ships an empty `<div id="root"></div>` body: invisible to GPTBot/ClaudeBot/PerplexityBot (they don't run JS) and slow/at-risk on Google. **This was the #1 bug.** Verify by fetching a built article and confirming real `<p>`/`<h1>` text inside `<body>` (not ~20 chars). React uses `createRoot` (not hydrate), so the injected static HTML is replaced on mount: humans get the identical SPA, crawlers get real HTML.
1a. **Prerender the STATIC pages too, not just articles.** Build `scripts/prerender-static.cjs`: for the homepage AND every static route (about, frameworks, books, courses, speaking, press, testimonials, case studies, awards, trusted-by, FAQ, privacy, terms), inject real visible body HTML (h1 + descriptive copy + proof + CTA) into `<div id="root">`, sourced from the same data the React components render so the static HTML and the SPA never disagree. **The homepage is the single most important URL: it's what an LLM resolves when someone asks "who's the best [category] expert?" A site with crawlable articles but an empty homepage is invisible exactly where it matters most.** This exact bug shipped on real sites: articles were prerendered, static pages were forgotten. Privacy and Terms are not exceptions.
1b. **Exactly ONE set of og:/twitter:/canonical tags per page.** The prerender steps must STRIP the homepage shell's og:/twitter: tags (and canonical link) before injecting the page-specific set. Duplicate competing tag sets make parsers show the sitewide tagline instead of the page title. Two regex traps that both shipped in production once: the strip/match pattern must include underscores (`[a-z_:]+`, or `og:site_name` slips through and duplicates), and any regex that matches HTML attributes must handle single AND double quotes (`src='x'` bypassed a double-quote-only pattern once). And HTML-escape every meta attribute value (an `escapeAttr` helper), or a quote in a title corrupts the head.
2. **Ship `verify-prerender.cjs` as the LAST build step.** It halts the build if any article body is <1200 chars, any static-route body is <400 chars or missing its h1, or any page is missing h1/article/JSON-LD/og:title, or any page head contains a duplicate of ANY og:/twitter: property (not just og:title; use an underscore-aware pattern). An empty shell must never deploy.
3. **OG image is a raster PNG, never an SVG.** Generate a branded `og-default.png` (1200×630) and point `og:image`/`twitter:image` at it. SVG OG images don't render in social/LLM preview fetchers.
4. **No fabricated stats.** Ship `citation-guard.cjs` (including a fabricated-source check: a stat citing a named source plus a month/year that links to an invented URL must quarantine) wired into the publish path; a stat citing a source with an invented URL must quarantine. Use only WebSearch-verified figures.
5. **Word-count floor.** No article under 900 words publishes; target 1,200-1,500 of real substance, never padding. Wire a word-count gate into the publish path.
6. **metaTitle carries the primary keyword** (keywords[0]), placed naturally toward the front.
7. **No schema points at a 404** (no headshot/logo/image URL unless the file exists).
7a. **No schema image is ever an SVG.** Google Rich Results rejects SVG images in structured data. `BlogPosting.image` and every `ImageObject` used in schema must point at `og-default.png` or another raster (PNG/JPEG/WebP), NEVER at the auto-generated SVG hero, even though the on-page hero itself is an SVG. This exact violation shipped fleet-wide once; do not recreate it.

### Hardening from real failures: MANDATORY (these are the bugs that bit earlier student builds; do not skip any)

These came from sites that shipped broken in exactly the ways a cold build regresses to. Build every one of these in.

8. **Every article gets a hero image, auto-generated: this is the PRIMARY image source, not a fallback.** Do NOT try to source a real stock/AI photo for every article (that path leads to missing images, copyright risk, and broken links). Instead `scripts/refresh-hero-images.cjs` generates a branded SVG hero (1200×675, derived from the brand palette, with the article title set in it) for EVERY article that lacks one, writes it to `public/articles/hero/<slug>.svg`, and updates `data/blog/posts.json` so `featuredImage.src` points at it. No article ever ships imageless. (The person can later swap in their own real photos per `IMAGE-SOURCING-RULE.md`, but the auto hero is the default so the site is never broken.)
9. **Strip query strings before any image file-existence check.** A reference like `hero.svg?v=2` must match the file `hero.svg`. Always compare `url.split("?")[0]`. (This exact bug caused ~25 missing hero images and 404s cached for a year.)
10. **`verify-prerender.cjs` must ALSO confirm referenced images resolve.** Beyond checking the body is non-empty and schema exists, it fetches/stats every `featuredImage.src`, every schema `image`/`logo` URL, and `og-default.png`, and HALTS the build if any returns 404 or is missing on disk. A schema or share tag pointing at a missing image must never deploy.
11. **Content-provenance + ownership guards in the publish path: `scripts/lib/content-guards.cjs`, wired into the publish script BEFORE anything goes live.** This is the guard that earlier student sites lacked, which let them fabricate authority. Three checks, each quarantines (does not publish) on failure:
    - **provenance**: reject any credential, award, designation, certification, ranking ("top 1%", "#1", "award-winning"), or named client that is NOT present in `client-brief.md`. The build must never invent authority the person didn't supply.
    - **no-unowned-link**: reject any link to a domain or social handle that is NOT in the person's brief (Section 6 social URLs + their own domain). This kills the "linked a competitor's video/site" failure. The only links allowed point to the person's own properties, the article's internal pages, or a verified citation source.
    - **citation**: reject any persuasion statistic (a percentage, "N out of M", "N% more/less") that lacks a real, checkable source URL in the SAME paragraph block. See the expanded citation spec below.
12. **Owned-link & video sanitization at publish time.** Even after the guards, normalize every link to one of the person's own channels to the EXACT verified URL from their brief (handles drift and dead-handle typos). A link to a SPECIFIC video or post (`watch?v=`, `youtu.be/`, `/reel/`, `/p/`) is ALWAYS rejected, even when the channel belongs to the person: a single video URL can never be proven owned, so link to the person's own channel page instead. Allow-listed reference domains for citations: `.gov`/`.edu`/`.mil`, and recognized primary sources for the person's field (for real estate: NAR, Census, HUD; plus Wikipedia). (The original failure: topic-matched video search returned other creators' videos and sent traffic to competitors across many articles.)
13. **Citation guard: full spec (don't ship a weak version).** `scripts/citation-guard.cjs` must: (a) split the body into `<p>`/`<li>`/`<h2>`/`<h3>` blocks and require any stat's citation in the SAME block, not paragraphs away; (b) flag research-trigger phrases ("studies show", "according to", "research finds") only when paired with a number; (c) ALLOW hedged language ("in my experience", "roughly", "ballpark", "I've found"); (d) ALLOW the person's own first-party figures stated as theirs (e.g., their own production numbers, years in business); (e) treat the fabrication trap as quarantine: any named source + a specific month/year + a stat must link to that source's REAL domain, never an invented URL; (f) audit FAQ answers separately; (g) exit non-zero so it gates the publish.
14. **Markdown never reaches a page as raw text.** Articles are stored as HTML in `posts.json`. Build `scripts/lib/md-to-html.cjs` (the shared converter) and `scripts/check-post-bodies.cjs` (fails the build if any body still contains `#`, `**`, or `[..](..)` markdown). A body that slipped through as markdown quarantines, it does not render.
15. **Regulated-niche rule.** If the person's niche touches legal, medical, financial, health, or another regulated area, DROP any claim you cannot verify rather than hedging it. "Studies show" is not a citation. When in doubt, cut it.

### Pre-ship verification: run this before you tell the person the site is "done"

Do not say "done", "live", or "ready" until you have personally confirmed ALL of these against the REAL deployed site (not a build log, not "it should work"):

- [ ] Fetch 2-3 live article URLs as a plain HTTP GET. Each `<body>` contains real `<p>`/`<h1>` article text (hundreds of chars), not an empty `<div id="root"></div>` shell.
- [ ] Fetch the live HOMEPAGE, `/about`, `/privacy`, and `/terms` the same way. Each contains real body text and an h1, not an empty shell. (Articles passing while static pages ship empty is a real bug that reached production before.)
- [ ] Each page's head contains exactly ONE og:title (no duplicate tag sets), and no JSON-LD `image` anywhere points at an `.svg`.
- [ ] Every article on the live site shows a hero image that loads (open 3 at random). `og-default.png` returns `200 image/png`.
- [ ] No internal link 404s (the `check-internal-links` gate passed AND you clicked through a few).
- [ ] No raw markdown visible on any page.
- [ ] No credential, award, stat, or link on the site that isn't backed by the brief (provenance + no-unowned-link gates passed).
- [ ] `npm run build` exits 0 with `verify-prerender` (incl. image-resolve check) passing as the last step.
- [ ] The daily-publish test run succeeded and the notification email arrived.

If any box is unchecked, it is NOT done. Fix the cause and re-run.

---

## Tone with the person

Plain English. Friendly but professional. Treat them as a smart business owner who isn't necessarily technical.

**No em dashes, ever:** not in your chat narration and not in anything you write. Use periods, commas, or colons instead.

When you have to use a technical term (DNS, schema, sitemap), give a one-sentence explanation in parentheses the first time.

When you're doing technical work, summarize in plain English. Don't paste raw command output into the chat.

When you need them to do something in a web browser, give step-by-step click-by-click instructions.

**Match their voice when writing articles.** Pull signature phrases from Section 1 of the brief. Apply the banned-words list. The site should sound like them, not like a generic expert blog.

---

## Step 1: Open the build

Send the person this message verbatim:

> Stage 2 starting. I'm reading your client brief now, then I'll run the build in phases. Roughly 1-3 hours total depending on your pillar count and how deep the research goes.
>
> You can hang out and watch each phase complete, or step away and come back. I'll let you know when I hit anything that needs your input (logging into Vercel, adding DNS records, etc.).
>
> Let's go.

Then read `client-brief.md` end-to-end. Confirm in chat that you have:
- Person's full name, business name, category sentence
- Target audience persona + audience platforms
- **Ideal Client (avatar) from Section 2**: life stage, what they're trying to do, pain/fear in their words, objection, what they wish was different
- Distinctive POV (one clean sentence) + at least 2 named frameworks with definitions
- **Pillars from Section 3**: either a buyer-supplied list, or the marker "deferred to Stage 2 research"
- At least 5 testimonials with full attribution (name + situation + framework + outcome)
- Brand colors, logo path, headshot path, owned photos, visual direction, sites they like/dislike, styles to avoid, and first-impression goal
- Conversion URL
- Notification email
- Cadence (default: 30-article launch burst + 5 articles per day, 6 AM local, 7 days/week; owner can change the daily number anytime)
- **Section 0 Pre-Intake Research**: pre-scraped findings from buyer's online presence (bio, podcasts, media features, speaking, books, courses, awards, etc.). Use this throughout the build to pre-populate JSON-LD schema, About page bio, Books page, Speaking page, Press page, Courses page, Awards page.

If any of the above is missing or empty, surface it now. Ask the person to either fill it or confirm Stage 2 should proceed and skip the corresponding section. If POV or frameworks are weak, send them back to Stage 1 Batch 3: don't proceed.

Before writing code, read `Visual-Quality-Gate.md` from this kit folder. Apply it as a delivery gate: the site must look credible, professional, specific to this buyer, and visually intentional, not like a generic AI template. If the brief lacks enough design direction, create a clean professional fallback, but note the gap in `BUILD-DECISIONS.md`.

---

## Phase A: Read brief and verify environment

1. Confirm `client-brief.md` exists in the folder. Read it. Save key values to local memory for the rest of the build.
2. **Reputation gate check.** Brief Section 3 must have one distinct POV sentence + at least 2 named frameworks with full definitions. If either is missing, STOP and send the person back to Stage 1 Batch 3.
3. Surface any `[NEEDS:]` tags from the brief. Resolve each with the person before continuing.
4. Verify Node.js (20+) and Git are available. If missing, install silently or hand them a direct download link.
5. Write `BUILD-DECISIONS.md` capturing the active values from the brief PLUS the pillar research you'll do in Phase B3.
6. Write `CLAUDE.md` at the project root with:
   - One-paragraph project description (pulled from brief Section 1 + 2)
   - Stack reminder (Vite + React + TS + Tailwind, JSON-as-CMS, GitHub Actions cron)
   - Pointer: "If you're a future Claude Code session opening this folder, read `client-brief.md` for ground truth and `BUILD-DECISIONS.md` for the active build state."
   - Banned words list (union of prompt + brief)
   - Voice notes from brief Section 1 (signature phrases)
   - **POV statement from brief Section 3**: every article must echo or extend this stance; never contradict it

---

## Phase B: Scaffold (Vite + React 19 + TypeScript + Tailwind)

7. Initialize the project: `npm create vite@latest . -- --template react-ts`.
8. Install: Tailwind 3, React Router 7, `@vercel/analytics`, `@vercel/speed-insights`, `react-helmet-async`.
9. Initialize `data/blog/posts.json` as `[]` and `data/blog/queue.json` as `[]`.
10. Build `<SEO />` component supporting on-page `title`/`description` AND CTR-optimized `metaTitle`/`metaDescription` as separate fields.
11. Build JSON-LD schema components, rendered into static HTML via prerender:

   **Core schemas (always):**
   - `BlogPostingSchema`: Person author + Organization publisher + datePublished + dateModified + wordCount + keywords + ImageObject
   - `BreadcrumbSchema`
   - `FAQPageSchema`: extracted from each article's FAQ section
   - `PersonSchema`: bio + social `sameAs` URLs from brief Section 6 + headshot + every credential in `hasCredential`. `sameAs` contains ONLY real, verified profile URLs from the brief; a missing profile is omitted, never filled with a placeholder or guessed handle (invalid placeholder `sameAs` URLs shipped in production once).
   - `OrganizationSchema`: their business from brief Section 1
   - `ImageObjectSchema`: every featured image

   **Authority-specific (always, drawing from brief Section 4):**
   - `CourseSchema`: one per course/program/certification listed in Section 4
   - `EventSchema`: one per past speaking engagement that has a public event page

   **Reputation + Recommendation (always, drawing from brief Section 4 + 5):**
   - `BookSchema`: one per book in Section 4
   - `ReviewSchema`: one per testimonial in Section 5, with full attribution and the framework→outcome link
   - `DefinedTerm` schema: one per named framework in Section 3
   - `Article` schema for each case study, with `mainEntityOfPage` linked to the framework used

12. Add Person + Organization JSON-LD to the root `index.html` so it's present on EVERY page (not just blog pages).

13. Build `scripts/generate-sitemap.cjs`, `scripts/generate-llms-txt.cjs`, `scripts/prerender-blog.cjs`, `scripts/prerender-static.cjs` (hard requirement 1a: homepage + every static route gets real body HTML).

14. Wire build chain in `package.json`:
   ```
   "build": "node scripts/check-banned-words.cjs && node scripts/check-post-bodies.cjs && node scripts/check-internal-links.cjs && node scripts/check-image-tags.cjs && vite build && node scripts/inject-watermark.cjs && node scripts/generate-sitemap.cjs && node scripts/generate-llms-txt.cjs && node scripts/prerender-blog.cjs && node scripts/prerender-static.cjs && node scripts/verify-prerender.cjs"
   ```

15. Write `public/robots.txt` with explicit `User-agent` allows for: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `Googlebot`, `DuckDuckBot`, `Bingbot`. One block per agent, then `Sitemap: https://[domain]/sitemap.xml`.

16. Build the guard scripts:
    - `scripts/check-banned-words.cjs`: fails the build if any post body contains a banned word
    - `scripts/check-post-bodies.cjs`: fails the build if any post body still has raw markdown syntax
    - `scripts/check-internal-links.cjs`: fails the build if any post body contains a bare-slug internal link or a link to a non-existent article slug. Valid hrefs: `/articles/<slug>` where slug exists in `posts.json`, static routes (`/`, `/articles`, `/about`, and the pillar landing pages), external URLs, anchors, mailto/tel. (Without this guard, the article writer keeps producing bare-slug links that 404 in production.)
    - `scripts/fix-internal-links.cjs`: one-shot repair: rewrites bare-slug links to `/articles/<slug>` when the target exists, remaps known hallucinated slugs, and unwraps `<a>` tags whose target can't be resolved. Run by hand if `check-internal-links.cjs` ever fails.
    - `scripts/check-image-tags.cjs`: fails the build if any image is missing alt text or ImageObject schema
    - `scripts/lib/md-to-html.cjs`: shared markdown → HTML converter
    - `scripts/refresh-hero-images.cjs`: generates a branded SVG hero for EVERY article (the PRIMARY image source, not a fallback); strips `?query` strings before file-matching; updates `data/blog/posts.json` featuredImage.src so no article is imageless
    - `scripts/lib/content-guards.cjs`: provenance + no-unowned-link + citation guards (Hardening rules 11-13); imported by the publish script and run on every entry before it goes live
    - `scripts/check-voice-fingerprint.cjs`: fails the build if `config/voice-profile.md` is missing the buyer's own name/business, or contains any other business's name. This failure class (a voice file carried over from someone else's build) recurred 3 times on template-derived sites; wire it into the build chain.

17. Write `vercel.json` at the project root with:
    - Framework preset: `vite`
    - Build command: `npm run build`
    - Output directory: `dist`
    - `cleanUrls: true`
    - SPA rewrite rule: `{"source": "/((?!.*\\.).*)", "destination": "/index.html"}`
    - **Security headers on `/(.*)`:** `X-Frame-Options: DENY` (no iframe-embed cloning), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`, `X-Robots-Tag: index, follow, max-image-preview:large`
    - Long-cache headers for `/assets/(.*)` (1 year, immutable; safe because Vite content-hashes these filenames)
    - Static images: `max-age=3600, must-revalidate`, NOT immutable. Hero images get regenerated and swapped at stable URLs; an immutable rule once pinned outdated artwork (and, worse, a cached error page) for a year with no way to clear it.
    - Short-cache headers (1 hour) for `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`
    - 1-day cache for `/robots.txt` and `/license.txt`

17a. **Anti-copy protections** (Phase 1 of the site-protection stack). Every site built from this prompt MUST ship with:
    - `public/robots.txt`: explicit ALLOW list for AI search bots (GPTBot, ClaudeBot, ChatGPT-User, OAI-SearchBot, anthropic-ai, PerplexityBot, Google-Extended) and traditional SEO bots (Googlebot, Bingbot, DuckDuckBot, Applebot, facebookexternalhit, Twitterbot, LinkedInBot). Explicit DENY for known commercial scrapers: `AhrefsBot`, `SemrushBot`, `SemrushBot-SA`, `MJ12bot`, `DotBot`, `rogerbot`, `BLEXBot`, `SerpstatBot`, `ZoominfoBot`, `DataForSeoBot`, `Bytespider`, `ImagesiftBot`, `PetalBot`, `MegaIndex.ru`, `BrandVerity`, `SiteCheckerBotCrawler`, `HTTrack`, `WebReaper`, `WebCopier`, `SiteSnagger`, `ProWebWalker`, `WebStripper`, `Web Image Collector`, `WebSauger`, `Offline Explorer`, `TurnitinBot`, `omgili`, `omgilibot`. Default `User-agent: *` allow at the bottom for polite generic crawlers.
    - `public/license.txt`: full licensing terms with permitted/prohibited uses, DMCA process, designated DMCA agent email, statutory damages reference. Linked from JSON-LD `license` field. Generate it from scratch for this person: fill in their owner name, jurisdiction, and DMCA contact email.
    - `scripts/inject-watermark.cjs`: runs after `vite build`, before `prerender-blog.cjs`. Injects (1) an HTML comment with build SHA + ISO timestamp + DMCA contact email, (2) `<meta name="x-content-fingerprint">` with SHA-256 of the build ID, (3) `<meta name="x-build-id">` with the full pre-image, (4) writes `dist/.well-known/build-manifest.json` with the same data. Every prerendered page inherits the watermark from the template.
    - Strengthened `<Footer />` component with explicit "All rights reserved" plus a fine-print block invoking U.S. copyright law and the DMCA (or the appropriate jurisdiction for non-US buyers).
    - `index.html` `<head>` includes meta tags: `copyright`, `author`, `rights`. A `WebSite`-typed JSON-LD block with `copyrightHolder`, `copyrightYear`, `copyrightNotice`, `license` (pointing at `/license.txt`).
    - Per-article BlogPosting JSON-LD in `scripts/prerender-blog.cjs` includes `copyrightHolder`, `copyrightYear`, `copyrightNotice`, `license`.

18. Write `config/voice-profile.md` from brief Section 1 (signature phrases, bio, tone notes, banned words) AND brief Section 3 (POV statement: every article must echo or extend the POV).

19. Write `prompts/article-writer.md`: a Claude Code prompt template the person or their VA pastes to draft a new article on demand. Bakes in: their pillars, voice profile, named frameworks from brief Section 3, POV statement, banned words, structure requirements, stat verification rule, image strategy, authority-build specifics. **The prompt MUST include an explicit internal-link format rule:** "Article cross-links MUST use `/articles/<slug>` format where slug exists in `data/blog/posts.json`. Pillar landing pages are the only bare-slug links allowed: exact list from `src/App.tsx`. Never invent slugs. `scripts/check-internal-links.cjs` will fail the build if you violate this." This wording is non-negotiable: copy it verbatim into the prompt.

---

## Phase B3: Pillar resolution

**Step 0: branch on the brief.** Open `client-brief.md` Section 3. Look at the "Pillars" line.

**Case A: Buyer supplied pillars.** They listed specific pillars they want (e.g., "Marketing & Branding, Lead Generation, Authority, Sales & Conversion"). Do not propose new ones. Your job is to **validate** each pillar:
- Run WebSearch on the pillar topic in their niche: does the pillar have real search volume?
- Check that each pillar has at least 5 specific question-shaped queries you can support with articles (use Reddit, PAA, ChatGPT for discovery).
- If a pillar has weak signal, surface it in chat: "Pillar X looks thin: I found only 2 specific queries in your niche. Want to keep it, drop it, or merge into [other pillar]?"
- If a pillar is strong, lock it as-is.
- Once all pillars are validated, proceed to Phase C.

**Case B: Buyer deferred to Stage 2 research** (Section 3 Pillars says "deferred to Stage 2 research"). Run the full discovery flow below, propose, lock.

---

### Full discovery flow (Case B only)

**Do NOT ask the person to come up with article topics.** That's your job. The brief gives you POV, frameworks, audience, and platforms: research flows from there.

**Step 1: Research what people in their niche are actually asking right now.**

Use these tools in order:

1. **WebSearch** for "[their category] questions" and "common questions about [their topic]"
2. **WebSearch** Reddit threads on the audience platforms from brief Section 2. Find the most active subreddits for their domain. Pull recent questions.
3. **Google "People Also Ask"** by WebSearch-ing top broad queries in their domain
4. **Direct queries to ChatGPT** via WebSearch: search for what AI is currently saying when asked questions in their niche. Find the gaps where their POV would dominate.
5. **Cross-reference with brief Section 3.** The distinctive POV tells you which questions to lean into and which to skip. Frameworks tell you which queries should become pillar guides.

**Step 2: Synthesize findings into pillars.**

The pillar count for authority builders is **3 to 5**. Pick between 3 and 5: fewer than 3 the site looks thin, more than 5 the AEO signal gets diluted across too many topics. Do not exceed 5.

Common pillar shapes:

- **Named framework pillar**: the person's flagship methodology gets its own pillar. Cornerstone guide defines it publicly. Supporting articles answer questions the framework solves.
- **Audience problem pillar**: the #1 pain their audience shows up with (from brief Section 3).
- **POV / Differentiator pillar**: their contrarian stance gets its own pillar. Articles compare their approach to "what most experts teach."
- **Category thought leadership pillar**: broader thought leadership in their space.
- **Case study / proof pillar**: real client outcomes. Sometimes a pillar, sometimes folded into others.

**Step 3: Propose pillars with evidence in chat:**

> Based on the research I just did in [niche], cross-referenced with your brief, here's what I'd recommend:
>
> **Pillar 1 (anchor): [Named framework from brief]**: your flagship IP. Found N queries in [niche subreddit] asking variants of "how do I [outcome the framework delivers]." Your brief calls this out as your most distinctive asset.
>
> **Pillar 2: [Audience problem from brief]**: top question in [research source] is "[specific finding]" which maps directly to the #1 pain you identified.
>
> **Pillar 3: [POV / Differentiator]**: there's strong PAA volume around "[broader topic]." Your contrarian POV gives you a unique angle here.
>
> **Pillar 4 (if applicable): [Second framework or category leadership]**: for [reason from research].
>
> **Pillar 5 (if applicable): [Case studies / proof]**: for [reason from research].

Then call `AskUserQuestion`:

**Question:** "Lock these pillars in?"

**Options:**
- "Yes, lock them in"
- "Mostly right, but adjust one"
- "Add one more"
- "Take one out"

Iterate in chat until locked. Append locked pillars to `BUILD-DECISIONS.md`.

---

## Phase C: Image strategy

Every article gets at least 2 images: featured + at least 1 in-article. Properly named and alt-texted.

**Featured image (hero):** 1200x675 WebP, file naming `[article-slug]-hero.webp` (slug includes primary keyword), alt text describes image AND includes primary keyword naturally.

**In-article image:** Same convention. 800-1200px wide. Placed after intro and partway through long articles.

**Sources for authority builders (in order of preference, COMMERCIAL-USE SAFE ONLY):**

1. **Branded photos owned by the buyer**: them in context (working, speaking, with clients). Buyer owns the rights.
2. **Event photos from past speaking gigs** (from brief Section 4): only if the buyer has rights or the event organizer's photos are licensed for the buyer's use.
3. **Branded framework diagrams** built in Figma, Canva, or AI-diagramming tools: the buyer's IP, they own it.
4. **Free stock with commercial license (no attribution required):**
   - **Unsplash**: free, no subscription needed, commercial use allowed
   - **Pexels**: free, no subscription needed, commercial use allowed
   - **Pixabay**: free, no subscription needed, commercial use allowed
5. **AI-generated: FREE tools only (no paid plans; use only tools whose FREE tier grants commercial rights), in priority order:**
   - **Google Gemini / Imagen (free): default for AI.** Commercial use allowed on the free tier; Google claims no ownership. Invisible SynthID marker only.
   - **ChatGPT image (free).** OpenAI grants the user ownership + commercial use of created images on every tier including free.
   - **Adobe Firefly (free).** Safest by training (licensed + public-domain only), but the free tier may add a watermark and carries no indemnification: confirm watermark-free before use.

**DO NOT use** (commercial-license issues or restrictions):
- **Midjourney and Ideogram**: commercial rights are gated behind a PAID plan; their free output is not safe to use commercially.
- **Flux**: its "dev" model is non-commercial-only and easy to grab by mistake. Skip it entirely.
- Any image scraped from Google Images, Pinterest, a competitor site, or the open web
- Shutterstock free tier (attribution required, not commercial-safe)
- Getty Images
- Any image whose license you can't verify

**The face/logo/brand screen: run on EVERY image, REJECT if any answer is yes** (unless the buyer owns the asset): recognizable human face (right of publicity); visible logo/brand/branded product; visible artwork/poster/character; famous landmark or recognizable private building. A "free" stock license clears the photo's copyright but NOT the face, brand, or property inside it. Prefer clean workspaces, abstract/lifestyle shots with no identifiable people, and the buyer's own branded diagrams.

**When generating with AI, never prompt for:** a named living artist's style, a real celebrity/public figure/specific person, a copyrighted character, or a real brand's logo.

**The rule:** every image on the buyer's site must be either (a) owned by the buyer, (b) Unsplash/Pexels/Pixabay AND passing the screen above, or (c) AI-generated under a verified commercial-rights tier AND passing the screen. No exceptions. (Full rule: `IMAGE-SOURCING-RULE.md` in this kit folder.)

**Open Graph + Twitter Card meta tags** on every page.

`scripts/refresh-hero-images.cjs` generates a branded SVG hero for every article so none ships imageless (this is the primary image source, not a fallback). `scripts/check-image-tags.cjs` fails the build if any image is missing alt text or ImageObject schema.

---

## Phase D: Seed content (pillar-driven + the Recognition/Reputation/Recommendation pages)

**Total seed expected: 40-50 articles. Hard cap: never more than 50 to start.** Distribute as 1 cornerstone per pillar plus enough supporting to reach the target, never exceeding 50 total. (30 go live at launch; the rest queue for the daily publish.) Writing 40-50 articles is a long generation run: batch it, and if the buyer's Claude subscription hits a usage window mid-run, pause cleanly and tell them exactly when to say "continue writing the seed articles."

### D0: Voice-check gate (HARD GATE before mass generation)

Before writing 40-50 articles in the buyer's voice, write 3 samples and get explicit buyer approval that the voice is right. If the voice is off, fixing it across 30 articles is a disaster. Fixing it across 3 is 10 minutes.

**Write 3 sample articles:**

1. One cornerstone pillar guide (3,000+ words): anchor pillar (preferably framework-based if applicable)
2. One supporting article (1,200-1,800 words): different pillar
3. One framework-definition article ("What is [Your Named Framework]?") OR one question-shaped article ("Questions to ask your [category] before [decision]"): third pillar

These 3 cover different formats so the buyer sees voice across lengths and styles.

Pull voice signals from:
- Section 1 of brief (signature phrases, banned words)
- **Section 0 voice samples extracted from media** (their actual spoken/written voice from podcasts, YouTube videos, keynotes, articles)
- Brief's POV (every article echoes the POV; never contradicts)
- Brief's named frameworks (referenced by name where relevant)

**Drop the 3 articles into chat as visible text** (not just file paths: the buyer needs to read them).

Then ask:

> Voice check. Before I write the rest of your seed articles, I want you to look at 3 samples and tell me if the voice is right. Reading these takes ~10 minutes. If anything is off, I'll fix the voice profile and rewrite these 3 before continuing.
>
> - Does this sound like you?
> - Anything I should change about the tone, cadence, or word choice?
> - Any phrase I'm using that's not how you talk?
> - Anything you'd never say?

**Iterate** in chat until the buyer says "yes, the voice is right." Each round of fixes:
1. Update `config/voice-profile.md` with the adjustment
2. Rewrite the 3 sample articles with the updated profile
3. Re-show

If after 3 attempts you can't get the voice right, STOP and tell the buyer: "I'm not nailing your voice. I need more voice samples. Paste 3-5 paragraphs of your actual recent writing (an email, a sales page, a social caption) and I'll re-calibrate." Don't proceed to D1 until voice is locked.

Once the buyer confirms, the 3 sample articles become the first 3 in the launch burst. Proceed to D1.

### D1: Cornerstone pillar guides (1 per pillar, 3,000+ words)

For each locked pillar:

- Comprehensive guide to that pillar
- If the pillar is framework-based, this guide IS the public definition of that framework
- Links to all supporting articles in that pillar
- FAQ with 10+ questions
- At least 3 images (one of which can be a framework diagram)
- Echoes or extends the POV from brief Section 3: never contradicts it

### D2: Supporting articles (roughly 4-6 per pillar, 1,200-1,800 words each)

For each pillar, generate roughly 7-10 supporting articles answering the actual questions you found in research, adjusting the per-pillar count so the total seed never exceeds 50 (with 5 pillars, hold to ~8 each). Examples to prioritize for AEO (authority flavors):

- "Questions to ask your [category] before [decision]": AEO gold, people literally type this
- "What is [your named framework] and how does it work": defines your IP publicly
- "[Your framework] vs [alternative methodology]": comparison content (AI loves comparison structure)
- "How to [outcome your work delivers]"
- "Case study: how [client name] used [your framework] to [outcome]": proof of practice
- "5 mistakes [your audience] makes when [trying to achieve outcome]"
- "[Year] guide to [your category]" (refresh annually)
- "What every [your audience] should know about [your specialty]"
- "Why most experts in [category] get [problem] wrong": POV-anchored

### D3: Every supporting article includes

- Each targets a specific search query from your research
- Each links back to its pillar cornerstone
- 4-6 FAQ entries
- At least 2 images (1 featured + 1 in-article)
- 3-5 internal links to other articles
- **Internal-link format is HARD:** article cross-links MUST be `/articles/<slug>` where slug exists in `posts.json`. Pillar landing pages (the routes registered in `src/App.tsx`) may be linked bare. Anything else fails the build via `check-internal-links.cjs`. **Never invent slugs.** If a target article doesn't exist yet, link to its pillar landing page or pick a different real article.
- Ends with the CTA from brief Section 6 (conversion URL)

### D4: Every article (cornerstone or supporting)

- title, slug, metaTitle (≤60 chars), metaDescription (≤155 chars)
- publishedDate, modifiedDate
- author (the person's name from brief Section 1)
- category (one of the pillars)
- keywords array (3-5 keywords)
- wordCount, readingMinutes
- 4-6 FAQ entries
- 3-5 internal links
- Featured image + in-article image with alt text
- CTA from brief Section 6

**Verify every statistic with WebSearch.** If you can't verify, drop the stat. Don't soften.

**Total seed expected: 40-50 articles. Hard cap: never more than 50 to start.** AEO works on breadth; the launch burst takes 30 and the rest feed the daily queue.

**Use the avatar from brief Section 2 to shape voice, CTA framing, and proof selection.** Articles should sound like they're talking to that one ideal client: their life stage, their pain phrases, their objections. The CTA at the bottom of each article should answer the objection from the brief. Featured testimonials and case studies on every relevant article should match the avatar's situation when possible.

**Articles auto-publish on schedule by default. They do NOT need pre-approval.** Standing recommendation: ship fast, fix later.

### D-Launch: Split the seed into launch burst + cron queue

Once all seed articles are generated (20-30 in `data/blog/queue.json`):

1. **Move the first 30 articles** from `queue.json` to `posts.json`. These are the launch burst: they go live the moment the site deploys in Phase E.
2. **Pick the 30 strategically:**
   - Every cornerstone pillar guide (1 per pillar)
   - The strongest supporting articles for the anchor pillar
   - The strongest "Questions to ask before [decision]" type articles (AEO gold)
   - At least 1 framework-definition article ("What is [Your Named Framework]?") to define the IP publicly on Day 1
   - Fill the rest with the best supporting articles across pillars
3. **Leave the remaining articles in `queue.json`.** Phase G's GitHub Actions cron will move them to `posts.json` at the cadence from brief Section 8 (default 5/day, owner-adjustable).
4. **Why a launch burst?** A site that ships with 1 article and slowly adds more looks like a slow blog to Google. A site that ships with 30 articles signals an active, established source: Google crawls it more aggressively, AI ingests more, and the indexing flywheel starts on Day 1 instead of Week 3.
5. **Queue runway math (tell the buyer plainly):** at 5/day, a 10-20 article queue lasts 2-4 days. Their choices: top up every few days by opening Claude Code here and saying "write me 25 more articles" (runs on their subscription), lower the cadence to 1-2/day for a longer runway, or add the optional paid autopilot so the site writes its own forever. Their site, their cost, their call.

### D5: The Recognition, Reputation, Recommendation pages (built once at launch)

These pages are what make the brief's proof stack legible to AI. Every page gets its appropriate schema.

| Page | Source in brief | Schema |
|---|---|---|
| **About** | Section 1 + 3: leads with **distinctive POV** (the contrarian stance from Section 3), then story, then credentials. NOT a resume. A thesis. | `Person` with full `hasCredential` |
| **Frameworks** | Section 3: every named methodology with name, one-sentence definition, principle. Surface names and principles publicly; withhold operational specifics. This is your IP catalog made public. AI loves citing named frameworks. | `DefinedTerm` per framework |
| **Books** | Section 4: every book with cover image, title, year, where to buy | `Book` per book |
| **Courses / Programs** | Section 4: every course, program, certification offered. Name, who it's for, what it covers, pricing if surfaced, link. | `Course` per offering |
| **Speaking** | Section 4: every past speaking engagement with event name, date, topic, link to event page if still live. One of the highest-weight Recommendation signals for authority builders. | `Event` per engagement |
| **Press / Featured In** | Section 5: every media feature, podcast, conference talk, citation with source name, date, link | none required, but include source URLs |
| **Testimonials / Reviews** | Section 5: strongest testimonials with full attribution: client name + situation + framework used + measurable outcome | `Review` per testimonial, linked to the framework's `DefinedTerm` |
| **Case Studies** | Section 5: long-form versions of strongest client stories | `Article` per case study, with `mainEntityOfPage` linked to the framework used |
| **Awards / Recognitions** | Section 5: every formal recognition, certification, designation, "Top X under Y" list | included in `Person.hasCredential` |
| **Trusted By** | Section 5: notable clients or partners with permission. Brand logos or names. If confidentiality limits public names, show categories ("3 Fortune 500 sales leaders, names redacted"). | none required |
| **Citations** | Section 5: anywhere their work or framework has been cited in a book, article, podcast, or study | none required, but include source URLs |
| **FAQ** | Section 6: the most-asked + wish-asked questions become a site-wide FAQ page | `FAQPage` |
| **Privacy + Terms** | Generated for this buyer (name, business, jurisdiction). Privacy MUST include a "Cookies and tracking" section (the site runs GA4/Clarity), and IF any form on the site collects phone numbers, an SMS/TCPA consent section. Both pages prerender like every other route (hard requirement 1a). | none required |

---

## Phase E: Deploy to Vercel

20. Verify the GitHub repo exists, the folder is connected to it, and the build code is committed and pushed.
21. Install Vercel CLI. Run `vercel`, walk through the login flow in their browser. Framework = Vite, build command = `npm run build`, output = `dist/`. Connect to GitHub repo so commits auto-deploy.
22. In Vercel dashboard, add the custom domain (from brief Section 7). Click-by-click.
23. Walk through DNS in their browser:
    - **Cloudflare subdomain:** `CNAME [subdomain] -> cname.vercel-dns.com` with Proxy "DNS only" (gray cloud)
    - **Cloudflare apex domain:** `A @ 76.76.21.21` and `AAAA @ 2606:4700:10::6816:1515`, plus `CNAME www -> [project].vercel.app`
    - **Subdomain elsewhere:** `CNAME [subdomain] -> cname.vercel-dns.com`
24. Wait for SSL provisioning (auto, 1-5 minutes).
24a. **Main-website cross-link (if brief Section 6 has a main website URL).** The buyer's main site might be one they already own, or one being built for them by someone else. Either way:
    - Add a clearly visible link to the main website in this site's nav and footer ("Main Site" / "Work With Me", pointing at the conversion path).
    - Confirm the identity block on THIS site (full name, business name, city and state, phone, and the one-sentence identity line) matches the main website character for character. Exact match is how AI connects the two sites as one person. If they differ, show the buyer both versions and fix this site to match the canonical one.
    - Write `docs/MAIN-SITE-CROSS-LINK.md`: a short instruction sheet the buyer forwards to whoever runs their main website. It asks for three things: (1) a nav + footer link to this blog (suggest the label "Local Guides" or "Articles"), (2) the same identity block character for character, (3) the DNS record for the blog subdomain if not already added. Keep it under one page, plain English.
24b. **Two Vercel traps that both burned real launches, check them now:**
    - **Deployment Protection:** new Vercel projects can ship with a login wall enabled. Fetch the live site with a plain no-auth GET; if you get a 302 to vercel.com/login instead of the page, walk the buyer through Vercel dashboard → project → Settings → Deployment Protection → disable for production. A "successfully deployed" site behind this wall is invisible to every visitor and every crawler.
    - **Verify the PUBLIC URL, never the deployment-hash URL.** URLs like `project-abc123-team.vercel.app` are auth-walled; always test and record `https://[project-name].vercel.app` or the custom domain.
25. Run Lighthouse on home + one article. **Mobile must score 90+.**

---

## Phase F: Verify Google Search Console + analytics

26. Walk to https://search.google.com/search-console.
27. "Add property" → Domain or URL prefix.
28. Verify via DNS TXT record. Walk through adding it.
29. Submit sitemap: `https://[domain]/sitemap.xml`.
30. URL Inspection: request indexing on home + 5 article URLs.
31. Confirm "Sitemap submitted - Success."

**GA4:** install `gtag` in `index.html` using the measurement ID from brief Section 7. Verify Real-Time shows pageview when they visit live site.

**Microsoft Clarity (DEFAULT-ON: install for every build):** free Microsoft tool for session recording, heatmaps, scroll depth, dead-click detection, rage-click detection, and JavaScript error tracking. Lightweight script (negligible page load impact), GDPR/CCPA compliant, no PII collected. Walk the buyer through signing up at clarity.microsoft.com, creating a project for their domain, copying the tracking script, and installing it in `index.html` alongside the GA4 gtag. Verify session recording works by visiting the live site and checking that a session appears in the Clarity dashboard within a few minutes. Buyer can disable later if they don't want it, but it ships ON by default. Reasoning: GA4 tells the buyer HOW MANY people read each article; Clarity shows HOW they behaved. Both together give the buyer real diagnostic power when something looks off post-launch.

**Vercel Analytics + Speed Insights:** enable in Vercel dashboard.

---

## Phase G: Daily publishing via GitHub Actions

32. Build `scripts/publish-batch.cjs` (also known as `auto-publish.cjs`): reads `data/blog/queue.json`, validates each entry (required fields, no banned phrases, no em-dashes, no leaked markdown via `md-to-html.cjs`) and runs `content-guards.cjs` (provenance + no-unowned-link + citation) plus the 900-word floor gate, **moves the first 5 passing entries** to `data/blog/posts.json`, runs `git add` / `git commit` / `git push`. **The script is APPEND-ONLY on `posts.json`: it must never modify, reorder, or delete an existing published article, it must reject duplicate slugs, and it must refuse to run (exit non-zero) if applying the batch would shrink the published count or change any existing slug's content hash.** Two more publish-script rules from real incidents: (a) **stamp `publishedDate` at publish time**, when the entry moves from queue to posts, never at generation time (generation-dated articles made a whole site's content look stale on arrival); (b) **a run that publishes ZERO articles (queue empty or everything quarantined) must exit non-zero** so the failure email fires. A zero-publish day silently reported as success once masked three straight days of missed publishing. Writes published URLs to `/tmp/published-urls.txt` for the email. Quarantines failing entries. (The daily count lives in ONE place: `const ARTICLES_PER_RUN = 5;` near the top of this script, with a comment right above it: "Your daily article count. Lower or raise it anytime, then commit and push. 5 is the default; less is fine." Tell the buyer this exists and that changing it is theirs to do, no permission needed.)

33. Build `scripts/queue-article.cjs`: interactive Node CLI for the person or their VA to add a new article. Validates: title length, metaDescription ≤155 chars, FAQ has 4+ entries, body format (HTML, not raw markdown). Writes to `data/blog/queue.json`.

34. Create `.github/workflows/daily-publish.yml`:

    ```yaml
    name: Daily Auto-Publish

    on:
      schedule:
        - cron: '0 [UTC_HOUR] * * *'  # 7 days a week by default
      workflow_dispatch:

    jobs:
      publish:
        runs-on: ubuntu-latest
        permissions:
          contents: write
        steps:
          - uses: actions/checkout@v4
            with:
              token: ${{ secrets.GITHUB_TOKEN }}
          - uses: actions/setup-node@v4
            with:
              node-version: '20'
          - run: npm ci
          - name: Run publish
            run: node scripts/publish-batch.cjs
          - name: Commit and push
            run: |
              git config user.name "github-actions[bot]"
              git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
              git add data/blog/posts.json data/blog/queue.json public/sitemap.xml public/llms.txt public/llms-full.txt
              if git diff --staged --quiet; then
                echo "No changes to commit"
              else
                git commit -m "Auto-publish: $(date +%Y-%m-%d)"
                git push
              fi
          - name: Send daily article email
            if: success()
            run: |
              URLS=$(cat /tmp/published-urls.txt 2>/dev/null || echo "")
              if [ -n "$URLS" ]; then
                LINKS=$(echo "$URLS" | awk '{print "<li><a href=\"" $0 "\">" $0 "</a> - <a href=\"https://search.google.com/search-console/inspect?resource_id=https://[domain]/&id=" $0 "\">request indexing</a></li>"}' | tr '\n' ' ')
                BODY="<p>Your articles are live today. For each one, click the request indexing link to ask Google to crawl it faster (takes 30 seconds total):</p><ul>${LINKS}</ul>"
                curl -X POST https://api.resend.com/emails \
                  -H "Authorization: Bearer ${{ secrets.RESEND_API_KEY }}" \
                  -H "Content-Type: application/json" \
                  -d "{\"from\":\"noreply@[domain]\",\"to\":\"[email]\",\"subject\":\"Your articles are live - request indexing\",\"html\":\"${BODY}\"}"
              fi
          - name: Send failure email
            if: failure()
            run: |
              curl -X POST https://api.resend.com/emails \
                -H "Authorization: Bearer ${{ secrets.RESEND_API_KEY }}" \
                -H "Content-Type: application/json" \
                -d '{"from":"noreply@[domain]","to":"[email]","subject":"Daily publish failed","html":"Check the GitHub Actions log."}'
    ```

    Replace `[UTC_HOUR]` with the publish hour from brief Section 8 converted to UTC. `[domain]` and `[email]` from brief Section 7.

35. Sign up for Resend (free tier: 100 emails/day). Get API key. Add as `RESEND_API_KEY` GitHub Secret. Walk through this in GitHub web UI. **Sender-address gotcha (do not skip):** Resend will not send from `noreply@[their domain]` until the domain is verified inside Resend (Domains → Add Domain → add the DNS records it shows). Either walk the buyer through verifying their domain now, or set the workflow's `from` address to `onboarding@resend.dev` (works unverified) and leave a note in `docs/PUBLISH-TROUBLESHOOTING.md` to switch to their own domain after verifying. An unverified sender makes BOTH the daily email and the failure email silently bounce, which is the worst failure mode: broken and invisible.

36. Test the workflow via "Run workflow" button. Confirm success and that the email arrives.

37. Tell the person:
    - "Your publish runs in the cloud now. Your computer can be off. Your laptop can be closed. Your site updates itself."
    - "Tomorrow morning at 6 AM your time, your first article goes live and you'll get an email."
    - "Peek at runs anytime: GitHub repo → Actions tab → Daily Auto-Publish."
    - "To pause publishing: click the workflow there, click ⋯, click Disable workflow."
    - "One expectation to set: GitHub's scheduler often runs 1-3 hours late at busy times. Your 6 AM publish landing at 8 AM is normal, not broken."
    - "And the absence signal that matters: if the morning email STOPS arriving for 2+ days, something upstream stopped silently. First check: Actions tab (did runs happen?), then GitHub billing/spending limits if the repo is private (exhausted free minutes stop workflows with no error email). This exact silent-stop happened in production; the missing morning email is your alarm."

---

## Phase H: Team documentation

38. `README.md`: project overview.
39. `docs/CONTENT-WORKFLOW.md`: how to queue a new article via Claude Code (`prompts/article-writer.md`) or via the queue script.
40. `docs/SEO-CHECKLIST.md`: per-article checklist.
41. `docs/IMAGE-GUIDE.md`: naming, alt text rules, sources, dimensions.
42. `docs/MONTHLY-REVIEW.md`: what to check in GSC monthly.
43. `docs/AI-SURFACING-CHECK.md`: how to check whether they appear in AI answers. Quarterly: run queries like "best [their category] expert" or "how do I [outcome they deliver]" through ChatGPT, Perplexity, Claude, Gemini. Document whether they appear, what context, what's missing.
44. `docs/PUBLISH-TROUBLESHOOTING.md`: what to do if the daily publish fails.
45. `docs/DAILY-INDEXING-RITUAL.md`: the 30-second daily task. After each "Your articles are live" email:
    1. Open the email
    2. For each article URL, click the "request indexing" link: opens GSC URL Inspection pre-filled
    3. Click "Request indexing" in GSC
    4. Repeat for each article (GSC limits roughly 10/day per property)

    Doing this every day is the single biggest free ranking accelerator.

46. `docs/REPUTATION-AUDIT.md`: a quarterly self-audit checklist for the Reputation layer. Questions: Are all named frameworks still on the Frameworks page? Have any new podcasts, articles, speaking engagements been added since last quarter? Is the distinctive POV on the About page still accurate? Are case studies linking framework → outcome? Walks them through running ChatGPT/Claude/Perplexity queries on their name and screenshotting the answers for a baseline.

47. `docs/SOCIAL-PROOF-AUDIT.md`: a quarterly self-audit checklist for the Recommendation layer. Questions: Are all testimonials surfaced with full attribution? Are awards and certifications current on the Awards page? Have any new media features, podcasts, or citations been earned since last quarter? Is the Trusted-By page current? Are the same top 5 proof points showing up consistently on the site AND on LinkedIn AND on every other place they're active?

---

## Phase I: Validation gates (do not say "done" until ALL pass)

**Content gates:**
- `posts.json` contains the full launch burst (30 published articles) and every seed article passed the guards; a build that reaches launch with zero or few articles is a FAILED build, not a quiet success (a zero-article build once passed as green)
- Every seed article returns 200 on the live domain
- About, Frameworks, Books, Courses, Speaking, Press, Testimonials, Case Studies, Awards, Trusted-By, FAQ pages all return 200
- Each blog article has 1 featured image with proper file naming, alt text, ImageObject schema
- Each blog article has at least 1 in-article image
- Open Graph image tags present (test in Facebook/LinkedIn debugger)

**Schema gates (Google Rich Results Test):**
- BlogPosting + FAQPage + BreadcrumbList pass on every blog article
- Person schema passes on About page with all credentials in `hasCredential`
- Organization schema passes
- Book schema passes on Books page
- Course schema passes on Courses page
- Event schema passes on Speaking page
- Review schema passes on Testimonials page with framework→outcome linkage
- DefinedTerm schema passes on Frameworks page
- ImageObject schema present on every featured image

**Infrastructure gates:**
- Every static route (home, about, all authority pages, privacy, terms) serves real prerendered body HTML on a plain GET, per hard requirement 1a
- No page head carries duplicate og:/twitter: sets; no schema image is an SVG
- `sitemap.xml` lists every page
- `llms.txt` is generated and lists every article
- `robots.txt` allows the AI bots
- GA4 Real-Time shows live traffic
- Clarity shows a session recording (if installed)
- GSC shows sitemap "Success"
- Lighthouse mobile 90+ on home + one article
- No console errors

**Build-time gates (exit code 0):**
- `scripts/check-banned-words.cjs`
- `scripts/check-post-bodies.cjs`
- `scripts/check-image-tags.cjs`

**Publish gates:**
- GitHub Actions workflow enabled
- Test run succeeded
- Daily email arrived with article URLs + indexing links
- `content-guards.cjs` (provenance + no-unowned-link + citation) is required by `publish-batch.cjs` and actually runs (confirm by grepping the require and reading the test-run log)
- The 900-word floor gate runs in the publish path
- The voice-profile fingerprint check passes (see Configuration gates)

**Configuration gates:**
- `client-brief.md` exists in the folder
- `BUILD-DECISIONS.md` exists with locked pillars
- `CLAUDE.md` exists at project root
- `vercel.json` exists at project root
- `config/voice-profile.md` exists, reflects the brief POV, and passes the fingerprint check: it contains THIS buyer's name/business and NO other business's name (this failure recurred 3 times on template-derived sites; the check is cheap, run it)
- `prompts/article-writer.md` exists

**Documentation gates:**
- All 10 files in `docs/` exist (CONTENT-WORKFLOW, SEO-CHECKLIST, IMAGE-GUIDE, MONTHLY-REVIEW, AI-SURFACING-CHECK, PUBLISH-TROUBLESHOOTING, DAILY-INDEXING-RITUAL, REPUTATION-AUDIT, SOCIAL-PROOF-AUDIT)

**If any check fails, fix it before reporting done.**

---

## Phase J: Post-launch monitoring playbook

**Week 1:** GSC daily for crawl errors. Confirm 3+ articles indexed. Run AI surfacing baseline using `docs/AI-SURFACING-CHECK.md`.

**Weeks 2-4:** GSC weekly. Watch for first impressions.

**Month 1 review:** impressions, clicks, CTR, position, top 20 queries. Re-run AI surfacing check.

**Quarterly:** refresh stale stats. Re-run AI surfacing check. Add new articles based on emerging queries. Add new Press, Speaking, Case Studies entries. Run `docs/REPUTATION-AUDIT.md` and `docs/SOCIAL-PROOF-AUDIT.md`. Check images still load.

**Annually:** re-verify year-specific stats. Refresh evergreen pillars. Update Person schema if credentials changed. Refresh About page POV if it's evolved.

---

## Final handoff

When all gates pass, send in chat:

> Your site is live, verified in Google Search Console, and on a daily cloud-based publish schedule.
>
> **Today: 30 articles are already live.** They shipped with the deploy. Open `https://[domain]/blog` and you'll see them. This is your launch burst: it signals to Google and AI that the site is active and gets indexing started immediately.
>
> **Tomorrow at 6 AM your local time:** The cron takes over. **5 more articles publish per day from here**, 7 days a week. You'll get an email each morning with the new URLs and one-click "request indexing" links. This is YOUR throttle: you can drop to 1-2 a day (or raise it) anytime, it's one number in your publish script, just ask me and I'll change it. And skim what publishes under your name, the morning email makes that quick.
>
> **What happens next (being straight with you about what's promised and what isn't):** your site is fully crawlable by Google and by AI systems, that part is verified and done. Indexing usually begins within days, and AI systems typically start picking up content over the following weeks, but nobody can promise rankings, traffic, leads, or AI recommendations on a schedule, and you should distrust anyone who does. What compounds your odds: the daily indexing ritual, consistent publishing, and keeping your proof pages current. The quarterly check in `docs/AI-SURFACING-CHECK.md` is how you measure whether it's working.
>
> **30-day checkpoint:** Review GSC data using `docs/MONTHLY-REVIEW.md`. Run the AI surfacing check in `docs/AI-SURFACING-CHECK.md`.
>
> **Quarterly:** Run `docs/REPUTATION-AUDIT.md` and `docs/SOCIAL-PROOF-AUDIT.md`. These are your two self-audit checklists for keeping the Recognition / Reputation / Recommendation layers current.
>
> **Five things to do this week:**
>
> 1. Skim the seed articles I wrote and tell me if anything's off. They're already live. If you want edits, just tell me. No pre-approval needed.
> 2. Set up the daily indexing ritual. Every morning when you get the "Your articles are live" email, click the indexing link for each article. Takes 30 seconds. Full how-to in `docs/DAILY-INDEXING-RITUAL.md`.
> 3. Bookmark your GSC, Vercel, and Clarity (if applicable) dashboards. Monthly review uses these.
> 4. Pick one case study and publish it as a Case Study page. Real, named, with the outcome documented. AI weighs case studies with measurable outcomes far higher than generic testimonials.
> 5. Read `docs/REPUTATION-AUDIT.md` and `docs/SOCIAL-PROOF-AUDIT.md`. These are the two ongoing audits that keep your AI recommendation strength compounding.
>
> **If the daily publish ever stops working:** GitHub repo → Actions → Daily Auto-Publish → check the most recent run. Or open Claude Code in this folder and say "publish failed, help me figure out why."

---

## What to ask if anything is unclear

If at any point the person asks a question you don't know the answer to, STOP and ask. Don't guess.

If a Phase I validation gate fails, troubleshoot. Don't skip.

If the person gets frustrated or overwhelmed, slow down. Tell them what just happened. Tell them what's next. Ask if they want to pause.

The point isn't to ship fast. The point is to ship a site that gets cited by AI when people ask about their category, and stays online without breaking for years.
