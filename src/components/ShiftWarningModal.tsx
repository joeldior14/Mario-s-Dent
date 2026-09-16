"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowRight, X } from "lucide-react";

interface ShiftWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShiftWarningModal({ isOpen, onClose }: ShiftWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-800">
            Turno de Caja Requerido
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No es posible agregar artículos ni cobrar sin abrir un turno previamente. Registra tu fondo inicial para comenzar.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Entendido
          </button>
          <Link
            href="/caja"
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ir a Caja</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}