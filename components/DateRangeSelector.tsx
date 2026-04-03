"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Range = "1m" | "3m" | "1y" | "all";

const RANGES: { label: string; value: Range }[] = [
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
  { label: "ALL", value: "all" },
];

export function DateRangeSelector({ defaultRange }: { defaultRange: string }) {
  const searchParams = useSearchParams();
  const [currentRange, setCurrentRange] = useState<Range>(() => {
    return (searchParams.get("range") as Range) || (defaultRange as Range);
  });

  useEffect(() => {
    const urlRange = searchParams.get("range") as Range;
    if (urlRange && RANGES.some(r => r.value === urlRange)) {
      setCurrentRange(urlRange);
    }
  }, [searchParams]);

  function handleSelect(range: Range) {
    const url = range === "all" ? "/" : `/?range=${range}`;
    window.location.href = url;
  }

  return (
    <div style={{ display: "flex", gap: 4, background: "#F5F3F0", borderRadius: 8, padding: 3 }}>
      {RANGES.map(({ label, value }) => {
        const isActive = currentRange === value;
        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            style={{
              background: isActive ? "#FFFFFF" : "transparent",
              border: isActive ? "1px solid #E8E5E1" : "1px solid transparent",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#1A1A1A" : "#6B6966",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
