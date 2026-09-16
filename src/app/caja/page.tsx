"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ConfirmarModal, { DialogType } from "@/components/ConfirmarModal";
import ExpenseModal, { ExpenseRecord } from "@/components/GastoMenorModal";
import CorteZPDFTemplate, { downloadCorteZPDF } from "@/components/CortePDF";
import OpenShiftModal from "@/components/OpenShiftModal";
import AuditTicketsModal from "@/components/AuditTicketsModal";
import { useShift } from "@/app/context/ShiftContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  Banknote,
  CreditCard,
  Building2,
  Lock,
  Receipt,
  FileSpreadsheet,
  PlusCircle,
  Store,
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
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

  // Control de Modales Operativos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTicketAuditOpen, setIsTicketAuditOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Control del Diálogo de Notificaciones / Confirmaciones
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

  // Filtros de Auditoría (Admin)
  const [selectedBranch, setSelectedBranch] = useState("Santa Ana");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Resolución Contable (Admin)
  const isAudited = auditStatus === "reviewed";
  const [resolutionType, setResolutionType] = useState<ResolutionType>("MERMA_ACEPTADA");
  const [adminNotes, setAdminNotes] = useState("");

  // Operatoria Cajero
  const [cashierNotes, setCashierNotes] = useState("");
  const [countedCash, setCountedCash] = useState<number>(0.0);
  const [expensesList, setExpensesList] = useState<ExpenseRecord[]>([]);

  // Estado reactivo para métricas del turno / jornada (Inicializados en 0.00)
  const [salesMetrics, setSalesMetrics] = useState({
    initialFund: 0.0,
    cash: 0.0,
    card: 0.0,
    transfer: 0.0,
    reportedCountedCash: 0.0,
    operatorNotes: "",
    operatorName: "Sin operador",
  });

  // Carga asíncrona no bloqueante (preparada para backend / Supabase)
  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;

    async function loadShiftData() {
      try {
        await Promise.resolve();

        if (isMounted) {
          setSalesMetrics({
            initialFund: 0.0,
            cash: 0.0,
            card: 0.0,
            transfer: 0.0,
            reportedCountedCash: 0.0,
            operatorNotes: "",
            operatorName: "Sin operador",
          });
        }
      } catch (error) {
        console.error("Error al cargar auditoría de turno:", error);
      }
    }

    loadShiftData();

    return () => {
      isMounted = false;
    };
  }, [isAdmin, selectedBranch, selectedDate]);

  // Balance Financiero Dinámico
  const totals: FinancialSummary = useMemo(() => {
    const totalExpenses = expensesList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    
    const fund = isAdmin ? salesMetrics.initialFund : isShiftOpen ? Number(initialCash) || 0.0 : 0.0;
    const cash = isAdmin ? salesMetrics.cash : 0.0;
    const card = isAdmin ? salesMetrics.card : 0.0;
    const transfer = isAdmin ? salesMetrics.transfer : 0.0;
    const grossSales = cash + card + transfer;

    const rawExpected = fund + cash - totalExpenses;
    const expected = (isShiftOpen || isAdmin) ? Math.max(0, rawExpected) : 0.0;
    const totalExp = Math.max(0, fund + grossSales - totalExpenses);

    const actualCounted = isAdmin ? salesMetrics.reportedCountedCash : isShiftOpen ? Number(countedCash) || 0.0 : 0.0;
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
  }, [expensesList, isAdmin, isShiftOpen, initialCash, salesMetrics, countedCash]);

  // Apertura de Turno
  const handleOpenShiftConfirm = useCallback((amount: number) => {
    openShift(amount, cashierName);
    setCountedCash(amount);
    setIsModalOpen(false);
  }, [openShift, cashierName]);

  // Guardar Gasto
  const handleSaveExpense = useCallback((newExpense: ExpenseRecord) => {
    setExpensesList((prev) => [newExpense, ...prev]);
  }, []);

  // Cierre de Turno
  const handleCloseShift = useCallback(() => {
    if (totals.isShortage && !cashierNotes.trim()) {
      setDialogConfig({
        isOpen: true,
        type: "warning",
        title: "Justificación Requerida",
        description: "Existe un faltante en el arqueo de efectivo. Es obligatorio ingresar una justificación antes de realizar el Corte Z.",
        confirmText: "Entendido",
        onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setDialogConfig({
      isOpen: true,
      type: "warning",
      title: "Confirmar Cierre de Turno",
      description: "¿Confirmas el cierre de jornada (Corte Z)? Esta acción registrará el balance final del día.",
      confirmText: "Sí, Cerrar Turno",
      cancelText: "Cancelar",
      onConfirm: () => {
        closeShift();
        setCashierNotes("");
        setCountedCash(0.0);

        setDialogConfig({
          isOpen: true,
          type: "success",
          title: "Turno Cerrado con Éxito",
          description: "El balance final ha sido asentado correctamente y el comprobante quedó registrado.",
          confirmText: "Aceptar",
          onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
        });
      },
      onCancel: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
    });
  }, [totals.isShortage, cashierNotes, closeShift]);

  // Resolución de Auditoría (Admin)
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

    setDialogConfig({
      isOpen: true,
      type: "confirm",
      title: "Dictamen de Auditoría",
      description: "¿Confirmas el dictamen de esta auditoría? Al guardar, la alerta de descuadre desaparecerá del Dashboard.",
      confirmText: "Aprobar y Resolver",
      cancelText: "Cancelar",
      onConfirm: () => {
        resolveAudit(adminNotes, resolutionType);
        setDialogConfig({
          isOpen: true,
          type: "success",
          title: "Auditoría Resuelta",
          description: "La discrepancia contable fue archivada y resuelta con éxito.",
          confirmText: "Aceptar",
          onConfirm: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
        });
      },
      onCancel: () => setDialogConfig((prev) => ({ ...prev, isOpen: false })),
    });
  }, [adminNotes, resolutionType, resolveAudit]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ENCABEZADO */}
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Control de caja</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Cash Drawer & Daily Close (Corte Z)
            </p>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Santa Ana">Santa Ana</option>
                  <option value="Ahuachapán">Ahuachapán</option>
                  <option value="Sonsonate">Sonsonate</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-xs text-slate-500 font-medium text-right">
                Turno:{" "}
                <strong className={isShiftOpen ? "text-emerald-600" : "text-slate-700"}>
                  {isShiftOpen ? "En Curso" : "Cerrado"}
                </strong>
                <span className="mx-2 text-slate-300">|</span>
                Operador: <strong className="text-slate-700">{cashierName}</strong>
              </div>

              {!isShiftOpen && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Iniciar Turno</span>
                </button>
              )}
            </div>
          )}
        </header>

        {/* 4 CARDS SUPERIORES */}
        <section className="grid grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Banknote className="w-3.5 h-3.5" />
              <span>Fondo Inicial</span>
            </div>
            <p className="text-xl font-bold text-slate-800">
              ${totals.initialFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Receipt className="w-3.5 h-3.5" />
              <span>Ventas Totales</span>
            </div>
            <p className="text-xl font-bold text-sky-600">
              ${totals.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Gastos</span>
            </div>
            <p className="text-xl font-bold text-red-500">
              {totals.expenses > 0
                ? `-$${totals.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                : "$0.00"}
            </p>
          </div>

          <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Receipt className="w-3.5 h-3.5" />
              <span>Total Esperado</span>
            </div>
            <p className="text-xl font-bold text-slate-800">
              ${totals.totalExpected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </section>

        {/* 2 COLUMNAS DE DETALLE */}
        <section className="grid grid-cols-12 gap-6 items-start">
          {/* DESGLOSE POR MÉTODO */}
          <div className="col-span-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Desglose de Ingresos</h2>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Efectivo</p>
                  <p className="text-[11px] text-slate-400">Ingreso a gaveta física</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-800">
                ${totals.cashSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Tarjeta</p>
                  <p className="text-[11px] text-slate-400">Comprobantes de terminal</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-800">
                ${totals.cardSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Transferencia</p>
                  <p className="text-[11px] text-slate-400">Acreditaciones bancarias</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-800">
                ${totals.transferSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* ARQUEO Y AUDITORÍA */}
          <div className="col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  {isAdmin ? "Auditoría de Arqueo (Corte Z)" : "Arqueo de Caja (Efectivo)"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAdmin
                    ? "Fiscalización de valores reportados y resolución contable"
                    : "Ingrese el conteo físico de billetes y monedas en gaveta"}
                </p>
              </div>

              {/* Badge superior si hay descuadre */}
              {isAdmin && !totals.isBalanced && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Efectivo Contado
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
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
                    placeholder={isShiftOpen ? "0.00" : "0.00"}
                    className={`w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none transition-colors ${
                      isShiftOpen && !isAdmin
                        ? "bg-slate-50 text-slate-800 focus:border-sky-400"
                        : "bg-slate-100 text-slate-500 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 leading-tight">
                  Efectivo Esperado
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    $
                  </span>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={totals.expectedCash.toFixed(2)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-100/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            {/* CUADRO DE DIFERENCIA (Verde: Cuadre exacto | Rojo: Descuadre pendiente | Azul: Descuadre resuelto) */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                totals.isBalanced
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-800"
                  : isAudited
                  ? "bg-sky-50 border-sky-300 text-sky-800"
                  : "bg-rose-50 border-rose-300 text-rose-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {totals.isBalanced ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : isAudited ? (
                  <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {totals.isBalanced
                      ? "Cuadre Exacto"
                      : isAudited
                      ? "Descuadre Auditado y Resuelto"
                      : totals.isSurplus
                      ? "Diferencia: Sobrante en Efectivo"
                      : "Diferencia: Faltante de Efectivo"}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {totals.isBalanced
                      ? "El conteo físico coincide al 100% con el efectivo esperado."
                      : isAudited
                      ? `Discrepancia conciliada bajo el dictamen [${resolutionType}].`
                      : totals.isSurplus
                      ? "Hay más dinero en la gaveta de lo registrado en sistema."
                      : "El efectivo físico es menor al balance exigido."}
                  </p>
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight tabular-nums">
                {totals.isBalanced
                  ? "$0.00"
                  : totals.isSurplus
                  ? `+$${totals.difference.toFixed(2)}`
                  : `-$${Math.abs(totals.difference).toFixed(2)}`}
              </span>
            </div>

            {/* JUSTIFICACIÓN POR DESCUADRE */}
            {(totals.isShortage || (isAdmin && !totals.isBalanced)) && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">
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
                    className={`w-full p-2.5 border rounded-xl text-xs focus:outline-none transition-colors ${
                      !cashierNotes.trim()
                        ? "border-rose-300 bg-rose-50/30 placeholder-rose-400 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-400"
                    } ${!isShiftOpen ? "bg-slate-100 cursor-not-allowed" : ""}`}
                  />
                )}
              </div>
            )}

            {/* ACCIONES */}
            {isAdmin ? (
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadCorteZPDF(`Corte-Z-${selectedBranch}-${selectedDate}.pdf`)
                      }
                      className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Descargar Corte Z</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTicketAuditOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Auditar Tickets</span>
                    </button>
                  </div>

                  {/* Botón de aprobar solo si hay descuadre */}
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
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-sky-600" /> Resuelto por {user?.name || "Administrador"}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Dictamen contable solo si hay descuadre y está pendiente */}
                {!totals.isBalanced && !isAudited && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">
                        Dictamen Contable:
                      </span>
                      <select
                        value={resolutionType}
                        onChange={(e) => setResolutionType(e.target.value as ResolutionType)}
                        className="text-xs font-semibold bg-white border border-slate-200 rounded-md px-2 py-1 focus:outline-none"
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
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-3 space-y-3">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={!isShiftOpen}
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Registrar Gasto Menor
                  </button>
                </div>

                {isShiftOpen && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseShift}
                      className="flex items-center gap-2 bg-[#B91C1C] hover:bg-red-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Cerrar Turno Diario (Corte Z)</span>
                    </button>
                  </div>
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
        currentAvailableCash={totals.difference >= 0 ? totals.expectedCash : totals.expectedCash + totals.difference}
      />

      <AuditTicketsModal
        isOpen={isTicketAuditOpen}
        onClose={() => setIsTicketAuditOpen(false)}
        branchName={selectedBranch}
        selectedDate={selectedDate}
        selectedShift="Jornada Completa"
      />

      {!isAdmin && (
        <OpenShiftModal
          isOpen={isModalOpen}
          cashierName={cashierName}
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
          folio: `Z-${selectedBranch.substring(0, 2).toUpperCase()}-${selectedDate.replace(/-/g, "")}`,
          branch: selectedBranch,
          date: selectedDate,
          cashier: isAdmin ? salesMetrics.operatorName : cashierName || "Maria G.",
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