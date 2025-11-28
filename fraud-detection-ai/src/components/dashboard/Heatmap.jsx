import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useRealTime } from "@/contexts/RealTimeContext";

// Size of chips depending on frequency
function sizeForCount(count, max) {
  if (!max) return "text-xs px-2 py-1";
  const pct = count / max;

  if (pct > 0.66) return "text-sm px-3 py-1.5";
  if (pct > 0.33) return "text-sm px-2 py-1";
  return "text-xs px-2 py-0.5";
}

export default function Heatmap({ limit = 20 }) {
  const { transactions } = useRealTime();
  const tx = Array.isArray(transactions) ? transactions : [];

  const byLocation = useMemo(() => {
    const map = {};

    tx.forEach((t) => {
      const loc = t.location || t?.risk?.location || "Unknown";
      map[loc] = (map[loc] || 0) + 1;
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }, [tx, limit]);

  const max = byLocation.length ? byLocation[0][1] : 0;

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium">Transaction Heatmap (by location)</h4>

      <div className="mt-3 flex flex-wrap gap-2">
        {byLocation.length === 0 && (
          <div className="text-sm text-muted-foreground">No data yet.</div>
        )}

        {byLocation.map(([loc, cnt]) => (
          <div
            key={loc}
            className={`rounded-full bg-gradient-to-r from-primary/10 to-primary/20 inline-flex items-center gap-2 ${sizeForCount(
              cnt,
              max
            )}`}
            title={`${loc}: ${cnt}`}
          >
            <span className="font-medium">{loc}</span>
            <span className="text-muted-foreground text-xs font-mono">
              ({cnt})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
