import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFraudDetection } from "@/contexts/FraudDetectionContext";
import { toast } from "sonner";

const AdminPanel = () => {
  const { rules, updateRule, deleteRule, addRule } = useFraudDetection();
  const [editingThreshold, setEditingThreshold] = useState({});
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleThreshold, setNewRuleThreshold] = useState(0);

  const toggleRule = (id) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      updateRule(id, { enabled: !rule.enabled });
    }
  };

  const handleSaveThreshold = (id) => {
    const newThreshold = editingThreshold[id];
    if (newThreshold !== undefined) {
      updateRule(id, { threshold: newThreshold });
      setEditingThreshold(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleAddRule = () => {
    if (!newRuleName || newRuleThreshold <= 0) {
      toast.error("Invalid Input", {
        description: "Please enter a valid rule name and threshold",
      });
      return;
    }
    addRule({
      name: newRuleName,
      threshold: newRuleThreshold,
      enabled: true,
    });
    setNewRuleName("");
    setNewRuleThreshold(0);
  };

  const handleDeleteRule = (id) => {
    deleteRule(id);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Fraud Detection Rules</h2>
              <p className="text-sm text-muted-foreground">Configure detection parameters</p>
            </div>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{rule.name}</h3>
                        <Badge variant={rule.enabled ? "default" : "secondary"}>
                          {rule.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Threshold: {rule.threshold}</p>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Threshold Value</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        value={editingThreshold[rule.id] ?? rule.threshold}
                        onChange={(e) => setEditingThreshold(prev => ({
                          ...prev,
                          [rule.id]: Number(e.target.value)
                        }))}
                        className="flex-1"
                      />
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => handleSaveThreshold(rule.id)}
                        disabled={editingThreshold[rule.id] === undefined}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 rounded-lg border border-border bg-background/50 space-y-3">
                <h3 className="font-semibold text-foreground">Add New Rule</h3>
                <div className="space-y-2">
                  <Label className="text-sm">Rule Name</Label>
                  <Input
                    placeholder="Enter rule name"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Threshold</Label>
                  <Input
                    type="number"
                    placeholder="Enter threshold value"
                    value={newRuleThreshold || ""}
                    onChange={(e) => setNewRuleThreshold(Number(e.target.value))}
                  />
                </div>
                <Button className="w-full" onClick={handleAddRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-6 border-border bg-card">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Suspicious Users</h2>
            <p className="text-sm text-muted-foreground">High-risk user profiles</p>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {[
                { name: "John Doe", risk: 89, transactions: 24, flagged: 12 },
                { name: "Alice Johnson", risk: 76, transactions: 18, flagged: 8 },
                { name: "Bob Smith", risk: 68, transactions: 15, flagged: 6 },
                { name: "Carol White", risk: 54, transactions: 12, flagged: 4 },
              ].map((user, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">Risk Score: {user.risk}%</p>
                    </div>
                    <Badge 
                      className={user.risk > 70 ? "bg-risk-high/10 text-risk-high border-risk-high/20" : "bg-risk-medium/10 text-risk-medium-foreground border-risk-medium/20"}
                    >
                      {user.risk > 70 ? "High Risk" : "Medium Risk"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Transactions</p>
                      <p className="font-semibold text-foreground">{user.transactions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Flagged</p>
                      <p className="font-semibold text-foreground">{user.flagged}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => toast.info("Feature Coming Soon", {
                        description: "User profile view will be available soon"
                      })}
                    >
                      View Profile
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => toast.success("User Blocked", {
                        description: `${user.name} has been blocked successfully`
                      })}
                    >
                      Block User
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </main>
  );
};

export default AdminPanel;
