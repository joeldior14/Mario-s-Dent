"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Coins,
  Plus,
  ArrowRight,
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

const BILL_DENOMINATIONS = [100, 50, 20, 10, 5, 1];

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

  // Sucursales
  const [selectedBranch, setSelectedBranch] = useState<BranchName>(() => {
    return (user?.branch as BranchName) || "Santa Ana";
  });

  const effectiveBranch = !isAdmin && user?.branch ? (user.branch as BranchName) : selectedBranch;

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/El_Salvador",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  });

  // Dictamen contable (Admin)
  const [resolutionType, setResolutionType] = useState<ResolutionType>("MERMA_ACEPTADA");
  const [adminNotes, setAdminNotes] = useState("");

  // Operatoria de cajero
  const [cashierNotes, setCashierNotes] = useState("");
  const [countedCash, setCountedCash] = useState<number>(0.0);
  const [expensesList, setExpensesList] = useState<ExpenseRecord[]>([]);

  // Métricas del turno para auditoría
  const [salesMetrics, setSalesMetrics] = useState({
    shiftId: null as string | null,
    auditStatus: "pending_review" as "pending_review" | "reviewed",
    auditResolution: "MERMA_ACEPTADA",
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
          setCurrentAuditedShiftId(audit.shiftId);
          setSalesMetrics({
            shiftId: audit.shiftId,
            auditStatus: (audit.auditStatus as "pending_review" | "reviewed") || "pending_review",
            auditResolution: audit.auditResolution || "MERMA_ACEPTADA",
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

  // Denominaciones rápidas
  const handleAddDenomination = (val: number) => {
    setCountedCash((prev) => Number((prev + val).toFixed(2)));
  };

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
  const handleCloseShift = useCallback(() => {
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
  }, [totals, cashierNotes, effectiveBranch, countedCash, closeShift]);

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
        {/* =========================================================================
            ENCABEZADO DE PANTALLA Y CONTROLES
           ========================================================================= */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Control de caja
              </h1>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
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
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Cajón de efectivo, conciliación de ventas y cierre diario (Corte Z)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 h-10 shadow-2xs hover:border-sky-400 transition-colors">
                  <Store className="w-3.5 h-3.5 text-sky-600 mr-2 shrink-0" />
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value as BranchName)}
                    className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="Santa Ana">Santa Ana</option>
                    <option value="Ahuachapán">Ahuachapán</option>
                    <option value="Sonsonate">Sonsonate</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 h-10 rounded-xl shadow-2xs hover:border-sky-400 transition-colors">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  />
                </div>

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
                <div className="flex items-center gap-2 bg-white border border-sky-500 rounded-xl px-3 py-1.5 shadow-2xs text-xs font-medium text-slate-500">
                  <span className="text-slate-700 font-bold capitalize">{currentDateDisplay}</span>
                  <span className="text-slate-300">|</span>
                  <span>
                    Operador: <strong className="text-slate-800">{activeOperatorName}</strong>
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

        {/* =========================================================================
            4 TARJETAS SUPERIORES DE TOTALES
           ========================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fondo Inicial */}
          <div className="bg-white border border-amber-300 border-l-4 border-l-amber-500 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Fondo Inicial
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800 font-mono tracking-tight">
              ${totals.initialFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
              Gaveta en apertura
            </span>
          </div>

          {/* Ventas Totales */}
          <div className="bg-white border border-blue-300 border-l-4 border-l-blue-500 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Ventas Totales
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-sky-600 font-mono tracking-tight">
              ${totals.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
              Todos los métodos de pago
            </span>
          </div>

          {/* Gastos Menores */}
          <div className="bg-white border border-red-300 border-l-4 border-l-red-500  rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Gastos Menores
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-500 font-mono tracking-tight">
              {totals.expenses > 0
                ? `-$${totals.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                : "$0.00"}
            </p>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
              Egresos de caja chica
            </span>
          </div>

          {/* Total Esperado General */}
          <div className="bg-white border border-green-300 border-l-4 border-l-emerald-500 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black-700 text-[15px] font-bold uppercase tracking-wider">
                Total Esperado
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-green-700 font-mono tracking-tight">
              ${totals.totalExpected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
              Fondo + Ventas - Gastos
            </span>
          </div>
        </section>

        {/* =========================================================================
            CUERPO EN 2 COLUMNAS (DESGLOSE + ARQUEO)
           ========================================================================= */}
        <section className="grid grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: Desglose por Método de Pago */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Desglose de Ingresos
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Auditoría por canal</span>
            </div>

            <div className="space-y-3">
              {/* Efectivo */}
              <div className="bg-white border border-emerald-400 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">Efectivo</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ingreso a gaveta física</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-slate-900 font-mono">
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
                    <p className="text-xs font-bold text-slate-800 leading-tight">Tarjeta</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Vouchers de POS</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  ${totals.cardSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Transferencia */}
              <div className="bg-white border border-purple-400 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">Transferencia</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Acreditación bancaria</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  ${totals.transferSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Listado de Gastos del Turno */}
            {expensesList.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Egresos Registrados ({expensesList.length})
                  </span>
                  <span className="text-[10px] font-bold text-rose-500 font-mono">
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
                      <span className="font-extrabold text-rose-500 font-mono">
                        -${Number(exp.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Consola de Arqueo y Auditoría */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-blue-300 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  {isAdmin ? "Auditoría de Arqueo (Corte Z)" : "Arqueo de Caja (Efectivo)"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAdmin
                    ? "Fiscalización de valores reportados y dictamen contable"
                    : "Ingrese el conteo físico de billetes y monedas en gaveta"}
                </p>
              </div>

              {isAdmin && !totals.isBalanced && (
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
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-tight mb-1.5">
                  Efectivo Contado
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold font-mono">
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
                    className={`w-full pl-8 pr-3 h-11 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:outline-none transition-colors ${
                      isShiftOpen && !isAdmin
                        ? "bg-slate-50 text-slate-900 focus:bg-white focus:border-sky-500"
                        : "bg-slate-100 text-slate-500 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                  Efectivo Esperado en Gaveta
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold font-mono">
                    $
                  </span>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={totals.expectedCash.toFixed(2)}
                    className="w-full pl-8 pr-3 h-11 bg-slate-100/80 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-600 cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            {/* Cuadro de Conciliación / Diferencia */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                totals.isBalanced
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                  : isAudited
                  ? "bg-sky-50/70 border-sky-300 text-sky-900"
                  : totals.isSurplus
                  ? "bg-blue-50/70 border-blue-300 text-blue-900"
                  : "bg-rose-50/70 border-rose-300 text-rose-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {totals.isBalanced ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : isAudited ? (
                  <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                ) : (
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${totals.isSurplus ? "text-blue-600" : "text-rose-600"}`} />
                )}
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {totals.isBalanced
                      ? "Cuadre Exacto"
                      : isAudited
                      ? "Descuadre Auditado y Resuelto"
                      : totals.isSurplus
                      ? "Diferencia: Sobrante de Efectivo"
                      : "Diferencia: Faltante de Efectivo"}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {totals.isBalanced
                      ? "El conteo físico coincide al 100% con el efectivo esperado."
                      : isAudited
                      ? `Discrepancia conciliada bajo el dictamen [${resolutionType}].`
                      : totals.isSurplus
                      ? "Hay más dinero físico en gaveta del registrado en sistema."
                      : "El efectivo físico es menor al balance contable exigido."}
                  </p>
                </div>
              </div>
              <span className="text-lg font-black font-mono tracking-tight">
                {totals.isBalanced
                  ? "$0.00"
                  : totals.isSurplus
                  ? `+$${totals.difference.toFixed(2)}`
                  : `-$${Math.abs(totals.difference).toFixed(2)}`}
              </span>
            </div>

            {/* Justificación obligatoria por descuadre */}
            {(totals.isShortage || (isAdmin && !totals.isBalanced)) && (
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

            {/* Acciones del Administrador */}
            {isAdmin ? (
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadCorteZPDF(`Corte-Z-${selectedBranch}-${selectedDate}.pdf`)
                      }
                      className="flex items-center gap-1.5 px-3 py-2 border border-emerald-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Descargar Corte Z</span>
                    </button>
                  </div>

                  {!totals.isBalanced && (
                    <>
                      {!isAudited ? (
                        <button
                          type="button"
                          onClick={handleResolveDiscrepancy}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Aprobar y Resolver Alerta</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-sky-600" /> Resuelto por {user?.name || "Administrador"}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {!totals.isBalanced && !isAudited && (
                  <div className="p-3.5 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2.5">
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
                      className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 placeholder-purple-300"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Acciones del Cajero */
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

      {/* =========================================================================
          MODALES OPERATIVOS (PRESERVADOS INTACTOS)
         ========================================================================= */}
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
          expenses: totals.expenses,
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