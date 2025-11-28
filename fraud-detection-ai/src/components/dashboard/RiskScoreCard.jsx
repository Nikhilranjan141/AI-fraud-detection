import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFraudEngine } from "@/hooks/useFraudEngine";

export default function RiskScoreCard() {
  const report = useFraudEngine() || {};
  const total = Math.max(report.blocked + report.highRisk + report.safe, 1);

  const blockedPct = Math.round((report.blocked / total) * 100) || 0;
  const highRiskPct = Math.round((report.highRisk / total) * 100) || 0;
  const safePct = Math.round((report.safe / total) * 100) || 0;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Risk Summary</h3>
        <Button variant="ghost" size="sm">Refresh</Button>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Blocked</span>
            <span className="font-mono">{report.blocked ?? 0}</span>
          </div>
          <Progress value={blockedPct} />
          <div className="text-xs text-muted-foreground mt-1">{blockedPct}% of recent</div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">High Risk (Challenge)</span>
            <span className="font-mono">{report.highRisk ?? 0}</span>
          </div>
          <Progress value={highRiskPct} />
          <div className="text-xs text-muted-foreground mt-1">{highRiskPct}% of recent</div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Allowed / Safe</span>
            <span className="font-mono">{report.safe ?? 0}</span>
          </div>
          <Progress value={safePct} />
          <div className="text-xs text-muted-foreground mt-1">{safePct}% of recent</div>
        </div>
      </div>
    </Card>
  );
}
