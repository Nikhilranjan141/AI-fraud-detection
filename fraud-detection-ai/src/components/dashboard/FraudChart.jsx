import { Card } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const data = [
  { time: "00:00", fraudulent: 4, legitimate: 45, flagged: 2 },
  { time: "04:00", fraudulent: 3, legitimate: 38, flagged: 1 },
  { time: "08:00", fraudulent: 8, legitimate: 92, flagged: 5 },
  { time: "12:00", fraudulent: 12, legitimate: 156, flagged: 8 },
  { time: "16:00", fraudulent: 6, legitimate: 134, flagged: 4 },
  { time: "20:00", fraudulent: 9, legitimate: 98, flagged: 6 },
];

const FraudChart = () => {
  return (
    <Card className="p-6 border-border bg-card h-[600px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Fraud Detection Analytics</h2>
        <p className="text-sm text-muted-foreground">24-hour transaction monitoring overview</p>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="legitimate" 
            stroke="hsl(var(--risk-safe))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--risk-safe))", r: 4 }}
            name="Legitimate"
          />
          <Line 
            type="monotone" 
            dataKey="flagged" 
            stroke="hsl(var(--risk-medium))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--risk-medium))", r: 4 }}
            name="Flagged"
          />
          <Line 
            type="monotone" 
            dataKey="fraudulent" 
            stroke="hsl(var(--risk-high))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--risk-high))", r: 4 }}
            name="Fraudulent"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FraudChart;
