"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Calendar,
  RotateCw,
  Search,
  TrendingUp,
  AlertTriangle,
  PackageX,
  ChevronDown,
} from "lucide-react";

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans">
      {/* 1. BARRA DE NAVEGACIÓN HEREDADA */}
      <Navbar />

      {/* 2. CONTENIDO PRINCIPAL DEL DASHBOARD */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
        {/* Contenedor tipo marco/tarjeta principal */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* ENCABEZADO DE LA SUCURSAL */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0284C7] tracking-tight">
                  Sucursal Matriz
                </h1>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  • Abierto
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Hoy, 24 Oct</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Sincronizar datos"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-right -mt-4">
            Última act: 10:42 AM
          </p>

          {/* BUSCADOR DE STOCK / PRECIO */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Consultar Stock/Precio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>

          {/* TARJETA DE INGRESOS DE HOY */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Ingresos Hoy
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0369A1]">
                $12,450
              </span>
              <span className="flex items-center text-xs font-bold text-emerald-600 gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +8.5%
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">42 Transacciones</span>
              <button className="text-sky-600 hover:text-sky-700 text-xs font-semibold px-2 py-0.5 border border-dashed border-sky-300 rounded hover:bg-sky-50 transition-colors">
                [Ver detalle]
              </button>
            </div>
          </div>

          {/* TARJETA MÉTODOS DE PAGO */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 mb-4">
              Métodos de Pago
            </h3>

            <div className="flex items-center justify-between gap-6">
              {/* Círculo indicador / porcentaje central */}
              <div className="w-20 h-20 rounded-full border-4 border-sky-500 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                100%
              </div>

              {/* Leyenda y porcentajes */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                    <span className="text-slate-600 font-medium">Tarjeta</span>
                  </div>
                  <span className="font-bold text-slate-700">60%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-slate-600 font-medium">Transferencia</span>
                  </div>
                  <span className="font-bold text-slate-700">25%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                    <span className="text-slate-600 font-medium">Efectivo</span>
                  </div>
                  <span className="font-bold text-slate-700">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ALERTA: VENCIMIENTOS */}
          <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Alertas de Vencimiento</span>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                3 Items
              </span>
            </div>

            <button className="w-full mt-3 py-1.5 px-3 border border-dashed border-sky-300 rounded text-left text-xs font-semibold text-sky-600 hover:bg-sky-50/50 flex items-center justify-between transition-colors">
              <span>[Revisar lotes]</span>
              <ChevronDown className="w-3.5 h-3.5 text-sky-500" />
            </button>
          </div>

          {/* ALERTA: PRODUCTOS AGOTADOS */}
          <div className="border border-red-200 bg-red-50/40 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 text-xs font-bold">
                <PackageX className="w-4 h-4" />
                <span>Productos Agotados</span>
              </div>
              <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                5 Items
              </span>
            </div>

            <button className="w-full mt-3 py-1.5 px-3 border border-dashed border-sky-300 rounded text-left text-xs font-semibold text-sky-600 hover:bg-sky-50/50 flex items-center justify-between transition-colors">
              <span>[Generar orden]</span>
              <ChevronDown className="w-3.5 h-3.5 text-sky-500" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}