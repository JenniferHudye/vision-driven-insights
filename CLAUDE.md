# CLAUDE.md

## What this is

An AEO/GEO authority content site for **Jennifer Hudye**, founder of **Vision Driven**. Jennifer is a vision and messaging expert who helps 7- and 8-figure entrepreneurs and CEOs clarify a 3-year Vivid Vision for their business and life, then turn it into a 90-day plan they will actually follow. The site is engineered so AI systems (ChatGPT, Claude, Perplexity, Gemini) recognize her, understand what she stands for, and recommend her by name when founders ask how to build a company vision or how to stop being the bottleneck in their own business. It is separate from her main site (visiondrivenglobal.com) and her consult funnel (vividvisionconsult.com), which stay the conversion engines.

## If you are a future Claude Code session opening this folder

- Read `client-brief.md` for ground truth about Jennifer, her audience, her frameworks, and her proof.
- Read `BUILD-DECISIONS.md` for the active build state: locked pillars, article plan, brand config, and open gaps.
- Content lives as JSON in `data/` and `data/blog/`. The React app reads it; the prerender scripts in `scripts/` read the same files.
- Node needs a PATH prefix on this machine (see `BUILD-DECISIONS.md` stack notes).

## Stack

Vite 6 + React 19 + TypeScript 5 + Tailwind 3 + React Router 7. JSON-as-CMS for articles (`data/blog/posts.json` live, `data/blog/queue.json` scheduled). Schema baked into static HTML by the prerender scripts. Daily auto-publish via GitHub Actions cron. Hosted on Vercel.

Do not switch the stack.

## Voice (see `config/voice-profile.md` for the full profile)

Write like Jennifer talks. Plain English at a 5th to 6th grade reading level. Moderately informal, enthusiastic, authoritative, playful. Lots of metaphors and word-pictures. One sentence per paragraph unless stacking short fragments on purpose. Use ellipses to trail a thought. Lead into a statement with a question. End sentences on the strongest word. Explain any jargon the first time it appears.

Sign-off when relevant: "Hold the vision."

## POV (every article must echo or extend this, never contradict it)

Most planning either fixes your business or your personal life, but rarely both at once, and that is exactly why it never sticks. When you fuse personal clarity and business strategy into one vision, every decision starts moving you toward the life AND the business you actually want.

## Banned words and constructions (union of the build standard + Jennifer's Voice/Tone Guide)

**Never use:** leverage, unlock, unleash, navigate (metaphorical), robust, elevate, delve, delved, embark, embarked, "in today's landscape", groundbreaking, "it is worth noting", "in conclusion", transformative, seamless, optimize, utilize, "let's explore", "it's important to note", "the reality is", "here's the truth", "not only X but also Y", invaluable, relentless, endeavour, enlightening, insights, esteemed, "shed light", "deep understanding", crucial, resonate, enhance, expertise, offerings, valuable, intricate, tapestry, foster, systemic, inherent, "treasure trove", testament, peril, landscape, pertinent, synergy, explore, underscores, empower, amplify, adhere, folks, pivotal, cognizant, conceptualize, complexity, recognize, adapt, promote, critique, comprehensive, implications, complementary, perspectives, holistic, discern, multifaceted, nuanced, underpinnings, cultivate, integral, profound, facilitate, encompass, elucidate, unravel, paramount, characterized, significant.

**Never use these constructions:** em dashes (use periods, commas, or "..."), "Not just X, but Y", "It's not X, it's Y", emojis (unless explicitly asked), hype, fake urgency or scarcity, TED-Talk-profound phrasing.

**Spelling:** American.

## Signature phrases (use naturally, do not overuse)

"Hold the vision, not the circumstances." / "Now is the new later." / "The life and business you actually want." / "Zone of genius." / "The Golden Jail Cell." / "Clarity doesn't cost you time. Lack of it does."

## Named frameworks (reference by name where relevant, define on first use)

Vivid Vision, The Vision Driven Method, The Vivid Vision Method, The Golden Jail Cell vs. The Golden Compass, The Big Life Stages of Entrepreneurship, Vision Amplifier. Full definitions in `data/frameworks.json`.

## Internal link rule (hard)

Article cross-links MUST use `/articles/<slug>` where the slug exists in `data/blog/posts.json`. Pillar landing pages (routes in `src/App.tsx`) are the only bare-path links allowed. Never invent slugs. `scripts/check-internal-links.cjs` fails the build on violations.
