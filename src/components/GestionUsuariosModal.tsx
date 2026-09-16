"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface AppUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "admin" | "cashier";
  branch: "Santa Ana" | "Ahuachapán" | "Sonsonate";
}

const INITIAL_USERS: AppUser[] = [
  {
    id: "u1",
    username: "maria.g",
    fullName: "Maria G.",
    email: "maria.g@mariosdent.com",
    role: "cashier",
    branch: "Santa Ana",
  },
  {
    id: "u2",
    username: "carlos.m",
    fullName: "Carlos M.",
    email: "carlos.m@mariosdent.com",
    role: "cashier",
    branch: "Ahuachapán",
  },
  {
    id: "u3",
    username: "manuel.r",
    fullName: "Manuel R.",
    email: "manuel.r@mariosdent.com",
    role: "cashier",
    branch: "Sonsonate",
  },
];

export default function UserManagementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "cashier">("cashier");
  const [branch, setBranch] = useState<"Santa Ana" | "Ahuachapán" | "Sonsonate">("Santa Ana");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setEditingUserId(null);
    setFullName("");
    setUsername("");
    setEmail("");
    setRole("cashier");
    setBranch("Santa Ana");
    setPassword("");
    setError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: AppUser) => {
    setEditingUserId(user.id);
    setFullName(user.fullName);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    setBranch(user.branch);
    setPassword("");
    setError(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar definitivamente el usuario de ${name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      setError("El nombre y nombre de usuario son requeridos.");
      return;
    }

    if (editingUserId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                fullName: fullName.trim(),
                username: username.trim().toLowerCase(),
                email: email.trim() || `${username.trim().toLowerCase()}@mariosdent.com`,
                role,
                branch,
              }
            : u
        )
      );
    } else {
      const newUser: AppUser = {
        id: crypto.randomUUID(),
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim() || `${username.trim().toLowerCase()}@mariosdent.com`,
        role,
        branch,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Gestión de Personal & Accesos
              </h3>
              <p className="text-[11px] text-slate-400">
                Asignación de sucursales fijas y credenciales
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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto">
          {isFormOpen ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {editingUserId ? "Modificar Usuario" : "Registrar Nuevo Cajero / Usuario"}
              </h4>

              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Maria Gonzalez"
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Usuario para Login
                  </label>
                  <input
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
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Sucursal Asignada (Fija)
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as any)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Santa Ana">Santa Ana</option>
                    <option value="Ahuachapán">Ahuachapán</option>
                    <option value="Sonsonate">Sonsonate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Rol
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="cashier">Cajero (Solo su sucursal)</option>
                    <option value="admin">Administrador (Total)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Contraseña {editingUserId && "(Dejar en blanco para no cambiar)"}
                </label>
                <input
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
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingUserId ? "Actualizar Usuario" : "Guardar Usuario"}</span>
                </button>
              </div>
            </form>
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
                          {u.branch}
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
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}