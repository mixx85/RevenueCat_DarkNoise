# SubInsights — Process Log

## Phase 0: API Discovery

**Goal:** Understand RevenueCat Charts API v2 response format before writing any code.

**Actions:**
- Tested `GET /v2/projects/{id}/metrics/overview` — returns 7 metrics: active_trials (74), active_subscriptions (2534), mrr ($4554), revenue ($4694), new_customers, active_users, num_tx_last_28_days
- Tested `GET /v2/projects/{id}/charts/mrr` — returns `values[]` with `{cohort, measure, value}` tuples. Measure 0 = MRR dollar value. Timestamps are Unix seconds.
- Tested `GET /v2/projects/{id}/charts/churn` — 3 measures: Actives (0), Churned Actives (1), Churn Rate % (2)
- Tested `GET /v2/projects/{id}/charts/trial_conversion_rate` — 5 measures: Trial Starts (0), Conversions (1), Expirations (2), Pending (3), Conversion Rate % (4)

**Key Finding:** Chart values use multi-measure format — each cohort timestamp has multiple entries with different `measure` indices. Must filter by measure index to get the right metric.

**Rate Limit:** 5 req/min confirmed. Sequential calls with 200ms gap + 1hr cache = safe.

---

## Phase 1: Build

**Tech decisions:**
- Next.js 14 App Router + Tremor + Tailwind CSS (dark mode)
- Server-side only API key handling via Route Handler
- GPT-4o-mini for memo generation with fallback template (no OpenAI key = still works)
- WoW delta computed as 7-day average vs prior 7-day average

**Architecture:**
- `/app/api/dashboard/route.ts` — single endpoint fetches all 5 RC API calls sequentially, computes metrics, generates memo
- `/app/page.tsx` — SSR page consuming the API route
- 5 components: KPICards, WeeklyMemo, MRRChart, FunnelChart, ChurnChart
- 3 lib modules: revenuecat.ts (API client), compute.ts (data processing), insights.ts (AI memo)

**Build:** `npm run build` — ✅ passes clean

---

## Phase 2: Deploy

**Target:** Vercel free tier
- GitHub repo: public
- Environment variables set in Vercel dashboard: RC_API_KEY, RC_PROJECT_ID, OPENAI_API_KEY

---

## Phase 3: Verification

- [ ] Live URL loads with real Dark Noise data
- [ ] MRR chart shows 90-day trend
- [ ] KPI cards show correct values matching RC dashboard
- [ ] Weekly memo generates (AI or fallback)
- [ ] Copy as Markdown button works
- [ ] Churn and funnel charts render

---

## Tradeoffs & Notes

1. **Cache strategy:** 1-hour revalidation means data is slightly stale but stays within rate limits. For a weekly memo tool, this is acceptable.
2. **Fallback memo:** If no OpenAI key, a template-based memo is generated. Less insightful but functional.
3. **WoW calculation:** Uses simple 7-day average comparison. More sophisticated approaches (e.g., cohort-weighted) possible but overkill for MVP.
4. **Chart data volume:** MRR chart fetches full history but only displays last 90 days. Could optimize with tighter date range.
5. **No authentication:** This is a read-only demo with a read-only API key. Production tool would need user auth + per-user RC keys.
