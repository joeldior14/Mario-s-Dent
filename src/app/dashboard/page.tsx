"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { getPendingDiscrepancyAlert, PendingDiscrepancyAlert } from "@/app/services/cashService";
import { useShift } from "@/app/context/ShiftContext";
import {
  Calendar as CalendarIcon,
  RotateCw,
  Search,
  TrendingUp,
  AlertTriangle,
  PackageX,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Store,
  CreditCard,
  Banknote,
  Building2,
  ArrowUpRight,
  Layers,
  X,
  Check,
  Building,
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

const BRANCH_OPTIONS = [
  { key: "all", label: "Todas las Sucursales", desc: "Consolidado de Red" },
  { key: "santa-ana", label: "Santa Ana", desc: "Sede Matriz" },
  { key: "ahuachapan", label: "Ahuachapán", desc: "Sucursal Occidente" },
  { key: "sonsonate", label: "Sonsonate", desc: "Sucursal Occidente" },
];

export default function DashboardPage() {
  const { auditStatus } = useShift();
  const [discrepancyAlert, setDiscrepancyAlert] = useState<PendingDiscrepancyAlert | null>(null);
  const [isLoadingAlert, setIsLoadingAlert] = useState(true);

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

  // Estados y Refs para los dropdowns personalizados (Sede y Fecha)
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Lógica del Calendario Customizado
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

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadAlert() {
      try {
        const alertData = await getPendingDiscrepancyAlert();
        setDiscrepancyAlert(alertData);
      } catch (err) {
        console.error("Error al consultar alertas de caja:", err);
      } finally {
        setIsLoadingAlert(false);
      }
    }

    loadAlert();
  }, []);

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

  // Búsqueda en Supabase con Debounce (300 ms)
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
              <h1 className="text-2xl font-black text-sky-600 tracking-tight">
                Panel Ejecutivo
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Red Operativa Activa
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Supervisión de ingresos, auditoría de ventas y salud de existencias
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* SELECTOR CUSTOMIZADO DE SUCURSAL */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsBranchDropdownOpen((prev) => !prev);
                  setIsDateOpen(false);
                }}
                className={`h-10 px-3.5 bg-white border rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs select-none ${
                  isBranchDropdownOpen
                    ? "border-sky-500 ring-2 ring-sky-500/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">
                    Sede
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                    {BRANCH_OPTIONS.find((b) => b.key === selectedBranchKey)?.label || activeMetrics.name}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 ml-1.5 transition-transform duration-200 ${
                    isBranchDropdownOpen ? "rotate-180 text-sky-600" : ""
                  }`}
                />
              </button>

              {isBranchDropdownOpen && (
                <div className="absolute right-0 sm:left-0 mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Seleccionar Sede
                  </div>
                  <div className="space-y-0.5">
                    {BRANCH_OPTIONS.map((b) => {
                      const isSelected = selectedBranchKey === b.key;
                      return (
                        <button
                          key={b.key}
                          type="button"
                          onClick={() => {
                            setSelectedBranchKey(b.key);
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-sky-50 text-sky-900 font-bold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Building
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isSelected ? "text-sky-600" : "text-slate-400"
                              }`}
                            />
                            <div>
                              <p className="leading-tight">{b.label}</p>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {b.desc}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SELECTOR CUSTOMIZADO DE FECHA (CALENDARIO FLOTANTE IGUAL AL DE CAJA) */}
            <div className="relative" ref={dateRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDateOpen((prev) => !prev);
                  setIsBranchDropdownOpen(false);
                }}
                className={`h-10 px-3.5 bg-white border rounded-xl flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs select-none ${
                  isDateOpen
                    ? "border-sky-500 ring-2 ring-sky-500/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-3.5 h-3.5 text-sky-600" />
                </div>

                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">
                    Fecha
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono tracking-tight">
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
                  {/* Encabezado del mes */}
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

                  {/* Días de la semana */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {dayNames.map((d) => (
                      <span key={d} className="text-[10px] font-black text-slate-400 py-1">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Cuadrícula de días */}
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

                  {/* Acciones al pie */}
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

            {/* Botón Sincronizar */}
            <button
              onClick={handleRefresh}
              title="Refrescar métricas"
              className="w-10 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-sky-500 hover:text-slate-700 rounded-xl flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-600" : ""}`} />
            </button>
          </div>
        </header>

        {/* =========================================================================
            2. ALERTA DE DESCUADRE DINÁMICA
           ========================================================================= */}
        {!isLoadingAlert && discrepancyAlert && (
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-rose-950">
                    Discrepancia contable detectada en arqueo de caja
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300/70 tracking-tight">
                    {discrepancyAlert.branchName}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700/90 mt-0.5">
                  Existe un turno cerrado con descuadre en gaveta física que requiere resolución administrativa.
                </p>
              </div>
            </div>

            <Link
              href={`/caja?branch=${encodeURIComponent(discrepancyAlert.branchName)}&date=${discrepancyAlert.closedAt.slice(0, 10)}`}
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

          {/* Menú Desplegable Flotante de Búsqueda */}
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
            <div className="bg-white border border-sky-400 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-sky-50/70 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">
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
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    Tickets
                  </span>
                  <span className="text-3xl font-black text-sky-700 font-mono">
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
            <div className="bg-white border border-sky-400 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-500" />
                  <h3 className="text-xs font-bold text-sky-600 uppercase tracking-wider">
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
            <div className="bg-white border border-sky-400 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-4">
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