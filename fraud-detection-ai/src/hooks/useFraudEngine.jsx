import { useState, useEffect } from "react";
import { useRealTime } from "@/contexts/RealTimeContext";

export function useFraudEngine() {
  const { liveTransactions } = useRealTime();

  const [riskScore, setRiskScore] = useState(0);
  const [anomalyReasons, setAnomalyReasons] = useState([]);
  const [dna, setDNA] = useState({
    device: "",
    location: "",
    speed: "",
    pattern: ""
  });

  useEffect(() => {
    if (!liveTransactions || liveTransactions.length === 0) return;

    // आखिरी transaction
    const lastTx = liveTransactions[liveTransactions.length - 1];

    // 🔥 AI Fraud Score (mock ML output)
    const score = Math.floor(Math.random() * 100);

    // 🔍 AI anomaly detection (reasons)
    const reasons = [];
    if (score > 60) reasons.push("Unusual spending pattern detected");
    if (score > 75) reasons.push("New device identified");
    if (score > 85) reasons.push("Behavior deviation from user profile");
    if (score > 92) reasons.push("Location mismatch detected");

    setRiskScore(score);
    setAnomalyReasons(reasons);

    // 🧬 Transaction DNA fingerprint
    setDNA({
      device: lastTx.device || "Android Device",
      location: lastTx.location || "Unknown City",
      speed: `${Math.floor(Math.random() * 500)} ms`,
      pattern: lastTx.type || "Regular Pattern"
    });

  }, [liveTransactions]);

  return {
    riskScore,
    anomalyReasons,
    dna
  };
}
