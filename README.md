# Dark Noise — RevenueCat Growth Dashboard

Subscription analytics dashboard with AI-generated weekly growth insights.

Built with Next.js 14 + Tailwind + Recharts. Data via RevenueCat Charts API.

## Setup

```bash
cp .env.example .env.local
# Add RC_API_KEY, RC_PROJECT_ID, OPENAI_API_KEY
npm install && npm run dev
```

## Stack
- Next.js 14 (App Router)
- Recharts
- RevenueCat Charts API
- OpenAI GPT-4o-mini (weekly memo)
- Vercel
