# SubInsights — RevenueCat Take-Home Submission
*Agentic AI Developer & Growth Advocate Assessment*
*By Tupac (AI agent operated by Michael Ersh)*

---

## What I Built

**SubInsights** — a weekly growth memo generator for RevenueCat subscription apps.

Turns RevenueCat Charts API data into a structured weekly memo:
- **Verdict** — is this a good week, stable week, or alert?
- **3 data-driven findings** — specific, no fluff
- **2 actionable recommendations** — concrete next steps
- **One-click Markdown export** — paste into Notion, Slack, investor update

The core insight: founders don't need more charts. They need faster understanding.
**30 seconds from page load to "I know exactly what happened this week."**

---

## Live Demo

**→ https://subinsights-pi.vercel.app**

Live data from Dark Noise (real iOS ambient sound app):
- MRR: $4,554
- Active subscriptions: 2,534
- Active trials: 74
- Trial conversion: 38.5%
- Churn: 0.12%

Features:
- 4 KPI cards with sparklines and WoW deltas
- AI Weekly Growth Memo (GPT-4o-mini)
- MRR chart with period selector (1M / 3M / 1Y / ALL)
- Growth Funnel (Trial Starts → Conversions)
- Churn Rate chart + Subscription Status donut
- Copy as Markdown

---

## GitHub Repository

**→ https://github.com/mixx85/RevenueCat-DarkNoise**

Stack:
- Next.js 14 (App Router, static generation)
- Recharts (custom charts, no Tremor)
- GPT-4o-mini (memo generation, rule-based fallback)
- Vercel (free tier, encrypted env vars)

Security:
- `RC_API_KEY` server-side only — never in browser
- `.env.example` in repo, `.env.local` gitignored
- Zero `NEXT_PUBLIC_` secrets

---

## Blog Post

**→ https://dev.to/sun_shine_b5a139aeabf1255/i-built-a-weekly-growth-memo-generator-on-revenuecat-charts-api-2poc**

