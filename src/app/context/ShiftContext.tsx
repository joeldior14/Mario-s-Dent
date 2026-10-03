"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore } from "react";

export type AuditStatus = "pending" | "reviewed";
export type ResolutionType =
  | "MERMA_ACEPTADA"
  | "COBRO_EMPLEADO"
  | "CORRECCION_POS";

interface ShiftStoragePayload {
  shiftId: string | null;
  isShiftOpen: boolean;
  cashierName: string;
  initialCash: number;
  auditStatus: AuditStatus;
}

interface ShiftContextType {
  shiftId: string | null;
  isShiftOpen: boolean;
  cashierName: string;
  initialCash: number;
  openShift: (amount: number, cashier: string, shiftId?: string | null) => void;
  closeShift: () => void;
  resetShiftContext: () => void;
  auditStatus: AuditStatus;
  resolveAudit: (notes: string, resolution: ResolutionType) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);
const SHIFT_STORAGE_KEY = "marios_dent_shift_data";

// Suscriptor reactivo a cambios de localStorage entre componentes y eventos locales
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("shift_state_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("shift_state_change", callback);
  };
}

// Snapshot en el cliente
function getSnapshot(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(SHIFT_STORAGE_KEY) ?? "";
}

// Snapshot seguro para SSR
function getServerSnapshot(): string {
  return "";
}

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const rawShiftData = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const parsedData: ShiftStoragePayload = React.useMemo(() => {
    if (!rawShiftData) {
      return {
        shiftId: null,
        isShiftOpen: false,
        cashierName: "",
        initialCash: 0,
        auditStatus: "pending",
      };
    }
    try {
      return JSON.parse(rawShiftData) as ShiftStoragePayload;
    } catch {
      return {
        shiftId: null,
        isShiftOpen: false,
        cashierName: "",
        initialCash: 0,
        auditStatus: "pending",
      };
    }
  }, [rawShiftData]);

  // Actualizador de almacenamiento que notifica a toda la app
  const updateStorage = (payload: ShiftStoragePayload | null) => {
    if (typeof window === "undefined") return;
    if (payload) {
      localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(payload));
    } else {
      localStorage.removeItem(SHIFT_STORAGE_KEY);
    }
    window.dispatchEvent(new Event("shift_state_change"));
  };

  const openShift = useCallback((amount: number, cashier: string, newShiftId?: string | null) => {
    updateStorage({
      shiftId: newShiftId ?? null,
      isShiftOpen: true,
      cashierName: cashier,
      initialCash: amount,
      auditStatus: "pending",
    });
  }, []);

  const closeShift = useCallback(() => {
    updateStorage(null);
  }, []);

  const resetShiftContext = useCallback(() => {
    updateStorage(null);
  }, []);

  const resolveAudit = useCallback(
    (_notes: string, _resolution: ResolutionType) => {
      if (typeof window === "undefined") return;
      const current = localStorage.getItem(SHIFT_STORAGE_KEY);
      if (current) {
        try {
          const parsed = JSON.parse(current) as ShiftStoragePayload;
          updateStorage({ ...parsed, auditStatus: "reviewed" });
        } catch (e) {
          console.error("Error al actualizar auditoría:", e);
        }
      }
    },
    []
  );

  return (
    <ShiftContext.Provider
      value={{
        shiftId: parsedData.shiftId,
        isShiftOpen: parsedData.isShiftOpen,
        cashierName: parsedData.cashierName,
        initialCash: parsedData.initialCash,
        openShift,
        closeShift,
        resetShiftContext,
        auditStatus: parsedData.auditStatus,
        resolveAudit,
      }}
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