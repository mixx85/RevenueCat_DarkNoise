"use client";

import { fmtNum } from "@/lib/format";
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ProcessedChurn } from "@/lib/compute";

function parseDate(label: string): Date {
  const parts = label.split(" ");
  if (parts.length === 2) {
    return new Date(`${parts[0]} ${parts[1]}, ${new Date().getFullYear()}`);
  }
  return new Date(label);
}

function formatChurnLabel(label: string): string {
  const date = parseDate(label);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Donut chart component
function SimpleDonut({ activeSubs, activeTrials }: { activeSubs: number; activeTrials: number }) {
  const total = activeSubs + activeTrials;
  if (total === 0) return <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#9B9895", fontSize: 13 }}>No data</div>;
  const subsAngle = (activeSubs / total) * 360;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const stroke = 22;

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arc(startAngle: number, endAngle: number) {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={180} height={180}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E5E1" strokeWidth={stroke} />
        <path d={arc(0, subsAngle)} fill="none" stroke="#11D483" strokeWidth={stroke} strokeLinecap="round" />
        <path d={arc(subsAngle, 360)} fill="none" stroke="#F2545B" strokeWidth={stroke} strokeLinecap="round" />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={22} fontWeight={700} fill="#1A1A1A">
          {fmtNum(total)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill="#9B9895">
          total
        </text>
      </svg>
      <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#11D483" }} />
          <span style={{ fontSize: 12, color: "#6B6966" }}>Subs: <strong style={{ color: "#1A1A1A" }}>{fmtNum(activeSubs)}</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F2545B" }} />
          <span style={{ fontSize: 12, color: "#6B6966" }}>Trials: <strong style={{ color: "#1A1A1A" }}>{fmtNum(activeTrials)}</strong></span>
        </div>
      </div>
    </div>
  );
}

// Compact churn line chart
function ChurnMiniChart({ churnSeries }: { churnSeries: ProcessedChurn[] }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={churnSeries} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E5E1" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#9B9895" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatChurnLabel}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9B9895" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v.toFixed(2)}%`}
          domain={[0, "auto"]}
          width={40}
        />
        <Tooltip
          formatter={(value) => [`${(value as number).toFixed(2)}%`, "Churn Rate"]}
          labelFormatter={(label) => formatChurnLabel(label as string)}
          contentStyle={{ background: "#1F1F47", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="Churn Rate"
          stroke="#F2545B"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "#F2545B", stroke: "#FFFFFF", strokeWidth: 2 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ChurnChartProps {
  churnSeries: ProcessedChurn[];
  activeSubs: number;
  activeTrials: number;
  period?: string;
}

export function ChurnChart({ churnSeries, activeSubs, activeTrials, period }: ChurnChartProps) {
  const churnSubtitle = period === "1m" ? "Daily churn — last 30 days" :
    period === "3m" ? "Daily churn — last 3 months" :
    period === "1y" ? "Daily churn — last 12 months" :
    "Daily churn — all time";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #E8E5E1", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>Churn Rate</h2>
        <p style={{ fontSize: 12, color: "#6B6966", margin: "0 0 16px 0" }}>{churnSubtitle}</p>
        {churnSeries.length > 0 ? (
          <ChurnMiniChart churnSeries={churnSeries} />
        ) : (
          <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "#9B9895", fontSize: 13 }}>
            No churn data available
          </div>
        )}
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E8E5E1", borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>Subscription Status</h2>
        <p style={{ fontSize: 12, color: "#6B6966", margin: "0 0 12px 0" }}>Current snapshot — active subs vs trials</p>
        <SimpleDonut activeSubs={activeSubs} activeTrials={activeTrials} />
      </div>
    </div>
  );
}
