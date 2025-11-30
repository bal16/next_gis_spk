"use client";

import { createContext, useContext, ReactNode } from "react";
import { useHomeLogic } from "../../hooks/useHomeLogic";
// import { useHomeLogic } from "@/hooks/useHomeLogic";

// Infer the return type of the hook to avoid manual type definitions
type HomeContextType = ReturnType<typeof useHomeLogic>;

// Create the context with a default undefined value
const HomeContext = createContext<HomeContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useHome = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};

// Provider component
export const HomeProvider = ({ children }: { children: ReactNode }) => {
  const homeLogic = useHomeLogic();

  return (
    <HomeContext.Provider value={homeLogic}>{children}</HomeContext.Provider>
  );
};

