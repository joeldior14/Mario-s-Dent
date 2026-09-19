"use client";

import React, { useState, useEffect, useId, useCallback } from "react";
import {
  X,
  Users,
  Plus,
  Pencil,
  Trash2,
  Store,
  ShieldCheck,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export type UserRole = "admin" | "cashier";
export type BranchName = "Santa Ana" | "Ahuachapán" | "Sonsonate";

export interface DBBranch {
  id: string;
  name: BranchName | string;
}

export interface AppUser {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  role: UserRole;
  branchId: string;
  branchName: string;
}

const ROLE_OPTIONS: readonly { value: UserRole; label: string }[] = [
  { value: "cashier", label: "Cajero (Solo su sucursal)" },
  { value: "admin", label: "Administrador (Total)" },
];

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileQueryResult {
  id: string;
  username: string;
  full_name: string;
  role: string;
  branch_id: string;
  branches: { id: string; name: string } | { id: string; name: string }[] | null;
}

export default function UserManagementModal({
  isOpen,
  onClose,
}: UserManagementModalProps) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [branches, setBranches] = useState<DBBranch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Estados del formulario
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<UserRole>("cashier");
  const [branchId, setBranchId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const modalId = useId();

// 1. Cargar usuarios y sucursales directamente desde Supabase
  const fetchData = useCallback(async () => {
    try {
      // Obtener sedes operativas
      const { data: branchData, error: branchErr } = await supabase
        .from("branches")
        .select("id, name")
        .order("name");

      if (branchErr) throw branchErr;
      setBranches(branchData || []);

      if (branchData && branchData.length > 0 && !branchId) {
        setBranchId(branchData[0].id);
      }

      // Obtener perfiles de usuarios con sucursal relacionada
      const { data: profilesData, error: profilesErr } = await supabase
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
        .order("created_at", { ascending: false });

      if (profilesErr) throw profilesErr;

      const formatted: AppUser[] = ((profilesData as unknown as ProfileQueryResult[]) || []).map((p) => {
        const branchRecord = Array.isArray(p.branches) ? p.branches[0] : p.branches;
        return {
          id: p.id,
          username: p.username,
          fullName: p.full_name,
          role: p.role as UserRole,
          branchId: p.branch_id,
          branchName: branchRecord?.name || "Sin Asignar",
        };
      });

      setUsers(formatted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al conectar con la base de datos";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  // Cargar datos al abrir de manera asíncrona segura
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadAsync = async () => {
      setIsLoading(true);
      setError(null);
      await fetchData();
    };

    if (isMounted) {
      loadAsync();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, fetchData]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingUserId(null);
    setFullName("");
    setUsername("");
    setRole("cashier");
    if (branches.length > 0) setBranchId(branches[0].id);
    setPassword("");
    setError(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: AppUser) => {
    setEditingUserId(user.id);
    setFullName(user.fullName);
    setUsername(user.username);
    setRole(user.role);
    setBranchId(user.branchId);
    setPassword("");
    setError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  // 2. Guardar: creación vía API / Admin Auth o actualización en profiles
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanFullName || !cleanUsername) {
      setError("El nombre completo y el usuario para login son obligatorios.");
      return;
    }

    if (!branchId) {
      setError("Debes seleccionar una sucursal.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (editingUserId) {
        // Actualización de registro existente en profiles
        const { error: updateErr } = await supabase
          .from("profiles")
          .update({
            full_name: cleanFullName,
            username: cleanUsername,
            role,
            branch_id: branchId,
          })
          .eq("id", editingUserId);

        if (updateErr) throw updateErr;
      } else {
        // Creación mediante endpoint administrativo seguro para auth.users
        if (!password || password.length < 6) {
          throw new Error("La contraseña inicial debe tener al menos 6 caracteres.");
        }

        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: cleanFullName,
            username: cleanUsername,
            branchId,
            role,
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "No se pudo registrar el usuario en Supabase Auth.");
        }
      }

      await fetchData();
      handleCloseForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el usuario";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Eliminar usuario de la base de datos
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar definitivamente el usuario de ${name}?`)) return;

    try {
      const { error: delErr } = await supabase.from("profiles").delete().eq("id", id);
      if (delErr) throw delErr;

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar el usuario";
      alert(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalId}-title`}
    >
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 id={`${modalId}-title`} className="text-sm font-bold text-slate-800">
                Gestión de Personal & Accesos
              </h3>
              <p className="text-[11px] text-slate-400">
                Sincronización de credenciales y sedes fijas (Supabase Auth)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Usuario</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 font-semibold flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isFormOpen ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {editingUserId ? "Modificar Usuario" : "Registrar Nuevo Cajero / Usuario"}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`${modalId}-name`}
                    className="block text-[11px] font-bold text-slate-500 uppercase mb-1"
                  >
                    Nombre Completo *
                  </label>
                  <input
                    id={`${modalId}-name`}
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Maria Gonzalez"
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${modalId}-user`}
                    className="block text-[11px] font-bold text-slate-500 uppercase mb-1"
                  >
                    Usuario para Login *
                  </label>
                  <input
                    id={`${modalId}-user`}
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. maria.g"
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`${modalId}-branch`}
                    className="block text-[11px] font-bold text-slate-500 uppercase mb-1"
                  >
                    Sucursal Asignada (Fija)
                  </label>
                  <select
                    id={`${modalId}-branch`}
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`${modalId}-role`}
                    className="block text-[11px] font-bold text-slate-500 uppercase mb-1"
                  >
                    Rol
                  </label>
                  <select
                    id={`${modalId}-role`}
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${modalId}-pass`}
                  className="block text-[11px] font-bold text-slate-500 uppercase mb-1"
                >
                  Contraseña {editingUserId && "(Dejar en blanco para no cambiar)"}
                </label>
                <input
                  id={`${modalId}-pass`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{editingUserId ? "Actualizar Usuario" : "Guardar Usuario"}</span>
                </button>
              </div>
            </form>
          ) : isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
              <span className="text-xs">Cargando personal desde la base de datos...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 bg-slate-50/50">
                    <th className="py-2.5 px-3">Usuario / Nombre</th>
                    <th className="py-2.5 px-3">Sucursal Asignada</th>
                    <th className="py-2.5 px-3">Rol</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-800 text-xs">{u.fullName}</p>
                        <p className="font-mono text-[10px] text-slate-400">@{u.username}</p>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          <Store className="w-3 h-3 text-sky-600" />
                          {u.branchName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-600">Cajero</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.fullName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        No hay personal registrado en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}