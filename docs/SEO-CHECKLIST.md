# Per-Article SEO Checklist

Before an article is considered ready (Claude Code checks this automatically when writing, but here it is for a human review):

- [ ] `title` is clear and specific, not generic
- [ ] `metaTitle` is 60 characters or fewer and puts the primary keyword near the front
- [ ] `metaDescription` is 155 characters or fewer and makes someone want to click
- [ ] Body is real HTML (no raw markdown symbols visible)
- [ ] 900 words minimum, 1,200 to 1,800 is the real target for a supporting article, 3,000+ for a cornerstone guide
- [ ] Every stat has a real, checkable source link in the same paragraph, or it is Jennifer's own hedged first-party figure
- [ ] 3 to 5 internal links to other real articles or pillar pages, using `/articles/<slug>` format
- [ ] 4 to 6 FAQ entries
- [ ] Featured image present with descriptive alt text
- [ ] Echoes or extends Jennifer's POV, never contradicts it
- [ ] No banned words (see `config/banned-words.json`), no em dashes
- [ ] Assigned to exactly one pillar in `data/pillars.json`

All of this is enforced by the build guard scripts (`npm run build` runs them). A failing check blocks the build.
