"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useShift } from "@/app/context/ShiftContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isShiftOpen, cashierName, closeShift } = useShift();

  const [currentTime, setCurrentTime] = useState<string>("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (closeShift) {
      closeShift();
    }
    router.push("/login");
  };

  const links = [
    { name: "Caja", href: "/caja" },
    { name: "Punto de venta", href: "/pos" },
    { name: "Inventario", href: "/inventario" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none relative z-30">
      {/* LADO IZQUIERDO: Logo y Enlaces */}
      <div className="flex items-center gap-8">
        <Link href="/caja" className="flex items-center gap-2">
          <Image
            src="/mariosdent.jpg"
            alt="Mario's Dent - Depósito Dental"
            width={120}
            height={40}
            priority
            className="h-9 w-auto object-contain"
          />
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

      {/* LADO DERECHO: Estado de Turno, Cajero, Hora y Acciones */}
      <div className="flex items-center gap-4 text-xs">
        {/* Badge Dinámico de Turno */}
        {isShiftOpen ? (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Turno en curso</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Sin turno abierto</span>
          </div>
        )}

        <span className="text-slate-300">|</span>

        {/* Nombre del Cajero */}
        <span className="font-medium text-slate-700">{cashierName || "Maria G."}</span>

        <span className="text-slate-300">|</span>

        {/* Reloj */}
        <span className="text-slate-500 font-mono w-16 text-center tabular-nums">
          {currentTime || "--:--:--"}
        </span>

        {/* Botones con sombreado al pasar el cursor */}
        <div className="flex items-center gap-1.5 ml-2 text-slate-600">
          {/* Botón Campana / Notificaciones */}
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 hover:shadow-xs transition-all active:scale-95"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Menú de Perfil / Usuario */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className={`flex items-center gap-1 p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:shadow-xs transition-all active:scale-95 ${
                isProfileOpen ? "bg-slate-100 shadow-inner text-slate-900" : ""
              }`}
              title="Opciones de usuario"
            >
              <User className="w-4 h-4" />
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Ventana flotante (Dropdown) */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-800 text-xs truncate">
                    {cashierName || "Maria G."}
                  </p>
                  <p className="text-[10px] text-slate-400">Cajero en turno</p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}