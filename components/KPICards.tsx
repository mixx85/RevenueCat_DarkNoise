"use client";

import { AreaChart, ResponsiveContainer, Area } from "recharts";
import { ComputedMetrics } from "@/lib/compute";
import { fmtNum, fmtMoney } from "@/lib/format";

function Sparkline({ data, color }: { data: { value: number }[]; color: string }) {
  if (!data || data.length < 2) return <div style={{ height: 36 }} />;
  return (
    <div style={{ height: 36, marginTop: 10 }}>
      <ResponsiveContainer width="100%" height={36}>
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
            fill={`url(#sg-${color.replace("#", "")})`} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPICard({ title, value, delta, sparkData }: {
  title: string;
  value: string;
  delta: number;
  sparkData?: { value: number }[];
}) {
  const isNeutral = Math.abs(delta) < 0.5;
  const isPos = delta > 0;
  const deltaColor = isNeutral ? "#9B9895" : isPos ? "#11D483" : "#F2545B";
  const deltaBg = isNeutral ? "#F5F3F0" : isPos ? "rgba(17,212,131,0.1)" : "rgba(242,84,91,0.1)";
  const deltaText = isNeutral ? "Stable" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}% WoW`;

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E5E1", borderRadius: 12, padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 500, color: "#9B9895", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      <p style={{ fontSize: 38, fontWeight: 800, color: "#1A1A1A", margin: "0 0 10px 0", lineHeight: 1 }}>{value}</p>
      <span style={{ fontSize: 12, fontWeight: 500, color: deltaColor, background: deltaBg, borderRadius: 6, padding: "3px 8px" }}>
        {deltaText}
      </span>
      {sparkData && sparkData.length >= 2 && (
        <Sparkline data={sparkData} color={deltaColor} />
      )}
    </div>
  );
}

export function KPICards({ metrics }: { metrics: ComputedMetrics }) {
  const mrrSpark = metrics.mrrSeries.map((d) => ({ value: d.MRR }));
  const churnSpark = metrics.churnSeries.map((d) => ({ value: d["Churn Rate"] }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      <KPICard title="MRR" value={fmtMoney(metrics.mrr)}
        delta={metrics.mrrWow} sparkData={mrrSpark} />
      <KPICard title="Active Subscriptions" value={fmtNum(metrics.activeSubs)}
        delta={metrics.mrrWow} sparkData={mrrSpark} />
      <KPICard title="Active Trials" value={fmtNum(metrics.activeTrials)}
        delta={0} sparkData={mrrSpark} />
      <KPICard title="Revenue (28d)" value={fmtMoney(metrics.revenue)}
        delta={metrics.revenueWow} sparkData={churnSpark} />
    </div>
  );
}
