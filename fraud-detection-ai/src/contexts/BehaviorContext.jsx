import { createContext, useContext, useState } from "react";

const BehaviorContext = createContext();

export const BehaviorProvider = ({ children }) => {
  const [profiles, setProfiles] = useState({});

  const updateProfile = (userId, data) => {
    setProfiles((prev) => ({
      ...prev,
      [userId]: { ...(prev[userId] || {}), ...data },
    }));
  };

  return (
    <BehaviorContext.Provider value={{ profiles, updateProfile }}>
      {children}
    </BehaviorContext.Provider>
  );
};

export const useBehavior = () => useContext(BehaviorContext);
