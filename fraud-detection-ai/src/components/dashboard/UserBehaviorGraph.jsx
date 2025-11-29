import React from "react";
import { Card } from "@/components/ui/card";
import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";

export default function UserBehaviorGraph({ top = 6 }) {
  const profiles = useBehaviorTracker() || {};
  const entries = Object.entries(profiles);

  if (!entries.length) {
    return (
      <Card className="p-4">
        <h4 className="text-sm font-medium">User Behavior</h4>
        <div className="mt-4 text-sm text-muted-foreground">No behavior data yet.</div>
      </Card>
    );
  }

  const scored = entries
    .map(([id, p]) => {
      const score = p.activityScore ?? (p.loginCount ? Math.min(100, p.loginCount * 5) : 10);
      return { id, score, meta: p };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, top);

  const max = Math.max(...scored.map((s) => s.score), 1);

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium">Top Users — Behavior Score</h4>

      <div className="mt-4 space-y-3">
        {scored.map((s) => (
          <div key={s.id} className="flex items-center gap-4">
            <div className="w-24 text-xs text-muted-foreground">{s.id}</div>
            <div className="flex-1 bg-muted rounded h-4 overflow-hidden">
              <div
                style={{ width: `${(s.score / max) * 100}%` }}
                className="h-full bg-primary transition-all"
              />
            </div>
            <div className="w-12 text-right font-mono text-sm">{Math.round(s.score)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
