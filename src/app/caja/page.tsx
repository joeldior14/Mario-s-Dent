"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import {
  openCashShiftInDB,
  recordExpenseInDB,
  fetchCurrentShiftExpenses,
  getShiftSalesBreakdown,
  ShiftSalesBreakdown,
  closeCashShiftInDB,
  getAdminShiftAudit,
  resolveShiftAuditInDB,
} from "@/app/services/cashService";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import ConfirmarModal, { DialogType } from "@/components/ConfirmarModal";
import ExpenseModal, { ExpenseRecord } from "@/components/GastoMenorModal";
import CorteZPDFTemplate, { downloadCorteZPDF } from "@/components/CortePDF";
import OpenShiftModal from "@/components/OpenShiftModal";
import AuditTicketsModal from "@/components/AuditTicketsModal";
import { useShift } from "@/app/context/ShiftContext";
import { BranchName, useAuth } from "@/app/context/AuthContext";
import {
  Banknote,
  CreditCard,
  Building2,
  Lock,
  Receipt,
  PlusCircle,
  Store,
  Calendar as CalendarIcon,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Coins,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Building,
} from "lucide-react";

export type ResolutionType = "MERMA_ACEPTADA" | "COBRO_EMPLEADO" | "CORRECCION_POS";

interface FinancialSummary {
  initialFund: number;
  cashSales: number;
  cardSales: number;
  transferSales: number;
  totalSales: number;
  expenses: number;
  expectedCash: number;
  totalExpected: number;
  difference: number;
  isSurplus: boolean;
  isShortage: boolean;
  isBalanced: boolean;
}

const BRANCH_LIST: { name: BranchName; state: string }[] = [
  { name: "Santa Ana", state: "Matriz Principal" },
  { name: "Ahuachapán", state: "Sucursal Occidente" },
  { name: "Sonsonate", state: "Sucursal Occidente" },
];

