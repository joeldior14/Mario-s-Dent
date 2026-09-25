"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  searchDashboardInventory,
  DashboardProductSearchResult,
  fetchDashboardSalesMetrics,
  DashboardSalesMetrics,
  fetchBranchesPerformance,
  BranchPerformanceMetric,
  fetchDashboardStockAlerts,
  DashboardStockAlerts,
} from "@/app/services/inventoryService";
import { useShift } from "@/app/context/ShiftContext";
import {
  Calendar,
  RotateCw,
  Search,
  TrendingUp,
  AlertTriangle,
  PackageX,
  ChevronDown,
  Store,
  CreditCard,
  Banknote,
  Building2,
  ArrowUpRight,
  Layers,
  X,
} from "lucide-react";

interface BranchMetric {
  id: string;
  name: string;
  isOpen: boolean;
  incomeToday: number;
  trend: string;
  transactionsCount: number;
  estimatedProfit: number;
  paymentMethods: {
    card: number;
    transfer: number;
    cash: number;
  };
}

const BRANCHES_DATA: Record<string, BranchMetric> = {
  "santa-ana": {
    id: "santa-ana",
    name: "Santa Ana (Matriz)",
    isOpen: true,
    incomeToday: 6200.0,
    trend: "+9.2%",
    transactionsCount: 22,
    estimatedProfit: 2150.0,
    paymentMethods: { card: 60, transfer: 25, cash: 15 },
  },
  ahuachapan: {
    id: "ahuachapan",
    name: "Sucursal Ahuachapán",
    isOpen: true,
    incomeToday: 2450.0,
    trend: "+4.1%",
    transactionsCount: 8,
    estimatedProfit: 860.0,
    paymentMethods: { card: 50, transfer: 20, cash: 30 },
  },
  sonsonate: {
    id: "sonsonate",
    name: "Sucursal Sonsonate",
    isOpen: true,
    incomeToday: 3800.0,
    trend: "+11.0%",
    transactionsCount: 12,
    estimatedProfit: 1390.0,
    paymentMethods: { card: 65, transfer: 30, cash: 5 },
  },
};

