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

---

# How We Built the Dark Noise Growth Dashboard
*A take-home assessment for RevenueCat's Agentic AI Developer & Growth Advocate role*

---

## Before We Started: Setting Up the Team

Before writing a single line of code, we set up and tested our agent team:

- **Tupac** — main operator and orchestrator. Receives the task, breaks it down, coordinates the team, reviews results, and makes final decisions.
- **Vasya** — fullstack developer. Gets a detailed technical spec and implements it. Reports back with what's done and what needs review.
- **Kolya** — researcher and market analyst. Studies the company, competitors, product landscape, and produces structured briefs.

Each agent was tested before deployment on this task. We don't spawn agents for show — only when there's a real advantage: parallel work, specialist depth, or independent verification.

---

## Phase 1: Research & Analysis

**Kolya** started first.

The goal was to understand RevenueCat deeply before proposing anything — their product, brand, visual identity, competitor landscape, and what would make a submission stand out.

Kolya studied:
- RevenueCat's product and Charts API documentation
- Their official brand guide and color palette (extracted from the press kit)
- Competitor submissions already in the field: Eduardo Santos (RC Pulse, Kotlin/Ktor + GPT-4o, Railway) and Caio (RC Copilot, Next.js + Recharts, anomaly detection + AI chat)
- RC's own dashboard aesthetic: dark navy background, cyan/blue chart lines, clean typography

Key findings from the research:
- Eduardo's strength: GPT-4o briefing text. Weakness: generic UI, no chart context.
- Caio's strength: over-engineered feature set (what-if simulator, anomaly detection). Weakness: no opinionated "weekly memo" format — just more dashboard.
- The gap: no one combined a **clean, opinionated narrative format** with **real chart data** in a visually polished way.

This shaped our positioning: not another dashboard, but a **weekly growth memo** — something a founder can read in 30 seconds and forward to their co-founder.

---

## Phase 2: Technical Design

With the research in hand, Tupac defined the architecture:

**Stack decision:**
- **Next.js 14** (App Router) — static generation at build time, zero runtime API calls for end users
- **Recharts** — lightweight, composable, full control over visual style
- **Tailwind CSS** — utility-first, fast to prototype
- **GPT-4o-mini** — fast and cheap for memo generation (< $0.001 per memo, < 2 seconds)
- **Vercel** — chosen deliberately for four reasons:
  1. Free tier covers everything needed for this demo
  2. Blazing fast CDN — static pages load in < 100ms
  3. Environment variable encryption — API keys never appear in source code or client bundle
  4. Native GitHub integration — push to main, deploy automatically

**RevenueCat brand colors** were pulled directly from the official press kit:
- Red `#F2545B`, Royal Blue `#576CDB`, Green `#11D483`, Black Purple `#1F1F47`

These informed every color decision in the UI — cards, badges, chart lines, accent elements.

**Key architectural decision:** pre-fetch all four time periods (1M / 3M / 1Y / ALL) at build time, bundle into the static page, and let the client switch instantly between them. No server roundtrips on period change.

---

## Phase 3: Development

Vasya received a detailed technical spec: exact file paths, component structure, color tokens, API endpoint names, measure indices (trial_conversion measure 4 = Conversion Rate, not measure 2 which is Expirations), and the expected visual output for each widget.

What Vasya built, in order:
1. `lib/revenuecat.ts` — RC Charts API v2 integration, rate limiting (300ms gaps between calls), retry logic
2. `lib/compute.ts` — WoW delta calculation, period-aware data filtering, correct measure index mapping
3. `lib/insights.ts` — GPT-4o-mini memo generation with structured prompt and rule-based fallback
4. `lib/format.ts` — deterministic number formatting (avoids hydration mismatches between server and client locale)
5. All UI components: KPI cards with sparklines, MRR area chart with gradient fill, Growth Funnel with horizontal bars, Churn rate line chart, custom SVG donut for subscription status, Weekly Memo with structured rendering

The page renders as **static** (pre-rendered at build time) — meaning any visitor gets instant load from Vercel's CDN, with no wait for API calls.

---

## Phase 4: Review & Visual Refinement

After Vasya's implementation, Tupac reviewed the result against the spec and the RC brand guide.

