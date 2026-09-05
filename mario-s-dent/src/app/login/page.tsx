"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [role, setRole] = useState<"cashier" | "admin">("cashier");
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

    // Simulación de autenticación y redirección por rol
    setTimeout(() => {
      setIsLoading(false);
      if (role === "cashier") {
        router.push("/caja"); // El cajero va directo al flujo de apertura
      } else {
        router.push("/dashboard"); // El administrador va al panel de control
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900 font-sans select-none">
      {/* 1. LADO IZQUIERDO: Branding y Bienvenida (Visible en pantallas medianas y grandes) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 p-12 flex-col justify-between overflow-hidden border-r border-slate-800">
        {/* Glow decorativo de fondo */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo superior */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/20 inline-flex items-center">
            <Image
              src="/mariosdent.jpg"
              alt="Mario's Dent"
              width={140}
              height={60}
              priority
              className="h-30 w-auto object-contain"
            />
          </div>
        </div>

        {/* Mensaje central */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema POS & Control de Inventario Clínico</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Gestión inteligente para tu depósito dental.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Control de lotes médicos, trazabilidad de vencimientos, escaneo continuo en caja y conciliación de turnos diarios en tiempo real.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
              <span className="block font-bold text-white mb-0.5">Venta en Mostrador</span>
              <span className="text-slate-400 text-[11px]">Lectura continua de códigos e impresión de tickets[cite: 1, 2].</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
              <span className="block font-bold text-white mb-0.5">Monitoreo Remoto</span>
              <span className="text-slate-400 text-[11px]">Control de ingresos y existencias 24/7 desde el móvil[cite: 1, 2].</span>
            </div>
          </div>
        </div>

        {/* Footer legal e indicativo */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500">
          <span>Terminal ID: POS-MD-01 (Mostrador)</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Servidor en línea (v1.0.4)</span>
          </div>
        </div>
      </div>

      {/* 2. LADO DERECHO: Tarjeta de Acceso y Formulario */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white lg:bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white lg:p-8 lg:rounded-3xl lg:border lg:border-slate-200/80 lg:shadow-xl space-y-6">
          
          {/* Cabecera en Móvil / Identificación */}
          <div className="text-center space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="Mario's Dent"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona tu rol operativo para ingresar al sistema
            </p>
          </div>

          {/* Selector interactivo de Rol (Cajero vs Admin) */}
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

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Usuario / Correo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {role === "cashier" ? "Usuario de Caja" : "Correo Electrónico"}
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
                  placeholder={role === "cashier" ? "Ej. maria.g" : "admin@mariosdent.com"}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contraseña o PIN
                </label>
                {role === "admin" && (
                  <button
                    type="button"
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-mono"
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

            {/* Indicador informativo de inicio rápido según rol */}
            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center gap-2.5 text-[11px] text-sky-800 font-medium">
              <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                {role === "cashier"
                  ? "Acceso optimizado para apertura de turno y facturación rápida[cite: 1, 2]."
                  : "Acceso total a métricas, inventario general y reportes financieros[cite: 1, 2]."}
              </span>
            </div>

            {/* Botón de Entrada */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Iniciar Sesión en Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Pie de autenticación */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              Mario&apos;s Dent Depósito Dental © 2026 • Acceso Protegido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}