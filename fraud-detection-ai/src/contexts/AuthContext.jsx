import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("fraud_detection_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const mockUser = {
        id: "user_" + Date.now(),
        email,
        name: email.split("@")[0],
        role: "admin",
      };
      
      setUser(mockUser);
      localStorage.setItem("fraud_detection_user", JSON.stringify(mockUser));
      
      toast.success("Login Successful", {
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      setIsLoading(false);
      return true;
    }
    
    toast.error("Login Failed", {
      description: "Please enter valid credentials",
    });
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fraud_detection_user");
    toast.success("Logged Out", {
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};






