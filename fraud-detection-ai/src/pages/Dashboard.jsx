import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🔐 Auth Context
import { useAuth } from "@/contexts/AuthContext";

// 🧩 Existing Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsOverview from "@/components/dashboard/StatsOverview";
import TransactionFeed from "@/components/dashboard/TransactionFeed";
import FraudChart from "@/components/dashboard/FraudChart";
import AdminPanel from "@/components/dashboard/AdminPanel";

// 🤖 NEW AI Fraud Components
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import AnomalyReasons from "@/components/dashboard/AnomalyReasons";
import LiveMonitor from "@/components/dashboard/LiveMonitor";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import UserBehaviorGraph from "@/components/dashboard/UserBehaviorGraph";
import Heatmap from "@/components/dashboard/Heatmap";
import TransactionDNA from "@/components/dashboard/TransactionDNA";

// ⭐ Core Feature Components
import ExpenseTrackerCard from "@/components/dashboard/ExpenseTrackerCard"; 
import PaymentDemoCard from "@/components/dashboard/PaymentDemoCard"; 

// ⭐ NEW FEATURE COMPONENTS
import BlockchainWalletCard from "@/components/dashboard/BlockchainWalletCard"; // <-- NEW WALLET IMPORTED
import FinancialLiteracyCard from "@/components/dashboard/FinancialLiteracyCard"; // <-- NEW LITERACY MODULE IMPORTED

// 🤖 NEW AI Chatbot Component
import AIChatbot from "@/components/AIChatbot"; 

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // 🔄 Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeView={activeView} setActiveView={setActiveView} />

      {activeView === "dashboard" ? (
        <main className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

          {/* ⭐ ROW 1: AI STATS OVERVIEW */}
          <StatsOverview />

            {/* ⭐ ROW 2: BLOCKCHAIN WALLET, API, and SECURITY TRACE (3 equal columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Blockchain Wallet Card (Web3/UPI Remittance) */}
                <BlockchainWalletCard /> 

                {/* 2. API Integration Demo (Mock Razorpay & Stock API) */}
                <PaymentDemoCard /> 

                {/* 3. Transaction DNA (Security Trace/Blockchain Hashing) */}
                <TransactionDNA />
                
          </div>
          
          {/* ⭐ ROW 3: EXPENSE TRACKER */}
          <ExpenseTrackerCard /> 

            {/* ⭐ ROW 4: ANALYTICS, LITERACY, and LIVE FEEDS (4 columns / 2+2 split) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Side Analytics & Literacy (Col 1-2) */}
            <div className="lg:col-span-2 space-y-6">
              <FraudChart />
              <FinancialLiteracyCard /> {/* <-- RENDERED HERE */}
            </div>

            {/* Right Side Live Updates (Col 3-4) */}
            <div className="lg:col-span-2 space-y-6">
              <TransactionFeed />
              <AlertsPanel />
              <RiskScoreCard /> 
            </div>
          </div>

          {/* ⭐ ROW 5: BEHAVIORAL DATA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UserBehaviorGraph className="lg:col-span-1" />
            <Heatmap className="lg:col-span-2" />
          </div>
            <LiveMonitor />

        </main>
      ) : (
        <AdminPanel />
      )}
      
      {/* 🤖 AI Chatbot Component */}
      <AIChatbot />

    </div>
  );
};

export default Dashboard;