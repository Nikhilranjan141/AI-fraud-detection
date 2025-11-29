// import { createContext, useContext, useState, useEffect } from "react";
// import { toast } from "sonner";

// const FraudDetectionContext = createContext(undefined);

// // Define a static set of users and their last known location and failed attempts count
// const userProfiles = {
//     "John Doe": { lastLocation: "Mumbai", failedAttempts: 0 },
//     "Alice Johnson": { lastLocation: "Delhi", failedAttempts: 0 },
//     "Bob Smith": { lastLocation: "Bangalore", failedAttempts: 0 },
//     "Carol White": { lastLocation: "Pune", failedAttempts: 0 },
//     "David Brown": { lastLocation: "Hyderabad", failedAttempts: 0 },
//     "Emma Wilson": { lastLocation: "Chennai", failedAttempts: 0 },
// };

// const generateRandomTransaction = (rules) => {
//     const users = Object.keys(userProfiles);
//     const locations = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Jaipur"]; // Added new location
    
//     const randomUser = users[Math.floor(Math.random() * users.length)];
//     const profile = userProfiles[randomUser];
    
//     // --- Rule Simulation Logic ---
//     let risk = "safe";
//     const reasons = [];

//     // 1. Unusual Location Change Alert
//     const isNewLocation = Math.random() < 0.2; // 20% chance of new location
//     const newLocation = isNewLocation ? locations[Math.floor(Math.random() * locations.length)] : profile.lastLocation;
    
//     if (isNewLocation && newLocation !== profile.lastLocation) {
//         const locationRule = rules.find(r => r.name === "Unusual Location Change" && r.enabled);
//         if (locationRule) {
//             risk = "medium";
//             reasons.push("Unusual location change");
//         }
//     }
//     profile.lastLocation = newLocation; // Update profile

//     // 2. Multiple Failed Attempts Alert
//     const isFailedAttempt = Math.random() < 0.15; // 15% chance of a failed attempt
//     const failedRule = rules.find(r => r.name === "Multiple Failed Attempts" && r.enabled);

//     if (isFailedAttempt) {
//         profile.failedAttempts += 1;
//         if (failedRule && profile.failedAttempts >= failedRule.threshold) {
//             risk = "high";
//             reasons.push("Multiple failed login/transaction attempts");
//         }
//     } else if (profile.failedAttempts > 0) {
//         // Reset attempts after a successful transaction
//         profile.failedAttempts = 0;
//     }

//     // 3. High Amount Transaction Rule (Existing Logic)
//     const highAmountRule = rules.find(r => r.name === "High Amount Transaction" && r.enabled);
//     const amount = Math.floor(Math.random() * 50000) + 1000;
    
//     if (highAmountRule && amount > highAmountRule.threshold && risk === "safe") {
//         risk = "medium";
//         reasons.push("High value transaction");
//     }

//     // --- Risk Finalization ---
//     if (reasons.length === 0) {
//         // Default risk setting based on remaining small chance
//         const random = Math.random();
//         if (random < 0.05) risk = "high";
//         else if (random < 0.2) risk = "medium";
//         else risk = "safe";
//     }

//     const now = new Date();
//     const time = now.toLocaleTimeString();
    
//     return {
//     id: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
//     amount,
//     user: randomUser,
//     time,
//     risk,
//     location: newLocation,
//     device: `Device-${Math.floor(Math.random() * 9999)}`,
//     paymentMode: ["UPI", "Card", "Net Banking", "Wallet"][Math.floor(Math.random() * 4)],
//     reasons: reasons,
// };

// };

// export const FraudDetectionProvider = ({ children }) => {
//     const [transactions, setTransactions] = useState([]);
//     const [rules, setRules] = useState([
//         { id: "1", name: "High Amount Transaction", threshold: 10000, enabled: true },
//         { id: "2", name: "Multiple Failed Attempts", threshold: 3, enabled: true }, // Updated rule name
//         { id: "3", name: "Unusual Location Change", threshold: 100, enabled: true }, // Updated rule name
//         { id: "4", name: "Rapid Transactions", threshold: 5, enabled: false }, // Existing rule
//     ]);

//     const [stats, setStats] = useState({
//         highRiskAlerts: 24,
//         transactionsMonitored: 1847,
//         safeTransactions: 1823,
//         activeUsers: 432,
//     });

//     // Initial setup with mock transactions
//     useEffect(() => {
//         const initialTransactions = Array.from({ length: 10 }, () => generateRandomTransaction(rules));
//         setTransactions(initialTransactions);
//     }, []);

