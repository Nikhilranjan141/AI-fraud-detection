// lib/behaviorEngine.js
// Lightweight in-memory behaviour profiling. Suitable for frontend demo/testing.
// API:
//   initBehaviorEngine(options)
//   updateWithTransaction(tx) -> updates profile
//   getUserProfile(userId)
//   computeBehaviorScore(tx) -> { score: 0..1, reasons: [...] }

const DEFAULTS = {
  decayHalfLifeMs: 1000 * 60 * 60 * 24, // 1 day half-life for historic counts
};

function now() {
  return Date.now();
}

function makeEmptyProfile(userId) {
  return {
    userId,
    firstSeen: now(),
    lastSeen: now(),
    txCount: 0,
    totalAmount: 0,
    avgAmount: 0,
    amounts: [], // small ring buffer if needed
    devices: {}, // counts
    locations: {}, // counts
    hours: {}, // transaction hours counts
    sessionSpeeds: [],
    fingerprint: null,
  };
}

function weightedAvg(prevAvg, prevCount, value) {
  const newCount = prevCount + 1;
  return (prevAvg * prevCount + value) / newCount;
}

class BehaviorEngine {
  constructor(opts = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.profiles = new Map();
    // limit memory by keeping small history per user
    this.maxAmountHistory = this.opts.maxAmountHistory || 20;
  }

  _ensureProfile(userId) {
    if (!this.profiles.has(userId)) {
      this.profiles.set(userId, makeEmptyProfile(userId));
    }
    return this.profiles.get(userId);
  }

  updateWithTransaction(tx) {
    const userId = tx.userId || "anon";
    const p = this._ensureProfile(userId);
    p.lastSeen = tx.timestamp || now();
    p.txCount += 1;
    p.totalAmount += tx.amount || 0;
    p.avgAmount = weightedAvg(p.avgAmount, p.txCount - 1, tx.amount || 0);

    // amounts buffer
    p.amounts = (p.amounts || []).slice(-this.maxAmountHistory);
    p.amounts.push(tx.amount || 0);
    if (p.amounts.length > this.maxAmountHistory) p.amounts.shift();

    // devices
    const d = tx.device || "unknown";
    p.devices[d] = (p.devices[d] || 0) + 1;

    // locations
    const loc = tx.location || "unknown";
    p.locations[loc] = (p.locations[loc] || 0) + 1;

    // hour of day
    const date = new Date(tx.timestamp || now());
    const hr = date.getHours();
    p.hours[hr] = (p.hours[hr] || 0) + 1;

    // session speed
    if (tx.metadata && typeof tx.metadata.speed === "number") {
      p.sessionSpeeds.push(tx.metadata.speed);
      if (p.sessionSpeeds.length > 20) p.sessionSpeeds.shift();
    }

    // optionally compute fingerprint placeholder
    // (actual fingerprint generation is in dnaFingerprint.js — you can call it externally)
    return p;
  }

  getUserProfile(userId) {
    return this.profiles.get(userId) || null;
  }

  computeBehaviorScore(tx) {
    // returns 0..1 where 0 = normal, 1 = extremely unusual
    const p = this.getUserProfile(tx.userId);
    if (!p) {
      // brand new user -> mild risk
      return { score: 0.4, reasons: ["new_user_profile"] };
    }

    const reasons = [];
    let score = 0;

    // Amount deviation (z-like)
    const avg = p.avgAmount || 0;
    const recentAmounts = p.amounts || [];
    const variance =
      recentAmounts.length > 1
        ? recentAmounts.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / (recentAmounts.length - 1)
        : 0.0;
    const std = Math.sqrt(variance || 0.0);
    const amountDelta = Math.abs((tx.amount || 0) - avg);

    if (std > 0) {
      const z = amountDelta / std;
      // z=0 -> normal; z>3 -> strong anomaly
      const amountScore = Math.min(1, z / 6); // scale down
      score += amountScore * 0.5; // weight
      if (amountScore > 0.3) reasons.push("amount_deviation");
    } else {
      // if std==0 and delta large compared to avg (e.g., avg small)
      if (avg < 50 && tx.amount > avg * 10 && tx.amount > 500) {
        score += 0.35;
        reasons.push("large_absolute_amount_for_small_profile");
      }
    }

    // device change
    const deviceSeen = p.devices[tx.device] || 0;
    const totalDevicesCount = Object.values(p.devices).reduce((a, b) => a + b, 0);
    if (deviceSeen === 0 && totalDevicesCount > 0) {
      score += 0.25;
      reasons.push("new_device");
    } else if (deviceSeen > 0 && deviceSeen / Math.max(1, totalDevicesCount) < 0.05) {
      score += 0.12;
      reasons.push("rare_device");
    }

    // location change
    const locSeen = p.locations[tx.location] || 0;
    const totalLocCount = Object.values(p.locations).reduce((a, b) => a + b, 0);
    if (locSeen === 0 && totalLocCount > 0) {
      score += 0.25;
      reasons.push("new_location");
    } else if (locSeen > 0 && locSeen / Math.max(1, totalLocCount) < 0.05) {
      score += 0.12;
      reasons.push("rare_location");
    }

    // time-of-day deviation
    const hour = new Date(tx.timestamp || now()).getHours();
    const hourCount = p.hours[hour] || 0;
    const totalHours = Object.values(p.hours).reduce((a, b) => a + b, 0);
    if (totalHours > 3 && hourCount / totalHours < 0.05) {
      score += 0.12;
      reasons.push("odd_time_of_day");
    }

    // speed/interaction anomaly (fast interactions)
    if (tx.metadata && typeof tx.metadata.speed === "number") {
      const speeds = p.sessionSpeeds || [];
      const avgSpeed = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : null;
      if (avgSpeed != null && tx.metadata.speed < avgSpeed * 0.4) {
        score += 0.08;
        reasons.push("fast_interaction");
      }
    }

    // clamp
    score = Math.max(0, Math.min(1, score));
    return { score, reasons };
  }
}

export default BehaviorEngine;
export { BehaviorEngine };
