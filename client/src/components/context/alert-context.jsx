import { createContext } from "react";

export const AlertContext = createContext({
  alerts: [],
  setAlert: () => {},
});
