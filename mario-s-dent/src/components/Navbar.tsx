"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useShift } from "@/app/context/ShiftContext";
import { Bell, User, LogOut, ShieldCheck, Store } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isShiftOpen } = useShift();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Reloj oficial de El Salvador (UTC-6)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("es-SV", {
          timeZone: "America/El_Salvador",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enlaces según el rol
  const links =
    user?.role === "admin"
      ? [
          { name: "Caja", href: "/caja" },
          { name: "Punto de venta", href: "/pos" },
          { name: "Inventario", href: "/inventario" },
          { name: "Dashboard", href: "/dashboard" },
        ]
      : [
          { name: "Caja", href: "/caja" },
          { name: "Punto de venta", href: "/pos" },
          { name: "Inventario", href: "/inventario" },
        ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 font-sans select-none relative z-30">
      {/* LADO IZQUIERDO: Marca y Rutas */}
      <div className="flex items-center gap-8">
        <Link
          href={user?.role === "admin" ? "/dashboard" : "/caja"}
          className="font-extrabold text-xl text-[#0284C7] tracking-tight"
        >
          Marios Dent
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <div key={link.href} className="relative py-5">
                <Link
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? "text-sky-600 font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {link.name}
                </Link>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* LADO DERECHO: Estado de Turno, Sucursal/Rol, Nombre, Reloj y Perfil */}
      <div className="flex items-center gap-4 text-xs">
        {/* Estado de Turno */}
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              isShiftOpen ? "bg-emerald-500" : "bg-amber-400"
            }`}
          />
          <span>{isShiftOpen ? "Turno en curso" : "Sin turno"}</span>
        </div>

        <span className="text-slate-300">|</span>

        {/* Nombre y Rol/Sucursal */}
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          {user?.role === "admin" ? (
            <span className="inline-flex items-center gap-1 text-sky-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
              <Store className="w-3.5 h-3.5 text-sky-600" />
              {user?.branch || "Santa Ana"}
            </span>
          )}
          <span className="text-slate-300">•</span>
          <span>{user?.name || "Usuario"}</span>
        </div>

        <span className="text-slate-300">|</span>

        {/* RELOJ EN VIVO */}
        <span
          suppressHydrationWarning
          className="text-slate-500 font-mono w-16 text-center tabular-nums font-medium"
        >
          {currentTime || "--:--:--"}
        </span>

        {/* Iconos de Notificaciones y Menú de Perfil */}
        <div
          className="flex items-center gap-1.5 ml-2 text-slate-600 relative"
          ref={menuRef}
        >
          <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors relative"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>

          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            title="Opciones de perfil"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Menú Desplegable de Sesión */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-800 text-xs truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}