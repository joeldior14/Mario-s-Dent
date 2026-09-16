"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  FileSpreadsheet,
  DollarSign,
  AlertCircle,
  Tag,
  FileText,
} from "lucide-react";

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  concept: string;
  time: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: ExpenseRecord) => void;
  currentAvailableCash?: number;
}

const EXPENSE_CATEGORIES = [
  "Insumos de Limpieza / Aseo",
  "Garrafones de Agua / Bebidas",
  "Mensajería / Fletes Locales",
  "Papelería / Rollos de Ticket",
  "Mantenimiento Menor de Local",
  "Otros Gastos Operativos",
] as const;

export default function ExpenseModal({
  isOpen,
  onClose,
  onSaveExpense,
  currentAvailableCash = 0.0,
}: ExpenseModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [concept, setConcept] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Manejo de accesibilidad (Escape) y bloqueo de scroll en el fondo
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Validación de entrada monetaria con regex (máximo 2 decimales)
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
      setError(null);
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const numAmount = parseFloat(amount);

      if (isNaN(numAmount) || numAmount <= 0) {
        setError("Por favor ingresa un monto válido mayor a $0.00.");
        return;
      }

      if (numAmount > currentAvailableCash) {
        setError(
          `Fondos insuficientes. El monto ($${numAmount.toFixed(
            2
          )}) supera el efectivo físico disponible en la gaveta ($${currentAvailableCash.toFixed(
            2
          )}).`
        );
        return;
      }

      const trimmedConcept = concept.trim();
      if (!trimmedConcept) {
        setError("Ingresa una descripción clara del gasto para fines de auditoría.");
        return;
      }

      const now = new Date();
      const formattedTime = now.toLocaleTimeString("es-SV", {
        timeZone: "America/El_Salvador",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const newExpense: ExpenseRecord = {
        id: crypto.randomUUID(),
        amount: Number(numAmount.toFixed(2)),
        category,
        concept: trimmedConcept,
        time: formattedTime,
      };

      onSaveExpense(newExpense);
      setAmount("");
      setConcept("");
      setCategory(EXPENSE_CATEGORIES[0]);
      setError(null);
      onClose();
    },
    [amount, category, concept, currentAvailableCash, onClose, onSaveExpense]
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Cabecera */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 id="expense-modal-title" className="text-sm font-bold text-slate-800">
                Registrar Gasto Menor
              </h3>
              <p className="text-[11px] text-slate-400">
                Salida justificada de efectivo del cajón de mostrador[cite: 1]
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Saldo disponible */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Efectivo disponible en gaveta:</span>
            <span className="font-mono font-bold text-slate-800 text-sm">
              ${currentAvailableCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Monto a Egresar */}
          <div>
            <label
              htmlFor="expense-amount-input"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Monto a Egresar ($ USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                $
              </span>
              <input
                id="expense-amount-input"
                type="text"
                inputMode="decimal"
                autoFocus
                required
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="expense-category-select"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              <span>Categoría del Gasto *</span>
            </label>
            <select
              id="expense-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Concepto / Justificación */}
          <div>
            <label
              htmlFor="expense-concept-input"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Concepto / Justificación *</span>
            </label>
            <input
              id="expense-concept-input"
              type="text"
              required
              value={concept}
              onChange={(e) => {
                setConcept(e.target.value);
                setError(null);
              }}
              placeholder="Ej. Compra de 2 garrafones de agua Cristal"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Advertencia contable */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <DollarSign className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              Esta salida restará directamente el saldo de <strong>Efectivo Esperado</strong> en la caja y quedará registrada en el <strong>Corte Z</strong>[cite: 1].
            </span>
          </div>

          {/* Botones de acción */}
          <footer className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Confirmar Salida
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}