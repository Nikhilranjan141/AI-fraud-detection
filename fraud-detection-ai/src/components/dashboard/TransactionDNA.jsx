import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useLiveTransactions } from "@/hooks/useLiveTransactions";
import { Fingerprint } from "lucide-react";

function simpleHash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return (h >>> 0).toString(36).slice(0, 8);
}

const MOCK_SMART_CONTRACT_STATE = {
    escrow: "Active (Tokenized)",
    validationMethod: "Multi-party Signatures",
    encryptionStandard: "AES-256 (E2EE)", 
};

export default function TransactionDNA({ txId } = {}) {
  
  const { transactions: txs } = useLiveTransactions(20) || {}; 
 
  const tx = useMemo(() => {
    if (!txs || txs.length === 0) return null;
    if (txId) return txs.find((t) => t.id === txId || t.txId === txId) || txs[0];
    return txs[0]; 
  }, [txs, txId]);

  if (!tx) {
    return (
      <Card className="p-4 h-[350px]">
        <h4 className="text-sm font-medium">Transaction DNA & Security Trace</h4>
        <div className="mt-3 text-sm text-muted-foreground">No recent transaction data available.</div>
      </Card>
    );
  }
  
  const userId = tx.userId || tx.user || "u";
const device = tx.device || "device";
const location = tx.location || "loc";
const amount = Math.round(tx.amount || 0);

const fingerprintBase = `${userId}|${device}|${location}|${amount}`;
const fingerprint = simpleHash(fingerprintBase);

  
  const human = {
    device: tx.device || "Unknown Device",
    location: tx.location || "Unknown Location",
    avgAmount: tx.amount || 0,
    time: tx.timestamp || (tx.time ? tx.time : "N/A"),
  };

  return (
    <Card className="p-4 h-full">
      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Fingerprint className="h-5 w-5 text-primary" /> Transaction DNA & Security Trace
      </h4> 
      <div className="mt-4 grid gap-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Fingerprint (Hashed for Integrity)</div>
          <div className="font-mono text-base font-semibold text-primary">{fingerprint}</div>
        </div>

        <div className="pt-2 border-t border-border space-y-2">
            <h5 className="font-semibold text-sm text-primary/80">Security Layer (Encryption & Immutability)</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <div className="text-xs text-muted-foreground">E2E Encryption</div>
                    <div className="font-medium">{MOCK_SMART_CONTRACT_STATE.encryptionStandard}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Smart Contract Status</div>
                    <div className="font-medium">{MOCK_SMART_CONTRACT_STATE.escrow}</div>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 border-t pt-2 border-border">
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

        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          Base Data Hash: <span className="font-mono">{fingerprintBase}</span>
        </div>
      </div>
    </Card>
  );
}