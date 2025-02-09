import { AuthContext } from "@/services/authentication/context";
import { useContext } from "react";

export const useAuth = () => {
  return useContext(AuthContext);
};
