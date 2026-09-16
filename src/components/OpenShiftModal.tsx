"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DollarSign, ShieldAlert, Sparkles, X } from "lucide-react";

interface OpenShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  cashierName?: string;
}

const PRESET_AMOUNTS = [30, 50, 100] as const;
const DEFAULT_AMOUNT = "50.00";

export default function OpenShiftModal({
  isOpen,
  onClose,
  onConfirm,
  cashierName = "Maria G.",
}: OpenShiftModalProps) {
  const [amount, setAmount] = useState<string>(DEFAULT_AMOUNT);

  // Bloqueo de scroll del body y captura de tecla Escape para accesibilidad
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

  // Manejo controlado del valor numérico (solo dígitos y un punto decimal)
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed < 0) return;
      onConfirm(Number(parsed.toFixed(2)));
    },
    [amount, onConfirm]
  );

  if (!isOpen) return null;

  const isValidAmount = !isNaN(parseFloat(amount)) && parseFloat(amount) >= 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="open-shift-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Cabecera */}
        <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 id="open-shift-title" className="text-base font-bold text-slate-800">
                Apertura de Turno
              </h3>
              <p className="text-xs text-slate-400">Cajero asignado: {cashierName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="initial-cash-input"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Fondo Inicial en Efectivo ($ USD)[cite: 1, 2]
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">
                $
              </span>
              <input
                id="initial-cash-input"
                type="text"
                inputMode="decimal"
                autoFocus
                required
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold font-mono text-slate-800 placeholder-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Sugerencias Rápidas */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Sugeridos:</span>
            {PRESET_AMOUNTS.map((val) => {
              const formattedVal = val.toFixed(2);
              const isSelected = amount === formattedVal;
              return (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(formattedVal)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    isSelected
                      ? "bg-sky-50 border-sky-400 text-sky-700 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  ${val}
                </button>
              );
            })}
          </div>

          {/* Advertencia Contextual */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Este monto servirá de base para el arqueo y cálculo de diferencias al realizar el Corte de Caja[cite: 1, 2].
            </span>
          </div>

          {/* Acciones */}
          <footer className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValidAmount}
              className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${
                isValidAmount
                  ? "bg-sky-600 hover:bg-sky-700 cursor-pointer active:scale-[0.98]"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Abrir Turno e Ir al POS</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}