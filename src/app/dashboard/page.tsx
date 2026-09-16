"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
  Receipt,
  Printer,
  X,
  Eye,
  AlertCircle,
  ExternalLink,
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
  cashDiscrepancy: {
    hasIssue: boolean;
    amount: number;
    type: "shortage" | "surplus" | "balanced";
  };
}

interface StockAlertItem {
  id: string;
  name: string;
  brand: string;
  branch: "Santa Ana" | "Ahuachapán" | "Sonsonate";
  stock: number;
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
    cashDiscrepancy: { hasIssue: false, amount: 0, type: "balanced" },
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
    cashDiscrepancy: { hasIssue: false, amount: 0, type: "balanced" },
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
    cashDiscrepancy: { hasIssue: true, amount: -20.0, type: "shortage" },
  },
};

// Catálogo de alertas de inventario (Stock bajo: 1 a 5 uds | Agotados: 0 uds)
const MOCK_STOCK_ALERTS: StockAlertItem[] = [
  // Productos Bajos en Stock (Ámbar)
  { id: "sb1", name: "Articaina 4% 1:100k", brand: "Septodont", branch: "Santa Ana", stock: 3 },
  { id: "sb2", name: "Tetric N-Ceram Bulk Fill IVA", brand: "Ivoclar", branch: "Ahuachapán", stock: 2 },
  { id: "sb3", name: "Fórceps 150 Universal", brand: "Hu-Friedy", branch: "Sonsonate", stock: 4 },
  { id: "sb4", name: "Brackets Mini Diamond Roth", brand: "Ormco", branch: "Ahuachapán", stock: 4 },

  // Productos Agotados (Rojo)
  { id: "ag1", name: "Resina Universal A2", brand: "3M Filtek Z350", branch: "Santa Ana", stock: 0 },
  { id: "ag2", name: "Articaina 4% 1:100k", brand: "Septodont", branch: "Ahuachapán", stock: 0 },
];

const MOCK_TICKETS = [
  {
    id: "t1",
    ticketNumber: "T-SA-1045",
    branch: "Santa Ana",
    cashier: "Maria G.",
    time: "15:40",
    total: 1250.0,
    method: "Efectivo",
    items: [
      { name: "Articaina 4% 1:100k", qty: 1, price: 920.0 },
      { name: "Guantes Nitrilo Med", qty: 2, price: 165.0 },
    ],
  },
  {
    id: "t2",
    ticketNumber: "T-SO-0892",
    branch: "Sonsonate",
    cashier: "Manuel R.",
    time: "14:15",
    total: 850.0,
    method: "Tarjeta",
    items: [{ name: "Resina Universal A2", qty: 1, price: 850.0 }],
  },
  {
    id: "t3",
    ticketNumber: "T-AH-0311",
    branch: "Ahuachapán",
    cashier: "Carlos T.",
    time: "12:20",
    total: 1450.0,
    method: "Transferencia",
    items: [{ name: "Opalescence Go 15%", qty: 1, price: 1450.0 }],
  },
];

const SEARCH_CATALOG = [
  { sku: "RS-305A", name: "Resina Universal A2", brand: "3M Filtek", price: 850.0, stock: 42 },
  { sku: "AN-1024", name: "Articaina 4% 1:100k", brand: "Septodont", price: 920.0, stock: 3 },
  { sku: "DP-8820", name: "Guantes Nitrilo Med", brand: "Cranberry", price: 210.0, stock: 120 },
  { sku: "OR-9002", name: "Opalescence Go 15%", brand: "Ultradent", price: 1450.0, stock: 15 },
];