export default function DashboardPage() {
  const { auditStatus } = useShift();

  // Estados del Buscador Rápido conectado a Supabase
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DashboardProductSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filtros de Sede y Fecha
  const [selectedBranchKey, setSelectedBranchKey] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/El_Salvador",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Métricas reales conectadas al backend
  const [realMetrics, setRealMetrics] = useState<DashboardSalesMetrics>({
    totalIncome: 0,
    totalTickets: 0,
    estimatedProfit: 0,
    trend: "+0.0%",
    paymentMethods: { card: 0, transfer: 0, cash: 0 },
    breakdownAmounts: { card: 0, transfer: 0, cash: 0 },
  });

  const [branchPerformance, setBranchPerformance] = useState<BranchPerformanceMetric[]>([]);

  const [stockAlerts, setStockAlerts] = useState<DashboardStockAlerts>({
    lowStockItems: [],
    outOfStockItems: [],
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
  };

  // Carga unificada de métricas, rendimiento y alertas desde Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [metricsData, perfData, alertsData] = await Promise.all([
          fetchDashboardSalesMetrics(selectedDate, selectedBranchKey),
          fetchBranchesPerformance(selectedDate),
          fetchDashboardStockAlerts(selectedBranchKey),
        ]);

        if (isMounted) {
          setRealMetrics(metricsData);
          setBranchPerformance(perfData);
          setStockAlerts(alertsData);
        }
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedBranchKey, isRefreshing]);

  // Búsqueda en Supabase con Debounce (300 ms) respetando la sucursal activa
  useEffect(() => {
    const cleanQuery = searchQuery.trim();

    const delayDebounce = setTimeout(async () => {
      if (!cleanQuery) {
        setSearchResults([]);
        setIsSearchOpen(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setIsSearchOpen(true);

      try {
        const data = await searchDashboardInventory(cleanQuery, selectedBranchKey);
        setSearchResults(data);
      } catch (err) {
        console.error("Error en búsqueda de inventario:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedBranchKey]);

  // Nombre legible de la sede activa
  const activeMetrics = useMemo(() => {
    if (selectedBranchKey !== "all" && BRANCHES_DATA[selectedBranchKey]) {
      return BRANCHES_DATA[selectedBranchKey];
    }
    return {
      id: "all",
      name: "Todas las Sucursales (Consolidado)",
      isOpen: true,
      incomeToday: 12450.0,
      trend: "+8.5%",
      transactionsCount: 42,
      estimatedProfit: 4400.0,
      paymentMethods: { card: 60, transfer: 25, cash: 15 },
    };
  }, [selectedBranchKey]);

  // Detección segura de discrepancia contable
  const isAuditPending =
    (auditStatus as string) === "pending" ||
    (auditStatus as string) === "pending_review";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* =========================================================================
            1. ENCABEZADO DE CONTROL EJECUTIVO
           ========================================================================= */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Panel Ejecutivo
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Red Operativa Activa
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Supervisión de ingresos, auditoría de ventas y salud de existencias
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Selector de Sucursal */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 h-10 shadow-2xs hover:border-slate-300 transition-colors">
              <Store className="w-4 h-4 text-sky-600 mr-2 shrink-0" />
              <div className="flex flex-col justify-center text-left leading-none pr-6">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                  Sede
                </span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                  {activeMetrics.name}
                </span>
              </div>
              <select
                value={selectedBranchKey}
                onChange={(e) => setSelectedBranchKey(e.target.value)}
                className="appearance-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="all">Todas las Sucursales (Consolidado)</option>
                <option value="santa-ana">Santa Ana (Matriz)</option>
                <option value="ahuachapan">Sucursal Ahuachapán</option>
                <option value="sonsonate">Sucursal Sonsonate</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Selector de Fecha */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 h-10 rounded-xl shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            {/* Botón Sincronizar */}
            <button
              onClick={handleRefresh}
              title="Refrescar métricas"
              className="w-10 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-600" : ""}`} />
            </button>
          </div>
        </header>

        {/* =========================================================================
            2. ALERTA DE DESCUADRE PENDIENTE
           ========================================================================= */}
        {isAuditPending && (
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-950">
                  Discrepancia contable detectada en arqueo de caja
                </p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Existe un turno cerrado con descuadre en gaveta física que requiere resolución administrativa.
                </p>
              </div>
            </div>

            <Link
              href="/caja"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
            >
              <span>Auditar Caja</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* =========================================================================
            3. BUSCADOR RÁPIDO DE PRECIOS & EXISTENCIAS (SUPABASE)
           ========================================================================= */}
        <div className="relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setIsSearchOpen(true);
              }}
              placeholder={`Consultar existencias y precios en ${
                selectedBranchKey === "all" ? "toda la red" : activeMetrics.name
              } (ej. Articaína, Resina A2, Fórceps)...`}
              className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium placeholder-slate-400 shadow-2xs focus:outline-none focus:border-sky-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setIsSearchOpen(false);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Menú Desplegable Flotante */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in-50 duration-150">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                  Consultando existencias en tiempo real...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                        <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {item.sku}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {item.brand} • <span className="text-slate-500">{item.branchName}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-bold text-sky-600">
                        ${item.price.toFixed(2)}
                      </p>
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          item.stock <= 0
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : item.stock <= 5
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {item.stock} en stock
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-xs text-slate-400">
                  No se encontraron insumos que coincidan con &quot;{searchQuery}&quot;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            4. GRID PRINCIPAL (FINANZAS Y OPERACIONES)
           ========================================================================= */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: Finanzas y Desempeño */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-sky-50/70 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Ingresos Totales Cobrados
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                      ${realMetrics.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {realMetrics.trend}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Margen bruto estimado:{" "}
                    <strong className="text-slate-700 font-mono">
                      ${realMetrics.estimatedProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tickets
                  </span>
                  <span className="text-3xl font-black text-sky-600 font-mono">
                    {realMetrics.totalTickets}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {selectedBranchKey === "all"
                    ? "Consolidado de 3 sucursales en operación"
                    : `Reporte específico de ${activeMetrics.name}`}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Corte y arqueo gestionado en Caja
                </span>
              </div>
            </div>

            {/* Rendimiento por Sucursal (Conectado a Supabase) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Rendimiento por Sucursal
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Jornada en curso</span>
              </div>

              <div className="space-y-3">
                {branchPerformance.length > 0 ? (
                  branchPerformance.map((b) => {
                    const isSelected = selectedBranchKey === b.id;

                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBranchKey(b.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-sky-50/50 border-sky-300 ring-1 ring-sky-300"
                            : "bg-slate-50/60 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-800">{b.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-[11px] font-mono">
                              {b.ticketsCount} tickets
                            </span>
                            <span className="font-extrabold text-slate-900 font-mono">
                              ${b.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No hay ventas registradas para las sucursales en la fecha seleccionada.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Métodos de Pago & Alertas de Inventario */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Distribución por Métodos de Pago
              </h3>

              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-sky-500"
                      strokeDasharray={`${realMetrics.paymentMethods.card}, 100`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${realMetrics.paymentMethods.transfer}, 100`}
                      strokeDashoffset={`-${realMetrics.paymentMethods.card}`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-slate-400"
                      strokeDasharray={`${realMetrics.paymentMethods.cash}, 100`}
                      strokeDashoffset={`-${realMetrics.paymentMethods.card + realMetrics.paymentMethods.transfer}`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black text-slate-800">100%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-sky-500" />
                      <span className="font-semibold text-slate-700">Tarjeta</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">{realMetrics.paymentMethods.card}%</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-semibold text-slate-700">Transferencia</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">{realMetrics.paymentMethods.transfer}%</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">Efectivo</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">{realMetrics.paymentMethods.cash}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertas de Inventario (Conectadas a Supabase) */}
            <div className="space-y-4">
              {/* STOCK BAJO */}
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Stock Bajo (1-5 unidades)
                    </h4>
                  </div>
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                    {stockAlerts.lowStockItems.length} items
                  </span>
                </div>

                <div className="divide-y divide-amber-200/40 max-h-44 overflow-y-auto pr-1">
                  {stockAlerts.lowStockItems.length > 0 ? (
                    stockAlerts.lowStockItems.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.brand}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded mr-1.5">
                            {item.branch}
                          </span>
                          <span className="font-extrabold text-amber-700 font-mono">
                            {item.stock} disp.
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-amber-700/80 italic py-2">
                      Sin insumos con stock crítico para esta selección.
                    </p>
                  )}
                </div>

                <Link
                  href="/inventario"
                  className="w-full mt-3 py-1.5 px-3 border border-dashed border-amber-300 rounded-xl text-center text-xs font-bold text-amber-800 hover:bg-amber-100/50 flex items-center justify-center gap-1.5 transition-colors block"
                >
                  <span>Revisar inventario para reordenar</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* PRODUCTOS AGOTADOS */}
              <div className="bg-rose-50/40 border border-rose-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-rose-800">
                    <PackageX className="w-4 h-4 text-rose-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Productos Agotados (Stock 0)
                    </h4>
                  </div>
                  <span className="text-[10px] font-extrabold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full border border-rose-200">
                    {stockAlerts.outOfStockItems.length} items
                  </span>
                </div>

                <div className="divide-y divide-rose-200/40 max-h-44 overflow-y-auto pr-1">
                  {stockAlerts.outOfStockItems.length > 0 ? (
                    stockAlerts.outOfStockItems.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.brand}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded mr-1.5">
                            {item.branch}
                          </span>
                          <span className="font-extrabold text-rose-600 font-mono">
                            0 en stock
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-rose-700/80 italic py-2">
                      No hay productos en quiebre de inventario.
                    </p>
                  )}
                </div>

                <Link
                  href="/inventario"
                  className="w-full mt-3 py-1.5 px-3 border border-dashed border-rose-300 rounded-xl text-center text-xs font-bold text-rose-800 hover:bg-rose-100/50 flex items-center justify-center gap-1.5 transition-colors block"
                >
                  <span>Generar orden / Reabastecer</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}