"use client";

import React, { createContext, useContext, useState } from "react";

interface ShiftContextType {
  isShiftOpen: boolean;
  cashierName: string;
  initialCash: number;
  openShift: (amount: number, cashier: string) => void;
  closeShift: () => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const [isShiftOpen, setIsShiftOpen] = useState<boolean>(false);
  const [cashierName, setCashierName] = useState<string>("Maria G.");
  const [initialCash, setInitialCash] = useState<number>(0);

  const openShift = (amount: number, cashier: string) => {
    setInitialCash(amount);
    setCashierName(cashier);
    setIsShiftOpen(true);
  };

  const closeShift = () => {
    setIsShiftOpen(false);
    setInitialCash(0);
  };

  return (
    <ShiftContext.Provider
      value={{ isShiftOpen, cashierName, initialCash, openShift, closeShift }}
    >
      {children}
    </ShiftContext.Provider>
  );
}

export function useShift() {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShift debe usarse dentro de ShiftProvider");
  }
  return context;
}