//     // Real-time transaction simulation
//     useEffect(() => {
//         const interval = setInterval(() => {
//             const newTransaction = generateRandomTransaction(rules);
            
//             setTransactions(prev => [newTransaction, ...prev].slice(0, 50));
            
//             // Update Stats
//             setStats(prev => ({
//                 highRiskAlerts: prev.highRiskAlerts + (newTransaction.risk === "high" ? 1 : 0),
//                 transactionsMonitored: prev.transactionsMonitored + 1,
//                 safeTransactions: prev.safeTransactions + (newTransaction.risk === "safe" ? 1 : 0),
//                 activeUsers: prev.activeUsers + (Math.random() > 0.8 ? 1 : 0),
//             }));

//             // Trigger Toasts based on risk and reasons
//             if (newTransaction.risk === "high" || newTransaction.reasons.length > 0) {
//                 const description = newTransaction.reasons.length > 0 
//   ? newTransaction.reasons.join(", ") 
//   : `Transaction by ${newTransaction.user} from ${newTransaction.location}`;


//                 if (newTransaction.risk === "high") {
//                     toast.error("🚨 High Risk Alert!", {
//                         description: description,
//                         duration: 5000,
//                     });
//                 } else if (newTransaction.risk === "medium") {
//                     toast.warning("🔔 Medium Risk Detected", {
//                         description: description,
//                         duration: 3000,
//                     });
//                 }
//             }
//         }, 5000); // New transaction every 5 seconds

//         return () => clearInterval(interval);
//     }, [rules]); // Rerun effect if rules change

//     const updateRule = (id, updates) => {
//         setRules(prev => prev.map(rule => 
//             rule.id === id ? { ...rule, ...updates } : rule
//         ));
//         toast.success("Rule Updated", {
//             description: "Fraud detection rule has been updated successfully",
//         });
//     };

//     const deleteRule = (id) => {
//         setRules(prev => prev.filter(rule => rule.id !== id));
//         toast.success("Rule Deleted", {
//             description: "Fraud detection rule has been removed",
//         });
//     };

//     const addRule = (rule) => {
//         const newRule = {
//             ...rule,
//             id: Date.now().toString(),
//         };
//         setRules(prev => [...prev, newRule]);
//         toast.success("Rule Added", {
//             description: "New fraud detection rule has been added",
//         });
//     };

//     return (
//         <FraudDetectionContext.Provider
//             value={{
//                 transactions,
//                 rules,
//                 stats,
//                 updateRule,
//                 deleteRule,
//                 addRule,
//             }}
//         >
//             {children}
//         </FraudDetectionContext.Provider>
//     );
// };

// export const useFraudDetection = () => {
//     const context = useContext(FraudDetectionContext);
//     if (!context) {
//         throw new Error("useFraudDetection must be used within FraudDetectionProvider");
//     }
//     return context;
// };











import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const FraudDetectionContext = createContext(undefined);

// Define a static set of users and their last known location and failed attempts count
const userProfiles = {
    "John Doe": { lastLocation: "Mumbai", failedAttempts: 0 },
    "Alice Johnson": { lastLocation: "Delhi", failedAttempts: 0 },
    "Bob Smith": { lastLocation: "Bangalore", failedAttempts: 0 },
    "Carol White": { lastLocation: "Pune", failedAttempts: 0 },
    "David Brown": { lastLocation: "Hyderabad", failedAttempts: 0 },
    "Emma Wilson": { lastLocation: "Chennai", failedAttempts: 0 },
};

