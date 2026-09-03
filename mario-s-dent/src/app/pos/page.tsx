"use client";

import React from "react";
import { Bell, User } from "lucide-react";

export default function PosPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans">
      {/* BARRA SUPERIOR (HEADER / NAVBAR) */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        
        {/* LADO IZQUIERDO: Logo y Enlaces */}
        <div className="flex items-center gap-8">
          {/* Logo Depósito Dental */}
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-extrabold text-xl text-[#0284C7] tracking-tight">
              Depósito Dental
            </span>
          </div>

          {/* Menú de Navegación */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-500">
            {/* Pestaña activa (POS) con línea inferior */}
            <div className="relative py-5">
              <span className="text-sky-600 font-bold cursor-pointer">
                POS
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
            </div>

            {/* Enlaces inactivos */}
            <span className="hover:text-slate-800 cursor-pointer transition-colors">
              Inventory
            </span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">
              Reconciliation
            </span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">
              Dashboard
            </span>
          </nav>
        </div>

        {/* LADO DERECHO: Estado, Cajero, Reloj y Acciones */}
        <div className="flex items-center gap-4 text-xs">
          {/* Estatus En Línea */}
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Online</span>
          </div>

          {/* Separador vertical */}
          <span className="text-slate-300">|</span>

          {/* Nombre de la cajera */}
          <span className="font-medium text-slate-700">
            Maria G.
          </span>

          {/* Separador vertical */}
          <span className="text-slate-300">|</span>

          {/* Reloj de turno */}
          <span className="text-slate-500 font-mono">
            04:48:48
          </span>

          {/* Botón Corte de Caja */}
          <button className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-md shadow-xs transition-colors ml-1">
            Corte de Caja
          </button>

          {/* Iconos de Campana (con punto rojo) y Perfil */}
          <div className="flex items-center gap-3 ml-2 text-slate-600">
            <button className="relative hover:text-slate-900 transition-colors" title="Notificaciones">
              <Bell className="w-5 h-5" />
              {/* Notificación activa (punto rojo) */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="hover:text-slate-900 transition-colors" title="Perfil">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

      </header>
    </div>
  );
}