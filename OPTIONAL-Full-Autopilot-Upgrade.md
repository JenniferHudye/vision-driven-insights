# OPTIONAL, Full Autopilot Upgrade

> Skip this unless you specifically want your site to write **brand-new articles forever, completely on its own**, and you're fine with a real monthly bill. Most people are perfectly happy with the free queue model. You can also add this later, anytime.

---

## What the default does vs. what this adds

**Default (queue model, free):** Claude writes a batch of articles during the build. A free automation publishes them over the following weeks. When the queue runs low, you say "write me 20 more" in Claude Code. Cost: ~$0/month.

**This upgrade (full autopilot, paid):** A cloud automation calls the Claude **API** every day, writes fresh articles from scratch (researches a real question, drafts it, runs the same quality and citation guards), drops them in your queue, and publishes them. You never top up the queue again. Cost: a real monthly bill that scales with how much you publish.

The difference is the **API key**. The free model runs on your normal Claude subscription. Autopilot runs in the cloud on its own schedule, so it needs an API key, and an API key bills you per use.

---

## The honest cost picture

API usage is billed per word in and out, so your bill depends on three things:
- **How many articles per day** you publish
- **How long** each article is
- **Which model** writes them (stronger models cost more per word)

It can range from modest at a few articles a day to a few hundred dollars a month at high volume with a top model. The exact number is genuinely hard to predict in advance, so **don't predict it. Cap it.**

**Set a hard monthly spending limit in the Anthropic Console (`console.anthropic.com` → Billing → Limits) before you turn this on.** That cap is your safety net: the autopilot can never spend more than you allow, no matter what. Start with a low cap (say $25-50), watch the first month's real usage, and raise it only if you want more volume. Check your actual spend anytime in the console.

---

## How to set it up

When you're ready, open Claude Code in your site folder and paste this:

```
I want to add the optional "full autopilot" article writer to this site, following
OPTIONAL-Full-Autopilot-Upgrade.md. Walk me through it step by step:
1. Help me create an Anthropic API key and SET A HARD MONTHLY SPENDING CAP first.
2. Add the key as a GitHub repository secret (ANTHROPIC_API_KEY).
3. Build a daily "article writer" script that calls the Claude API to research one
   real question my audience is asking, draft a 1,200-1,500 word article in my voice
   (pull voice + POV + frameworks from config/voice-profile.md and client-brief.md),
   and add it to data/blog/queue.json.
4. Run it through the SAME guards the build already uses: banned words, the citation
   guard (no fabricated stats), the word-count floor, and the internal-link format rule.
5. Wire it into a new GitHub Actions workflow that runs each morning BEFORE the existing
   daily-publish step, so fresh articles are written and then published the same day.
6. Test it once with "Run workflow," show me the article it produced, and confirm the
   guards caught anything bad before we trust it.
Start by helping me create the API key and set the spending cap.
```

Claude will build it the same way it built the rest of the site, and verify it works before you rely on it.

---

## How to turn it off

If you ever want to stop the autopilot and go back to the free queue model:
- GitHub repo → **Actions** tab → open the autopilot workflow → **⋯** → **Disable workflow.**
- Optionally delete the API key in the Anthropic Console so it can never bill again.

Your site keeps running on the free daily-publish either way. Nothing breaks.
