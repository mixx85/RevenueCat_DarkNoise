"use client";

import { AreaChart, ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ProcessedMRR } from "@/lib/compute";
import { Period } from "@/lib/revenuecat";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1F1F47", borderRadius: 8, padding: "8px 12px" }}>
        <p style={{ fontSize: 12, color: "#9B9895", margin: "0 0 4px 0" }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
          ${payload[0].value.toLocaleString("en-US")}
        </p>
      </div>
    );
  }
  return null;
};

// For "all" period: keep only points where date label is non-empty (= years only)
// For other periods: keep all points, show every Nth tick to avoid crowding
function getTickConfig(data: ProcessedMRR[], period: Period): { interval: number | "preserveStartEnd" } {
  if (period === "all") return { interval: 0 }; // show all, but most labels are "" so only years show
  if (period === "1y") return { interval: 1 }; // every other month
  if (period === "3m") return { interval: 0 }; // 3 points, show all
  if (period === "1m") {
    // ~30 daily points, show every 5th
    const step = Math.max(1, Math.floor(data.length / 6));
    return { interval: step };
  }
  return { interval: 0 };
}

export function MRRChartClient({ data, defaultRange }: { data: ProcessedMRR[]; defaultRange: Period }) {
  const subtitle =
    defaultRange === "1m" ? "Daily Revenue — last 30 days" :
    defaultRange === "3m" ? "Monthly MRR — last 3 months" :
    defaultRange === "1y" ? "Monthly MRR — last 12 months" :
    "Monthly MRR — all time";

  const chartTitle = defaultRange === "1m" ? "Daily Revenue" : "MRR Growth";

  const { interval } = getTickConfig(data, defaultRange);

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E5E1", borderRadius: 12, padding: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>{chartTitle}</h2>
      <p style={{ fontSize: 12, color: "#6B6966", margin: "0 0 16px 0" }}>{subtitle}</p>
      <ResponsiveContainer width="100%" height={224}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#11D483" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#11D483" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E5E1" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9B9895" }}
            tickLine={false}
            axisLine={false}
            interval={interval}
            minTickGap={32}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9B9895" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`}
            width={40}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="MRR"
            stroke="#11D483"
            strokeWidth={2}
            fill="url(#mrrGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#11D483", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
