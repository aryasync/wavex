import { createContext, useContext } from "react";

// Create context for shared items state
export const ItemsContext = createContext();

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};
