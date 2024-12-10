import { useContext } from "react";
import { StoreContext } from "./StoreContext";

const useStore = () => {
  return useContext(StoreContext);
};

export { useStore };
