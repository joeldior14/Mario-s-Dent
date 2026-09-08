"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserSession {
  name: string;
  email: string;
  role: "admin" | "cashier";
  branch: "Santa Ana" | "Ahuachapán" | "Sonsonate";
}

interface AuthContextType {
  user: UserSession | null;
  login: (role: "admin" | "cashier", branch?: "Santa Ana" | "Ahuachapán" | "Sonsonate") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const router = useRouter();

  // Cargar sesión persistida si existe
  useEffect(() => {
    const saved = localStorage.getItem("marios_dent_session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("marios_dent_session");
      }
    }
  }, []);

  const login = (
    role: "admin" | "cashier",
    branch: "Santa Ana" | "Ahuachapán" | "Sonsonate" = "Santa Ana"
  ) => {
    const sessionData: UserSession =
      role === "admin"
        ? {
            name: "Mario Administrador",
            email: "admin@mariosdent.com",
            role: "admin",
            branch: "Santa Ana",
          }
        : {
            name: "Maria G.",
            email: "maria.g@mariosdent.com",
            role: "cashier",
            branch: branch,
          };

    setUser(sessionData);
    localStorage.setItem("marios_dent_session", JSON.stringify(sessionData));

    if (role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/caja");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("marios_dent_session");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}