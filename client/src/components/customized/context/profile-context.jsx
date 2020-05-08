import { createContext } from "react";

export const ProfileContext = createContext({
  profile: {},
  setProfile: () => {},
  //   profiles: [],
});
