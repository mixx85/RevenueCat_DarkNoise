# SubInsights — RevenueCat Weekly Growth Memo Generator

> Built as part of RevenueCat's Agentic AI Developer & Growth Advocate take-home assessment.  
> 🤖 Built by **Tupac** (AI agent), operated by Michael Ersh.

---

## What It Does

Turns RevenueCat Charts API data into a **weekly growth memo** — verdict, findings, actions — in 30 seconds.

**Not a dashboard. A structured signal.**

> "Dashboards hand you ingredients. You still have to cook."

---

## Links

| | |
|---|---|
| 🚀 **Live demo** | https://subinsights-pi.vercel.app |
| 📹 **Video walkthrough** | https://github.com/mixx85/RevenueCat-DarkNoise/releases/download/v1.0/subinsights_demo.mov |
| 📝 **Blog post** | https://dev.to/sun_shine_b5a139aeabf1255/i-built-a-weekly-growth-memo-generator-on-revenuecat-charts-api-2poc |
| 🐦 **X/Twitter** | https://x.com/4designLab/status/2040397688299049340 |

---

## Stack

- **Next.js 14** (App Router, static generation, ISR)
- **Recharts** (custom charts, no Tremor)
- **GPT-4o-mini** (memo generation, rule-based fallback)
- **Vercel** (free tier, encrypted env vars)
- **RevenueCat Charts API v2**

---

## How It Works

```
Build time:
  fetchBaseline()       → overview + revenue + churn + trial (4 RC API calls)
  fetchMRRForPeriod()   × 4 periods (4 RC API calls)
  generateMemo()        → GPT-4o-mini structured prompt
  → Static HTML, all periods embedded

Runtime:
  User visits → instant load from CDN
  Period switch → useState, zero API calls
  ISR revalidation → every 1 hour
```

**Security:** `RC_API_KEY` never in client bundle. Zero `NEXT_PUBLIC_` secrets. Vercel encrypted env vars.

---

## Run Locally

```bash
git clone https://github.com/mixx85/RevenueCat-DarkNoise
cd RevenueCat-DarkNoise
npm install
cp .env.example .env.local
# Add your RC_API_KEY and RC_PROJECT_ID to .env.local
npm run dev
```

Open `http://localhost:3000`. Your first weekly memo in under 5 seconds.

---

## API Gotchas

**`trial_conversion_rate` measure indices:**
- measure[0] = Trial Starts
- measure[1] = Conversions
- measure[2] = Expirations ← NOT "new paid subs"
- measure[3] = Pending
- measure[4] = Conversion Rate %

**`incomplete: true`** flag — filter out before computing WoW deltas or you get artificially low numbers.

**Rate limit: 15 req/min** — solved by pre-fetching all periods at build time, not per user request.

---

## Docs

| File | Description |
|------|-------------|
| [`docs/SUBMISSION.md`](docs/SUBMISSION.md) | Full submission — all deliverables, links, requirements |
| [`docs/PROCESS_LOG.md`](docs/PROCESS_LOG.md) | How we built it — phases, decisions, agent team |
| [`docs/TECHNICAL_SPEC.md`](docs/TECHNICAL_SPEC.md) | Reverse-engineered technical spec |
| [`docs/BLOG_DRAFT.md`](docs/BLOG_DRAFT.md) | Blog post source |
| [`docs/SOCIAL_POSTS.md`](docs/SOCIAL_POSTS.md) | All social posts |

---

## Agent Team

- **Tupac** — main operator, orchestrator, product decisions, code review, acceptance
- **Vasya** — fullstack developer (implementation)
- **Kolya** — researcher, market analysis, competitor review
- **Konj Joe 2027** — GTM operator, growth campaign, $100 budget strategy
- **Nora** — media creator, blog post storytelling, social posts
- **Oleg** — diagnostics, architecture audit, API integration review

---

*🤖 Disclosure: Built by Tupac, an AI agent operated by Michael Ersh.*
