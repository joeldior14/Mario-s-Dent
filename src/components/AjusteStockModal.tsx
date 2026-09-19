"use client";

import React, { useState, useId } from "react";
import { X, Plus, Minus, PackageCheck, AlertCircle, Loader2 } from "lucide-react";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  sku: string;
  branchName: string;
  currentStock: number;
  onConfirm: (
    type: "add" | "remove",
    quantity: number,
    reason: string
  ) => Promise<void> | void;
}

const REASONS = {
  add: [
    "Reabastecimiento / Compra",
    "Devolución de Cliente",
    "Ajuste por Inventario Físico (+)",
  ],
  remove: [
    "Merma / Deterioro",
    "Producto Vencido",
    "Ajuste por Inventario Físico (-)",
    "Uso Interno / Muestra",
  ],
} as const;

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
  const [reason, setReason] = useState<string>(REASONS.add[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formId = useId();

  if (!isOpen) return null;

  const numQty = typeof quantity === "number" ? quantity : parseInt(quantity, 10) || 0;
  const projectedStock =
    operation === "add"
      ? currentStock + numQty
      : Math.max(0, currentStock - numQty);

  const isExcessRemoval = operation === "remove" && numQty > currentStock;
  const isInvalidQty = numQty <= 0;

  const handleClose = () => {
    if (isSubmitting) return;
    setOperation("add");
    setQuantity(1);
    setReason(REASONS.add[0]);
    setErrorMessage(null);
    onClose();
  };

  const handleOperationChange = (type: "add" | "remove") => {
    setOperation(type);
    setReason(REASONS[type][0]);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isInvalidQty) {
      setErrorMessage("Ingresa una cantidad válida mayor a cero.");
      return;
    }

    if (isExcessRemoval) {
      setErrorMessage(
        `No puedes retirar más de ${currentStock} unidades disponibles en stock.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onConfirm(operation, numQty, reason);
      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el ajuste de stock";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 id={`${formId}-title`} className="text-sm font-bold text-slate-800">
                Ajuste Manual de Existencias
              </h3>
              <p className="text-[11px] text-slate-400">
                Sucursal: <strong className="text-slate-600">{branchName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 cursor-pointer"
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
          {/* Selector de Tipo de Movimiento */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tipo de Movimiento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleOperationChange("add")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
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
                disabled={isSubmitting}
                onClick={() => handleOperationChange("remove")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
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

          {/* Selector de Motivo */}
          <div>
            <label
              htmlFor={`${formId}-reason`}
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Motivo del Ajuste
            </label>
            <select
              id={`${formId}-reason`}
              value={reason}
              disabled={isSubmitting}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500 focus:bg-white disabled:opacity-50"
            >
              {REASONS[operation].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad a Ajustar */}
          <div>
            <label
              htmlFor={`${formId}-qty`}
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Cantidad de Unidades
            </label>
            <input
              id={`${formId}-qty`}
              type="number"
              min="1"
              max={operation === "remove" ? currentStock : undefined}
              value={quantity}
              disabled={isSubmitting}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Ej. 10"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white disabled:opacity-50"
              required
            />
          </div>

          {/* Mensaje de Error Reactivo */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

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
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isExcessRemoval || isInvalidQty || isSubmitting}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                operation === "add"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {operation === "add" ? "Confirmar Entrada" : "Confirmar Salida"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}