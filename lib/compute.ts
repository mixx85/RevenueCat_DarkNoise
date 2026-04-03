import { ChartData, ChartValue, OverviewMetric, Period } from "./revenuecat";

export interface ProcessedMRR {
  date: string;
  dateTs: number;
  MRR: number;
}

export interface ProcessedFunnel {
  name: string;
  value: number;
}

export interface ProcessedChurn {
  date: string;
  "Churn Rate": number;
}

export interface ComputedMetrics {
  mrr: number;
  mrrWow: number;
  activeSubs: number;
  activeTrials: number;
  revenue: number;
  revenueWow: number;
  churn: number;
  churnWow: number;
  trialConv: number;
  trialWow: number;
  mrrSeries: ProcessedMRR[];
  churnSeries: ProcessedChurn[];
  funnel: ProcessedFunnel[];
}

function getOverviewValue(metrics: OverviewMetric[], id: string): number {
  return metrics.find((m) => m.id === id)?.value ?? 0;
}

function getMeasureValues(values: ChartValue[], measureIdx: number): { ts: number; val: number }[] {
  return values
    .filter((v) => v.measure === measureIdx)
    .map((v) => ({ ts: v.cohort, val: v.value }))
    .sort((a, b) => a.ts - b.ts);
}

function computeWoW(series: { ts: number; val: number }[]): number {
  const complete = series.filter((v) => v.val > 0);
  if (complete.length < 14) return 0;
  const recent = complete.slice(-7).reduce((s, v) => s + v.val, 0) / 7;
  const prev = complete.slice(-14, -7).reduce((s, v) => s + v.val, 0) / 7;
  if (prev === 0) return 0;
  return ((recent - prev) / prev) * 100;
}

function getCutoffTs(period: Period): number {
  const now = new Date();
  switch (period) {
    case "1m": { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d.getTime() / 1000; }
    case "3m": { const d = new Date(now); d.setMonth(d.getMonth() - 3); return d.getTime() / 1000; }
    case "1y": { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d.getTime() / 1000; }
    default: return 0; // all time
  }
}

function mrrLabel(ts: number, period: Period): string {
  const d = new Date(ts * 1000);
  if (period === "1m") {
    // daily: "Apr 1"
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (period === "3m") {
    // weekly buckets: "Jan W1", "Jan W2" etc
    const mon = d.toLocaleDateString("en-US", { month: "short" });
    const week = Math.ceil(d.getDate() / 7);
    return `${mon} W${week}`;
  }
  if (period === "1y") {
    // monthly: "Apr '25"
    const mon = d.toLocaleDateString("en-US", { month: "short" });
    const yr = d.getFullYear().toString().slice(-2);
    return `${mon} '${yr}`;
  }
  // "all" — show year for January, empty string for other months (recharts skips empty ticks)
  return d.getMonth() === 0 ? String(d.getFullYear()) : "";
}

function dayLabel(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function computeMetrics(
  overview: OverviewMetric[],
  mrr: ChartData,
  revenue: ChartData,
  churn: ChartData,
  trialConversion: ChartData,
  period: Period = "all"
): ComputedMetrics {
  const mrrVal = getOverviewValue(overview, "mrr");
  const activeSubs = getOverviewValue(overview, "active_subscriptions");
  const activeTrials = getOverviewValue(overview, "active_trials");
  const revenueVal = getOverviewValue(overview, "revenue");

  const cutoffTs = getCutoffTs(period);

  const nowTs = Date.now() / 1000;

  // MRR series — filtered by period AND past only (no projected future data)
  // For 1M: use daily revenue data (MRR is monthly, only 1 point per month)
  let mrrValues: { ts: number; val: number }[];
  if (period === "1m") {
    // Use daily revenue as proxy for 1M chart
    mrrValues = getMeasureValues(revenue.values, 0)
      .filter((v) => v.val > 0 && v.ts >= cutoffTs && v.ts <= nowTs);
  } else {
    mrrValues = getMeasureValues(mrr.values, 0)
      .filter((v) => v.val > 0 && v.ts >= cutoffTs && v.ts <= nowTs);
  }
  const mrrWow = computeWoW(getMeasureValues(mrr.values, 0));
  const mrrSeries: ProcessedMRR[] = mrrValues.map((v) => ({
    date: mrrLabel(v.ts, period),
    dateTs: v.ts,
    MRR: Math.round(v.val),
  }));

  // Churn (measure 2 = Churn Rate %) — filtered by period
  const allChurnValues = getMeasureValues(churn.values, 2);
  const churnFiltered = allChurnValues.filter((v) => v.val > 0 && v.ts >= cutoffTs && v.ts <= nowTs);
  const churnVal = churnFiltered.length > 0 ? churnFiltered[churnFiltered.length - 1].val : 0;
  const churnWow = computeWoW(allChurnValues.slice(-30));
  const churnSeries: ProcessedChurn[] = churnFiltered.map((v) => ({
    date: dayLabel(v.ts),
    "Churn Rate": parseFloat(v.val.toFixed(2)),
  }));

  // Trial conversion (measure 4 = Conversion Rate %)
  const trialValues = getMeasureValues(trialConversion.values, 4);
  const recentTrial = trialValues.filter((v) => v.val > 0).slice(-14);
  const trialConvVal = recentTrial.length > 0 ? recentTrial[recentTrial.length - 1].val : 0;
  const trialWow = computeWoW(trialValues.filter((v) => v.val >= 0).slice(-30));

  // Revenue WoW
  const revValues = getMeasureValues(revenue.values, 0);
  const revenueWow = computeWoW(revValues);

  // Funnel — filtered by period
  const trialStarts = getMeasureValues(trialConversion.values, 0).filter((v) => v.ts >= cutoffTs);
  const trialConversions = getMeasureValues(trialConversion.values, 1).filter((v) => v.ts >= cutoffTs);
  const totalStarts = trialStarts.reduce((s, v) => s + v.val, 0);
  const totalConv = trialConversions.reduce((s, v) => s + v.val, 0);
  const funnelLabel = period === "1m" ? "30d" : period === "3m" ? "3M" : period === "1y" ? "1Y" : "All";

  const funnel: ProcessedFunnel[] = [
    { name: `Trial Starts (${funnelLabel})`, value: Math.round(totalStarts) },
    { name: `Conversions (${funnelLabel})`, value: Math.round(totalConv) },
    { name: "Active Trials", value: activeTrials },
  ];

  return {
    mrr: mrrVal, mrrWow,
    activeSubs, activeTrials,
    revenue: revenueVal, revenueWow,
    churn: churnVal, churnWow,
    trialConv: trialConvVal, trialWow,
    mrrSeries, churnSeries, funnel,
  };
}
