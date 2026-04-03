import { NextRequest, NextResponse } from "next/server";
import { fetchDashboardData, Period } from "@/lib/revenuecat";
import { computeMetrics } from "@/lib/compute";
import { generateMemo } from "@/lib/insights";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const period = (searchParams.get("range") as Period) || "all";

    const raw = await fetchDashboardData(period);
    const metrics = computeMetrics(
      raw.overview,
      raw.mrr,
      raw.revenue,
      raw.churn,
      raw.trialConversion,
      period
    );

    const memo = await generateMemo({
      appName: "Dark Noise",
      mrr: metrics.mrr,
      mrrWow: metrics.mrrWow,
      activeSubs: metrics.activeSubs,
      subsWow: metrics.mrrWow > 0 ? metrics.activeSubs * (metrics.mrrWow / 100) : 0,
      revenue: metrics.revenue,
      churn: metrics.churn,
      churnWow: metrics.churnWow,
      trialConv: metrics.trialConv,
      trialWow: metrics.trialWow,
    });

    return NextResponse.json({
      metrics,
      memo,
      fetchedAt: raw.fetchedAt,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch data", details: String(err) },
      { status: 500 }
    );
  }
}
