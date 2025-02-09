// src/hooks/useAuth.jsx

import { createContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/custom/useLocalStorage";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const AuthContext = createContext(null);

  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
    navigate("/profile");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
