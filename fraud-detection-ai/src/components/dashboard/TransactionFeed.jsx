import { AlertTriangle, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFraudDetection } from "@/contexts/FraudDetectionContext";

const getRiskIcon = (risk) => {
  switch (risk) {
    case "high":
      return AlertTriangle;
    case "medium":
      return AlertCircle;
    case "low":
      return ShieldCheck;
    default:
      return CheckCircle;
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case "high":
      return "bg-risk-high/10 text-risk-high border-risk-high/20";
    case "medium":
      return "bg-risk-medium/10 text-risk-medium-foreground border-risk-medium/20";
    case "low":
      return "bg-risk-low/10 text-risk-low-foreground border-risk-low/20";
    default:
      return "bg-risk-safe/10 text-risk-safe border-risk-safe/20";
  }
};

const TransactionFeed = () => {
  const { transactions } = useFraudDetection();

  return (
    <Card className="p-6 border-border bg-card">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Live Transaction Feed</h2>
        <p className="text-sm text-muted-foreground">Real-time monitoring</p>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {transactions.map((transaction, index) => {
            const Icon = getRiskIcon(transaction.risk);
            return (
              <div
                key={transaction.id}
                className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-all duration-300 animate-in fade-in slide-in-from-right-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${transaction.risk === "high" ? "text-risk-high" : transaction.risk === "medium" ? "text-risk-medium-foreground" : transaction.risk === "low" ? "text-risk-low-foreground" : "text-risk-safe"}`} />
                    <span className="font-semibold text-foreground">{transaction.user}</span>
                  </div>
                  <Badge className={getRiskColor(transaction.risk)}>
                    {transaction.risk.toUpperCase()}
                  </Badge>
                </div>
                <div className="ml-7 space-y-1 text-sm">
                  <p className="text-foreground font-semibold">₹{transaction.amount.toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">{transaction.time} • {transaction.location}</p>
                  {transaction.paymentMode && (
                    <p className="text-muted-foreground text-xs">{transaction.paymentMode} • {transaction.device}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TransactionFeed;
