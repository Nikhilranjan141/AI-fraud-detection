import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const FraudDetectionContext = createContext(undefined);

const generateRandomTransaction = () => {
  const users = ["John Doe", "Alice Johnson", "Bob Smith", "Carol White", "David Brown", "Emma Wilson"];
  const locations = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai"];
  const risks = ["high", "medium", "low", "safe"];
  const riskWeights = [0.1, 0.15, 0.25, 0.5];
  
  const random = Math.random();
  let risk = "safe";
  let cumulative = 0;
  
  for (let i = 0; i < riskWeights.length; i++) {
    cumulative += riskWeights[i];
    if (random <= cumulative) {
      risk = risks[i];
      break;
    }
  }
  
  const amount = risk === "high" 
    ? Math.floor(Math.random() * 50000) + 50000
    : risk === "medium"
    ? Math.floor(Math.random() * 30000) + 20000
    : Math.floor(Math.random() * 10000) + 1000;
  
  const now = new Date();
  const time = now.toLocaleTimeString();
  
  return {
    id: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    amount,
    user: users[Math.floor(Math.random() * users.length)],
    time,
    risk,
    location: locations[Math.floor(Math.random() * locations.length)],
    device: `Device-${Math.floor(Math.random() * 9999)}`,
    paymentMode: ["UPI", "Card", "Net Banking", "Wallet"][Math.floor(Math.random() * 4)],
  };
};

export const FraudDetectionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [rules, setRules] = useState([
    { id: "1", name: "High Amount Transaction", threshold: 10000, enabled: true },
    { id: "2", name: "Multiple Failed Attempts", threshold: 3, enabled: true },
    { id: "3", name: "Unusual Location", threshold: 100, enabled: true },
    { id: "4", name: "Rapid Transactions", threshold: 5, enabled: false },
  ]);

  const [stats, setStats] = useState({
    highRiskAlerts: 24,
    transactionsMonitored: 1847,
    safeTransactions: 1823,
    activeUsers: 432,
  });

  useEffect(() => {
    const initialTransactions = Array.from({ length: 10 }, generateRandomTransaction);
    setTransactions(initialTransactions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = generateRandomTransaction();
      
      setTransactions(prev => [newTransaction, ...prev].slice(0, 50));
      
      setStats(prev => ({
        highRiskAlerts: prev.highRiskAlerts + (newTransaction.risk === "high" ? 1 : 0),
        transactionsMonitored: prev.transactionsMonitored + 1,
        safeTransactions: prev.safeTransactions + (newTransaction.risk === "safe" ? 1 : 0),
        activeUsers: prev.activeUsers + (Math.random() > 0.8 ? 1 : 0),
      }));

      if (newTransaction.risk === "high") {
        toast.error("High Risk Alert!", {
          description: `₹${newTransaction.amount.toLocaleString("en-IN")} transaction by ${newTransaction.user} from ${newTransaction.location}`,
          duration: 5000,
        });
      } else if (newTransaction.risk === "medium") {
        toast.warning("Medium Risk Detected", {
          description: `₹${newTransaction.amount.toLocaleString("en-IN")} transaction by ${newTransaction.user}`,
          duration: 3000,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateRule = (id, updates) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
    toast.success("Rule Updated", {
      description: "Fraud detection rule has been updated successfully",
    });
  };

  const deleteRule = (id) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
    toast.success("Rule Deleted", {
      description: "Fraud detection rule has been removed",
    });
  };

  const addRule = (rule) => {
    const newRule = {
      ...rule,
      id: Date.now().toString(),
    };
    setRules(prev => [...prev, newRule]);
    toast.success("Rule Added", {
      description: "New fraud detection rule has been added",
    });
  };

  return (
    <FraudDetectionContext.Provider
      value={{
        transactions,
        rules,
        stats,
        updateRule,
        deleteRule,
        addRule,
      }}
    >
      {children}
    </FraudDetectionContext.Provider>
  );
};

export const useFraudDetection = () => {
  const context = useContext(FraudDetectionContext);
  if (!context) {
    throw new Error("useFraudDetection must be used within FraudDetectionProvider");
  }
  return context;
};
