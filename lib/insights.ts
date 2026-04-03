import OpenAI from "openai";

export interface MemoData {
  appName: string;
  mrr: number;
  mrrWow: number;
  activeSubs: number;
  subsWow: number;
  revenue: number;
  churn: number;
  churnWow: number;
  trialConv: number;
  trialWow: number;
}

export async function generateMemo(data: MemoData): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackMemo(data);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Detect stability
  const isStable = Math.abs(data.mrrWow) < 1 && data.churn < 5;

  const context = isStable
    ? "This week is stable — MRR is flat and churn is healthy. Focus should shift to growth levers (trial conversion, retention) rather than churn firefighting."
    : `This week shows ${data.mrrWow >= 2 ? "strong growth" : data.mrrWow > 0 ? "modest growth" : "decline"} in MRR. Churn is ${data.churn >= 5 ? "above target" : "healthy"}.`;

  const prompt = `You are a subscription analytics advisor for indie app founders.
Write a weekly growth memo for ${data.appName}.

Context: ${context}

Data: MRR $${data.mrr.toFixed(0)} (${data.mrrWow > 0 ? "+" : ""}${data.mrrWow.toFixed(1)}% WoW), Active subs ${data.activeSubs} (${data.subsWow > 0 ? "+" : ""}${data.subsWow.toFixed(0)} WoW), Revenue $${data.revenue.toFixed(0)}, Churn ${data.churn.toFixed(1)}% (${data.churnWow > 0 ? "+" : ""}${data.churnWow.toFixed(1)}% WoW), Trial conv ${data.trialConv.toFixed(1)}% (${data.trialWow > 0 ? "+" : ""}${data.trialWow.toFixed(1)}% WoW).

Format: 1) verdict sentence with 🟢/🟡/🔴, 2) 3 bullet findings (specific, data-driven), 3) 2 actions (concrete, not generic). Max 150 words.

Rules:
- If MRR is stable (±1%) and churn is low (<5%), do NOT say "positive momentum". Say "stable week" and focus on growth levers.
- Do not make up numbers. Only use the data provided.
- Actions must be specific: "Test trial screen copy" not "Improve onboarding."`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });
    return response.choices[0].message.content || generateFallbackMemo(data);
  } catch (e) {
    console.error("OpenAI error:", e);
    return generateFallbackMemo(data);
  }
}

function generateFallbackMemo(data: MemoData): string {
  const isStable = Math.abs(data.mrrWow) < 1 && data.churn < 5;
  const verdict = isStable
    ? "🟡"
    : data.mrrWow >= 2
    ? "🟢"
    : data.mrrWow >= -1
    ? "🟡"
    : "🔴";

  const momentumPhrase = isStable
    ? "a stable week — MRR is flat and churn is healthy"
    : `${data.mrrWow >= 0 ? "positive" : "declining"} momentum with MRR ${data.mrrWow > 0 ? "up" : "down"} ${Math.abs(data.mrrWow).toFixed(1)}% WoW`;

  return `${verdict} ${data.appName} ${momentumPhrase}.

• MRR at $${data.mrr.toFixed(0)} with ${data.activeSubs} active subscriptions (${data.mrrWow > 0 ? "+" : ""}${data.mrrWow.toFixed(1)}% WoW).
• Churn rate: ${data.churn.toFixed(1)}% — ${isStable ? "healthy, shift focus to growth levers" : data.churn < 5 ? "within target range" : "above target, investigate recent cohorts"}.
• Trial conversion: ${data.trialConv.toFixed(1)}% ${data.trialConv > 60 ? "(strong)" : data.trialConv > 30 ? "(room to improve)" : "(needs attention)"}.

→ ${isStable ? 'A/B test trial-to-paid screen: try urgency ("48h left") vs. value-first ("unlock premium features").' : data.churn > 5 ? "Run a win-back campaign for churned users from the past 30 days." : "Scale acquisition — conversion is strong enough to support more volume."}
→ ${data.trialConv < 60 ? "Review onboarding flow: are users reaching the 'aha' moment before trial ends?" : "Monitor retention cohorts — ensure new subs stick around past week 2."}`;
}
