"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth, UserRole } from "@/app/context/AuthContext";
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
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>("cashier");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Si entra desde el teléfono, forzar rol Administrador
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setRole("admin");
        setUsername("admin@mariosdent.com");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === "admin") {
      setUsername("admin@mariosdent.com");
    } else {
      setUsername("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Llamada con los 3 argumentos exactos que pide tu AuthContext
    const result = await login(username, password, role);

    if (result?.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900 font-sans select-none">
      {/* LADO IZQUIERDO: Branding (Solo en PC) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 p-12 flex-col justify-between overflow-hidden border-r border-slate-800">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/30 inline-flex items-center justify-center">
            <Image
              src="/mariosdent.jpg"
              alt="Mario's Dent"
              width={260}
              height={100}
              priority
              className="h-20 sm:h-24 w-auto object-contain"
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
            Control de inventario multi-sucursal, arqueos de turno y ventas ágiles en mostrador[cite: 10].
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500">
          <span>Terminal ID: POS-MD-01 (Mostrador)</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Servidor en línea (Supabase Auth)</span>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: Formulario de acceso */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white lg:bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white lg:p-8 lg:rounded-3xl lg:border lg:border-slate-200/80 lg:shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <Image
                src="/mariosdent.jpg"
                alt="Mario's Dent"
                width={150}
                height={50}
                priority
                className="h-12 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="text-xs text-slate-500">
              <span className="lg:hidden">Acceso gerencial exclusivo para Administrador</span>
              <span className="hidden lg:inline">Ingresa con tus credenciales autenticadas[cite: 10]</span>
            </p>
          </div>

          {/* Selector de Rol: Oculto en móviles */}
          <div className="hidden lg:grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange("cashier")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === "admin"
                  ? "bg-white text-sky-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrador</span>
            </button>
          </div>

          {/* Badge en móvil confirmando rol */}
          <div className="lg:hidden flex items-center justify-center gap-2 py-2 px-3 bg-sky-50 border border-sky-200 rounded-xl text-xs font-bold text-sky-800">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Perfil: Administrador / Propietario</span>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder={role === "cashier" ? "Ej. maria.g" : "admin@mariosdent.com"}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center gap-2.5 text-[11px] text-sky-800 font-medium">
              <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                {role === "cashier"
                  ? "La sucursal de atención será asignada según tu cuenta[cite: 10]."
                  : "Acceso con control total de las 3 sucursales e inventario general[cite: 10]."}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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