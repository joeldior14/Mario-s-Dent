"use client";

import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  FileText,
  Building,
  Calendar,
  DollarSign,
  Package,
  ShieldCheck,
} from "lucide-react";
import { exportInventoryToCSV, HaciendaItem } from "@/utils/HaciendaExport";

interface BranchStock {
  branchId: "santa-ana" | "ahuachapan" | "sonsonate";   
  branchName: string;
  stock: number;
}

interface InventoryItemRaw {
  id: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  cost: number;
  price: number;
  branches: BranchStock[];
}

interface HaciendaReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryItemRaw[];
}

export default function HaciendaReportModal({
  isOpen,
  onClose,
  products,
}: HaciendaReportModalProps) {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [reportScope, setReportScope] = useState<
    "ALL" | "Santa Ana" | "Ahuachapán" | "Sonsonate"
  >("ALL");

  if (!isOpen) return null;

  // Procesar items según el alcance de sucursal
  const processedItems: HaciendaItem[] = products.map((p) => {
    let units = 0;
    if (reportScope === "ALL") {
      units = p.branches.reduce((acc, curr) => acc + curr.stock, 0);
    } else {
      units = p.branches.find((b) => b.branchName === reportScope)?.stock ?? 0;
    }

    return {
      sku: p.sku,
      name: p.name,
      brand: p.brand,
      description: p.description,
      units,
      cost: p.cost,
      price: p.price,
    };
  });

  const totalProductsCount = processedItems.length;
  const totalPhysicalUnits = processedItems.reduce(
    (acc, curr) => acc + curr.units,
    0
  );
  const totalInventoryValuation = processedItems.reduce(
    (acc, curr) => acc + curr.units * curr.cost,
    0
  );

  const handleExportCSV = () => {
    exportInventoryToCSV(processedItems, selectedYear, reportScope === "ALL" ? "Consolidado_General" : reportScope);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                Informe Fiscal de Inventario (Hacienda)
              </h3>
              <p className="text-[11px] text-slate-400">
                Declaración Anual de Existencias y Valuación al Costo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido / Filtros */}
        <div className="p-6 space-y-5">
          {/* Parámetros fiscales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Ejercicio Fiscal (Corte 31/Dic)</span>
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="2026">Ejercicio 2026 (En curso)</option>
                <option value="2025">Ejercicio 2025</option>
                <option value="2024">Ejercicio 2024</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-sky-600" />
                <span>Alcance / Establecimiento</span>
              </label>
              <select
                value={reportScope}
                onChange={(e) => setReportScope(e.target.value as any)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="ALL">Todas las sucursales (Consolidado)</option>
                <option value="Santa Ana">Casa Matriz - Santa Ana</option>
                <option value="Ahuachapán">Sucursal Ahuachapán</option>
                <option value="Sonsonate">Sucursal Sonsonate</option>
              </select>
            </div>
          </div>

          {/* Tarjetas de Resumen Valuado */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">
                Artículos
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {totalProductsCount} SKUs
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">
                Unidades Físicas
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {totalPhysicalUnits} piezas
              </span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="block text-[10px] text-emerald-700 font-bold uppercase">
                Valuación al Costo
              </span>
              <span className="text-sm font-bold text-emerald-800 font-mono">
                ${totalInventoryValuation.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Campos incluidos */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600">
            <span className="font-bold text-slate-700 text-[11px] block">
              Columnas auditables generadas:
            </span>
            <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-500">
              <li>• Código de Barra / SKU</li>
              <li>• Nombre y Descripción</li>
              <li>• Marca / Fabricante</li>
              <li>• Presentación (Unidad de Medida)</li>
              <li>• Stock Físico al corte</li>
              <li>• Costo Unitario de Compra</li>
              <li>• Precio de Venta al Público</li>
              <li>• Total Valuado al Costo ($)</li>
            </ul>
          </div>
        </div>

        {/* Pie con acciones */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Formato listo para anexos fiscales.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel / CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}