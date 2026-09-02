# What This Costs & What Accounts You'll Need

Straight answer, no fine print.

---

## The recurring cost: basically nothing

The **default build** (the "queue model") is designed to cost almost nothing to keep running:

| Piece | What it does | Cost |
|---|---|---|
| **Your Claude subscription** | Builds the site and writes your articles | You already pay for it, no extra |
| **Vercel** | Hosts your live site | **Free** tier is plenty |
| **GitHub** | Stores your site + runs the daily auto-publish | **Free** |
| **GitHub Actions** | The automation that publishes your daily articles | **Free** (well within free limits) |
| **Resend** | Emails you each morning when articles go live | **Free** tier (100 emails/day) |
| **Google Search Console** | Tracks your Google indexing | **Free** |
| **Microsoft Clarity** (optional) | Shows how visitors behave on your site | **Free** |

**The only thing you might pay for: a domain name.** If you don't already own one, expect roughly **$12-20/year**. If you already have a domain, you'll just use a subdomain of it (like `insights.yourdomain.com`) for free.

So: **~$0/month to run, plus maybe $12-20/year for a domain.**

---

## How the "queue model" keeps it free

Here's the trick that makes it cost nothing:

- During the build, Claude writes you **40-50 articles at once** (this runs on your Claude subscription, no separate bill).
- 30 go live the day your site launches. The rest sit in a queue.
- A **free** automation publishes **5 per day** from that queue, automatically, every morning. That number is yours: drop it to 1-2 a day or raise it anytime, it's one number in one file and Claude will change it for you if you ask.
- At 5 a day the queue runs low every few days: open Claude Code in your site folder and say **"write me 25 more articles."** Claude writes them on your existing subscription, and the cycle continues. Prefer fewer top-ups? Lower the daily number, or add the optional autopilot below.

You're never charged per article. The site keeps publishing as long as you top up the queue every few weeks.

---

## Optional paid upgrade: "full autopilot"

If you'd rather the site write **brand-new articles forever on its own**, no topping up the queue, ever, there's an optional upgrade in `OPTIONAL-Full-Autopilot-Upgrade.md`. That one uses a separate "API key" that bills you per use, so it *does* have a real monthly cost that scales with how many articles you publish. It's genuinely optional. **Skip it unless you specifically want hands-off-forever and don't mind a monthly bill.** Most people are happy with the free queue model.

---

## The accounts you'll create (all free)

Claude walks you through each one *when it's needed* during the build, you don't have to set anything up in advance. For reference, here's the full list:

1. **GitHub** (github.com), stores your site and runs the daily publish. Free.
2. **Vercel** (vercel.com), hosts the live site. Free. Sign in with your GitHub account.
3. **Google Search Console** (search.google.com/search-console), tracks indexing. Free.
4. **Resend** (resend.com), sends your morning "articles are live" email. Free tier.
5. **Microsoft Clarity** (clarity.microsoft.com), optional visitor analytics. Free.
6. **A domain**, either one you already own (you'll use a subdomain), or a new one (~$12-20/year).

You'll also use the **Claude desktop app** (Claude Code) you're already in, and optionally a **ChatGPT** account if you build your brain with the Brain Builder GPT.

That's the whole picture. No hidden costs, no platform that locks you in. You own all of it.
