// lib/anomalyEngine.js
// Combines behaviorEngine and fingerprint checks to produce anomaly warnings.
// Usage:
//   const res = detectAnomaly(tx, { profile, fingerprintCompareResult, recentTxs });
//   res = { anomaly: true/false, score: 0..1, reasons: [...] }

import { compareFingerprints } from "./dnaFingerprint.js"; // ensure relative path correct in your project

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

/**
 * detectAnomaly(tx, context)
 * context: {
 *   profile, // from behaviorEngine.getUserProfile(tx.userId)
 *   behaviorScore: {score, reasons},
 *   fingerprint, // current computed fingerprint for this tx's user (string)
 *   storedFingerprint, // stored from profile (string)
 *   recentTxs: [] // array of recent transactions of same user
 * }
 */
function detectAnomaly(tx, context = {}) {
  const reasons = [];
  let score = 0;

  // behavior score contribution
  if (context.behaviorScore && typeof context.behaviorScore.score === "number") {
    score += clamp01(context.behaviorScore.score) * 0.5;
    if (context.behaviorScore.reasons && context.behaviorScore.reasons.length) {
      reasons.push(...context.behaviorScore.reasons.map(r => `behavior:${r}`));
    }
  }

  // fingerprint mismatch
  if (context.fingerprint && context.storedFingerprint) {
    const cmp = compareFingerprints(context.fingerprint, context.storedFingerprint);
    // if totally different -> high contribution
    if (!cmp.same) {
      const fpScore = 1 - cmp.score; // more different => closer to 1
      score += clamp01(fpScore) * 0.35;
      reasons.push(`fingerprint_mismatch:${(fpScore).toFixed(2)}`);
    }
  } else if (!context.storedFingerprint) {
    // no stored fingerprint means new user or not computed; mild contribution
    score += 0.08;
    reasons.push("no_stored_fingerprint");
  }

  // velocity check: many txs in short time
  if (Array.isArray(context.recentTxs)) {
    const nowTs = tx.timestamp || Date.now();
    const windowMs = 1000 * 60; // 1 minute
    const withinWindow = context.recentTxs.filter(t => (nowTs - (t.timestamp || nowTs)) <= windowMs);
    const cnt = withinWindow.length;
    if (cnt > 3) {
      // suspicious rapid transactions
      const velScore = clamp01((cnt - 3) / 10);
      score += velScore * 0.3;
      reasons.push(`velocity:${cnt}tx/min`);
    }
  }

  // amount spike check (absolute)
  if (tx.amount && tx.amount > 50000) {
    // high absolute amount — add risk
    const amtExtra = Math.min(1, (tx.amount - 50000) / 200000);
    score += amtExtra * 0.3;
    reasons.push("high_absolute_amount");
  }

  // combine and clamp
  score = clamp01(score);

  // decide anomaly boolean
  // threshold is configurable; here we use 0.45
  const anomaly = score >= 0.45;

  // XAI explainers: return reasons and partial contributions
  return {
    anomaly,
    score,
    reasons,
    explanation: `Anomaly score ${score.toFixed(2)} (threshold 0.45). Reasons: ${reasons.join(", ")}`,
  };
}

export { detectAnomaly };
export default { detectAnomaly };
