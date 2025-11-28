import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useLiveTransactions } from "@/hooks/useLiveTransactions";

/**
 * Transaction DNA — shows derived fingerprint for latest user / transaction.
 * This is a UI helper showing device+location+amount-range+time-hash etc.
 */

function simpleHash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return (h >>> 0).toString(36).slice(0, 8);
}

export default function TransactionDNA({ txId } = {}) {
  const txs = useLiveTransactions(20) || [];
  const tx = useMemo(() => {
    if (txId) return txs.find((t) => t.id === txId || t.txId === txId) || txs[0];
    return txs[0];
  }, [txs, txId]);

  if (!tx) {
    return (
      <Card className="p-4">
        <h4 className="text-sm font-medium">Transaction DNA</h4>
        <div className="mt-3 text-sm text-muted-foreground">No transaction selected.</div>
      </Card>
    );
  }

  const fingerprintBase = `${tx.userId || tx.userName || "u"}|${tx.device || "device"}|${tx.location ||
    "loc"}|${Math.round(tx.amount || 0)}`;
  const fingerprint = simpleHash(fingerprintBase);
  const human = {
    device: tx.device || "unknown",
    location: tx.location || "unknown",
    avgAmount: tx.avgAmount || tx.amount || 0,
    time: tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "unknown",
  };

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium">Transaction DNA</h4>
      <div className="mt-3 grid gap-2 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Fingerprint</div>
          <div className="font-mono text-sm">{fingerprint}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted-foreground">Device</div>
            <div className="font-medium">{human.device}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="font-medium">{human.location}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Amount</div>
            <div className="font-medium">₹{Number(human.avgAmount).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Time</div>
            <div className="font-medium">{human.time}</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Base: <span className="font-mono">{fingerprintBase}</span>
        </div>
      </div>
    </Card>
  );
}
