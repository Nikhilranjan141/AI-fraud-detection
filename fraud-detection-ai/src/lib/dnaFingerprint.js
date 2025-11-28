// lib/dnaFingerprint.js
// Compute a deterministic "fingerprint" string for a user given aggregated info.
// This is NOT cryptographic — it's a stable string useful to compare "same vs changed" fingerprint.

function simpleHash(str) {
  // djb2-like
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

function normalize(val) {
  if (val == null) return "";
  if (typeof val === "number") return val.toFixed(2);
  if (Array.isArray(val)) return val.join("|");
  return String(val);
}

/**
 * computeFingerprint(profile)
 * profile: {
 *   userId,
 *   devices: { mobile: count, desktop: count, ... },
 *   locations: { "Delhi,IN": count, ... },
 *   avgAmount,
 *   medianHour, // hour of day user usually transacts
 *   behaviorVector: [..] // optional
 * }
 */
function computeFingerprint(profile = {}) {
  const parts = [
    profile.userId || "anon",
    normalize(profile.avgAmount || 0),
    normalize(profile.medianHour || 0),
    normalize(profile.devices ? Object.entries(profile.devices).map(([k,v])=>`${k}:${v}`).sort().join(",") : ""),
    normalize(profile.locations ? Object.entries(profile.locations).map(([k,v])=>`${k}:${v}`).sort().join(",") : ""),
    normalize(profile.behaviorVector ? profile.behaviorVector.slice(0,6).join(",") : "")
  ];
  const combined = parts.join("||");
  return simpleHash(combined);
}

/**
 * compareFingerprints(a, b) => similarity boolean and score
 */
function compareFingerprints(a, b) {
  if (!a || !b) return { same: false, score: 0 };
  // crude comparison: identical string = same; partial prefix match => partial score
  if (a === b) return { same: true, score: 1 };
  // score based on shared prefix characters
  let i = 0;
  const n = Math.min(a.length, b.length);
  while (i < n && a[i] === b[i]) i++;
  const score = i / Math.max(a.length, b.length);
  return { same: false, score };
}

export { computeFingerprint, compareFingerprints };
export default { computeFingerprint, compareFingerprints };
