"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Minus, PackageCheck, AlertCircle } from "lucide-react";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  sku: string;
  branchName: string;
  currentStock: number;
  onConfirm: (type: "add" | "remove", quantity: number, reason: string) => void;
}

export default function StockAdjustmentModal({
  isOpen,
  onClose,
  productName,
  sku,
  branchName,
  currentStock,
  onConfirm,
}: StockAdjustmentModalProps) {
  const [operation, setOperation] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [reason, setReason] = useState<string>("Reabastecimiento / Compra");

  // Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setOperation("add");
      setQuantity(1);
      setReason("Reabastecimiento / Compra");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const numQty = typeof quantity === "number" ? quantity : parseInt(quantity) || 0;
  const projectedStock =
    operation === "add"
      ? currentStock + numQty
      : Math.max(0, currentStock - numQty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numQty <= 0) {
      alert("Por favor ingresa una cantidad válida mayor a cero.");
      return;
    }
    if (operation === "remove" && numQty > currentStock) {
      alert("No puedes retirar más unidades de las que existen en stock actual.");
      return;
    }

    onConfirm(operation, numQty, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Ajuste Manual de Existencias
              </h3>
              <p className="text-[11px] text-slate-400">
                Sucursal: <strong className="text-slate-600">{branchName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ficha del Producto */}
        <div className="px-6 pt-4 pb-2">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 text-xs">{productName}</p>
              <p className="text-[10px] text-slate-400 font-mono">SKU: {sku}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Stock Actual
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {currentStock} unidades
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Selector de Tipo de Operación */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tipo de Movimiento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setOperation("add");
                  setReason("Reabastecimiento / Compra");
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  operation === "add"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Entrada (Agregar)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOperation("remove");
                  setReason("Merma / Deterioro");
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  operation === "remove"
                    ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Salida (Quitar)</span>
              </button>
            </div>
          </div>

          {/* Cantidad a Ajustar */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Cantidad de Unidades
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={operation === "remove" ? currentStock : undefined}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ej. 10"
                className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Previsualización del Stock Resultante */}
          <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-500">Nuevo stock resultante:</span>
            <span className="font-bold text-sky-900 font-mono text-sm">
              {projectedStock} unidades
            </span>
          </div>

          {/* Botonera */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-2xs transition-colors cursor-pointer ${
                operation === "add"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {operation === "add" ? "Confirmar Entrada" : "Confirmar Salida"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}