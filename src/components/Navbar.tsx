"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/app/context/AuthContext";
import { useShift } from "@/app/context/ShiftContext";
import GestionSucursalesModal from "@/components/GestionSucursalesModal";
import GestionUsuariosModal from "@/components/GestionUsuariosModal";
import {
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

// Formateador estático para la hora oficial de El Salvador (UTC-6)
const elSalvadorTimeFormatter = new Intl.DateTimeFormat("es-SV", {
  timeZone: "America/El_Salvador",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// Hook nativo de React para verificar si el componente ya montó en cliente
const emptySubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,  // En el navegador (cliente)
    () => false  // En el servidor (SSR)
  );

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isShiftOpen } = useShift();

  const mounted = useIsMounted();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Lectura perezosa de la cookie sin provocar re-renderizados en cascada
  const [cookieRole] = useState<UserRole | null>(() => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/marios_dent_session=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        return parsed.role;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Determinar rol efectivo
  const effectiveRole: UserRole = user?.role || cookieRole || "admin";

  // Reloj oficial de El Salvador
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(elSalvadorTimeFormatter.format(new Date()));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cerrar menú de perfil con clic externo o tecla Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Enlaces protegidos contra discrepancias SSR vs Cliente
  const links = useMemo(() => {
    const role = mounted ? effectiveRole : "admin";

    if (role === "admin") {
      return [
        { name: "Caja", href: "/caja" },
        { name: "Inventario", href: "/inventario" },
        { name: "Dashboard", href: "/dashboard" },
      ];
    }

    return [
      { name: "Caja", href: "/caja" },
      { name: "Punto de venta", href: "/pos" },
      { name: "Inventario", href: "/inventario" },
    ];
  }, [mounted, effectiveRole]);

  // Manejadores estables
  const handleOpenBranchModal = useCallback(() => {
    setShowProfileMenu(false);
    setShowBranchModal(true);
  }, []);

  const handleOpenUsersModal = useCallback(() => {
    setShowProfileMenu(false);
    setShowUsersModal(true);
  }, []);

  const handleLogout = useCallback(() => {
    setShowProfileMenu(false);
    logout();
  }, [logout]);

  // Ruta base del logotipo
  const homeHref = mounted && effectiveRole !== "admin" ? "/caja" : "/dashboard";

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 font-sans select-none relative z-30">
        {/* LADO IZQUIERDO: Logotipo y Enlaces */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
  href={homeHref}
  className="relative flex items-center shrink-0 cursor-pointer transition-transform hover:scale-105"
>
  <div className="relative -my-3 h-14 sm:h-16 w-auto flex items-center justify-center">
    <Image
      src="/mariosdent.jpg"
      alt="Mario's Dent"
      width={160}
      height={70}
      priority
      className="h-12 sm:h-14 w-auto object-contain drop-shadow-xs"
    />
  </div>
</Link>

          {/* Menú de módulos en escritorio */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/caja" && pathname.startsWith(link.href));

              return (
                <div key={link.href} className="relative py-5">
                  <Link
                    href={link.href}
                    className={`transition-colors duration-150 ${
                      isActive
                        ? "text-sky-600 font-bold"
                        : "text-slate-500 hover:text-slate-900"
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

          {/* Indicador en teléfono móvil */}
          <div className="md:hidden flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span className="text-slate-300">•</span>
            <span>
              {mounted
                ? effectiveRole === "admin"
                  ? "Dashboard"
                  : "Terminal"
                : "Dashboard"}
            </span>
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          {/* Turno: Protegido con `mounted` para que el SSR y el primer frame del cliente coincidan */}
          {mounted && effectiveRole !== "admin" && (
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 text-slate-600 font-medium"
                suppressHydrationWarning
              >
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    isShiftOpen ? "bg-emerald-500" : "bg-amber-400"
                  }`}
                />
                <span>{isShiftOpen ? "Turno en curso" : "Sin turno"}</span>
              </div>
              <span className="text-slate-300">|</span>
            </div>
          )}

          {/* Identificador de Rol y Usuario */}
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            {mounted && effectiveRole !== "admin" ? (
              <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                <Store className="w-3.5 h-3.5 text-sky-600" />
                {user?.branch || "Santa Ana"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </span>
            )}
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline font-semibold">
              {mounted && effectiveRole !== "admin"
                ? user?.name || "Cajero"
                : user?.name || "Mario Ochoa"}
            </span>
          </div>

          {/* Reloj Oficial (Visible en PC) */}
          <span className="hidden md:inline text-slate-300">|</span>
          <span
            suppressHydrationWarning
            className="hidden md:inline text-slate-500 font-mono w-16 text-center tabular-nums font-medium"
          >
            {currentTime || "--:--:--"}
          </span>

          {/* Botón directo de Salir en Móvil */}
          <button
            type="button"
            onClick={handleLogout}
            className="md:hidden flex items-center gap-1.5 py-1.5 px-2.5 bg-rose-50 text-rose-600 border border-rose-200/70 rounded-xl font-bold text-xs hover:bg-rose-100 transition-colors active:scale-95 cursor-pointer ml-1"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>

          {/* Menú de Notificaciones y Perfil en PC */}
          <div
            className="hidden md:flex items-center gap-1.5 ml-2 text-slate-600 relative"
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
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                showProfileMenu ? "bg-slate-100 text-slate-900" : "hover:bg-slate-100"
              }`}
              title="Opciones de perfil"
            >
              <User className="w-4 h-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-800 text-xs truncate">
                    {user?.name || (effectiveRole === "admin" ? "Mario Ochoa" : "Cajero")}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email || "admin@mariosdent.com"}
                  </p>
                </div>

                {mounted && effectiveRole === "admin" && (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenBranchModal}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <Store className="w-4 h-4 text-sky-600" />
                      <span>Gestión de Sucursales</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenUsersModal}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <Users className="w-4 h-4 text-sky-600" />
                      <span>Gestión de Usuarios</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modales Administrativos */}
      <GestionSucursalesModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
      />

      <GestionUsuariosModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
      />
    </>
  );
}