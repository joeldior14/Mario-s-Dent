"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useShift } from "@/app/context/ShiftContext";
import UserManagementModal from "@/components/GestionUsuariosModal";
import BranchManagementModal from "@/components/GestionSucursalesModal";
import {
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isShiftOpen } = useShift();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links =
    user?.role === "admin"
      ? [
          { name: "Caja", href: "/caja" },
          { name: "Inventario", href: "/inventario" },
          { name: "Dashboard", href: "/dashboard" },
        ]
      : [
          { name: "Caja", href: "/caja" },
          { name: "Punto de venta", href: "/pos" },
          { name: "Inventario", href: "/inventario" },
        ];

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 font-sans select-none relative z-30">
        <div className="flex items-center gap-8">
          <Link
            href={user?.role === "admin" ? "/dashboard" : "/caja"}
            className="flex items-center gap-2 py-2"
          >
            <Image
              src="/mariosdent.jpg"
              alt="Mario's Dent"
              width={130}
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

        <div className="flex items-center gap-4 text-xs">
          {user?.role !== "admin" && (
            <>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    isShiftOpen ? "bg-emerald-500" : "bg-amber-400"
                  }`}
                />
                <span>{isShiftOpen ? "Turno en curso" : "Sin turno"}</span>
              </div>
              <span className="text-slate-300">|</span>
            </>
          )}

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

          <span
            suppressHydrationWarning
            className="text-slate-500 font-mono w-16 text-center tabular-nums font-medium"
          >
            {currentTime || "--:--:--"}
          </span>

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
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Opciones de perfil"
            >
              <User className="w-4 h-4" />
            </button>

            {/* MENÚ DESPLEGABLE */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-800 text-xs truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>

                {/* ACCIONES EXCLUSIVAS DEL ADMIN */}
                {user?.role === "admin" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowBranchModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5 text-sky-600" />
                      <span>Gestión de Sucursales</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowUsersModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-sky-600" />
                      <span>Gestión de Usuarios</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL DE GESTIÓN DE USUARIOS */}
      <UserManagementModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
      />

      {/* MODAL DE GESTIÓN DE SUCURSALES */}
      <BranchManagementModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
      />
    </>
  );
}