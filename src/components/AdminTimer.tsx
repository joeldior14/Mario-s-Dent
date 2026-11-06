"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";

// Tiempo de inactividad en milisegundos (Ejemplo: 15 minutos = 15 * 60 * 1000)
const IDLE_TIMEOUT = 15 * 60 * 1000; 

export default function AdminIdleTimer() {
  const { user, logout } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(( ) => {
    // Si no hay usuario o el usuario NO es admin, no hacemos nada (el cajero se ignora)
    if (!user || user.role !== "admin") {
      return;
    }

    const handleLogout = () => {
      alert("Su sesión de Administrador ha expirado por inactividad.");
      logout();
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Iniciar cuenta regresiva nuevamente
      timerRef.current = setTimeout(handleLogout, IDLE_TIMEOUT);
    };

    // Eventos que detectan actividad del usuario
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Inicializar el temporizador al montar
    resetTimer();

    // Limpieza de eventos al desmontar o cambiar de usuario
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  return null; // Este componente es lógico y visualmente no renderiza nada
}