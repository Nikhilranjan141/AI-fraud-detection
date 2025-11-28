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

          {/* ⭐ AI STATS OVERVIEW */}
          <StatsOverview />

          {/* ⭐ NEW AI Fraud Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RiskScoreCard />
            <AnomalyReasons />
            <TransactionDNA />
          </div>

          {/* ⭐ CHARTS + BEHAVIOR GRAPH + FEEDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Side Charts */}
            <div className="lg:col-span-2 space-y-6">
              <FraudChart />
              <UserBehaviorGraph />
            </div>

            {/* Right Side Live Updates */}
            <div className="space-y-6">
              <TransactionFeed />
              <AlertsPanel />
            </div>
          </div>

          {/* ⭐ HEATMAP + LIVE MONITOR */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Heatmap />
            <LiveMonitor />
          </div>
        </main>
      ) : (
        <AdminPanel />
      )}
    </div>
  );
};

export default Dashboard;
