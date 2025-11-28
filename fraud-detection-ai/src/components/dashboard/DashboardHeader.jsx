import { Shield, Activity, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">RakshakX</h1>
              <p className="text-sm text-muted-foreground">Real-time Financial Security System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right mr-2">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <Button
              variant={activeView === "dashboard" ? "default" : "outline"}
              onClick={() => setActiveView("dashboard")}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button
              variant={activeView === "admin" ? "default" : "outline"}
              onClick={() => setActiveView("admin")}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
