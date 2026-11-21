"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useLenis, UseLenisOptions, UseLenisReturn } from "../hooks/useLenis";

const LenisContext = createContext<UseLenisReturn | null>(null);

export interface SmoothScrollProviderProps {
  children: ReactNode;
  options?: UseLenisOptions;
}

export function SmoothScrollProvider({
  children,
  options,
}: SmoothScrollProviderProps) {
  const lenisControls = useLenis(options);

  return (
    <LenisContext.Provider value={lenisControls}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisContext(): UseLenisReturn {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error(
      "useLenisContext must be used within a SmoothScrollProvider. Alternatively, use useLenis() directly."
    );
  }
  return context;
}

export default SmoothScrollProvider;

