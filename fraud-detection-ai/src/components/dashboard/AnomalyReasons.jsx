import React from "react";
import { Card } from "@/components/ui/card";
import { useRealTime } from "@/contexts/RealTimeContext";

function ReasonBadge({ reason }) {
  return (
    <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-xs font-medium">
      {reason}
    </span>
  );
}

export default function AnomalyReasons({ limit = 8 }) {
  const { transactions } = useRealTime();

  const tx = Array.isArray(transactions) ? transactions : [];

  // Build anomaly frequency map
  const reasonsMap = tx.reduce((acc, t) => {
    const reasons =
      t?.risk?.anomalyReasons ||
      t?.risk?.reasons ||
      t?.anomalies ||
      [];

    if (!Array.isArray(reasons)) return acc;

    reasons.forEach((r) => {
      acc[r] = (acc[r] || 0) + 1;
    });

    return acc;
  }, {});

  const reasons = Object.entries(reasonsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold">Top Anomaly Reasons (recent)</h4>

      <div className="mt-3 flex flex-wrap gap-2">
        {reasons.length > 0 ? (
          reasons.map(([reason, count]) => (
            <div key={reason} className="flex items-center gap-2">
              <ReasonBadge reason={reason} />
              <span className="text-xs text-muted-foreground">{count}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No anomalies detected recently.
          </div>
        )}
      </div>
    </Card>
  );
}
