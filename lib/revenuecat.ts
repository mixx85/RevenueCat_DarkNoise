const RC_API_KEY = process.env.RC_API_KEY!;
const RC_PROJECT_ID = process.env.RC_PROJECT_ID!;
const BASE_URL = "https://api.revenuecat.com/v2";

// Use local mock data instead of API calls for development/testing
const USE_MOCK = process.env.USE_MOCK_DATA === "true";

async function readMockFile<T>(filename: string): Promise<T> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const data = await fs.readFile(
    path.join(process.cwd(), "data", filename),
    "utf-8"
  );
  return JSON.parse(data) as T;
}

async function rcFetch(path: string): Promise<unknown> {
  if (USE_MOCK) {
    throw new Error("Using mock data");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${RC_API_KEY}` },
    next: { revalidate: 3600 },
  });

  if (res.status === 429) {
    throw new Error("Rate limit exceeded");
  }

  if (!res.ok) {
    throw new Error(`RC API error ${res.status}`);
  }
  return res.json();
}

export interface OverviewMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
}

export interface ChartValue {
  cohort: number;
  measure: number;
  value: number;
  incomplete: boolean;
}

export interface ChartData {
  values: ChartValue[];
  measures: { display_name: string; unit: string; chartable: boolean }[];
  summary: Record<string, Record<string, number>>;
}

export interface DashboardData {
  overview: OverviewMetric[];
  mrr: ChartData;
  revenue: ChartData;
  churn: ChartData;
  trialConversion: ChartData;
  fetchedAt: string;
}

export type Period = "1m" | "3m" | "1y" | "all";

function getPeriodStart(period: Period): string {
  const now = new Date();
  switch (period) {
    case "1m": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      return d.toISOString();
    }
    case "3m": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 3);
      return d.toISOString();
    }
    case "1y": {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return d.toISOString();
    }
    case "all":
    default:
      return new Date("2023-04-01").toISOString();
  }
}

function getMRRResolution(period: Period): string {
  switch (period) {
    case "1m": return "day";
    case "3m": return "week";
    case "1y":
    case "all":
    default: return "month";
  }
}

export async function fetchDashboardData(period: Period = "all"): Promise<DashboardData> {
  // Development: use local mock files to avoid RC API rate limits
  if (USE_MOCK) {
    const [overview, mrrMonth, revenueDay, churnDay, trialConv] = await Promise.all([
      readMockFile("overview.json"),
      readMockFile("mrr_month.json"),
      readMockFile("revenue_day.json"),
      readMockFile("churn_day.json"),
      readMockFile("trial_conv.json"),
    ]);
    return {
      overview: (overview as { metrics: OverviewMetric[] }).metrics,
      mrr: mrrMonth as ChartData,
      revenue: revenueDay as ChartData,
      churn: churnDay as ChartData,
      trialConversion: trialConv as ChartData,
      fetchedAt: new Date().toISOString(),
    };
  }

  const now = new Date();
  const end = now.toISOString();
  const startPeriod = getPeriodStart(period);
  const mrrResolution = getMRRResolution(period);

  const overviewRaw = await rcFetch(`/projects/${RC_PROJECT_ID}/metrics/overview`) as { metrics: OverviewMetric[] };
  await new Promise((r) => setTimeout(r, 300));

  const mrrRaw = await rcFetch(
    `/projects/${RC_PROJECT_ID}/charts/mrr?resolution=${mrrResolution}&start_time=${startPeriod}&end_time=${end}`
  ) as ChartData;
  await new Promise((r) => setTimeout(r, 300));

  const revenueRaw = await rcFetch(
    `/projects/${RC_PROJECT_ID}/charts/revenue?resolution=day&start_time=${startPeriod}&end_time=${end}`
  ) as ChartData;
  await new Promise((r) => setTimeout(r, 300));

  const churnRaw = await rcFetch(
    `/projects/${RC_PROJECT_ID}/charts/churn?resolution=day&start_time=${startPeriod}&end_time=${end}`
  ) as ChartData;
  await new Promise((r) => setTimeout(r, 300));

  const trialConversionRaw = await rcFetch(
    `/projects/${RC_PROJECT_ID}/charts/trial_conversion_rate?resolution=day&start_time=${startPeriod}&end_time=${end}`
  ) as ChartData;

  return {
    overview: overviewRaw.metrics,
    mrr: mrrRaw,
    revenue: revenueRaw,
    churn: churnRaw,
    trialConversion: trialConversionRaw,
    fetchedAt: now.toISOString(),
  };
}
