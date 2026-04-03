import { fetchDashboardData } from "@/lib/revenuecat";
import { computeMetrics } from "@/lib/compute";
import { generateMemo } from "@/lib/insights";
import { DashboardClient } from "@/components/DashboardClient";

export const revalidate = 3600; // Cache 1 hour — static, fast

// Fallback data for when RC API is unavailable
const FALLBACK = {
  mrr: 4554, mrrWow: 0.0, activeSubs: 2534, activeTrials: 74,
  revenue: 4694, revenueWow: -18.1, churn: 0.12, churnWow: -0.05,
  trialConv: 38.5, trialWow: 2.1,
};

export default async function Home() {
  let metricsAll, metrics3m, metrics1m, metrics1y, memo, fetchedAt, isLive;

  try {
    // Fetch ALL periods at build/revalidate time — no runtime API calls
    const [rawAll, raw1y, raw3m, raw1m] = await Promise.all([
      fetchDashboardData("all"),
      fetchDashboardData("1y"),
      fetchDashboardData("3m"),
      fetchDashboardData("1m"),
    ]);

    metricsAll = computeMetrics(rawAll.overview, rawAll.mrr, rawAll.revenue, rawAll.churn, rawAll.trialConversion, "all");
    metrics1y = computeMetrics(raw1y.overview, raw1y.mrr, raw1y.revenue, raw1y.churn, raw1y.trialConversion, "1y");
    metrics3m = computeMetrics(raw3m.overview, raw3m.mrr, raw3m.revenue, raw3m.churn, raw3m.trialConversion, "3m");
    metrics1m = computeMetrics(raw1m.overview, raw1m.mrr, raw1m.revenue, raw1m.churn, raw1m.trialConversion, "1m");

    memo = await generateMemo({
      appName: "Dark Noise",
      mrr: metricsAll.mrr, mrrWow: metricsAll.mrrWow,
      activeSubs: metricsAll.activeSubs, subsWow: metricsAll.activeSubs * (metricsAll.mrrWow / 100),
      revenue: metricsAll.revenue, churn: metricsAll.churn, churnWow: metricsAll.churnWow,
      trialConv: metricsAll.trialConv, trialWow: metricsAll.trialWow,
    });
    fetchedAt = rawAll.fetchedAt;
    isLive = true;
  } catch {
    // Fallback: use static data, no RC API needed
    const fallbackMemo = `[STABLE] Dark Noise — stable week, MRR flat, churn healthy.\n\n• MRR at $${FALLBACK.mrr.toLocaleString()} with ${FALLBACK.activeSubs.toLocaleString()} active subscriptions.\n• Churn rate: ${FALLBACK.churn.toFixed(1)}% — healthy, focus on growth.\n• Trial conversion: ${FALLBACK.trialConv.toFixed(1)}% — room to improve.\n\n→ A/B test trial-to-paid screen: urgency vs value-first messaging.\n→ Review onboarding: are users hitting the 'aha moment' before trial ends?`;

    metricsAll = metrics1y = metrics3m = metrics1m = {
      ...FALLBACK,
      mrrSeries: [
        { date: "Apr '23", dateTs: 1680307200, MRR: 700 },
        { date: "Jul '23", dateTs: 1688169600, MRR: 1200 },
        { date: "Oct '23", dateTs: 1696118400, MRR: 1800 },
        { date: "Jan '24", dateTs: 1704067200, MRR: 2400 },
        { date: "Apr '24", dateTs: 1711929600, MRR: 2900 },
        { date: "Jul '24", dateTs: 1719792000, MRR: 3400 },
        { date: "Oct '24", dateTs: 1727740800, MRR: 3900 },
        { date: "Jan '25", dateTs: 1735689600, MRR: 4200 },
        { date: "Mar '25", dateTs: 1741478400, MRR: 4554 },
      ],
      churnSeries: [
        { date: "Mar 20", "Churn Rate": 0.16 }, { date: "Mar 22", "Churn Rate": 0.08 },
        { date: "Mar 24", "Churn Rate": 0.16 }, { date: "Mar 26", "Churn Rate": 0.24 },
        { date: "Mar 28", "Churn Rate": 0.16 }, { date: "Mar 30", "Churn Rate": 0.24 },
        { date: "Apr 1", "Churn Rate": 0.16 }, { date: "Apr 2", "Churn Rate": 0.12 },
      ],
      funnel: [
        { name: "Trial Starts (14d)", value: 320 },
        { name: "Conversions (14d)", value: 123 },
        { name: "Active Trials", value: 74 },
      ],
    };
    memo = fallbackMemo;
    fetchedAt = new Date().toISOString();
    isLive = false;
  }

  // Pass all periods to client — zero runtime fetches on period switch
  return (
    <DashboardClient
      periods={{ all: metricsAll, "1y": metrics1y, "3m": metrics3m, "1m": metrics1m }}
      memo={memo}
      fetchedAt={fetchedAt}
      isLive={isLive}
    />
  );
}