export default function CajaPage() {
  const {
    isShiftOpen,
    cashierName,
    initialCash,
    openShift,
    closeShift,
    auditStatus,
    resolveAudit,
  } = useShift();

  const searchParams = useSearchParams();
  const paramBranch = searchParams.get("branch");
  const paramDate = searchParams.get("date");

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [currentAuditedShiftId, setCurrentAuditedShiftId] = useState<string | null>(null);

  // Fecha en zona horaria local de El Salvador
  const currentDateDisplay = useMemo(() => {
    return new Intl.DateTimeFormat("es-SV", {
      timeZone: "America/El_Salvador",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }, []);

  const activeOperatorName = useMemo(() => {
    return user?.name || cashierName || "Operador";
  }, [user?.name, cashierName]);

  const [isProcessing, setIsProcessing] = useState(false);

  // Ventas en tiempo real
  const [salesBreakdown, setSalesBreakdown] = useState<ShiftSalesBreakdown>({
    cash: 0,
    card: 0,
    transfer: 0,
    total: 0,
  });

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTicketAuditOpen, setIsTicketAuditOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Estados de control para dropdowns personalizados
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Diálogo común
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: DialogType;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Sucursales y Fecha inicializadas con URL o fallback dinámico
  const [selectedBranch, setSelectedBranch] = useState<BranchName>(() => {
    if (paramBranch) return paramBranch as BranchName;
    return (user?.branch as BranchName) || "Santa Ana";
  });

  const effectiveBranch = !isAdmin && user?.branch ? (user.branch as BranchName) : selectedBranch;

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (paramDate) return paramDate;
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/El_Salvador",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  });

  const [cashierNotes, setCashierNotes] = useState("");
  const [countedCash, setCountedCash] = useState<number>(0.0);
  const [expensesList, setExpensesList] = useState<ExpenseRecord[]>([]);

  // =========================================================================
  // SINCRONIZACIÓN ESTRICTA DEL TURNO POR SUCURSAL DEL CAJERO
  // =========================================================================
  useEffect(() => {
    if (isAdmin) return;

    let isMounted = true;

    async function syncCashierShift() {
      try {
        const branchNameQuery = user?.branch || "Santa Ana";

        // 1. Obtener id de la sucursal asignada al cajero
        const { data: branchData } = await supabase
          .from("branches")
          .select("id")
          .ilike("name", `%${branchNameQuery.trim()}%`)
          .maybeSingle();

        if (!branchData) {
          if (isMounted) closeShift();
          return;
        }

        // 2. Buscar si la sucursal tiene un turno abierto
        const { data: openShiftData } = await supabase
          .from("cash_shifts")
          .select("id, initial_cash, cashier_id, profiles(full_name)")
          .eq("branch_id", branchData.id)
          .eq("status", "open")
          .order("opened_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!isMounted) return;

        if (openShiftData) {
          const shiftUserRecord = Array.isArray(openShiftData.profiles)
            ? openShiftData.profiles[0]
            : openShiftData.profiles;

          openShift(
            Number(openShiftData.initial_cash),
            shiftUserRecord?.full_name || user?.name || "Operador",
            openShiftData.id
          );
        } else {
          closeShift();
          setCountedCash(0.0);
        }
      } catch (err) {
        console.error("Error sincronizando turno de sucursal:", err);
      }
    }

    syncCashierShift();

    return () => {
      isMounted = false;
    };
  }, [isAdmin, user?.branch, user?.name, openShift, closeShift]);

  // Cierre de menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setIsBranchOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica del Calendario
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(selectedDate ? `${selectedDate}T12:00:00` : new Date());
    return isNaN(d.getTime()) ? new Date() : d;
  });

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const dayNames = ["DO", "LU", "MA", "MI", "JU", "VI", "SÁ"];

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, dateStr, isCurrentMonth: false });
    }

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, dateStr, isCurrentMonth: true });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [viewMonth]);

  // Dictamen contable (Admin)
  const [resolutionType, setResolutionType] = useState<ResolutionType>("MERMA_ACEPTADA");
  const [adminNotes, setAdminNotes] = useState("");

  // Métricas del turno para auditoría
  const [salesMetrics, setSalesMetrics] = useState({
    shiftId: null as string | null,
    auditStatus: "none" as "pending_review" | "reviewed" | "none",
    auditResolution: "",
    auditNotes: "",
    initialFund: 0.0,
    cash: 0.0,
    card: 0.0,
    transfer: 0.0,
    totalSales: 0.0,
    expenses: 0.0,
    reportedCountedCash: 0.0,
    operatorNotes: "",
    operatorName: "Sin operador",
  });

  const isAudited = isAdmin
    ? salesMetrics.auditStatus === "reviewed"
    : auditStatus === "reviewed";

  // Carga de ventas en vivo para el turno
  useEffect(() => {
    if (isAdmin) return;

    let isMounted = true;
    async function loadSales() {
      if (!isShiftOpen) {
        if (isMounted) setSalesBreakdown({ cash: 0, card: 0, transfer: 0, total: 0 });
        return;
      }

      const breakdown = await getShiftSalesBreakdown(effectiveBranch);
      if (isMounted) setSalesBreakdown(breakdown);
    }

    loadSales();
    return () => {
      isMounted = false;
    };
  }, [isAdmin, effectiveBranch, isShiftOpen]);

  // Carga de gastos del turno
  useEffect(() => {
    if (isAdmin) return;

    let isMounted = true;
    async function loadExpenses() {
      if (!isShiftOpen) {
        if (isMounted) setExpensesList([]);
        return;
      }

      try {
        const dbExpenses = await fetchCurrentShiftExpenses(effectiveBranch);
        if (isMounted) setExpensesList(dbExpenses);
      } catch (err) {
        console.error("Error al cargar gastos del turno:", err);
      }
    }

    loadExpenses();
    return () => {
      isMounted = false;
    };
  }, [isAdmin, effectiveBranch, isShiftOpen]);

  // Carga unificada de auditoría (Admin)
  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;
    async function loadAdminAudit() {
      try {
        const audit = await getAdminShiftAudit(selectedBranch, selectedDate);
        if (isMounted) {
          if (!audit.shiftId) {
            // Si no existe turno en la fecha consultada (ej. fechas de septiembre)
            setCurrentAuditedShiftId(null);
            setSalesMetrics({
              shiftId: null,
              auditStatus: "none",
              auditResolution: "",
              auditNotes: "",
              initialFund: 0.0,
              cash: 0.0,
              card: 0.0,
              transfer: 0.0,
              totalSales: 0.0,
              expenses: 0.0,
              reportedCountedCash: 0.0,
              operatorNotes: "",
              operatorName: "Sin turno registrado",
            });
            setAdminNotes("");
            setResolutionType("MERMA_ACEPTADA");
            return;
          }

          setCurrentAuditedShiftId(audit.shiftId);
          setSalesMetrics({
            shiftId: audit.shiftId,
            auditStatus: (audit.auditStatus as "pending_review" | "reviewed" | "none") || "pending_review",
            auditResolution: audit.auditResolution || "",
            auditNotes: audit.auditNotes || "",
            initialFund: audit.initialFund,
            cash: audit.cashSales,
            card: audit.cardSales,
            transfer: audit.transferSales,
            totalSales: audit.totalSales,
            expenses: audit.expenses,
            reportedCountedCash: audit.reportedCountedCash,
            operatorNotes: audit.operatorNotes,
            operatorName: audit.operatorName,
          });

          if (audit.auditStatus === "reviewed") {
            setAdminNotes(audit.auditNotes || "");
            setResolutionType((audit.auditResolution as ResolutionType) || "MERMA_ACEPTADA");
          } else {
            setAdminNotes("");
            setResolutionType("MERMA_ACEPTADA");
          }
        }
      } catch (error) {
        console.error("Error al cargar auditoría unificada:", error);
        if (isMounted) {
          setCurrentAuditedShiftId(null);
          setSalesMetrics({
            shiftId: null,
            auditStatus: "none",
            auditResolution: "",
            auditNotes: "",
            initialFund: 0.0,
            cash: 0.0,
            card: 0.0,
            transfer: 0.0,
            totalSales: 0.0,
            expenses: 0.0,
            reportedCountedCash: 0.0,
            operatorNotes: "",
            operatorName: "Sin turno registrado",
          });
          setAdminNotes("");
          setResolutionType("MERMA_ACEPTADA");
        }
      }
    }

    loadAdminAudit();
    return () => {
      isMounted = false;
    };
  }, [isAdmin, selectedBranch, selectedDate]);

  // Cálculos contables unificados
  const totals: FinancialSummary = useMemo(() => {
    const liveExpenses = expensesList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalExpenses = isAdmin ? salesMetrics.expenses : liveExpenses;

    const fund = isAdmin ? salesMetrics.initialFund : isShiftOpen ? Number(initialCash) || 0.0 : 0.0;
    const cash = isAdmin ? salesMetrics.cash : salesBreakdown.cash;
    const card = isAdmin ? salesMetrics.card : salesBreakdown.card;
    const transfer = isAdmin ? salesMetrics.transfer : salesBreakdown.transfer;
    const grossSales = isAdmin ? salesMetrics.totalSales : cash + card + transfer;

    const rawExpected = fund + cash - totalExpenses;
    const expected = isShiftOpen || isAdmin ? Math.max(0, rawExpected) : 0.0;
    const totalExp = Math.max(0, fund + grossSales - totalExpenses);

    const actualCounted = isAdmin
      ? salesMetrics.reportedCountedCash
      : isShiftOpen
      ? Number(countedCash) || 0.0
      : 0.0;
    const diff = Number((actualCounted - expected).toFixed(2));

    return {
      initialFund: fund,
      cashSales: cash,
      cardSales: card,
      transferSales: transfer,
      totalSales: grossSales,
      expenses: totalExpenses,
      expectedCash: expected,
      totalExpected: totalExp,
      difference: diff,
      isSurplus: diff > 0,
      isShortage: diff < 0,
      isBalanced: diff === 0,
    };
  }, [expensesList, isAdmin, isShiftOpen, initialCash, salesMetrics, salesBreakdown, countedCash]);

  // Iniciar turno
  const handleOpenShiftConfirm = async (amount: number) => {
    try {
      setIsProcessing(true);
      await openCashShiftInDB({
        branchName: effectiveBranch,
        cashierId: user?.id || "",
        initialCash: amount,
      });

      openShift(amount, activeOperatorName);
      setCountedCash(amount);
      setIsModalOpen(false);

      // Desacoplamiento para montar ConfirmarModal tras el cierre de OpenShiftModal
      setTimeout(() => {
        setDialogConfig({
          isOpen: true,
          type: "success",
          title: "Turno en curso",
          description: `Inicio de turno exitoso con un fondo de $${amount.toFixed(2)}.`,
          confirmText: "Aceptar",
          onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
        });
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar turno en base de datos";
      setDialogConfig({
        isOpen: true,
        type: "warning",
        title: "Error de Apertura",
        description: msg,
        confirmText: "Aceptar",
        onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Registrar gasto
  const handleSaveExpense = async (newExpense: ExpenseRecord) => {
    try {
      setIsProcessing(true);
      await recordExpenseInDB({
        branchName: effectiveBranch,
        amount: newExpense.amount,
        category: newExpense.category,
        concept: newExpense.concept,
      });

      setExpensesList((prev) => [newExpense, ...prev]);
      setIsExpenseModalOpen(false);

      setDialogConfig({
        isOpen: true,
        type: "success",
        title: "Gasto Registrado",
        description: `Se retiraron $${Number(newExpense.amount).toFixed(2)} de gaveta exitosamente.`,
        confirmText: "Aceptar",
        onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrar gasto";
      setDialogConfig({
        isOpen: true,
        type: "warning",
        title: "Error de Salida",
        description: msg,
        confirmText: "Aceptar",
        onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cerrar turno (Corte Z)
  const handleCloseShift = () => {
    const currentCounted = Number(countedCash) || 0;
    const currentExpected = Number(totals.expectedCash) || 0;
    const realDiff = Number((currentCounted - currentExpected).toFixed(2));

    if (realDiff !== 0 && !cashierNotes.trim()) {
      setDialogConfig({
        isOpen: true,
        type: "warning",
        title: "Justificación Requerida",
        description:
          "Existe un descuadre en el arqueo de efectivo. Es obligatorio ingresar una justificación antes de realizar el Corte Z.",
        confirmText: "Entendido",
        onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setDialogConfig({
      isOpen: true,
      type: "warning",
      title: "Confirmar Cierre de Turno",
      description:
        "¿Confirmas el cierre de jornada (Corte Z)? Esta acción asentará el balance final en el sistema y cerrará la caja.",
      confirmText: "Sí, Cerrar Turno",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          setIsProcessing(true);

          await closeCashShiftInDB({
            branchName: effectiveBranch,
            countedCash: currentCounted,
            expectedCash: currentExpected,
            totalSales: totals.totalSales,
            totalExpenses: totals.expenses,
            difference: realDiff,
            notes: cashierNotes,
          });

          closeShift();
          setCashierNotes("");
          setCountedCash(0.0);
          setExpensesList([]);
          setSalesBreakdown({ cash: 0, card: 0, transfer: 0, total: 0 });

          setDialogConfig({
            isOpen: true,
            type: "success",
            title: "Turno Cerrado con Éxito",
            description:
              "El balance final ha sido asentado correctamente en la base de datos (Corte Z registrado).",
            confirmText: "Aceptar",
            onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
          });
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : "Error al registrar el cierre de turno";
          setDialogConfig({
            isOpen: true,
            type: "warning",
            title: "Error de Cierre",
            description: msg,
            confirmText: "Aceptar",
            onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
          });
        } finally {
          setIsProcessing(false);
        }
      },
      onCancel: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
    });
  };

  // Auditoría dictaminada por Admin
  const handleResolveDiscrepancy = useCallback(() => {
    if (!adminNotes.trim()) {
      setDialogConfig({
        isOpen: true,
        type: "warning",
        title: "Justificación Requerida",
        description: "Por favor ingrese una breve justificación técnica antes de dictaminar la auditoría.",
        confirmText: "Entendido",
        onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!currentAuditedShiftId) {
      setDialogConfig({
        isOpen: true,
        type: "warning",
        title: "Turno No Identificado",
        description: "No se encontró un turno registrado en la fecha seleccionada para resolver.",
        confirmText: "Aceptar",
        onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setDialogConfig({
      isOpen: true,
      type: "confirm",
      title: "Dictamen de Auditoría",
      description: "¿Confirmas el dictamen de esta auditoría? Al guardar, la alerta de descuadre quedará resuelta en la base de datos.",
      confirmText: "Aprobar y Resolver",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          setIsProcessing(true);

          await resolveShiftAuditInDB({
            shiftId: currentAuditedShiftId,
            resolutionType,
            notes: adminNotes,
          });

          setSalesMetrics((prev) => ({
            ...prev,
            auditStatus: "reviewed",
            auditResolution: resolutionType,
            auditNotes: adminNotes,
          }));

          resolveAudit(adminNotes, resolutionType);

          setDialogConfig({
            isOpen: true,
            type: "success",
            title: "Auditoría Resuelta",
            description: "La discrepancia contable fue archivada y resuelta con éxito en la base de datos.",
            confirmText: "Aceptar",
            onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Error al procesar la auditoría";
          setDialogConfig({
            isOpen: true,
            type: "warning",
            title: "Error de Auditoría",
            description: msg,
            confirmText: "Aceptar",
            onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
          });
        } finally {
          setIsProcessing(false);
        }
      },
      onCancel: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
    });
  }, [adminNotes, resolutionType, currentAuditedShiftId, resolveAudit]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ENCABEZADO */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-sky-600 tracking-tight">
                Control de caja
              </h1>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Auditoría Administrativa
                </span>
              ) : isShiftOpen ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Turno en Curso
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-slate-600 border border-rose-500">
                  Turno Cerrado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Cajón de efectivo, conciliación de ventas y cierre diario (Corte Z)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2.5">
                {/* 1. SELECTOR CUSTOMIZADO DE SUCURSAL */}
                <div className="relative" ref={branchRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBranchOpen(!isBranchOpen);
                      setIsDateOpen(false);
                    }}
                    className={`h-10 px-3.5 bg-white border rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs select-none ${
                      isBranchOpen ? "border-sky-500 ring-2 ring-sky-500/10" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Store className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">
                        Sede
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {selectedBranch}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform duration-200 ${
                        isBranchOpen ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>

                  {isBranchOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                        Seleccionar Sede
                      </div>
                      <div className="space-y-0.5">
                        {BRANCH_LIST.map((branch) => {
                          const isSelected = selectedBranch === branch.name;
                          return (
                            <button
                              key={branch.name}
                              type="button"
                              onClick={() => {
                                setSelectedBranch(branch.name);
                                setIsBranchOpen(false);
                              }}
                              className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-sky-50 text-sky-900 font-bold"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Building className={`w-3.5 h-3.5 ${isSelected ? "text-sky-600" : "text-slate-400"}`} />
                                <div>
                                  <p className="leading-tight">{branch.name}</p>
                                  <span className="text-[10px] text-slate-400 font-normal">{branch.state}</span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SELECTOR CUSTOMIZADO DE FECHA */}
                <div className="relative" ref={dateRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDateOpen(!isDateOpen);
                      setIsBranchOpen(false);
                    }}
                    className={`h-10 px-3.5 bg-white border rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs select-none ${
                      isDateOpen ? "border-sky-500 ring-2 ring-sky-500/10" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <CalendarIcon className="w-3.5 h-3.5 text-sky-600" />
                    </div>

                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">
                        Fecha
                      </span>
                      <span className="text-xs font-bold text-slate-800 tabular-nums tracking-tight">
                        {selectedDate}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform duration-200 ${
                        isDateOpen ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>

                  {isDateOpen && (
                    <div className="absolute right-0 sm:left-0 mt-2 w-72 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-xs font-extrabold text-slate-800 capitalize">
                          {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {dayNames.map((d) => (
                          <span key={d} className="text-[10px] font-black text-slate-400 py-1">
                            {d}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((item, idx) => {
                          const isSelected = selectedDate === item.dateStr;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedDate(item.dateStr);
                                setIsDateOpen(false);
                              }}
                              className={`h-8 w-8 mx-auto rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-sky-600 text-white shadow-xs scale-105"
                                  : item.isCurrentMonth
                                  ? "text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                                  : "text-slate-300 hover:text-slate-500"
                              }`}
                            >
                              {item.day}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Intl.DateTimeFormat("en-CA", {
                              timeZone: "America/El_Salvador",
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }).format(new Date());
                            setSelectedDate(today);
                            setViewMonth(new Date());
                            setIsDateOpen(false);
                          }}
                          className="text-sky-600 font-bold hover:underline cursor-pointer"
                        >
                          Hoy
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDateOpen(false)}
                          className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. BOTÓN AUDITAR TICKETS */}
                <button
                  type="button"
                  onClick={() => setIsTicketAuditOpen(true)}
                  className="px-3.5 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs hover:border-sky-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>Auditar Tickets</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs text-xs font-medium text-sky-600">
                  <span className="text-sky-700 font-bold capitalize">{currentDateDisplay}</span>
                  <span className="text-slate-300">|</span>
                  <span>
                    Operador: <span className="text-slate-800">{activeOperatorName}</span>
                  </span>
                </div>

                {!isShiftOpen && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Iniciar Turno</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* 4 TARJETAS SUPERIORES DE TOTALES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fondo Inicial */}
          <div className="bg-white border border-amber-300 border-l-4 border-l-amber-500 rounded-2xl p-4 shadow-xs hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Fondo Inicial
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-500 tabular-nums tracking-tight">
              ${totals.initialFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">
              Gaveta en apertura
            </span>
          </div>

          {/* Ventas Totales */}
          <div className="bg-white border border-blue-300 border-l-4 border-l-blue-500 rounded-2xl p-4 shadow-xs hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Ventas Totales
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-sky-600 tabular-nums tracking-tight">
              ${totals.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-sky-700 font-medium mt-0.5 block">
              Todos los métodos de pago
            </span>
          </div>

          {/* Gastos Menores */}
          <div className="bg-white border border-red-300 border-l-4 border-l-red-500 rounded-2xl p-4 shadow-xs hover:border-rose-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Gastos Menores
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-rose-500 tabular-nums tracking-tight">
              {totals.expenses > 0
                ? `-$${totals.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                : "$0.00"}
            </p>
            <span className="text-[10px] text-rose-700 font-medium mt-0.5 block">
              Egresos de caja chica
            </span>
          </div>

          {/* Total Esperado General */}
          <div className="bg-white border border-green-300 border-l-4 border-l-emerald-500 rounded-2xl p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Total Esperado
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-700 tabular-nums tracking-tight">
              ${totals.totalExpected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
              Fondo + Ventas - Gastos
            </span>
          </div>
        </section>

        {/* CUERPO EN 2 COLUMNAS */}
        <section className="grid grid-cols-12 gap-6 items-start">
          {/* Desglose de Ingresos */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-sky-600 uppercase tracking-wider">
                Desglose de Ingresos
              </h2>
            </div>

            <div className="space-y-3">
              {/* Efectivo */}
              <div className="bg-white border border-emerald-400 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-x font-bold text-emerald-800 leading-tight">Efectivo</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-emerald-900 tabular-nums">
                  ${totals.cashSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Tarjeta */}
              <div className="bg-white border border-sky-400 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-x font-bold text-sky-800 leading-tight">Tarjeta</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-sky-900 tabular-nums">
                  ${totals.cardSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Transferencia */}
              <div className="bg-white border border-purple-400 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-x font-bold text-purple-800 leading-tight">Transferencia</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-purple-900 tabular-nums">
                  ${totals.transferSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Listado de Gastos */}
            {expensesList.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Egresos Registrados ({expensesList.length})
                  </span>
                  <span className="text-[10px] font-bold text-rose-500 tabular-nums">
                    -${totals.expenses.toFixed(2)}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-32 overflow-y-auto pr-1">
                  {expensesList.map((exp, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[190px]">
                          {exp.concept}
                        </p>
                        <p className="text-[10px] text-slate-400">{exp.category}</p>
                      </div>
                      <span className="font-extrabold text-rose-500 tabular-nums">
                        -${Number(exp.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Arqueo y Auditoría */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-slate-300 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-sky-600 tracking-tight">
                  {isAdmin ? "Auditoría de Arqueo (Corte Z)" : "Arqueo de Caja (Efectivo)"}
                </h2>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  {isAdmin
                    ? "Fiscalización de valores reportados y dictamen contable"
                    : "Ingrese el conteo físico de billetes y monedas en gaveta"}
                </p>
              </div>

              {/* Si no existe turno registrado en la fecha seleccionada, no mostramos badges de descuadre ni dictamen */}
              {isAdmin && currentAuditedShiftId && !totals.isBalanced && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold ${
                    isAudited
                      ? "bg-sky-50 text-sky-700 border border-sky-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
                  }`}
                >
                  {isAudited ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      Auditado y Resuelto
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Pendiente de Resolución
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Inputs de Conteo y Esperado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-sky-700 uppercase tracking-tight mb-1.5">
                  Efectivo Contado
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold tabular-nums">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={!isShiftOpen || isAdmin}
                    value={
                      isAdmin
                        ? salesMetrics.reportedCountedCash.toFixed(2)
                        : isShiftOpen
                        ? countedCash || ""
                        : ""
                    }
                    onChange={(e) => setCountedCash(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-3 h-11 border border-slate-200 rounded-xl text-sm font-bold tabular-nums focus:outline-none transition-colors ${
                      isShiftOpen && !isAdmin
                        ? "bg-slate-50 text-slate-900 focus:bg-white focus:border-sky-500"
                        : "bg-slate-100 text-slate-500 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-sky-700 uppercase tracking-tight mb-1.5">
                  Efectivo Esperado en Gaveta
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold tabular-nums">
                    $
                  </span>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={totals.expectedCash.toFixed(2)}
                    className="w-full pl-8 pr-3 h-11 bg-slate-100/80 border border-slate-200 rounded-xl text-sm font-bold tabular-nums text-slate-600 cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            {/* Cuadro de Diferencia */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                totals.isBalanced || (isAdmin && !currentAuditedShiftId)
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                  : isAudited
                  ? "bg-sky-50/70 border-sky-300 text-sky-900"
                  : totals.isSurplus
                  ? "bg-blue-50/70 border-blue-300 text-blue-900"
                  : "bg-rose-50/70 border-rose-300 text-rose-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {totals.isBalanced || (isAdmin && !currentAuditedShiftId) ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : isAudited ? (
                  <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                ) : (
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${totals.isSurplus ? "text-blue-600" : "text-rose-600"}`} />
                )}
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {!currentAuditedShiftId && isAdmin
                      ? "Sin Jornada Registrada"
                      : totals.isBalanced
                      ? "Cuadre Exacto"
                      : isAudited
                      ? "Descuadre Auditado y Resuelto"
                      : totals.isSurplus
                      ? "Diferencia: Sobrante de Efectivo"
                      : "Diferencia: Faltante de Efectivo"}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {!currentAuditedShiftId && isAdmin
                      ? "No existen registros de turnos de caja para la fecha seleccionada."
                      : totals.isBalanced
                      ? "El conteo físico coincide al 100% con el efectivo esperado."
                      : isAudited
                      ? `Discrepancia conciliada bajo el dictamen [${salesMetrics.auditResolution || resolutionType}].`
                      : totals.isSurplus
                      ? "Hay más dinero físico en gaveta del registrado en sistema."
                      : "El efectivo físico es menor al balance contable exigido."}
                  </p>
                </div>
              </div>
              <span className="text-lg font-black tabular-nums tracking-tight">
                {!currentAuditedShiftId && isAdmin
                  ? "$0.00"
                  : totals.isBalanced
                  ? "$0.00"
                  : totals.isSurplus
                  ? `+$${totals.difference.toFixed(2)}`
                  : `-$${Math.abs(totals.difference).toFixed(2)}`}
              </span>
            </div>

            {/* Justificación obligatoria */}
            {((totals.isShortage && !isAdmin) || (isAdmin && currentAuditedShiftId && !totals.isBalanced)) && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                  Justificación / Motivo del Descuadre
                  {!isAdmin && (
                    <span className="text-rose-600 ml-1 font-semibold normal-case">
                      *(Obligatorio para cerrar turno)
                    </span>
                  )}
                </label>

                {isAdmin ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic">
                    {salesMetrics.operatorNotes
                      ? `“${salesMetrics.operatorNotes}”`
                      : "No se registró ninguna observación por el operador en este turno."}
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    disabled={!isShiftOpen}
                    value={cashierNotes}
                    onChange={(e) => setCashierNotes(e.target.value)}
                    placeholder="Explique detalladamente la causa del faltante de efectivo..."
                    className={`w-full p-3 border rounded-xl text-xs focus:outline-none transition-colors ${
                      !cashierNotes.trim()
                        ? "border-rose-300 bg-rose-50/25 placeholder-rose-300 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-500 focus:bg-white"
                    } ${!isShiftOpen ? "bg-slate-100 cursor-not-allowed" : ""}`}
                  />
                )}
              </div>
            )}

            {/* Acciones Admin */}
            {isAdmin ? (
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!currentAuditedShiftId}
                      onClick={() =>
                        downloadCorteZPDF(`Corte-Z-${selectedBranch}-${selectedDate}.pdf`)
                      }
                      className="flex items-center gap-1.5 px-3 py-2 border border-emerald-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Descargar Corte Z</span>
                    </button>
                  </div>

                  {currentAuditedShiftId && !totals.isBalanced && (
                    <>
                      {!isAudited ? (
                        <button
                          type="button"
                          onClick={handleResolveDiscrepancy}
                          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Aprobar y Resolver Alerta</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resuelto por {user?.name || "Administrador"}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {currentAuditedShiftId && !totals.isBalanced && !isAudited && (
                  <div className="p-3.5 bg-purple-100/50 border border-purple-200 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-900 uppercase tracking-tight">
                        Dictamen Contable:
                      </span>
                      <select
                        value={resolutionType}
                        onChange={(e) => setResolutionType(e.target.value as ResolutionType)}
                        className="text-xs font-bold bg-white border border-purple-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="MERMA_ACEPTADA">Ajuste Aceptado (Merma)</option>
                        <option value="COBRO_EMPLEADO">Cobro a Cajero / Nómina</option>
                        <option value="CORRECCION_POS">Error Corregido en POS</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Escriba la justificación contable de la resolución..."
                      className="w-full text-xs text-slate-700 font-medium p-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 placeholder-purple-300"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Acciones Cajero */
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={!isShiftOpen}
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Registrar Gasto Menor
                </button>

                {isShiftOpen && (
                  <button
                    type="button"
                    onClick={handleCloseShift}
                    className="flex items-center gap-2 bg-[#B91C1C] hover:bg-red-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cerrar Turno (Corte Z)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODALES OPERATIVOS */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
        currentAvailableCash={
          totals.expectedCash > 0
            ? totals.expectedCash
            : Number(initialCash) || countedCash || 0.0
        }
      />

      <AuditTicketsModal
        isOpen={isTicketAuditOpen}
        onClose={() => setIsTicketAuditOpen(false)}
        branchName={effectiveBranch}
        selectedDate={selectedDate}
        selectedShift="Jornada Completa"
      />

      {!isAdmin && (
        <OpenShiftModal
          isOpen={isModalOpen}
          cashierName={activeOperatorName}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleOpenShiftConfirm}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmarModal
        isOpen={dialogConfig.isOpen}
        type={dialogConfig.type}
        title={dialogConfig.title}
        description={dialogConfig.description}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        onConfirm={dialogConfig.onConfirm}
        onCancel={dialogConfig.onCancel}
      />

      <CorteZPDFTemplate
        data={{
          folio: `Z-${effectiveBranch.substring(0, 2).toUpperCase()}-${selectedDate.replace(/-/g, "")}`,
          branch: effectiveBranch,
          date: selectedDate,
          cashier: isAdmin ? salesMetrics.operatorName : activeOperatorName,
          adminName: user?.name || "Mario Administrador",
          initialFund: totals.initialFund,
          cashSales: totals.cashSales,
          cardSales: totals.cardSales,
          transferSales: totals.transferSales,
          totalSales: totals.totalSales,
          expenses: totals.expenses,
          expectedCash: totals.expectedCash,
          countedCash: isAdmin ? salesMetrics.reportedCountedCash : countedCash,
          difference: totals.difference,
          cashierNote: isAdmin
            ? salesMetrics.operatorNotes || "Sin observaciones registradas."
            : cashierNotes || "Turno cerrado sin observaciones.",
          adminNote: adminNotes || "Resolución contable archivada.",
          resolutionType,
        }}
      />
    </div>
  );
}