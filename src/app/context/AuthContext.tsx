"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export type UserRole = "admin" | "cashier";
export type BranchName = "Santa Ana" | "Ahuachapán" | "Sonsonate";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: BranchName;
  branchId: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (
    identifier: string,
    pass: string,
    expectedRole: UserRole
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Consulta el perfil del usuario en la tabla profiles
  const loadProfile = useCallback(
    async (userId: string, emailStr: string): Promise<UserSession | null> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            username,
            full_name,
            role,
            branch_id,
            branches (
              id,
              name
            )
          `)
          .eq("id", userId)
          .single();

        if (error || !data) return null;

        const branchRecord = Array.isArray(data.branches)
          ? data.branches[0]
          : data.branches;

        return {
          id: data.id,
          name: data.full_name,
          email: emailStr,
          role: data.role as UserRole,
          branch: (branchRecord?.name as BranchName) || "Santa Ana",
          branchId: data.branch_id,
        };
      } catch {
        return null;
      }
    },
    []
  );

  // Sincroniza la sesión persistente de Supabase
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const profile = await loadProfile(
            session.user.id,
            session.user.email || ""
          );
          if (mounted) setUser(profile);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await loadProfile(
            session.user.id,
            session.user.email || ""
          );
          setUser(profile);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = useCallback(
    async (
      identifier: string,
      pass: string,
      expectedRole: UserRole
    ): Promise<{ error?: string }> => {
      let emailToAuth = identifier.trim().toLowerCase();

      // Si se ingresó un nombre de usuario (ej. 'admin'), se completa con el dominio
      if (!emailToAuth.includes("@")) {
        emailToAuth = `${emailToAuth}@mariosdent.com`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: pass,
      });

      if (error || !data.user) {
        return { error: "Credenciales incorrectas o usuario no registrado." };
      }

      const profile = await loadProfile(
        data.user.id,
        data.user.email || emailToAuth
      );

      if (!profile) {
        return {
          error: "El usuario existe pero no tiene un perfil asignado en la base de datos.",
        };
      }

      if (expectedRole === "admin" && profile.role !== "admin") {
        await supabase.auth.signOut();
        return {
          error: "Acceso denegado: Esta cuenta no posee permisos de Administrador.",
        };
      }

      setUser(profile);

      if (profile.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/caja");
      }

      return {};
    },
    [loadProfile, router]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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