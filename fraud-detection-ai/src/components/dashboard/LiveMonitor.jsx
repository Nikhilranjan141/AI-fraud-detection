import React from "react";
import { Card } from "@/components/ui/card";
import { useLiveTransactions } from "@/hooks/useLiveTransactions";

function TxRow({ tx }) {
  const time = tx?.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : "-";
  const amount = tx?.amount != null ? `₹${Number(tx.amount).toLocaleString()}` : "-";
  const status = tx?.risk?.action || (tx?.isSuspicious ? "suspicious" : "ok");

  const statusClass =
    status === "block"
      ? "text-destructive"
      : status === "challenge" || status === "suspicious"
      ? "text-amber-600"
      : "text-green-600";

  return (
    <div className="grid grid-cols-6 gap-2 items-center py-2 border-b last:border-b-0">
      <div className="col-span-2">
        <div className="text-sm font-medium">{tx?.userName || tx?.userId || "Unknown"}</div>
        <div className="text-xs text-muted-foreground">{tx?.device || "—"} • {tx?.location || "—"}</div>
      </div>
      <div className="text-sm">{amount}</div>
      <div className="text-sm">{tx?.method || "—"}</div>
      <div className={`text-sm font-medium ${statusClass}`}>{status}</div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
}

export default function LiveMonitor({ max = 12 }) {
  const transactions = useLiveTransactions(max) || [];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium">Live Transactions</h3>
      <div className="mt-3 divide-y">
        {transactions.length > 0 ? (
          transactions.map((tx) => <TxRow key={tx.id || tx.txId || JSON.stringify(tx)} tx={tx} />)
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">No live transactions yet.</div>
        )}
      </div>
    </Card>
  );
}
