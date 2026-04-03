# Dark Noise — RevenueCat Growth Dashboard

Subscription analytics dashboard with AI-generated weekly growth insights.

Built with Next.js 14 + Recharts. Data via RevenueCat Charts API.

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your keys (see below)
npm run dev
```

## Environment variables

```
RC_API_KEY=           # RevenueCat secret key (sk_...)
RC_PROJECT_ID=        # RevenueCat project ID (proj...)
OPENAI_API_KEY=       # Optional — AI memo generation (GPT-4o-mini)
```

Without `OPENAI_API_KEY` the weekly memo falls back to a rule-based summary.

## Stack
- Next.js 14 (App Router, static generation)
- Recharts
- RevenueCat Charts API
- OpenAI GPT-4o-mini (weekly memo)
- Vercel
