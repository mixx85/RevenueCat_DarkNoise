"use client";

interface WeeklyMemoProps {
  memo: string;
  fetchedAt: string;
}

function processMemoLine(line: string): { type: "verdict" | "bullet" | "action" | "heading" | "text"; content: string } {
  // Check for emoji verdict at start of line
  if (/^[🟢🟡🔴]\s/.test(line)) {
    const emoji = line[0];
    const text = line.slice(2); // skip emoji + space
    const dotColor = emoji === "🟢" ? "#11D483" : emoji === "🔴" ? "#F2545B" : "#E8B84A";
    const labelText = emoji === "🟢" ? "[GOOD]" : emoji === "🔴" ? "[ALERT]" : "[STABLE]";
    return { type: "verdict", content: JSON.stringify({ text, dotColor, labelText }) };
  }
  if (line.startsWith("•") || line.startsWith("−") || line.startsWith("-") || line.startsWith("*")) {
    return { type: "bullet", content: line.replace(/^[•\−\-\*]\s*/, "") };
  }
  if (line.startsWith("→")) {
    return { type: "action", content: line.replace(/^→\s*/, "") };
  }
  if (line.match(/^(Key findings|Actions|Findings):/i)) {
    return { type: "heading", content: line };
  }
  return { type: "text", content: line };
}

export function WeeklyMemo({ memo, fetchedAt }: WeeklyMemoProps) {
  const lines = memo.split("\n").filter((l) => l.trim());

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E5E1", borderRadius: 12, padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>Weekly Growth Memo</h2>
        <p style={{ fontSize: 12, color: "#9B9895", margin: 0 }}>
          {new Date(fetchedAt).toLocaleString("en-US")} · AI insights
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {lines.map((line, i) => {
          const parsed = processMemoLine(line);

          if (parsed.type === "verdict") {
            try {
              const { text, dotColor, labelText } = JSON.parse(parsed.content);
              return (
                <p key={i} style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
                  <span style={{ color: dotColor, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>{labelText}</span>
                  <span style={{ color: "#1A1A1A" }}>{text}</span>
                </p>
              );
            } catch {
              return <p key={i} style={{ fontSize: 15, color: "#1A1A1A", margin: "0 0 4px 0" }}>{line}</p>;
            }
          }

          if (parsed.type === "bullet") {
            return (
              <div key={i} style={{ display: "flex", gap: 8, paddingLeft: 4 }}>
                <span style={{ color: "#11D483", marginTop: 2, flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 13, color: "#6B6966", lineHeight: 1.6 }}>
                  {parsed.content}
                </span>
              </div>
            );
          }

          if (parsed.type === "action") {
            // Add "Growth Recommendations" header before first action item
            const prevLine = lines[i - 1]?.trim() || "";
            const isFirstAction = !prevLine.startsWith("→");
            return (
              <>
                {isFirstAction && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9895", textTransform: "uppercase", letterSpacing: "0.08em", margin: "8px 0 4px 0" }}>
                    Growth Recommendations
                  </p>
                )}
                <div key={i} style={{ display: "flex", gap: 8, paddingLeft: 8, marginTop: 2 }}>
                  <span style={{ color: "#576CDB", flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.5 }}>
                    {parsed.content}
                  </span>
                </div>
              </>
            );
          }

          if (parsed.type === "heading") {
            return (
              <p key={i} style={{ fontSize: 11, fontWeight: 600, color: "#9B9895", textTransform: "uppercase", letterSpacing: "0.08em", margin: "8px 0 2px 0" }}>
                {parsed.content}
              </p>
            );
          }

          return (
            <p key={i} style={{ fontSize: 13, color: "#6B6966", lineHeight: 1.6, margin: 0 }}>
              {parsed.content}
            </p>
          );
        })}
      </div>
    </div>
  );
}
