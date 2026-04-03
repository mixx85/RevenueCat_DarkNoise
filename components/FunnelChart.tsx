"use client";

import { ProcessedFunnel } from "@/lib/compute";
import { fmtNum } from "@/lib/format";

// Fully event-based funnel — no mixing flow/stock
export function FunnelChart({ data, period }: { data: ProcessedFunnel[]; period?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barColors = ["#F2545B", "#11D483", "#576CDB"];
  const rangeLabel = period === "1m" ? "30 days" : period === "3m" ? "3 months" : period === "1y" ? "1 year" : "all time";

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E5E1", borderRadius: 12, padding: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>Growth Funnel</h2>
      <p style={{ fontSize: 12, color: "#6B6966", margin: "0 0 20px 0" }}>Trial starts and conversions — {rangeLabel}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map((item, i) => (
          <div key={item.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#6B6966" }}>{item.name}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{fmtNum(item.value)}</span>
            </div>
            <div style={{ height: 8, background: "#F5F3F0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(item.value / max) * 100}%`,
                background: barColors[i % barColors.length],
                borderRadius: 4,
                transition: "width 0.6s ease"
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
