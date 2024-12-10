import React, { createContext, ReactNode } from "react";
import { rootStore  } from "./store/RootStore";

const StoreContext = createContext(rootStore);

const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <StoreContext.Provider value={rootStore}>
    {children}
  </StoreContext.Provider>
);

export { StoreProvider, StoreContext };
