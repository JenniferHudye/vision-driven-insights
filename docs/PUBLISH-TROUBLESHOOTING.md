# If the Daily Publish Stops Working

## First check: did it actually stop?

GitHub repo -> **Actions** tab -> **Daily Auto-Publish** -> look at the most recent runs.

- **A run happened but landed late (1-3 hours after 6 AM):** normal. GitHub's free scheduler is not exact at busy times. Not a bug.
- **No run happened at all today:** see below.
- **A run happened and shows a red X (failed):** click into it, read the log. The most common causes are below.

## The real alarm: the morning email stops for 2+ days

If the "Your articles are live" email stops arriving for two or more mornings in a row, something upstream broke silently. Check, in order:

1. **Actions tab:** are runs happening at all?
2. **GitHub billing / Actions minutes** (Settings -> Billing, if the repo is private): a private repo that runs out of free Actions minutes stops workflows with no error email. Public repos have unlimited free minutes.
3. **Resend dashboard:** is the API key still valid? Did the sending domain's verification lapse?
4. **The queue:** open `data/blog/queue.json`. Empty queue means nothing to publish. `publish-batch.cjs` is written to fail loudly (exit non-zero, which fires the failure email) if it publishes zero articles, so an empty queue should itself trigger an alert, not silence. If you're not getting even the failure email, the problem is upstream of the script (Actions minutes or Resend).

## Common failure causes

- **Empty queue:** ask Claude Code to "write me 20 more articles."
- **A queued article failed a guard** (banned word, uncited stat, unowned link, under 900 words): it gets quarantined, not published, and logged in the Actions run output. Fix the entry in `queue.json` or ask Claude Code to fix it.
- **RESEND_API_KEY secret missing or expired:** GitHub repo -> Settings -> Secrets and variables -> Actions -> check `RESEND_API_KEY` exists. Get a new key from resend.com if needed.
- **Sender address not verified:** the workflow ships using `onboarding@resend.dev`, which works without verifying a domain. If you switch the `from` address to `noreply@yourdomain.com`, you must first verify that domain inside Resend (Domains -> Add Domain -> add the DNS records shown), or BOTH the daily email and the failure email will silently bounce.
- **Merge conflict in `data/blog/posts.json` or `queue.json`:** if you've hand-edited these files recently, make sure they're valid JSON and pushed before the next scheduled run.

## To manually trigger a run right now

GitHub repo -> Actions -> Daily Auto-Publish -> "Run workflow" button (top right).

## Still stuck

Open Claude Code in this folder and say: "the daily publish stopped, help me figure out why." Paste the Actions log if you have it.
