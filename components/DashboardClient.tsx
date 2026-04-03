"use client";

import { useState } from "react";
import { KPICards } from "./KPICards";
import { WeeklyMemo } from "./WeeklyMemo";
import { MRRChartClient } from "./MRRChartClient";
import { FunnelChart } from "./FunnelChart";
import { ChurnChart } from "./ChurnChart";
import { CopyMarkdownButton } from "./CopyMarkdownButton";
import { ComputedMetrics } from "@/lib/compute";
import { Period } from "@/lib/revenuecat";

type PeriodData = Record<Period, ComputedMetrics>;

const RANGES: { label: string; value: Period }[] = [
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
  { label: "ALL", value: "all" },
];

export function DashboardClient({ periods, memo, fetchedAt, isLive }: {
  periods: PeriodData;
  memo: string;
  fetchedAt: string;
  isLive: boolean;
}) {
  const [period, setPeriod] = useState<Period>("all");
  const metrics = periods[period];

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Nav */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E5E1", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F2545B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h4.5a2.5 2.5 0 010 5H3V3zm0 5h3l3 5H3V8z" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1F1F47" }}>RevenueCat</span>
            <span style={{ color: "#D4D1CC" }}>·</span>
            <span style={{ fontSize: 14, color: "#6B6966" }}>SubInsights</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#9B9895" }}>
              Updated {new Date(fetchedAt).toLocaleTimeString("en-US")}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: isLive ? "rgba(17,212,131,0.1)" : "rgba(232,184,74,0.1)", border: `1px solid ${isLive ? "rgba(17,212,131,0.3)" : "rgba(232,184,74,0.3)"}`, borderRadius: 20, padding: "4px 10px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: isLive ? "#11D483" : "#E8B84A" }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: isLive ? "#11D483" : "#E8B84A" }}>{isLive ? "Live" : "Cached"}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#1F1F47", margin: "0 0 6px 0" }}>Dark Noise — Growth Dashboard</h1>
            <p style={{ fontSize: 13, color: "#6B6966", margin: 0 }}>
              Subscription analytics powered by RevenueCat, with AI-generated growth insights.
            </p>
          </div>
          <CopyMarkdownButton data={{ metrics, memo, fetchedAt, isLive }} period={period} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* KPI — always current snapshot */}
          <KPICards metrics={metrics} />

          {/* AI Weekly Memo */}
          <WeeklyMemo memo={memo} fetchedAt={fetchedAt} />

          {/* Range selector */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E5E1", borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Time range</span>
            <div style={{ display: "flex", gap: 4, background: "#F5F3F0", borderRadius: 8, padding: 3 }}>
              {RANGES.map(({ label, value }) => {
                const isActive = period === value;
                return (
                  <button key={value} onClick={() => setPeriod(value)} style={{
                    background: isActive ? "#FFFFFF" : "transparent",
                    border: isActive ? "1px solid #E8E5E1" : "1px solid transparent",
                    borderRadius: 6, padding: "4px 12px", fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#1A1A1A" : "#6B6966",
                    cursor: "pointer", transition: "all 0.15s ease",
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Charts — instant switch, no server round-trip */}
          <MRRChartClient data={metrics.mrrSeries} defaultRange={period} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FunnelChart data={metrics.funnel} period={period} />
            <ChurnChart churnSeries={metrics.churnSeries} activeSubs={metrics.activeSubs} activeTrials={metrics.activeTrials} period={period} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #E8E5E1", background: "#FFFFFF", marginTop: 32 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "#9B9895", margin: 0 }}>
            🤖 Built by <span style={{ color: "#1F1F47" }}>Tupac</span> (AI agent, operated by Michael Ersh) ·{" "}
            <a href="https://github.com/mixx85/subinsights" style={{ color: "#576CDB", textDecoration: "none" }}>GitHub →</a>
          </p>
          <a href="https://www.revenuecat.com" style={{ fontSize: 12, color: "#F2545B", textDecoration: "none", fontWeight: 500 }}>Powered by RevenueCat →</a>
        </div>
      </div>
    </div>
  );
}
