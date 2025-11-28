import { useEffect } from "react";
import { useBehavior } from "@/contexts/BehaviorContext";
import { useRealTime } from "@/contexts/RealTimeContext";

export function useBehaviorTracker() {
  const { profiles, updateProfile } = useBehavior();
  const { liveTransactions } = useRealTime();

  useEffect(() => {
    if (!liveTransactions || liveTransactions.length === 0) return;

    const tx = liveTransactions[liveTransactions.length - 1]; // latest
    const userId = tx.userId || "user_001";

    // update real-time behavioral profile
    updateProfile(userId, {
      lastAmount: tx.amount,
      lastLocation: tx.location,
      lastDevice: tx.device,
      lastTime: tx.timestamp,
      lastRisk: tx.risk,
    });

  }, [liveTransactions, updateProfile]);

  return profiles;
}
