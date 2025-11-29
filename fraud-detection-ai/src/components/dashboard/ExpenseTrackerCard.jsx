import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DollarSign, Percent, ArrowUp, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const INITIAL_INCOME = 0;

const INITIAL_EXPENSES = {
  rent: 0,
  groceries: 0,
  entertainment: 0,
  travel: 0,
  utilities: 0,
  others: 0,
};

const EXPENSE_CATEGORIES = [
  { key: "rent", name: "Rent & Housing", color: "hsl(var(--primary))" },
  { key: "groceries", name: "Groceries", color: "hsl(var(--risk-safe))" },
  { key: "entertainment", name: "Entertainment", color: "hsl(var(--risk-medium))" },
  { key: "travel", name: "Travel & Fuel", color: "hsl(var(--risk-high))" },
  { key: "utilities", name: "Utilities & Bills", color: "hsl(210 40% 60%))" },
  { key: "others", name: "Others", color: "hsl(280 50% 60%))" },
];


const analyzeEmergencyBalance = (income, savingAmount) => {
  const EMERGENCY_GOAL = income * 3; 
  const isEmergencyLow = savingAmount < 0; 
  const hasMetGoal = savingAmount >= EMERGENCY_GOAL;
  
  if (income === 0) return null;

  if (isEmergencyLow) {
      return {
          type: 'CRITICAL',
          message: "⚠ Warning! Your *Monthly Budget is Overspent*. Please stop all non-essential expenses immediately.",
          goalAmount: EMERGENCY_GOAL,
      };
  }

  if (savingAmount < (EMERGENCY_GOAL * 0.5) && savingAmount > 0) {
      return {
          type: 'WARNING',
          message: `Your **Emergency Balance is Decreasing!** Current Savings (₹${savingAmount.toLocaleString()}) is less than 50% of the 3-month target (₹${EMERGENCY_GOAL.toLocaleString()}).`,
goalAmount: EMERGENCY_GOAL,

      };
  }

  if (hasMetGoal) {
      return {
          type: 'SAFE',
          message: `✅ Great Job! You have met your 3-month emergency balance goal (₹${EMERGENCY_GOAL.toLocaleString()}).`,
goalAmount: EMERGENCY_GOAL,

      };
  }

  return { 
      type: 'INFO', 
     message: `Keep Saving! You need ₹${(EMERGENCY_GOAL - savingAmount).toLocaleString()} more to reach your 3-month emergency goal.`,
goalAmount: EMERGENCY_GOAL,

  };
};

const generateBudgetingSuggestions = (income, expenses, totalExpenses) => {
  if (income === 0 || totalExpenses === 0) return [];
  
  const suggestions = [];
  const incomeSpentPct = (totalExpenses / income);

  if (incomeSpentPct > 0.8) {
      suggestions.push({
          category: 'Budgeting',
          advice: `Total expenditure (${(incomeSpentPct * 100).toFixed(0)}%) is very high. Consider cutting discretionary spending.`,

          savingsPotential: 'High',
      });
  }

  const rentExpense = expenses.rent;
  const groceryExpense = expenses.groceries;
  const travelExpense = expenses.travel;

  if (rentExpense > (income * 0.30) && rentExpense > 0) {
      suggestions.push({
          category: 'Housing',
          advice: `Your **Rent/Housing cost (₹${rentExpense.toLocaleString()})** is high (>${(income * 0.30).toLocaleString()} limit). Exploring cheaper accommodation could save you ~₹${(rentExpense * 0.1).toFixed(0)} monthly.`,

          savingsPotential: '10%',
      });
  }

  if (groceryExpense > (income * 0.15) && groceryExpense > 10000) {
      suggestions.push({
          category: 'Groceries',
          advice: `You spent ₹${groceryExpense.toLocaleString()} on Groceries. Changing vendor or buying in bulk could **save you 10-15%** (~₹${(groceryExpense * 0.12).toFixed(0)}).`,

          savingsPotential: 'Medium',
      });
  }

  if (travelExpense + expenses.entertainment > income * 0.20 && travelExpense + expenses.entertainment > 0) {
      suggestions.push({
          category: 'Lifestyle',
         advice: `**Travel and Entertainment** expenses seem high. Reducing spending in this area could significantly increase your savings goal.`,
  savingsPotential: 'Variable'
      });
  }
  
  return suggestions.length > 0 ? suggestions : [{ category: 'Great Job', advice: 'Your spending is currently well-balanced according to AI models. Keep monitoring!', savingsPotential: 'N/A' }];
};

