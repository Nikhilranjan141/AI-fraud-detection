// lib/riskCalculator.js
// Given transaction + anomaly detection results, returns a risk object:
// { score, action: 'allow'|'challenge'|'block', recommendedActions: [...], details: { ... } }

function decideAction(score, tx, options = {}) {
  // score: 0..1
  // simple thresholds:
  //   < 0.25 -> allow
  //   0.25-0.6 -> challenge (OTP/MFA)
  //   > 0.6 -> block or manual review
  const recommended = [];
  let action = "allow";

  if (score < 0.25) {
    action = "allow";
  } else if (score < 0.6) {
    action = "challenge";
    recommended.push("otp");
    // if device is new, suggest stronger
    if (tx && tx.device && tx.device !== "mobile") {
      recommended.push("manual_review");
    }
  } else {
    action = "block";
    recommended.push("manual_review");
    if (tx && tx.amount && tx.amount > 100000) {
      recommended.push("freeze_account");
    }
  }

  return { action, recommended };
}

function computeRisk({ tx, anomalyResult, fingerprintCompare = null, profile = null }) {
  const score = anomalyResult && typeof anomalyResult.score === "number" ? anomalyResult.score : 0;

  // augment with business heuristics: high amount, VIP whitelists etc.
  let finalScore = score;

  // amplify for high-value
  if (tx && tx.amount) {
    if (tx.amount > 100000) finalScore = Math.min(1, finalScore + 0.25);
    else if (tx.amount > 50000) finalScore = Math.min(1, finalScore + 0.12);
  }

  // fingerprintCompare might be { same: bool, score: 0..1 }
  if (fingerprintCompare && fingerprintCompare.same === false) {
    // invoice: fingerprintCompare.score small => more different => amplify
    finalScore = Math.min(1, finalScore + (1 - (fingerprintCompare.score || 0)) * 0.2);
  }

  // profile-level escalation (e.g., previously flagged users)
  if (profile && profile.flagged) {
    finalScore = Math.min(1, finalScore + 0.3);
  }

  const { action, recommended } = decideAction(finalScore, tx);

  const details = {
    baseAnomalyScore: score,
    finalScore,
    anomalyReasons: anomalyResult && anomalyResult.reasons ? anomalyResult.reasons : [],
    fingerprintCompare,
  };

  return {
    score: finalScore,
    action,
    recommendedActions: recommended,
    details,
    message: `Risk ${finalScore.toFixed(2)} -> ${action}`,
  };
}

export { computeRisk, decideAction };
export default { computeRisk, decideAction };
