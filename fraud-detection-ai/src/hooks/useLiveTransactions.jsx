import { useState, useEffect } from "react";

export function useLiveTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = {
        id: Date.now(),
        amount: Math.floor(Math.random() * 50000) + 1000,
        location: ["Delhi", "Mumbai", "Pune", "Bangalore"][Math.floor(Math.random() * 4)],
        device: ["Mobile", "Laptop", "Tablet"][Math.floor(Math.random() * 3)],
        timestamp: new Date().toLocaleTimeString(),
        risk: ["low", "medium", "high"][Math.floor(Math.random() * 3)]
      };

      setTransactions((prev) => [newTx, ...prev].slice(0, 30));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { transactions };
}
