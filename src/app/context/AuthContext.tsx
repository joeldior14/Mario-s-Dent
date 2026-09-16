"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "cashier";
export type BranchName = "Santa Ana" | "Ahuachapán" | "Sonsonate";

export interface UserSession {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  branch: BranchName;
}

interface AuthContextType {
  user: UserSession | null;
  login: (role: UserRole, usernameInput?: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "marios_dent_session";

const REGISTERED_USERS: Record<
  string,
  { name: string; email: string; branch: BranchName }
> = {
  "maria.g": {
    name: "Maria G.",
    email: "maria.g@mariosdent.com",
    branch: "Santa Ana",
  },
  "carlos.m": {
    name: "Carlos M.",
    email: "carlos.m@mariosdent.com",
    branch: "Ahuachapán",
  },
  "manuel.r": {
    name: "Manuel R.",
    email: "manuel.r@mariosdent.com",
    branch: "Sonsonate",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // 1. Estado inicial idéntico en Servidor y Cliente (evita el error de hidratación)
  const [user, setUser] = useState<UserSession | null>(null);

  // 2. Carga en cliente sin provocar error de render síncrono
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as UserSession;
        // Se difiere en la cola de eventos para evitar la advertencia de cascading render
        queueMicrotask(() => {
          setUser(parsed);
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = useCallback(
    (role: UserRole, usernameInput: string = "maria.g") => {
      let sessionData: UserSession;

      if (role === "admin") {
        sessionData = {
          name: "Mario Administrador",
          email: "admin@mariosdent.com",
          role: "admin",
          branch: "Santa Ana",
        };
      } else {
        const normalized = usernameInput.trim().toLowerCase();
        const profile = REGISTERED_USERS[normalized] || {
          name: usernameInput,
          email: `${normalized}@mariosdent.com`,
          branch: "Santa Ana" as BranchName,
        };

        sessionData = {
          name: profile.name,
          email: profile.email,
          role: "cashier",
          branch: profile.branch,
        };
      }

      setUser(sessionData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/caja");
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}