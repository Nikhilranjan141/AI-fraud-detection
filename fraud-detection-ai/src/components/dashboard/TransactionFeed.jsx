
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
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "low":
      return "bg-sky-500/10 text-sky-500 border-sky-500/20";
    default:
      return "bg-risk-safe/10 text-risk-safe border-risk-safe/20";
  }
};

const TransactionFeed = () => {
  const { transactions } = useFraudDetection();

  return (
    <Card className="p-6 border-border bg-card">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Live Transaction Feed (Fraud Alerts)</h2>
        <p className="text-sm text-muted-foreground">Real-time monitoring and anomaly flagging</p>
      </div>

      <ScrollArea className="h-[300px] lg:h-[450px] pr-4">
        <div className="space-y-4">
          {transactions.map((transaction, index) => {
            const Icon = getRiskIcon(transaction.risk);
            const hasAlert = transaction.risk !== "safe" && transaction.reasons && transaction.reasons.length > 0;

            return (
              <div
  key={transaction.id}
  className={`p-4 rounded-lg border ${getRiskColor(transaction.risk)} 
    bg-background/50 hover:bg-background transition-all duration-300 
    animate-in fade-in slide-in-from-right-4`}
  style={{ animationDelay: `${index * 50}ms` }}
>

                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`h-5 w-5 ${
                        transaction.risk === "high"
                          ? "text-destructive"
                          : transaction.risk === "medium"
                          ? "text-amber-500"
                          : transaction.risk === "low"
                          ? "text-sky-500"
                          : "text-risk-safe"
                      }`}
                    />

                    <span className="font-semibold text-foreground">{transaction.user}</span>
                  </div>

                  <Badge className={getRiskColor(transaction.risk)}>
                    {transaction.risk.toUpperCase()}
                  </Badge>
                </div>

                <div className="ml-7 space-y-1 text-sm">
                  <p className="text-foreground font-semibold">₹{transaction.amount.toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">{transaction.time} • {transaction.location}</p>

                  {hasAlert && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {transaction.reasons.map((reason, rIndex) => (
                        <Badge
                          key={rIndex}
                          variant="secondary"
                          className="text-xs bg-red-100 text-red-700 border-red-300"
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
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

