"use client";

import React, { useState } from "react";
import { DollarSign, ShieldAlert, Sparkles, X } from "lucide-react";

interface OpenShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, notes: string) => void;
  cashierName?: string;
}

const PRESET_AMOUNTS = [30, 50, 100];

export default function OpenShiftModal({
  isOpen,
  onClose,
  onConfirm,
  cashierName = "Maria G.",
}: OpenShiftModalProps) {
  const [amount, setAmount] = useState<string>("50.00");
  const [notes, setNotes] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed < 0) return;
    onConfirm(parsed, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Apertura de Turno</h3>
              <p className="text-xs text-slate-400">Cajero asignado: {cashierName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Fondo Inicial en Efectivo ($ USD)[cite: 1, 2]
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                autoFocus
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold font-mono text-slate-800 placeholder-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Botones rápidos de monto */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Sugeridos:</span>
            {PRESET_AMOUNTS.map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setAmount(val.toFixed(2))}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  amount === val.toFixed(2)
                    ? "bg-sky-50 border-sky-400 text-sky-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                ${val}
              </button>
            ))}
          </div>

          {/* Notas u observaciones */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Observaciones (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Billetes de $5 y monedas para cambio"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Aviso informativo */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Este monto servirá de base para el arqueo y cálculo de diferencias al realizar el Corte de Caja[cite: 1, 2].
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Abrir Turno e Ir al POS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}