# BUILD-DECISIONS.md

Active build state for the Vision Driven Insights authority site. Source of truth for content is `client-brief.md`. This file is the active build config.

_Last updated: 2026-09-01_

## Identity

- **Person:** Jennifer Hudye
- **Business:** Vision Driven (legal: Vision Driven LLC; alt: Vision Driven Global)
- **Category:** Vision and messaging expert who helps 7- and 8-figure entrepreneurs and CEOs clarify a 3-year Vivid Vision for their business and life, then turn it into a 90-day plan they will actually follow.
- **Business type:** A (expert-led)
- **Scale figure (site-wide):** 550+ companies guided through the Vivid Vision process (Jennifer-confirmed 2026-09-01)

## POV (every article must echo or extend this, never contradict it)

Most planning either fixes your business or your personal life, but rarely both at once, and that is exactly why it never sticks. When you fuse personal clarity and business strategy into one vision, every decision starts moving you toward the life AND the business you actually want.

## Named frameworks (see `data/frameworks.json`)

1. Vivid Vision
2. The Vision Driven Method (was "Vision Driven OS" in early drafts; renamed per Jennifer 2026-09-02)
3. The Vivid Vision Method: Vivid Vision Clarity, the Vivid Vision Expander, Powerfully Articulate Your Vision, Vision Alive Imagery, the Vivid Vision Rollout (stage names from Jennifer's "(External) VIP Vivid Vision Journey" deck). The design deliverable is the "Vivid Vision Blueprint", never "Vivid Vision Board".
4. The Golden Jail Cell vs. The Golden Compass
5. The Big Life Stages of Entrepreneurship
6. Vision Amplifier

## Pillars (LOCKED 2026-09-01, Case A: buyer-supplied via "Vision Driven Content Pillars SOP", validated for search demand, public names approved by Jennifer)

| # | Public title | Brand label | Slug | Primary keyword | Search validation |
|---|---|---|---|---|---|
| 1 | Clarify Your Vivid Vision | CLARIFY | `clarify-your-vivid-vision` | vivid vision | Strong. Cameron Herold book ecosystem, "13-point checklist," multiple active guides. |
| 2 | Turn Your Vision Into a Plan | CREATE | `turn-your-vision-into-a-plan` | quarterly planning for entrepreneurs | Strong. Quarterly planning, rocks, operating rhythm, planning-calendar content is an active category. |
| 3 | Become the Vision-Driven Entrepreneur | CONNECT | `become-the-vision-driven-entrepreneur` | founder impostor syndrome | Strong. "Founder impostor syndrome," identity-mismatch, 75%-of-founders content is active. |
| 4 | Business and Life, Integrated | LIFESTYLE | `business-and-life-integrated` | work life integration for entrepreneurs | Strong. Work-life integration vs balance, founder burnout, family-business content is active; Inc/EO framing matches Jennifer's POV. |

Pillar 5 ("TBD" in the SOP) was intentionally dropped for now at Jennifer's direction (2026-09-01). Revisit later as Vision-Driven Leadership, Money/Wealth, or Legacy.

## Article plan (COMPLETE as of 2026-09-02)

- Total seed: 44. 4 cornerstone guides (1,300 to 3,200 words) + 40 supporting (roughly 600 to 1,100 words, tight and unpadded).
- Cornerstones: `how-to-write-a-vivid-vision`, `turn-your-vision-into-a-90-day-plan`, `the-vision-driven-entrepreneur`, `build-a-business-that-funds-your-life`.
- Launch burst: 30 in `data/blog/posts.json` (publishedDate spread 2026-08-06 to 09-02 so the site reads as established). 14 in `data/blog/queue.json` for the daily cron.
- `WORD_FLOOR` in `scripts/publish-batch.cjs` lowered from 900 to 600. Rationale: the seed is deliberately a set of focused supporting articles plus deep cornerstones; the build standard also says "never padding." Raise back toward 900 if future top-ups are written longer.
- Cadence: 5/day at 6 AM local, 7 days/week (owner-adjustable via `ARTICLES_PER_RUN` in `scripts/publish-batch.cjs`).
- Known optimization: the SPA bundle is ~548 KB because all 30 published article bodies are imported into the client. AEO is unaffected (prerendered HTML is lean). Code-split `ArticleDetail` if Lighthouse mobile drops below 90.

## Brand and design

- **Look:** dark (Jennifer-confirmed). Near-black / deep-plum background, warm off-white text, gold primary accent, indigo secondary.
- **Palette:** gold `#D0AA44`, indigo `#4B0082`, deep plum `#270626`, near-black `#0B0710`, white `#FFFFFF` (from Vision Driven Brand Style Guide v2).
- **Fonts:** Futura is the brand font but is not free for web. Using **Jost** (Google Fonts) as the heading/body substitute (close geometric sans), and **Tangerine** as a stand-in for the Eyesome Script accent. Swap to licensed Futura web fonts if Jennifer provides them. Recorded as a gap.
- **Logo:** Vision Driven gold gem + wordmark. PNG on hand (`Vision Driven logos.png`). Needs copying into `public/assets/`. SVG preferred if available.
- **Headshot:** only asset on hand is `Jennifer Hyude New Sig.png` (email-signature graphic: purple background, circular crop, script overlay). Usable small. A clean high-res headshot is a gap.
- **First impression goal:** credible, expansive, premium. A founder should feel "this person has done this hundreds of times and can see where I am trying to go."

## Conversion

- **CTA URL (site-wide):** https://vividvisionconsult.com/ (Jennifer-confirmed). A Vision Driven LLC property with a "Schedule Your Vivid Vision Consult" call to action.
- **CTA label:** "Book a Vivid Vision Consult"
- **Main website (cross-link):** https://www.visiondrivenglobal.com

## Infrastructure (pending Jennifer)

- **Domain:** CONFIRMED and LIVE 2026-09-23. `insights.visiondrivenglobal.com`, a free subdomain of Jennifer's owned domain, DNS at GoDaddy (single `A insights 76.76.21.21` record), attached in Vercel, SSL issued. No nameserver change, her main site and email were untouched.
- **Jurisdiction:** placeholder Texas (Austin base, from research, unconfirmed). Affects Privacy/Terms governing law.
- **Timezone:** America/Chicago assumed. Cron publish hour 11:00 UTC (6 AM Central). Adjust in `.github/workflows/daily-publish.yml` if wrong.
- **GitHub:** account not yet created (Jennifer has Git Bash locally only).
- **Vercel / Google Search Console / Resend / GA4 / Microsoft Clarity:** not yet set up. Phase E onward.
- **Notification email:** jennifer@visiondrivenglobal.com

## Gaps carried from client-brief.md

Clean high-res headshot; licensed Futura web fonts; exact social URLs (Instagram/YouTube/Facebook/X/Pinterest); media/press dates and links; speaking years and links; any book/e-book authored by Jennifer; YouTube channel URL + subscriber count; newsletter; more testimonials; hard numbers for case studies; domain; jurisdiction confirmation; all deploy accounts.

## Stack notes

- Vite 6 + React 19 + TypeScript 5 + Tailwind 3 + React Router 7. JSON-as-CMS. Prerender to static HTML. GitHub Actions daily publish. Vercel host.
- `react-helmet-async` was removed (no React 19 peer support). Head management for the SPA is a small custom `useDocumentHead` hook; crawler-facing head + body come from the prerender scripts, which is what matters for AEO.
