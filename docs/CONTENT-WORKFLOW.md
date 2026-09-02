# Content Workflow

How new articles get onto the site.

## Option 1: Ask Claude Code (recommended)

Open Claude Code in this project folder and say something like:

> "Write me 20 more articles."

Claude reads `prompts/article-writer.md`, `client-brief.md`, `BUILD-DECISIONS.md`, and `config/voice-profile.md`, writes the articles in Jennifer's voice, and appends them to `data/blog/queue.json`. It then runs the guard scripts (banned words, markdown leakage, internal links, image tags, citations) and fixes anything that fails before telling you it's done.

This runs on your existing Claude subscription. No extra bill.

## Option 2: The queue CLI (no Claude needed)

```bash
npm run queue
```

Walks you through title, pillar, meta description, body, and FAQ, one question at a time. Converts markdown to HTML automatically. Good for a VA who is not using Claude Code.

## How articles go live

New articles land in `data/blog/queue.json`. They do NOT go live immediately. Every morning, the GitHub Actions workflow (`.github/workflows/daily-publish.yml`) runs `scripts/publish-batch.cjs`, which moves the next batch (5 by default) from `queue.json` into `data/blog/posts.json`, the live file, after running every safety check. You get an email when it happens.

To publish something immediately instead of waiting for the daily run, move its entry from `data/blog/queue.json` to `data/blog/posts.json` by hand, add a `publishedDate` (today's date, `YYYY-MM-DD`), run `npm run build` to regenerate images and the sitemap, then commit and push.

## Changing how many publish per day

Open `scripts/publish-batch.cjs`, find `const ARTICLES_PER_RUN = 5;` near the top, change the number, commit, and push. That's the whole change.