export default function DashboardPage() {
  const { auditStatus } = useShift(); // Consume el estado global
  const [selectedBranchKey, setSelectedBranchKey] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-24");
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [activeTicket, setActiveTicket] = useState<(typeof MOCK_TICKETS)[0] | null>(null);

  // Métricas financieras calculadas según la sucursal seleccionada
  const activeMetrics = useMemo(() => {
    if (selectedBranchKey !== "ALL") {
      return BRANCHES_DATA[selectedBranchKey];
    }

    const branches = Object.values(BRANCHES_DATA);
    const totalIncome = branches.reduce((acc, b) => acc + b.incomeToday, 0);
    const totalTx = branches.reduce((acc, b) => acc + b.transactionsCount, 0);
    const totalProfit = branches.reduce((acc, b) => acc + b.estimatedProfit, 0);
    const anyDiscrepancy = branches.find((b) => b.cashDiscrepancy.hasIssue);

    return {
      id: "all",
      name: "Todas las Sucursales (Consolidado de Red)",
      isOpen: true,
      incomeToday: totalIncome,
      trend: "+8.5%",
      transactionsCount: totalTx,
      estimatedProfit: totalProfit,
      paymentMethods: { card: 60, transfer: 25, cash: 15 },
      cashDiscrepancy: anyDiscrepancy
        ? anyDiscrepancy.cashDiscrepancy
        : { hasIssue: false, amount: 0, type: "balanced" as const },
    };
  }, [selectedBranchKey]);

  // Filtrado de alertas según la tienda elegida
  const branchNameFilter = useMemo(() => {
    if (selectedBranchKey === "santa-ana") return "Santa Ana";
    if (selectedBranchKey === "ahuachapan") return "Ahuachapán";
    if (selectedBranchKey === "sonsonate") return "Sonsonate";
    return "ALL";
  }, [selectedBranchKey]);

  const lowStockList = useMemo(() => {
    return MOCK_STOCK_ALERTS.filter(
      (item) =>
        item.stock > 0 &&
        item.stock <= 5 &&
        (branchNameFilter === "ALL" || item.branch === branchNameFilter)
    );
  }, [branchNameFilter]);

  const outOfStockList = useMemo(() => {
    return MOCK_STOCK_ALERTS.filter(
      (item) =>
        item.stock === 0 &&
        (branchNameFilter === "ALL" || item.branch === branchNameFilter)
    );
  }, [branchNameFilter]);

  // Búsqueda rápida
  const quickSearchResults = useMemo(() => {
    if (!quickSearch.trim()) return [];
    return SEARCH_CATALOG.filter(
      (it) =>
        it.name.toLowerCase().includes(quickSearch.toLowerCase()) ||
        it.sku.toLowerCase().includes(quickSearch.toLowerCase()) ||
        it.brand.toLowerCase().includes(quickSearch.toLowerCase())
    );
  }, [quickSearch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          
          {/* ENCABEZADO: Selector de Sucursal y Filtro de Fecha */}
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-sky-600" />
                <div className="relative inline-block">
                  <select
                    value={selectedBranchKey}
                    onChange={(e) => setSelectedBranchKey(e.target.value)}
                    className="appearance-none text-xl font-bold text-[#0284C7] bg-transparent pr-8 py-0.5 focus:outline-none cursor-pointer tracking-tight"
                  >
                    <option value="ALL">Todas las Sucursales (Consolidado)</option>
                    <option value="santa-ana">Santa Ana (Matriz)</option>
                    <option value="ahuachapan">Sucursal Ahuachapán</option>
                    <option value="sonsonate">Sucursal Sonsonate</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-sky-600 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  • Abierto
                </span>
              </div>

              {/* Filtro de Fecha */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
                  />
                </div>
                <span className="text-[11px] text-slate-400">
                  Última sincronización: 10:42 AM
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert("Sincronizando métricas en tiempo real...")}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors"
                title="Refrescar métricas"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BUSCADOR RÁPIDO DE INVENTARIO */}
          <div className="relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Consultar Stock/Precio rápido por nombre o SKU..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
              />
              {quickSearch && (
                <button
                  type="button"
                  onClick={() => setQuickSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Desplegable de Resultados Rápidos */}
            {quickSearchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 z-20 bg-white border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100 overflow-hidden">
                {quickSearchResults.map((prod) => (
                  <div
                    key={prod.sku}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 mr-2">{prod.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{prod.sku}]</span>
                      <p className="text-[11px] text-slate-500">{prod.brand}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-800 block">
                        ${prod.price.toFixed(2)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          prod.stock <= 5
                            ? "bg-rose-50 text-rose-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {prod.stock} en stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ALERTA DE DESCUADRE: Desaparece automáticamente cuando auditStatus es "reviewed" */}
        {auditStatus === "pending_review" && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-900">
                  Alerta de Descuadre en Corte Z: Sucursal Santa Ana
                </p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Faltante registrado de -$50.00 en el turno de Maria G. Pendiente de resolución contable.
                </p>
              </div>
            </div>

            <Link
              href="/caja"
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs shrink-0"
            >
              Auditar caja
            </Link>
          </div>
        )}

          {/* TARJETA HERO: INGRESOS Y CONTADOR DE TRANSACCIONES */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Ingresos de la Jornada
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#0369A1]">
                    ${activeMetrics.incomeToday.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="flex items-center text-xs font-bold text-emerald-600 gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {activeMetrics.trend}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Margen bruto estimado:{" "}
                  <strong className="text-slate-600">
                    ${activeMetrics.estimatedProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Operaciones Registradas
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {activeMetrics.transactionsCount}
                </span>
              </div>
            </div>

            {/* ENLACE INTERACTIVO: [Ver detalle de tickets] */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">
                {selectedBranchKey === "ALL" ? "Consolidado de 3 sucursales" : activeMetrics.name}
              </span>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(true)}
                className="text-sky-600 hover:text-sky-700 text-xs font-bold px-2.5 py-1 border border-dashed border-sky-300 rounded-lg hover:bg-sky-50 transition-colors"
              >
                [Ver detalle de tickets]
              </button>
            </div>
          </div>

          {/* SECCIÓN MÉTODOS DE PAGO: GRÁFICO CIRCULAR */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">
              Distribución por Métodos de Pago
            </h3>

            <div className="flex items-center justify-between gap-6 flex-wrap">
              {/* Gráfico circular SVG Donut */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
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
                    strokeDasharray={`${activeMetrics.paymentMethods.card}, 100`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${activeMetrics.paymentMethods.transfer}, 100`}
                    strokeDashoffset={`-${activeMetrics.paymentMethods.card}`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-slate-400"
                    strokeDasharray={`${activeMetrics.paymentMethods.cash}, 100`}
                    strokeDashoffset={`-${activeMetrics.paymentMethods.card + activeMetrics.paymentMethods.transfer}`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-slate-800">100%</span>
                  <span className="text-[9px] text-slate-400">Total</span>
                </div>
              </div>

              {/* Leyendas y porcentajes */}
              <div className="flex-1 min-w-[200px] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                    <span className="text-slate-600 font-medium">Tarjeta</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {activeMetrics.paymentMethods.card}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-slate-600 font-medium">Transferencia</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {activeMetrics.paymentMethods.transfer}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                    <span className="text-slate-600 font-medium">Efectivo</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {activeMetrics.paymentMethods.cash}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ALERTAS OPERATIVAS: STOCK BAJO (ÁMBAR) Y AGOTADOS (ROJO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Alerta Ámbar: Stock Bajo (1 a 5 piezas) */}
            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Productos Bajos en Stock</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                    {lowStockList.length} Items
                  </span>
                </div>

                {/* Listado con Nombre de Producto y Sucursal */}
                <div className="divide-y divide-amber-200/50 bg-white/80 rounded-lg border border-amber-200/60 overflow-hidden">
                  {lowStockList.length > 0 ? (
                    lowStockList.map((item) => (
                      <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{item.brand}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded mb-0.5">
                            {item.branch}
                          </span>
                          <span className="block text-[11px] font-bold text-amber-700">
                            {item.stock} disponibles
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-amber-800/70">
                      No hay productos con stock bajo en esta sucursal.
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/inventario"
                className="w-full mt-3 py-1.5 px-3 bg-white border border-dashed border-amber-300 rounded-lg text-xs font-semibold text-amber-800 hover:bg-amber-100/50 flex items-center justify-between transition-colors"
              >
                <span>[Revisar inventario para reordenar]</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-600 -rotate-90" />
              </Link>
            </div>

            {/* Alerta Roja: Productos Agotados (Stock 0) */}
            <div className="border border-rose-200 bg-rose-50/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <PackageX className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Productos Agotados (Stock 0)</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md">
                    {outOfStockList.length} Items
                  </span>
                </div>

                {/* Listado con Nombre de Producto y Sucursal */}
                <div className="divide-y divide-rose-200/50 bg-white/80 rounded-lg border border-rose-200/60 overflow-hidden">
                  {outOfStockList.length > 0 ? (
                    outOfStockList.map((item) => (
                      <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{item.brand}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded mb-0.5">
                            {item.branch}
                          </span>
                          <span className="block text-[11px] font-black text-rose-600">
                            0 en stock
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-rose-800/70">
                      No hay productos agotados en esta sucursal.
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/inventario"
                className="w-full mt-3 py-1.5 px-3 bg-white border border-dashed border-rose-300 rounded-lg text-xs font-semibold text-rose-800 hover:bg-rose-100/50 flex items-center justify-between transition-colors"
              >
                <span>[Generar orden / Reabastecer]</span>
                <ChevronDown className="w-3.5 h-3.5 text-rose-600 -rotate-90" />
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* MODAL DE AUDITORÍA Y TICKETS */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Auditoría de Tickets y Ventas
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Comprobantes emitidos en {activeMetrics.name} ({selectedDate})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-12 overflow-hidden">
              <div className="col-span-7 border-r border-slate-100 overflow-y-auto divide-y divide-slate-100">
                {MOCK_TICKETS.map((sale) => (
                  <div
                    key={sale.id}
                    onClick={() => setActiveTicket(sale)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      activeTicket?.id === sale.id
                        ? "bg-sky-50/60 border-l-4 border-l-sky-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-xs text-slate-800">
                          {sale.ticketNumber}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600">
                          {sale.branch}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {sale.time} • Cajero: <strong className="text-slate-600">{sale.cashier}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-800 block">
                        ${sale.total.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {sale.method}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-span-5 p-4 bg-slate-50/40 flex flex-col justify-between overflow-y-auto">
                {activeTicket ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs font-mono text-[11px] text-slate-600 space-y-2">
                      <div className="text-center pb-2 border-b border-dashed border-slate-200">
                        <p className="font-bold text-slate-800">MARIOS DENT</p>
                        <p className="text-[10px] text-slate-400">Sucursal {activeTicket.branch}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Ticket: {activeTicket.ticketNumber}</p>
                      </div>

                      <div className="space-y-1 py-1 border-b border-dashed border-slate-200">
                        {activeTicket.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[10px]">
                            <span>{it.qty}x {it.name}</span>
                            <span className="font-bold">${(it.qty * it.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between text-xs font-bold text-slate-800 pt-1">
                        <span>TOTAL</span>
                        <span>${activeTicket.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Reimprimiendo ticket ${activeTicket.ticketNumber}...`)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-sky-600" />
                      <span>Reimprimir Comprobante</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                    <Eye className="w-8 h-8 stroke-[1.5] mb-2 text-slate-300" />
                    <p className="text-xs">Selecciona un ticket para previsualizar su comprobante digital.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}