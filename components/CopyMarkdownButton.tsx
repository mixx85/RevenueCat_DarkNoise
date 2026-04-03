"use client";

import { useState } from "react";
import { Period } from "@/lib/revenuecat";

interface CopyMarkdownButtonProps {
  data: {
    metrics: {
      mrr: number;
      mrrWow: number;
      activeSubs: number;
      revenue: number;
      churn: number;
      churnWow: number;
      trialConv: number;
      trialWow: number;
      funnel: Array<{ name: string; value: number }>;
    };
    memo: string;
    fetchedAt: string;
    isLive?: boolean;
  };
  period: Period;
}

export function CopyMarkdownButton({ data, period }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const periodLabel = period === "all" ? "All time" : period === "1y" ? "Last 1 Year" : period === "3m" ? "Last 3 Months" : "Last 1 Month";
    const m = data.metrics;
    let md = `# Weekly Growth Memo — Dark Noise\n_Generated ${new Date(data.fetchedAt).toLocaleDateString("en-US")} · Chart range: ${periodLabel}_\n\n`;
    md += data.memo + "\n\n";
    md += `## Dashboard Data\n\n`;
    md += `**MRR:** $${m.mrr.toLocaleString("en-US")} (${m.mrrWow > 0 ? "+" : ""}${m.mrrWow.toFixed(1)}% WoW)\n\n`;
    md += `**Active Subscriptions:** ${m.activeSubs.toLocaleString("en-US")}\n\n`;
    md += `**Revenue:** $${m.revenue.toLocaleString("en-US")}\n\n`;
    md += `**Churn Rate:** ${m.churn.toFixed(2)}% (${m.churnWow > 0 ? "+" : ""}${m.churnWow.toFixed(1)}% WoW)\n\n`;
    md += `**Trial Conversion:** ${m.trialConv.toFixed(1)}% (${m.trialWow > 0 ? "+" : ""}${m.trialWow.toFixed(1)}% WoW)\n\n`;
    if (m.funnel && m.funnel.length > 0) {
      md += `## Growth Funnel\n\n`;
      m.funnel.forEach((item) => {
        md += `- **${item.name}:** ${item.value.toLocaleString("en-US")}\n`;
      });
    }
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "#576CDB", color: "#fff", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}
    >
      {copied ? "Copied!" : "Copy as Markdown"}
    </button>
  );
}
