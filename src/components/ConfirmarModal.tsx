"use client";

import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle2, HelpCircle, X } from "lucide-react";

export type DialogType = "confirm" | "success" | "warning" | "error";

interface ConfirmModalProps {
  isOpen: boolean;
  type?: DialogType;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmModal({
  isOpen,
  type = "confirm",
  title,
  description,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onCancel) onCancel();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isNoticeOnly = !onCancel;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      case "warning":
      case "error":
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <HelpCircle className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonClasses = () => {
    if (type === "warning" || type === "error") {
      return "bg-[#B91C1C] hover:bg-red-800 text-white";
    }
    return "bg-[#0284C7] hover:bg-sky-700 text-white";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel || onConfirm}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 p-6 flex flex-col items-center text-center space-y-4"
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {getIcon()}

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        <div className={`w-full pt-2 flex items-center gap-2.5 ${isNoticeOnly ? "justify-center" : "justify-between"}`}>
          {!isNoticeOnly && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer ${getConfirmButtonClasses()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}