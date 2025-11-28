import { AlertTriangle, CheckCircle, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFraudDetection } from "@/contexts/FraudDetectionContext";

const StatsOverview = () => {
  const { stats } = useFraudDetection();

  const statsConfig = [
    {
      label: "High Risk Alerts",
      value: stats.highRiskAlerts,
      change: "+12%",
      icon: AlertTriangle,
      trend: "up",
      color: "risk-high"
    },
    {
      label: "Transactions Monitored",
      value: stats.transactionsMonitored,
      change: "+23%",
      icon: TrendingUp,
      trend: "up",
      color: "primary"
    },
    {
      label: "Safe Transactions",
      value: stats.safeTransactions,
      change: "+18%",
      icon: CheckCircle,
      trend: "up",
      color: "risk-safe"
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      change: "+5%",
      icon: Users,
      trend: "up",
      color: "primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="p-6 border-border bg-card hover:bg-card/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</h3>
                <p className={`text-sm mt-2 ${stat.trend === "up" ? "text-risk-safe" : "text-risk-high"}`}>
                  {stat.change} from last week
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                <Icon className={`h-6 w-6 text-${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;
