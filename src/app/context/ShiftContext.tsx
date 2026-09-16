"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

export type AuditStatus = "pending_review" | "reviewed";

export interface ShiftSession {
  shiftId: string | null;
  isShiftOpen: boolean;
  cashierName: string;
  cashierId?: string;
  branch: string;
  initialCash: number;
  openedAt: string | null;
  closedAt: string | null;
  auditStatus: AuditStatus;
  auditNotes?: string;
  resolutionType?: string;
}

interface ShiftContextType {
  // Estado actual del turno
  shiftId: string | null;
  isShiftOpen: boolean;
  cashierName: string;
  initialCash: number;
  branch: string;
  openedAt: string | null;
  auditStatus: AuditStatus;
  isLoading: boolean;
  error: string | null;

  // Acciones operativas preparadas para API/Backend
  openShift: (amount: number, cashier: string, branch?: string) => Promise<void>;
  closeShift: (countedCash?: number, cashierNote?: string) => Promise<void>;
  resolveAudit: (notes: string, resolution: string) => Promise<void>;
  refreshShiftStatus: () => Promise<void>;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const [shiftId, setShiftId] = useState<string | null>(null);
  const [isShiftOpen, setIsShiftOpen] = useState<boolean>(false);
  const [cashierName, setCashierName] = useState<string>("Maria G.");
  const [branch, setBranch] = useState<string>("Santa Ana");
  const [initialCash, setInitialCash] = useState<number>(0);
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const [auditStatus, setAuditStatus] = useState<AuditStatus>("pending_review");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronización inicial con el backend / persistencia (React 19 Safe)
  useEffect(() => {
    let isMounted = true;

    // Diferir a microtarea para evitar setState síncrono en el cuerpo del efecto
    queueMicrotask(async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);

      try {
        // 🔌 Conexión preparada para backend:
        // const res = await fetch("/api/shifts/current");
        // const data = await res.json();
        // if (isMounted && data.activeShift) { ...setters }
        await Promise.resolve();
      } catch (err) {
        console.error("Error al sincronizar el estado del turno:", err);
        if (isMounted) {
          setError("No se pudo comprobar el estado del turno con el servidor.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Función manual para refrescar el turno desde botones o eventos
  const refreshShiftStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.resolve();
    } catch (err) {
      console.error("Error al sincronizar el estado del turno:", err);
      setError("No se pudo comprobar el estado del turno con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apertura de turno
  const openShift = useCallback(
    async (amount: number, cashier: string, branchName: string = "Santa Ana") => {
      setIsLoading(true);
      setError(null);
      try {
        // 🔌 Conexión preparada para backend:
        // const res = await fetch("/api/shifts/open", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ initialCash: amount, cashier, branch: branchName }),
        // });
        // const data = await res.json();
        // setShiftId(data.id);

        await Promise.resolve();
        const generatedId = `shift-${Date.now()}`;
        const timestamp = new Date().toISOString();

        setShiftId(generatedId);
        setInitialCash(amount);
        setCashierName(cashier);
        setBranch(branchName);
        setOpenedAt(timestamp);
        setIsShiftOpen(true);
        setAuditStatus("pending_review");
      } catch (err) {
        console.error("Error al iniciar turno:", err);
        setError("Ocurrió un error al registrar la apertura de turno.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Cierre de turno
  const closeShift = useCallback(
    async (countedCash?: number, cashierNote?: string) => {
      void countedCash; 
      void cashierNote;

      setIsLoading(true);
      setError(null);
      try {
        await Promise.resolve();
        setIsShiftOpen(false);
        setShiftId(null);
        setInitialCash(0);
        setOpenedAt(null);
        setAuditStatus("pending_review");
      } catch (err) {
        console.error("Error al cerrar turno:", err);
        setError("Ocurrió un error al registrar el cierre de turno.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Resolución de auditoría administrativa
  const resolveAudit = useCallback(
    async (notes: string, resolution: string) => {
      void notes;       // 👈 Consumo neutro
      void resolution;

      setIsLoading(true);
      setError(null);
      try {
        await Promise.resolve();
        setAuditStatus("reviewed");
      } catch (err) {
        console.error("Error al dictaminar auditoría:", err);
        setError("No se pudo asentar la resolución de auditoría.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      shiftId,
      isShiftOpen,
      cashierName,
      initialCash,
      branch,
      openedAt,
      auditStatus,
      isLoading,
      error,
      openShift,
      closeShift,
      resolveAudit,
      refreshShiftStatus,
    }),
    [
      shiftId,
      isShiftOpen,
      cashierName,
      initialCash,
      branch,
      openedAt,
      auditStatus,
      isLoading,
      error,
      openShift,
      closeShift,
      resolveAudit,
      refreshShiftStatus,
    ]
  );

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}

export function useShift() {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShift debe usarse dentro de un ShiftProvider");
  }
  return context;
}