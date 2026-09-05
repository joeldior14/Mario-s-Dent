"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import OpenShiftModal from "@/components/OpenShiftModal";
import { useShift } from "@/app/context/ShiftContext";
import {
  Banknote,
  CreditCard,
  Building2,
  Lock,
  Receipt,
  FileSpreadsheet,
  PlusCircle,
} from "lucide-react";

export default function CajaPage() {
  const { isShiftOpen, cashierName, initialCash, openShift, closeShift } = useShift();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Valores simulados según el estado del turno
  const initialFund = isShiftOpen ? (initialCash || 5000.0) : 0.0;
  const totalSales = isShiftOpen ? 0.0 : 0.0;
  const expenses = isShiftOpen ? 0.0 : 0.0;
  const totalExpected = isShiftOpen ? initialFund + totalSales : 0.0;

  // Desglose de ventas por método de pago
  const cashSales = isShiftOpen ? 0.0 : 0.0;
  const cardSales = isShiftOpen ? 0.0 : 0.0;
  const transferSales = isShiftOpen ? 0.0 : 0.0;

  // Efectivo esperado en el cajón físico: (Fondo Inicial + Ventas Efectivo - Gastos)
  const expectedCash = isShiftOpen ? initialFund + cashSales - expenses : 0.0;

  // Estado para el conteo físico que ingresa el cajero
  const [countedCash, setCountedCash] = useState<number>(17450.0);

  // Cálculo automático de diferencia
  const currentCounted = isShiftOpen ? countedCash : 0.0;
  const difference = currentCounted - expectedCash;
  const isSurplus = difference >= 0;

  const handleOpenShiftConfirm = (amount: number, notes: string) => {
    openShift(amount, cashierName);
    setCountedCash(amount);
    setIsModalOpen(false);
  };

  const handleCloseShift = () => {
    const confirmClose = window.confirm(
      "¿Estás seguro de que deseas cerrar el turno diario (Corte Z)? Esta acción registrará el balance final."
    );
    if (confirmClose) {
      closeShift();
      alert("Turno cerrado correctamente. Generando comprobante de balance...");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      {/* 1. Barra de navegación común */}
      <Navbar />

      {/* 2. Contenido principal */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ENCABEZADO DE LA VISTA */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Control de caja
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Cash Drawer & Daily Close (Corte X / Z)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 font-medium text-right">
              <div>
                Turno:{" "}
                <strong className={isShiftOpen ? "text-emerald-600" : "text-slate-700"}>
                  {isShiftOpen ? "Mañana (En Curso)" : "Cerrado"}
                </strong>
                <span className="mx-2 text-slate-300">|</span>
                Operador: <strong className="text-slate-700">{cashierName}</strong>
              </div>
            </div>

            {/* BOTÓN CONDICIONAL DE ACCIÓN DE CAJA */}
            {!isShiftOpen && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Iniciar Turno</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 CARDS SUPERIORES DE TOTALES */}
        <div className="grid grid-cols-4 gap-5">
          {/* Fondo Inicial */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Banknote className="w-3.5 h-3.5" />
              <span>Fondo Inicial</span>
            </div>
            <p className="text-xl font-bold text-slate-800">
              ${initialFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Ventas Totales */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Receipt className="w-3.5 h-3.5" />
              <span>Ventas Totales</span>
            </div>
            <p className="text-xl font-bold text-sky-600">
              ${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Gastos */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Gastos</span>
            </div>
            <p className="text-xl font-bold text-red-500">
              {expenses > 0 ? `-$${expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"}
            </p>
          </div>

          {/* Total Esperado con borde vertical verde */}
          <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Receipt className="w-3.5 h-3.5" />
              <span>Total Esperado</span>
            </div>
            <p className="text-xl font-bold text-slate-800">
              ${totalExpected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* CONTENIDO EN 2 COLUMNAS */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: Desglose de Ingresos */}
          <div className="col-span-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 mb-4">
              Desglose de Ingresos
            </h2>

            {/* Efectivo */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Efectivo</p>
                  <p className="text-[11px] text-slate-400">{isShiftOpen ? "0 transacciones" : "0 transacciones"}</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-800">
                ${cashSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Tarjeta */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Tarjeta</p>
                  <p className="text-[11px] text-slate-400">{isShiftOpen ? "0 transacciones" : "0 transacciones"}</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-800">
                ${cardSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Transferencia */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Transferencia</p>
                  <p className="text-[11px] text-slate-400">{isShiftOpen ? "0 transacciones" : "0 transacciones"}</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-800">
                ${transferSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* COLUMNA DERECHA: Arqueo de Caja (Efectivo) */}
          <div className="col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Arqueo de Caja (Efectivo)
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ingrese el conteo físico de billetes y monedas.
              </p>
            </div>

            {/* Campos de Efectivo Contado vs Efectivo Esperado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Efectivo Contado
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!isShiftOpen}
                    value={isShiftOpen ? countedCash || "" : ""}
                    onChange={(e) => setCountedCash(parseFloat(e.target.value) || 0)}
                    placeholder={isShiftOpen ? "0.00" : "Turno cerrado"}
                    className={`w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none transition-colors ${
                      isShiftOpen
                        ? "bg-slate-50 text-slate-800 focus:border-sky-400"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 leading-tight">
                  Efectivo Esperado (Fondo + Ventas Efectivo - Gastos)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    $
                  </span>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={expectedCash.toFixed(2)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-100/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            {/* Cuadro de Diferencia (Sobrante / Faltante) */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                !isShiftOpen
                  ? "bg-slate-50 border-slate-200 text-slate-400"
                  : isSurplus
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-800"
                  : "bg-red-50/60 border-red-200 text-red-800"
              }`}
            >
              <div>
                <p className="text-xs font-bold leading-tight">
                  {!isShiftOpen
                    ? "Sin turno activo"
                    : isSurplus
                    ? "Diferencia (Sobrante)"
                    : "Diferencia (Faltante)"}
                </p>
                <p className="text-[11px] opacity-75 mt-0.5">
                  {!isShiftOpen
                    ? "Abra un turno para registrar entradas y arqueos."
                    : isSurplus
                    ? "El conteo físico excede el esperado."
                    : "El conteo físico es menor al esperado."}
                </p>
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                {!isShiftOpen
                  ? "$0.00"
                  : difference >= 0
                  ? `+$${difference.toFixed(2)}`
                  : `-$${Math.abs(difference).toFixed(2)}`}
              </span>
            </div>

            {/* Botones de acción */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-end gap-3">
                <button
                  disabled={!isShiftOpen}
                  className={`px-4 py-2 border text-xs font-semibold rounded-lg shadow-xs transition-colors ${
                    isShiftOpen
                      ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  }`}
                >
                  Registrar Gasto Menor
                </button>
                <button
                  disabled={!isShiftOpen}
                  className={`px-4 py-2 border text-xs font-semibold rounded-lg shadow-xs transition-colors ${
                    isShiftOpen
                      ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  }`}
                >
                  Realizar Corte Parcial X
                </button>
              </div>

              {/* Botón rojo destructivo de Cierre Final (Corte Z) */}
              {isShiftOpen && (
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseShift}
                    className="flex items-center gap-2 bg-[#B91C1C] hover:bg-red-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cerrar Turno Diario Corte Z</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE APERTURA DE TURNO */}
      <OpenShiftModal
        isOpen={isModalOpen}
        cashierName={cashierName}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleOpenShiftConfirm}
      />
    </div>
  );
}