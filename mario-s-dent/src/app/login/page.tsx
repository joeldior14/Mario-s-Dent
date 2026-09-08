"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Store,
  KeyRound,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<"cashier" | "admin">("cashier");
  const [branch, setBranch] = useState<"Santa Ana" | "Ahuachapán" | "Sonsonate">("Santa Ana");
  const [username, setUsername] = useState("maria.g");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole: "cashier" | "admin") => {
    setRole(newRole);
    if (newRole === "cashier") {
      setUsername("maria.g");
    } else {
      setUsername("admin@mariosdent.com");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(role, branch);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900 font-sans select-none">
      {/* LADO IZQUIERDO: Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 p-12 flex-col justify-between overflow-hidden border-r border-slate-800">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/20 inline-flex items-center">
            <Image
              src="/mariosdent.jpg"
              alt="Mario's Dent"
              width={140}
              height={45}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema POS & Control de Inventario Clínico</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Gestión inteligente para tu depósito dental.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Control de inventario multi-sucursal, arqueos de turno y ventas ágiles en mostrador.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500">
          <span>Terminal ID: POS-MD-01 (Mostrador)</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Servidor en línea</span>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: Formulario de acceso */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white lg:bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white lg:p-8 lg:rounded-3xl lg:border lg:border-slate-200/80 lg:shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona tu rol para ingresar a la terminal
            </p>
          </div>

          {/* Selector de Rol */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange("cashier")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === "cashier"
                  ? "bg-white text-sky-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Cajero (POS)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === "admin"
                  ? "bg-white text-sky-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrador</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Si es cajero, selecciona su sucursal asignada */}
            {role === "cashier" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sucursal de Atención
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="Santa Ana">Santa Ana</option>
                  <option value="Ahuachapán">Ahuachapán</option>
                  <option value="Sonsonate">Sonsonate</option>
                </select>
              </div>
            )}

            {/* Campo Usuario */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {role === "cashier" ? "Usuario de Caja" : "Correo Administrador"}
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type={role === "cashier" ? "text" : "email"}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center gap-2.5 text-[11px] text-sky-800 font-medium">
              <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                {role === "cashier"
                  ? `Ingreso para mostrador asignado a ${branch}.`
                  : "Acceso con control total de las 3 sucursales e inventario general."}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}