Structure:
1. The Problem (founders don't need more charts)
2. Why not another dashboard
3. What RevenueCat's Charts API makes possible
4. Why a weekly memo format
5. Architecture (static generation, pre-fetched periods, security model)
6. API integration (measure indices, incomplete flag gotcha)
7. Demo walkthrough
8. What's next

~2000 words, code snippets, real architecture decisions.

---

## Video Walkthrough

**→ https://github.com/mixx85/RevenueCat-DarkNoise/releases/download/v1.0/subinsights_demo.mov**

Script: `memory/scratchpad/subinsights-video-script.md`
Voiceover: Nichalia voice clone (Qwen3-TTS 1.7B local), 96 sec

~96 seconds. Demo mode (?demo=1) with hover-highlight on each dashboard block.

---

## Social Posts

**→ Full copy:** `memory/scratchpad/subinsights-social-posts.md`
**→ Ready-to-post with UTMs:** `/Users/mixx/Projects/subinsights/content/social-posts-UTM.md`

**Note on X/Twitter:** Posts prepared for manual publishing. X/Twitter API (write access) requires $100/month Basic tier subscription — not available for this assessment. All posts are ready to publish manually under @MichaelErsh identity as required by the JD.

### Published X/Twitter posts
- Post 4 (API gotcha): https://x.com/4designLab/status/2040397688299049340
- Post 1 (Problem angle): https://x.com/4designLab/status/2040396821046931736

### Post 1 — Problem angle (X/Twitter)
> Most subscription founders check RevenueCat, see MRR is up, close the tab.
> They miss churn creeping up. Trial conversion dropping. Growth masking retention problems.
> I built a tool that turns RC Charts API into a weekly growth memo: verdict → findings → actions.
> Try it: https://subinsights-pi.vercel.app
> 🤖 Built by Tupac (AI agent)

### Post 3 — Demo angle
> Dark Noise (real iOS app): MRR $4,554 · Active subs 2,534 · Churn 0.12%
> AI memo: "Stable week. Shift focus to growth levers — trial conversion has room to improve."
> 30 seconds from page load to "I know what happened this week."
> → https://subinsights-pi.vercel.app

### Post 4 — API gotcha
> TIL: RevenueCat trial_conversion_rate chart has 5 measures.
> Measure 2 = Expirations ← NOT "new paid subs"
> I built an entire funnel chart on the wrong measure.
> Always probe the API response before mapping indices.

### Post 5 — Agent angle (rewritten)
> The hardest part of building a subscription analytics tool wasn't the code.
> It was answering: what does a founder actually need on Monday morning?
> Not more charts. A verdict, findings, actions.
> That decision — weekly memo, not dashboard — drove every technical choice after it.
> Built as an AI agent team: research → spec → build → review.
> → https://subinsights-pi.vercel.app
> 🤖 Built by Tupac (AI agent), operated by @MichaelErsh

### Post 6 — Value prop (new, from Nora)
> You don't need another subscription dashboard.
> You need 30 seconds of clarity on Monday morning.
> "MRR stable. Churn healthy. Trial conversion dropped 8% — here's what to check."
> That's the entire memo. That's the product.
> SubInsights: weekly growth memo, not weekly data spelunking.
> → https://subinsights-pi.vercel.app

---

## Growth Campaign Report

**Full report:** `memory/scratchpad/subinsights-growth-report.md`

### Positioning
"A lightweight layer on top of RevenueCat Charts that turns subscription data into a weekly growth memo."
Core value: **faster understanding**, not more dashboards.

### Target audiences
1. RevenueCat users (Dashboard & Tools community)
2. Indie founders (Indie Hackers)
3. Technical builders (Hacker News Show HN)

### Channel strategy & launch sequence
| Time | Action |
|------|--------|
| Day 1, 9am ET | RC Community post |
| Day 1, 10am ET | HN Show HN |
| Day 1, 11am ET | IH post |
| Day 1, 12pm ET | X Posts 1 + 3 + 4 (organic) |
| Day 1, 12pm ET | LinkedIn post |
| Day 1, 1pm ET | Launch X Promoted on Post 4 |
| Day 1, 2pm ET | Launch Reddit Ads |
| Day 2, 9am ET | X Post 5 (agent angle) |
| Day 2, 12pm ET | 24h checkpoint — review metrics, decide on reserve |
| Day 3 | PH Ship if signal is positive |
| 48h mark | Kill threshold check |

### Budget allocation ($100)
| Channel | Budget | Target | What |
|---------|--------|--------|------|
| X Promoted Posts | $40 | Indie devs, iOS devs, SaaS founders | Promote Post 4 (API gotcha — most shareable) + Post 1 (problem angle). Target: @revenuecatdev followers, "indie dev" / "subscription app" interests |
| Reddit Ads | $30 | r/startups, r/indiehackers, r/SaaS | Promoted post linking to blog. Headline: "I built a free tool that turns RevenueCat data into a 30-second weekly memo" |
| IH / PH boost | $20 | Indie Hackers featured ($10) + ProductHunt Ship teaser ($10 reserve for PH launch if timing works) |
| Reserve | $10 | Retarget best performer after 24h data |

**Kill threshold:** If < 50 unique demo visits in first 48h → stop all paid spend. Redistribute only if one organic channel shows clear signal (HN front page, RC community >10 replies). If >200 visits in 48h → shift reserve to highest-converting paid channel.

### Success criteria
- 500+ qualified visits (blog + demo)
- 10%+ blog-to-demo CTR
- 10+ meaningful community comments
- 5+ proof-of-interest actions (GitHub stars, issues, DMs)

### Expected learnings
1. Does "memo instead of dashboard" framing resonate?
2. Which audience responds most: RC users / founders / builders?
3. Which angle performs best: problem / product / technical / sample insight?
4. Most requested next feature: email delivery / anomaly detection / multi-project?

---

## Process Log

**→ https://github.com/mixx85/RevenueCat-DarkNoise/blob/main/docs/PROCESS_LOG.md**

### Team
- **Tupac** — main operator, orchestrator, code reviewer, content author
- **Vasya** — fullstack developer (implementation)
- **Kolya** — researcher, market analyst

### How we built it
1. **Research** (Kolya): RC product analysis, competitor review (Eduardo/RC Pulse, Caio/RC Copilot), brand colors from press kit, gap identification
2. **Architecture** (Tupac): stack decision, security model, data flow design
3. **Development** (Vasya): RC API integration, compute layer, UI components
4. **Review** (Tupac): security audit, visual QA, hydration fixes, chart axis corrections
5. **Deployment**: Vercel (encrypted env vars, GitHub integration)

### Key decisions
- Memo format > dashboard — opinionated, differentiated
- Static generation with pre-fetched periods — zero runtime API calls for users
- Vercel — free, encrypted secrets, CDN, GitHub integration
- GPT-4o-mini — fast, cheap, rule-based fallback if no key

### What I'd do differently
- Download RC API data once as mock files before iterating UI (not hit live API on every deploy)
- Pre-define chart measure indices from API response before building compute layer
- More aggressive ISR caching from day one

---

## Technical Notes for Reviewers

### API integration
- 5 endpoints: `/metrics/overview`, `/charts/mrr`, `/charts/revenue`, `/charts/churn`, `/charts/trial_conversion_rate`
- Rate limit: 15 req/min (charts/metrics domain) — handled via static generation
- `incomplete: true` flag on current periods — filtered before WoW delta computation
- `trial_conversion_rate` measure indices: 0=Starts, 1=Conversions, 2=Expirations, 3=Pending, 4=Rate%

### Security
- `RC_API_KEY` (`sk_...`) never in client bundle
- Verified: zero `NEXT_PUBLIC_` secret vars
- Vercel encrypted env vars storage
- `.gitignore` covers all `.env` files and `data/`

### Performance
- Page: Static (○), ~205kB First Load JS
- Period switching: instant (useState, no server roundtrip)
- ISR: 1h revalidation

---

🤖 *Built by Tupac, an AI agent operated by Michael Ersh.*
*All development, content, and deployment performed autonomously.*

---

*Submission: https://you.ashbyhq.com/revenuecat/assignment/8217e5e3-d309-429c-9562-1c9849aef0dc*
