"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  History,
  ShoppingCart,
  ArrowRightLeft,
  ArrowDownLeft,
  ShieldAlert,
  SlidersHorizontal,
  Globe2,
  Store,
} from "lucide-react";

export interface StockMovement {
  id: string;
  date: string;
  type: "VENTA_POS" | "TRASLADO" | "INGRESO" | "AJUSTE";
  branch: string;
  user: string;
  quantity: number;
  stockAfter: number;
  reference: string;
}

interface ProductHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch?: string; // Puede ser "Santa Ana", "Ahuachapán", "Sonsonate" o "ALL"
  product: {
    sku: string;
    name: string;
    brand: string;
  } | null;
}

const MOCK_HISTORY: StockMovement[] = [
  {
    id: "m1",
    date: "2026-09-08 10:14 AM",
    type: "VENTA_POS",
    branch: "Santa Ana",
    user: "Maria G.",
    quantity: -2,
    stockAfter: 0,
    reference: "Ticket #T-SA-1045",
  },
  {
    id: "m2",
    date: "2026-09-06 03:40 PM",
    type: "VENTA_POS",
    branch: "Santa Ana",
    user: "Maria G.",
    quantity: -5,
    stockAfter: 2,
    reference: "Ticket #T-SA-1020",
  },
  {
    id: "m3",
    date: "2026-09-05 02:15 PM",
    type: "VENTA_POS",
    branch: "Sonsonate",
    user: "Manuel R.",
    quantity: -3,
    stockAfter: 25,
    reference: "Ticket #T-SO-0891",
  },
  {
    id: "m4",
    date: "2026-09-04 11:20 AM",
    type: "TRASLADO",
    branch: "Sonsonate",
    user: "Mario (Admin)",
    quantity: +14,
    stockAfter: 28,
    reference: "Traspaso desde Santa Ana",
  },
  {
    id: "m5",
    date: "2026-09-04 11:20 AM",
    type: "TRASLADO",
    branch: "Santa Ana",
    user: "Mario (Admin)",
    quantity: -14,
    stockAfter: 7,
    reference: "Traspaso hacia Sonsonate",
  },
  {
    id: "m6",
    date: "2026-09-03 04:30 PM",
    type: "VENTA_POS",
    branch: "Ahuachapán",
    user: "Carlos M.",
    quantity: -2,
    stockAfter: 14,
    reference: "Ticket #T-AH-0412",
  },
  {
    id: "m7",
    date: "2026-09-01 09:00 AM",
    type: "INGRESO",
    branch: "Santa Ana",
    user: "Mario (Admin)",
    quantity: +50,
    stockAfter: 50,
    reference: "Lote de Compra Factura #F-440",
  },
];

export default function ProductHistoryModal({
  isOpen,
  onClose,
  currentBranch = "Santa Ana",
  product,
}: ProductHistoryModalProps) {
  const isGlobalView = currentBranch === "ALL";

  // Si la tabla ya estaba en ALL, inicia marcado; si estaba en una tienda, inicia desmarcado
  const [showAllBranches, setShowAllBranches] = useState<boolean>(isGlobalView);

  // Sincronizar estado cuando cambia el prop o se abre el modal
  useEffect(() => {
    if (isOpen) {
      setShowAllBranches(currentBranch === "ALL");
    }
  }, [isOpen, currentBranch]);

  const filteredHistory = useMemo(() => {
    if (showAllBranches || isGlobalView) return MOCK_HISTORY;
    return MOCK_HISTORY.filter((item) =>
      item.branch.toLowerCase().includes(currentBranch.toLowerCase())
    );
  }, [showAllBranches, isGlobalView, currentBranch]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* CABECERA */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Kardex y Trazabilidad de Stock
                </h3>
                <span className="font-mono text-[10px] bg-slate-200/80 font-bold text-slate-700 px-1.5 py-0.5 rounded">
                  {product.sku}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {product.name} •{" "}
                <span className="text-slate-600 font-medium">
                  {product.brand}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BARRA DE FILTRO CON CONTEXTO INTELIGENTE */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Store className="w-3.5 h-3.5 text-sky-600" />
            <span>
              Mostrando movimientos de:{" "}
              <strong className="text-slate-800">
                {isGlobalView || showAllBranches
                  ? "Toda la Red (Consolidado)"
                  : currentBranch}
              </strong>
            </span>
          </div>

          {/* Si ya venía de vista global "ALL", se muestra como etiqueta fija; si venía de una sucursal, se habilita el checkbox */}
          {isGlobalView ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <Globe2 className="w-3.5 h-3.5" />
              Vista Global Automática
            </span>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 hover:border-sky-400 px-3 py-1.5 rounded-xl shadow-2xs transition-all">
              <input
                type="checkbox"
                checked={showAllBranches}
                onChange={(e) => setShowAllBranches(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-sky-600" />
                Ver todas las sucursales
              </span>
            </label>
          )}
        </div>

        {/* TABLA DE MOVIMIENTOS */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          {filteredHistory.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2 bg-slate-50/30">
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Operación</th>
                  <th className="py-2.5 px-3">Sede / Responsable</th>
                  <th className="py-2.5 px-3 text-right">Cantidad</th>
                  <th className="py-2.5 px-3 text-right">Saldo</th>
                  <th className="py-2.5 px-3">Comprobante / Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredHistory.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      {row.date}
                    </td>
                    <td className="py-2.5 px-3">
                      {row.type === "VENTA_POS" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                          <ShoppingCart className="w-3 h-3" /> Venta POS
                        </span>
                      )}
                      {row.type === "TRASLADO" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md text-[11px]">
                          <ArrowRightLeft className="w-3 h-3" /> Traslado
                        </span>
                      )}
                      {row.type === "INGRESO" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md text-[11px]">
                          <ArrowDownLeft className="w-3 h-3" /> Ingreso
                        </span>
                      )}
                      {row.type === "AJUSTE" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                          <SlidersHorizontal className="w-3 h-3" /> Ajuste
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-800 text-[11px]">
                        {row.branch}
                      </p>
                      <p className="text-[10px] text-slate-400">{row.user}</p>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <span
                        className={
                          row.quantity < 0
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }
                      >
                        {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                      {row.stockAfter}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 font-mono">
                      {row.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hay movimientos registrados para este producto en {currentBranch}.
            </div>
          )}
        </div>

        {/* PIE DE AUDITORÍA */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sky-600" />
            <span className="text-[11px]">
              Registro de auditoría contable inalterable.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}