const ExpenseTrackerCard = () => {
  const [income, setIncome] = useState(INITIAL_INCOME);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  const handleExpenseChange = (key, value) => {
    const numericValue = value === "" ? 0 : Math.max(0, Number(value)); 
    setExpenses(prev => ({ ...prev, [key]: numericValue }));
  };

  const { totalExpenses, savingAmount, savingPercentage, chartData, emergencyAlert, budgetingSuggestions } = useMemo(() => {
    const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
    const savingAmount = income - totalExpenses;
    
    const savingPercentage = income > 0 ? ((savingAmount / income) * 100).toFixed(1) : 0;

    const data = EXPENSE_CATEGORIES.map(cat => ({
      name: cat.name,
      value: expenses[cat.key],
      color: cat.color,
    })).filter(item => item.value > 0);

    if (savingAmount > 0) {
      data.push({
        name: `Savings (${savingPercentage}%)`,

        value: savingAmount,
        color: "hsl(var(--risk-low))",
      });
    }

    const emergencyAlert = analyzeEmergencyBalance(income, savingAmount);
    const budgetingSuggestions = generateBudgetingSuggestions(income, expenses, totalExpenses);

    return { totalExpenses, savingAmount, savingPercentage, chartData: data, emergencyAlert, budgetingSuggestions };
  }, [income, expenses]);
  
  const renderLegend = (props) => {
    const { payload } = props;
    return (
  <ul className="text-sm space-y-1 mt-4">
    {payload.map((entry, index) => (
      <li key={`item-${index}`} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: entry.payload.color }} className="w-3 h-3 rounded-full"></div>
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
        <span className="font-medium text-foreground">
          ₹{entry.payload.value.toLocaleString()}
        </span>
      </li>
    ))}
  </ul>
);
  };


  const getAlertStyle = (type) => {
      switch (type) {
          case 'CRITICAL': return "border-destructive text-destructive bg-destructive/10";
          case 'WARNING': return "border-amber-500 text-amber-500 bg-amber-500/10";
          case 'SAFE': return "border-risk-safe text-risk-safe bg-risk-safe/10";
          default: return "border-muted-foreground text-muted-foreground bg-muted/10";
      }
  };


  return (
    <Card className="p-6 border-border bg-card flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" /> User Financial Tracker
        </h2>
        <p className="text-sm text-muted-foreground">Input your financial data for spending visualization & AI analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
       
        <div className="space-y-4 lg:col-span-1 p-4 border rounded-lg bg-background/50">
          <h3 className="font-semibold text-lg text-foreground mb-4">Input Data</h3>

          <div className="space-y-2">
            <Label htmlFor="income" className="text-sm flex items-center gap-1">
              <ArrowUp className="h-4 w-4 text-primary" /> Monthly Income (₹)
            </Label>
            <Input
              id="income"
              type="number"
              value={income === 0 ? "" : income} 
              placeholder="e.g., 80000"
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
              min="0"
            />
          </div>

          <h4 className="font-medium text-foreground mt-6 pt-3 border-t border-border">Monthly Expenses (₹)</h4>
          
          {EXPENSE_CATEGORIES.map(cat => (
  <div className="space-y-2" key={cat.key}>
    <Label htmlFor={cat.key} className="text-sm">{cat.name}</Label>
    <Input
      id={cat.key}
      type="number"
      value={expenses[cat.key] === 0 ? "" : expenses[cat.key]}
      placeholder={`e.g., ${cat.key === 'rent' ? '25000' : '5000'}`}
      onChange={(e) => handleExpenseChange(cat.key, e.target.value)}
      min="0"
    />
  </div>
))}

        </div>

        <div className="lg:col-span-3 space-y-6">
          
          <div className="space-y-4">
             
              {emergencyAlert && income > 0 && (
                  <Card className={`p-3 border-l-4 font-medium ${getAlertStyle(emergencyAlert.type)}`}>
  <div className="flex items-start gap-2">
    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
    <p
      className="text-sm"
      dangerouslySetInnerHTML={{
        __html: emergencyAlert.message.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      }}
    />
  </div>

  <p className="text-xs mt-1 ml-7 text-muted-foreground">
    Goal: {emergencyAlert.goalAmount
      ? `3 Months Income (₹${emergencyAlert.goalAmount.toLocaleString()})`
      : "N/A"}
  </p>
</Card>

              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg bg-primary/5 text-center">
                  <p className="text-xs text-muted-foreground">Total Income</p>
                  <h3 className="text-xl font-bold text-primary">₹{income.toLocaleString()}</h3>
                </div>
                <div className="p-3 border rounded-lg bg-risk-high/5 text-center">
                  <p className="text-xs text-muted-foreground">Total Expenses</p>
                  <h3 className="text-xl font-bold text-risk-high">₹{totalExpenses.toLocaleString()}</h3>
                </div>
                <div className="p-3 border rounded-lg bg-risk-low/5 text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      Monthly Savings <Percent className="h-3 w-3" />
                  </p>
                  <h3 className={`text-xl font-bold ${savingAmount >= 0 ? 'text-risk-low' : 'text-destructive'}`}>
  ₹{savingAmount.toLocaleString()}
</h3>

                  <p className="text-xs text-muted-foreground mt-0.5">{savingPercentage}% of Income</p>
                </div>
              </div>
          </div>

          <Card className="p-4 border-l-4 border-teal-500 bg-teal-500/10">
              <h4 className="font-semibold text-sm text-teal-700 flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4" /> AI Budgeting Suggestions
              </h4>
              <div className="space-y-2">
                  {budgetingSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3">
                          <TrendingUp className="h-4 w-4 text-teal-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                              <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: suggestion.advice.replace(/\\(.?)\\*/g, '<strong>$1</strong>') }} />
                              <Badge variant="secondary" className="mt-1 text-xs bg-muted text-muted-foreground">
                                  Category: {suggestion.category} | Potential Savings: {suggestion.savingsPotential}
                              </Badge>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>
          
          <div className="h-[400px] w-full p-4 border rounded-lg bg-background/50">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
  data={chartData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={100}
  fill="#8884d8"
  labelLine={false}
>
  {chartData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.color} />
  ))}
</Pie>

                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  content={renderLegend} 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground text-right pt-2">
              Note: Chart reflects real-time data entered in the form.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseTrackerCard;