import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFraudEngine } from "@/hooks/useFraudEngine";

export default function AlertsPanel({ max = 10 }) {
  const report = useFraudEngine() || {};
  const recent = report.recent || [];
  const initialAlerts = recent
    .filter((t) => t?.risk && (t.risk.action === "block" || t.risk.action === "challenge" || t.isSuspicious))
    .slice(0, max);

  const [alerts, setAlerts] = useState(initialAlerts);

  function dismiss(id) {
    setAlerts((s) => s.filter((a) => (a.id || a.txId) !== id));
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Active Alerts</h3>
        <Button variant="ghost" size="sm" onClick={() => setAlerts([])}>
          Clear
        </Button>
      </div>

      <div className="mt-3 space-y-3">
        {alerts.length === 0 && (
          <div className="text-sm text-muted-foreground">No active alerts.</div>
        )}

        {alerts.map((a) => {
          const id = a.id || a.txId || JSON.stringify(a);
          const reason = (a.risk && a.risk.reasons && a.risk.reasons.join(", ")) || a?.anomalies?.join?.(", ") || "Suspicious activity";
          const score = a?.risk?.score ?? a?.score ?? null;

          return (
            <div key={id} className="border rounded-md p-3 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{a?.userName || a?.userId || "Unknown user"}</div>
                  <div className="text-xs text-muted-foreground">• {a?.location || "unknown"}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{reason}</div>
                {score != null && <div className="text-xs font-mono mt-1">Risk score: {score}</div>}
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <Button size="sm" variant="ghost" onClick={() => dismiss(id)}>Dismiss</Button>
                <a href={`/transactions/${id}`} className="text-sm text-primary">View</a>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
