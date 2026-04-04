const RC_API_KEY = process.env.RC_API_KEY!;
const RC_PROJECT_ID = process.env.RC_PROJECT_ID!;
const BASE_URL = "https://api.revenuecat.com/v2";

// Use local mock data: explicitly set OR as fallback when API fails
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

async function fetchFromMockFiles(period: Period = "all"): Promise<DashboardData> {
  const mrrFile = `mrr_${period}.json`;
  const [overview, mrrData, revenueDay, churnDay, trialConv] = await Promise.all([
    readMockFile("overview.json"),
    readMockFile(mrrFile).catch(() => readMockFile("mrr_month.json")),
    readMockFile("revenue_day.json"),
    readMockFile("churn_day.json"),
    readMockFile("trial_conv.json"),
  ]);
  return {
    overview: (overview as { metrics: OverviewMetric[] }).metrics,
    mrr: mrrData as ChartData,
    revenue: revenueDay as ChartData,
    churn: churnDay as ChartData,
    trialConversion: trialConv as ChartData,
    fetchedAt: new Date().toISOString(),
  };
}

// Fetch all-time baseline data (overview + slow-changing charts)
// These are fetched ONCE and shared across all periods
export interface BaselineData {
  overview: OverviewMetric[];
  revenue: ChartData;    // all-time daily — client filters by period
  churn: ChartData;      // all-time daily — client filters by period
  trialConversion: ChartData; // all-time daily — client filters by period
  fetchedAt: string;
}

export async function fetchBaseline(): Promise<BaselineData> {
  if (USE_MOCK) {
    const [overview, revenueDay, churnDay, trialConv] = await Promise.all([
      readMockFile("overview.json"),
      readMockFile("revenue_day.json"),
      readMockFile("churn_day.json"),
      readMockFile("trial_conv.json"),
    ]);
    return {
      overview: (overview as { metrics: OverviewMetric[] }).metrics,
      revenue: revenueDay as ChartData,
      churn: churnDay as ChartData,
      trialConversion: trialConv as ChartData,
      fetchedAt: new Date().toISOString(),
    };
  }

  const now = new Date();
  const end = now.toISOString();
  const start = new Date("2023-04-01").toISOString();

  const overviewRaw = await rcFetch(`/projects/${RC_PROJECT_ID}/metrics/overview`) as { metrics: OverviewMetric[] };
  await new Promise(r => setTimeout(r, 400));
  const revenueRaw = await rcFetch(`/projects/${RC_PROJECT_ID}/charts/revenue?resolution=day&start_time=${start}&end_time=${end}`) as ChartData;
  await new Promise(r => setTimeout(r, 400));
  const churnRaw = await rcFetch(`/projects/${RC_PROJECT_ID}/charts/churn?resolution=day&start_time=${start}&end_time=${end}`) as ChartData;
  await new Promise(r => setTimeout(r, 400));
  const trialConvRaw = await rcFetch(`/projects/${RC_PROJECT_ID}/charts/trial_conversion_rate?resolution=day&start_time=${start}&end_time=${end}`) as ChartData;

  return {
    overview: overviewRaw.metrics,
    revenue: revenueRaw,
    churn: churnRaw,
    trialConversion: trialConvRaw,
    fetchedAt: now.toISOString(),
  };
}

// Fetch only MRR chart for a specific period (different resolution per period)
export async function fetchMRRForPeriod(period: Period): Promise<ChartData> {
  if (USE_MOCK) {
    const mrrFile = `mrr_${period}.json`;
    const data = await readMockFile(mrrFile).catch(() => readMockFile("mrr_month.json"));
    return data as ChartData;
  }

  const now = new Date();
  const end = now.toISOString();
  const start = getPeriodStart(period);
  const resolution = getMRRResolution(period);

  return await rcFetch(
    `/projects/${RC_PROJECT_ID}/charts/mrr?resolution=${resolution}&start_time=${start}&end_time=${end}`
  ) as ChartData;
}

// Fallback-only function: always reads from mock files (used in catch block)
export async function fetchDashboardData(period: Period = "all"): Promise<DashboardData> {
  return fetchFromMockFiles(period);
}
