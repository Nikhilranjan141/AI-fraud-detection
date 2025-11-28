// lib/mockTransactions.js
// Simulates a stream of incoming transactions for frontend testing.
// Usage:
//   const stop = startMockStream(tx => console.log(tx), { interval: 800, users: 10 });
//   stop(); // to stop stream

const DEVICE_TYPES = ["mobile", "desktop", "tablet"];
const LOCATIONS = ["Mumbai,IN", "Delhi,IN", "Bengaluru,IN", "Chennai,IN", "Kolkata,IN", "Hyderabad,IN"];
const MERCHANTS = ["PayStore", "UPI-Pay", "QuickShop", "Telecom", "Foodie", "RideNow"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomUserId(numUsers = 50) {
  return `user_${randInt(1, numUsers)}`;
}

function randomAmount() {
  const r = Math.random();
  if (r < 0.75) return Number((Math.random() * 2000 + 10).toFixed(2));
  if (r < 0.95) return Number((Math.random() * 20000 + 2000).toFixed(2));
  return Number((Math.random() * 200000 + 20000).toFixed(2));
}

function randomTimestamp() {
  return Date.now();
}

function randomDevice(userId) {
  // simple bias: some users prefer mobile
  return Math.random() < 0.85 ? "mobile" : randChoice(DEVICE_TYPES);
}

function randomLocation() {
  return randChoice(LOCATIONS);
}

function makeTransaction({ users = 50 } = {}) {
  const userId = randomUserId(users);
  const merchant = randChoice(MERCHANTS);
  const amount = randomAmount();
  const device = randomDevice(userId);
  const location = randomLocation();
  const txn = {
    id: `txn_${Date.now().toString(36)}_${randInt(1000, 9999)}`,
    userId,
    merchant,
    amount,
    currency: "INR",
    device,
    location,
    timestamp: randomTimestamp(),
    // some metadata possible
    metadata: {
      ip: `${randInt(11, 223)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(0,255)}`,
      speed: Number((Math.random() * 2).toFixed(2)), // seconds per action
      sessionLengthSec: randInt(1, 600)
    }
  };
  return txn;
}

function startMockStream(onTransaction, { interval = 1000, users = 50 } = {}) {
  if (typeof onTransaction !== "function") {
    throw new Error("onTransaction callback required");
  }
  const timer = setInterval(() => {
    const tx = makeTransaction({ users });
    onTransaction(tx);
  }, interval);

  return () => clearInterval(timer);
}

export { startMockStream, makeTransaction };
export default { startMockStream, makeTransaction };
