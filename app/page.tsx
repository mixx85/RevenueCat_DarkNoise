import { fetchBaseline, fetchMRRForPeriod, fetchDashboardData } from "@/lib/revenuecat";
import { computeMetrics } from "@/lib/compute";
import { generateMemo } from "@/lib/insights";
import { DashboardClient } from "@/components/DashboardClient";

export const revalidate = 3600; // ISR: rebuild once per hour

export default async function Home() {
  let metricsAll, metrics3m, metrics1m, metrics1y, memo, fetchedAt, isLive;

  try {
    // ARCHITECTURE: fetch baseline once (overview + revenue/churn/trial all-time)
    // Then fetch only MRR chart per period (4 requests, each with different resolution)
    // Total: 4 baseline + 4 MRR = 8 requests vs old 20. Fits RC 15 req/min limit.
    const baseline = await fetchBaseline();
    await new Promise(r => setTimeout(r, 500));

    const mrrAll = await fetchMRRForPeriod("all");
    await new Promise(r => setTimeout(r, 400));
    const mrr1y = await fetchMRRForPeriod("1y");
    await new Promise(r => setTimeout(r, 400));
    const mrr3m = await fetchMRRForPeriod("3m");
    await new Promise(r => setTimeout(r, 400));
    const mrr1m = await fetchMRRForPeriod("1m");

    // All periods share the same overview/revenue/churn/trial data
    // Only MRR chart differs per period
    metricsAll = computeMetrics(baseline.overview, mrrAll, baseline.revenue, baseline.churn, baseline.trialConversion, "all");
    metrics1y  = computeMetrics(baseline.overview, mrr1y,  baseline.revenue, baseline.churn, baseline.trialConversion, "1y");
    metrics3m  = computeMetrics(baseline.overview, mrr3m,  baseline.revenue, baseline.churn, baseline.trialConversion, "3m");
    metrics1m  = computeMetrics(baseline.overview, mrr1m,  baseline.revenue, baseline.churn, baseline.trialConversion, "1m");

    memo = await generateMemo({
      appName: "Dark Noise",
      mrr: metricsAll.mrr, mrrWow: metricsAll.mrrWow,
      activeSubs: metricsAll.activeSubs, subsWow: metricsAll.activeSubs * (metricsAll.mrrWow / 100),
      revenue: metricsAll.revenue, churn: metricsAll.churn, churnWow: metricsAll.churnWow,
      trialConv: metricsAll.trialConv, trialWow: metricsAll.trialWow,
    });
    fetchedAt = baseline.fetchedAt;
    isLive = true;

  } catch {
    // Fallback: mock files per period
    const fallbackMemo = `[STABLE] Dark Noise — stable week, MRR flat, churn healthy.\n\n• MRR at $4,554 with 2,534 active subscriptions.\n• Churn rate: 0.1% — healthy, focus on growth levers.\n• Trial conversion: 38.5% — room to improve.\n\n→ A/B test trial-to-paid screen: urgency vs value-first messaging.\n→ Review onboarding: are users hitting the 'aha moment' before trial ends?`;

    try {
      // Use mock files directly — no dynamic import (breaks webpack module cache)
      const [rawAll, raw1y, raw3m, raw1m] = await Promise.all([
        fetchDashboardData("all"), fetchDashboardData("1y"),
        fetchDashboardData("3m"), fetchDashboardData("1m"),
      ]);
      metricsAll = computeMetrics(rawAll.overview, rawAll.mrr, rawAll.revenue, rawAll.churn, rawAll.trialConversion, "all");
      metrics1y  = computeMetrics(raw1y.overview,  raw1y.mrr,  raw1y.revenue,  raw1y.churn,  raw1y.trialConversion,  "1y");
      metrics3m  = computeMetrics(raw3m.overview,  raw3m.mrr,  raw3m.revenue,  raw3m.churn,  raw3m.trialConversion,  "3m");
      metrics1m  = computeMetrics(raw1m.overview,  raw1m.mrr,  raw1m.revenue,  raw1m.churn,  raw1m.trialConversion,  "1m");
    } catch {
      const FALLBACK_SERIES = {
        mrrSeries: [{date:"Apr '23",dateTs:1680307200,MRR:700},{date:"Jan '24",dateTs:1704067200,MRR:2400},{date:"Apr '24",dateTs:1711929600,MRR:2900},{date:"Jan '25",dateTs:1735689600,MRR:4200},{date:"Mar '25",dateTs:1741478400,MRR:4554}],
        churnSeries: [{date:"Mar 28","Churn Rate":0.16},{date:"Mar 30","Churn Rate":0.24},{date:"Apr 1","Churn Rate":0.16},{date:"Apr 2","Churn Rate":0.12}],
        funnel: [{name:"Trial Starts (14d)",value:320},{name:"Conversions (14d)",value:123},{name:"Active Trials",value:74}],
      };
      const m = { mrr:4554, mrrWow:0, activeSubs:2534, activeTrials:74, revenue:4694, revenueWow:-18.1, churn:0.12, churnWow:-0.05, trialConv:38.5, trialWow:2.1, ...FALLBACK_SERIES };
      metricsAll = metrics1y = metrics3m = metrics1m = m;
    }
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