Several visual passes were made:
- **Color accuracy**: all RC official brand colors applied consistently across every component
- **Typography**: KPI numbers at 38px/800 weight — large enough to read at a glance
- **MRR chart**: green gradient fill (#11D483 with opacity fade), `domain=['auto','auto']` so flat data doesn't look like a flat line at the bottom
- **Churn axis**: corrected from `>= 0` filter (which caused near-zero values to disappear) to `> 0` with proper `domain=[0, 'auto']`
- **Funnel**: replaced Tremor's BarChart (which colored all bars black) with custom horizontal bars using RC brand colors
- **Donut**: replaced Tremor's DonutChart with a custom SVG donut — full color control
- **Hydration fix**: `toLocaleString("en-US")` produces different output depending on server/client locale. Replaced with deterministic regex-based formatter in `lib/format.ts`

---

## Phase 5: Security Review

Before publishing to GitHub, Vasya ran a security audit:

- All API keys (`RC_API_KEY`, `OPENAI_API_KEY`) loaded exclusively via `process.env` on the server side
- Zero `NEXT_PUBLIC_` prefixed secret variables — keys never reach the browser
- `.gitignore` covers `.env*.local`, `data/`, `.vercel/`
- `.env.example` contains only placeholder values — safe to commit
- `lib/revenuecat.ts` is a server-only module — only imported in server components and API routes, never in `"use client"` components

TypeScript check: `npx tsc --noEmit` → 0 errors.
Build check: `npm run build` → clean, 0 warnings.

---

## Phase 6: Git & Deployment

The project was published to a clean GitHub repository — **mixx85/RevenueCat-DarkNoise** — with a fresh git history containing no sensitive data:

- `PROCESS_LOG.md` excluded
- `data/` (RC API mock data with real Dark Noise metrics) excluded via `.gitignore` and not committed
- Only source code, configuration, and documentation

Deployment to **Vercel** was done via CLI with encrypted environment variables — the RC API key is stored in Vercel's encrypted secrets store, never in any file that touches git.

**Why Vercel specifically:**
- Free tier with no credit card required
- Automatic HTTPS and CDN distribution
- Encrypted environment variables — never exposed in build logs or source
- Direct GitHub integration — `git push` → deploy
- Edge caching — static pages served from the closest datacenter to the visitor

Live demo: **https://subinsights-pi.vercel.app**
GitHub: **https://github.com/mixx85/RevenueCat-DarkNoise**

---

## What the Dashboard Does

**Weekly Snapshot (top section):**
Four KPI cards — MRR, Active Subscriptions, Active Trials, Revenue — each showing the current value, WoW delta (color-coded: green / red / neutral), and a mini sparkline of the trend.

**AI Weekly Growth Memo:**
Generated by GPT-4o-mini from real RC data. Structured as: verdict (🟢/🟡/🔴), three data-driven findings, and two specific actions. Falls back to a rule-based summary if no OpenAI key is present.

Under the memo findings, a **"Growth Recommendations"** section separates the analysis from the action items — making it easy to scan and act.

**Explore Data section:**
Time range selector (1M / 3M / 1Y / ALL) with instant client-side switching — all periods pre-loaded at build time, no server calls on switch.

- **MRR / Revenue chart**: area chart with green gradient fill, adaptive X-axis labels per period (days / weeks / months / years)
- **Growth Funnel**: trial starts → conversions → active trials, horizontal bars in RC brand colors
- **Churn Rate**: daily churn line chart for the selected period
- **Subscription Status**: custom SVG donut — active subscriptions (green) vs active trials (red)

**Copy as Markdown**: one-click export of the full memo + all metrics in markdown format, ready to paste into a Notion doc, Slack message, or investor update.

---

---

## Phase 3 Extension: Content Creation & Growth Strategy (Task Requirements #2 and #3)

With the product built and deployed, we moved to the content and growth requirements.

**Task #2 — Content creation** (blog post): covered by Tupac + reviewed by Nora (creative) and Konj Joe (GTM). Nora owned storytelling and opening, Konj Joe owned product thesis and marketing angle.

**Task #3 — Growth campaign** ($100 budget, social posts, channel strategy): fully Konj Joe. Nora added Post 6 (value prop) and rewrote Post 5 (agent angle).

### Blog Post

Tupac drafted the initial blog post covering the product thesis, architecture decisions, API gotchas, and agentic process. The draft was then reviewed by three specialist agents running in parallel:

- **Kolya** (analyst) — scored the post 6.5/10. Key findings: hook is strong but buries the best line mid-post, agentic process section too thin (1 paragraph for the central criterion of the TA), CTA missing entirely.
- **Konj Joe 2027** (GTM operator) — added the push vs pull argument missing from the thesis: "A dashboard requires you to show up. A memo finds you." Called out $100 budget as "wishlist not strategy" without specific channels and kill thresholds.
- **Nora** (media creator, Opus model) — found the best sentence in the entire post buried on page 3: "Dashboards hand you ingredients. You still have to cook." Rewrote the opening around it. Flagged that the post was written inside-out — explaining how we built it before explaining why anyone should care.

After three individual reviews, **Konj Joe** was re-spawned on ChatGPT Codex (gpt-5.3) with all three review outputs to synthesize the final version. He produced ready-to-use texts for every section needing a rewrite.

Final blog post published on Dev.to:
**https://dev.to/sun_shine_b5a139aeabf1255/i-built-a-weekly-growth-memo-generator-on-revenuecat-charts-api-2poc**

### Social Posts

Six posts written for different audiences and angles:
1. Problem angle — for founders who relate to the Monday morning dashboard habit
2. Demo angle — real Dark Noise metrics as proof
3. API gotcha (TIL) — technical insight for developers, no sales pitch
4. Agent angle — the product decision story
5. Value prop — 30 seconds of clarity (from Nora's rewrite)
6. LinkedIn — direct signal to RC hiring team

Post 2 (technical architecture) was cut after Nora's review: "This post is for nobody — too basic for engineers, incomprehensible for founders."

Post 4 (API gotcha) identified as best organic performer — concrete, shareable without clicking.

Published on X/Twitter:
- https://x.com/4designLab/status/2040397688299049340 (Post 4)
- https://x.com/4designLab/status/2040396821046931736 (Post 1)

### $100 Growth Budget

Initial plan was "wait and boost the winner" — Konj Joe called this a wishlist, not a strategy. Replaced with:

| Channel | Budget | Target |
|---------|--------|--------|
| X Promoted Posts | $40 | @revenuecatdev followers, indie dev interests |
| Reddit Ads | $30 | r/startups, r/indiehackers, r/SaaS |
| IH featured + PH Ship | $20 | Indie Hackers + ProductHunt |
| Reserve | $10 | Retarget best performer after 24h |

Kill threshold: if < 50 demo visits in 48h — stop all paid spend.

### Video

Voiceover generated locally via Qwen3-TTS 1.7B with voice cloning from a reference sample (Nichalia voice). 96 seconds, 6 scenes matching dashboard sections. Screen recording with demo mode (`?demo=1`) — hover highlights each block in RC red (#F2545B) as the narration moves through it.

Video: **https://github.com/mixx85/RevenueCat-DarkNoise/releases/download/v1.0/subinsights_demo.mov**

---

## Oleg's Architecture Audit

After shipping, Oleg (diagnostics specialist) audited the RC API integration and found two critical issues:

1. **Timestamps with millisecond precision in URLs** — `new Date().toISOString()` produced a unique URL on every request, defeating Next.js fetch-cache entirely. Every hot reload = 8 fresh HTTP calls to RC API = guaranteed 429. Fixed by normalizing to hour boundary: `new Date(Math.floor(Date.now() / 3600000) * 3600000)`.

2. **Mock fallback used `process.env` mutation at runtime** — `USE_MOCK` is a module-level constant evaluated once at load time. Mutating `process.env` after module load has no effect. Fixed by exporting `fetchFromMockFiles` directly and calling it in the catch block.

Request count reduced from 20 to 8 by fetching baseline data (overview + revenue + churn + trial) once, and only fetching MRR chart per period.

---

*🤖 Disclosure: Built by Tupac, an AI agent operated by Michael Ersh, as a take-home assessment for RevenueCat's Agentic AI Developer & Growth Advocate role.*
