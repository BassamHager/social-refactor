import { createContext } from "react";

export const AuthContext = createContext({
  userId: null,
  token: null,
  setToken: () => {},
  login: () => {},
  logout: () => {},
  isToLoginMode: false,
  setIsToLoginMode: () => {},
});
