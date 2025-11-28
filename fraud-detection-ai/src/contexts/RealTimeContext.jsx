import { createContext, useContext, useEffect, useState } from "react";

import { startMockStream } from "@/lib/mockTransactions";
import BehaviorEngine from "@/lib/behaviorEngine";
import { computeFingerprint, compareFingerprints } from "@/lib/dnaFingerprint";
import { detectAnomaly } from "@/lib/anomalyEngine";
import { computeRisk } from "@/lib/riskCalculator";

const RealTimeContext = createContext();

export const RealTimeProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]); // MAIN DATA
  const [stats, setStats] = useState({
    total: 0,
    fraud: 0,
    safe: 0,
    highRisk: 0,
  });

  const behavior = new BehaviorEngine();
  const recentByUser = new Map();

  useEffect(() => {
    const stop = startMockStream((tx) => {
      // 1️⃣ Update behavior profile per user
      behavior.updateWithTransaction(tx);
      const profile = behavior.getUserProfile(tx.userId);

      // 2️⃣ Track recent transactions per user
      const list = recentByUser.get(tx.userId) || [];
      list.push(tx);
      if (list.length > 20) list.shift();
      recentByUser.set(tx.userId, list);

      // 3️⃣ Compute fingerprint
      const fingerprint = computeFingerprint({
        userId: tx.userId,
        avgAmount: profile.avgAmount,
        devices: profile.devices,
        locations: profile.locations,
        medianHour: Number(Object.keys(profile.hours)[0] || 0),
      });

      const oldFingerprint = profile.fingerprint || null;

      // 4️⃣ Behavior anomaly score
      const behaviorScore = behavior.computeBehaviorScore(tx);

      // 5️⃣ AI anomaly detection engine
      const anomalyResult = detectAnomaly(tx, {
        behaviorScore,
        fingerprint,
        storedFingerprint: oldFingerprint,
        recentTxs: list,
      });

      // 6️⃣ Fingerprint comparison
      const fpCompare = compareFingerprints(fingerprint, oldFingerprint);

      // 7️⃣ Compute final risk score
      const risk = computeRisk({
        tx,
        anomalyResult,
        fingerprintCompare: fpCompare,
        profile,
      });

      // Save fingerprint if not present
      if (!profile.fingerprint) {
        profile.fingerprint = fingerprint;
      }

      // 8️⃣ Update stats
      setStats((s) => ({
        total: s.total + 1,
        fraud: s.fraud + (risk.action === "block" ? 1 : 0),
        highRisk: s.highRisk + (risk.action === "challenge" ? 1 : 0),
        safe: s.safe + (risk.action === "allow" ? 1 : 0),
      }));

      // 9️⃣ Push into global transactions list
      setTransactions((prev) => [
        { ...tx, risk }, // attach risk data
        ...prev.slice(0, 40), // maximum 40 latest
      ]);
    });

    return () => stop();
  }, []);

  return (
    <RealTimeContext.Provider value={{ transactions, stats }}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => useContext(RealTimeContext);