const generateRandomTransaction = (rules) => {
    const users = Object.keys(userProfiles);
    const locations = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Jaipur"];
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const profile = userProfiles[randomUser];
    
    let risk = "safe";
    const reasons = [];
    const amount = Math.floor(Math.random() * 50000) + 1000;
    
    // --- 1. Rule Processing Logic (Checks ALL rules, including user-added ones) ---
    
    rules.forEach(rule => {
        if (!rule.enabled) return;

        let ruleBreached = false;
        
        // A. Hardcoded Rules (Based on specific context logic)
        if (rule.name === "Unusual Location Change") {
            const isNewLocation = Math.random() < 0.05; // 5% chance
            const newLocation = isNewLocation ? locations[Math.floor(Math.random() * locations.length)] : profile.lastLocation;
            if (isNewLocation && newLocation !== profile.lastLocation) {
                ruleBreached = true;
                profile.lastLocation = newLocation;
            }
        }
        
        if (rule.name === "Multiple Failed Attempts") {
            const isFailedAttempt = Math.random() < 0.03; // 3% chance
            if (isFailedAttempt) {
                profile.failedAttempts += 1;
            } else if (profile.failedAttempts > 0) {
                profile.failedAttempts = 0; // Reset attempts on successful transaction
            }
            if (profile.failedAttempts >= rule.threshold) {
                ruleBreached = true;
            }
        }
        
        // B. Generic / User-Defined Rules (Simulated based on Amount or Chance)
        // If the rule name doesn't match a hardcoded logic, we apply a generic check.
        if (rule.name === "High Amount Transaction" || (!["Unusual Location Change", "Multiple Failed Attempts", "Rapid Transactions"].includes(rule.name))) {
            
            // Simulation: 15% chance of breaching a custom rule, OR if amount is significantly higher than the custom threshold
            if (Math.random() < 0.15 || amount > (rule.threshold * 2)) {
                 ruleBreached = true;
            }
        }

        // --- Apply Risk based on breach ---
        if (ruleBreached) {
            reasons.push(rule.name);
            
            // Determine severity of risk based on threshold magnitude (for custom rules)
            if (rule.threshold >= 20000) {
                // High thresholds often imply high risk (e.g., very high amount)
                risk = "high";
            } else if (risk !== "high") {
                // Otherwise, set to medium risk if not already high
                risk = "medium";
            }
        }
    });

    // --- 2. Risk Finalization (Fallback) ---
    if (reasons.length === 0) {
        // Default risk setting based on remaining small chance
        const random = Math.random();
        if (random < 0.005) risk = "high";
        else if (random < 0.02) risk = "medium";
        else risk = "safe";
    }
    
    const newLocation = profile.lastLocation;
    const now = new Date();
    const time = now.toLocaleTimeString();
    
    return {
    id: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    amount,
    user: randomUser,
    time,
    risk,
    location: newLocation,
    device: `Device-${Math.floor(Math.random() * 9999)}`,
    paymentMode: ["UPI", "Card", "Net Banking", "Wallet"][Math.floor(Math.random() * 4)],
    reasons: Array.from(new Set(reasons)), // Ensure unique reasons
};

};

export const FraudDetectionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [rules, setRules] = useState([
        { id: "1", name: "High Amount Transaction", threshold: 10000, enabled: true },
        { id: "2", name: "Multiple Failed Attempts", threshold: 3, enabled: true }, 
        { id: "3", name: "Unusual Location Change", threshold: 100, enabled: true }, 
        { id: "4", name: "Rapid Transactions", threshold: 5, enabled: false }, 
    ]);

    const [stats, setStats] = useState({
        highRiskAlerts: 24,
        transactionsMonitored: 1847,
        safeTransactions: 1823,
        activeUsers: 432,
    });

    // Initial setup with mock transactions
    useEffect(() => {
        const initialTransactions = Array.from({ length: 10 }, () => generateRandomTransaction(rules));
        setTransactions(initialTransactions);
    }, []);

    // Real-time transaction simulation
    useEffect(() => {
        const interval = setInterval(() => {
    // Generate transaction using the LATEST rules state
    const newTransaction = generateRandomTransaction(rules);

    setTransactions(prev => [newTransaction, ...prev].slice(0, 50));

    // Update Stats
    setStats(prev => ({
        highRiskAlerts: prev.highRiskAlerts + (newTransaction.risk === "high" ? 1 : 0),
        transactionsMonitored: prev.transactionsMonitored + 1,
        safeTransactions: prev.safeTransactions + (newTransaction.risk === "safe" ? 1 : 0),
        activeUsers: prev.activeUsers + (Math.random() > 0.8 ? 1 : 0),
    }));

    // Trigger Toasts
    if (newTransaction.risk === "high" || newTransaction.risk === "medium") {
        const description = newTransaction.reasons.length > 0 
            ? newTransaction.reasons.join(", ") 
            : "Risk detected by system rules.";

        if (newTransaction.risk === "high") {
            toast.error(`🚨 HIGH RISK: ${newTransaction.user}`, {
                description,
                duration: 5000,
            });
        } else {
            toast.warning(`🔔 MEDIUM RISK: ${newTransaction.user}`, {
                description,
                duration: 3000,
            });
        }
    }

}, 5000); // <-- CORRECT place for timeout
 // New transaction every 5 seconds

        return () => clearInterval(interval);
    }, [rules]); // IMPORTANT: Rerun effect if rules change

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
        // Check if a rule with the same name already exists
        if (rules.some(r => r.name === newRule.name)) {
             toast.error("Error", {
               description: `Rule name '${newRule.name}' already exists.`,

            });
            return;
        }
        setRules(prev => [...prev, newRule]);
        toast.success("Rule Added", {
           description: `New rule ${newRule.name} has been added and is active.`,

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