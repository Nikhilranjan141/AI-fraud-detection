import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const pushAlert = (alert) => {
    setAlerts((prev) => [
      { id: Date.now().toString(), ...alert },
      ...prev.slice(0, 20),
    ]);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, pushAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
