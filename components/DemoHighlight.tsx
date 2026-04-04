"use client";

import { useEffect, useState } from "react";

// Demo mode: each section gets highlighted in sequence
// Triggered by ?demo=1 URL param
// Used for screen recording

const HIGHLIGHT_STYLE = {
  outline: "3px solid #F2545B",
  boxShadow: "0 0 0 3px rgba(242,84,91,0.2), 0 0 24px rgba(242,84,91,0.15)",
  borderRadius: 12,
  transition: "all 0.4s ease",
};

const NORMAL_STYLE = {
  outline: "none",
  boxShadow: "none",
  transition: "all 0.4s ease",
};

export function useDemoMode() {
  const [isDemo, setIsDemo] = useState(false);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") {
      setIsDemo(true);
    }

    // Listen for demo events from mouse automation script
    const handler = (e: CustomEvent) => {
      setActiveBlock(e.detail.block);
    };
    window.addEventListener("demo-highlight" as any, handler);
    return () => window.removeEventListener("demo-highlight" as any, handler);
  }, []);

  const getBlockStyle = (blockId: string) => {
    if (!isDemo) return {};
    return activeBlock === blockId ? HIGHLIGHT_STYLE : NORMAL_STYLE;
  };

  return { isDemo, activeBlock, getBlockStyle };
}
