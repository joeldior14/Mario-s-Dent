"use client";

import React, { useState } from "react";
import {
  X,
  Store,
  Plus,
  Phone,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
} from "lucide-react";

export interface BranchItem {
  id: string;
  name: string;
  code: string;
  phone: string;
  address: string;
  isActive: boolean;
}

const INITIAL_BRANCHES: BranchItem[] = [
  {
    id: "branch-sa",
    name: "Santa Ana",
    code: "SA",
    phone: "2440-1234",
    address: "Av. Independencia Sur #12, Santa Ana",
    isActive: true,
  },
  {
    id: "branch-ah",
    name: "Ahuachapán",
    code: "AH",
    phone: "2413-5678",
    address: "Calle Menéndez Norte #4, Ahuachapán",
    isActive: true,
  },
  {
    id: "branch-so",
    name: "Sonsonate",
    code: "SO",
    phone: "2451-9012",
    address: "Paseo 15 de Septiembre #8, Sonsonate",
    isActive: true,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BranchManagementModal({ isOpen, onClose }: Props) {
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [showForm, setShowForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setEditingBranchId(null);
    setFormData({ name: "", code: "", phone: "", address: "" });
    setShowForm(true);
  };

  const handleOpenEdit = (branch: BranchItem) => {
    setEditingBranchId(branch.id);
    setFormData({
      name: branch.name,
      code: branch.code,
      phone: branch.phone,
      address: branch.address,
    });
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert("El nombre y el código de la sucursal son obligatorios.");
      return;
    }

    if (editingBranchId) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranchId
            ? { ...b, ...formData, code: formData.code.toUpperCase() }
            : b
        )
      );
    } else {
      const newBranch: BranchItem = {
        id: `branch-${Date.now()}`,
        name: formData.name,
        code: formData.code.toUpperCase(),
        phone: formData.phone || "Sin teléfono",
        address: formData.address || "Sin dirección registrada",
        isActive: true,
      };
      setBranches((prev) => [...prev, newBranch]);
    }

    setShowForm(false);
  };

  const handleToggleActive = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar la sucursal "${name}"?`)) {
      setBranches((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Gestión de Sucursales
              </h2>
              <p className="text-[11px] text-slate-400">
                Administración de sedes y puntos de venta de Mario&apos;s Dent
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido / Lista y Formulario */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {!showForm ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {branches.length} sucursales registradas
                </span>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="flex items-center gap-1.5 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Sucursal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${
                      branch.isActive
                        ? "bg-white border-slate-200"
                        : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {branch.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                          {branch.code}
                        </span>
                        {branch.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                            <AlertCircle className="w-3 h-3" /> Inactiva
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {branch.phone}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {branch.address}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(branch.id)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          branch.isActive
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {branch.isActive ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(branch)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id, branch.name)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Formulario de Alta / Edición */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase">
                    Nombre de la Sucursal
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej. San Miguel, Ahuachapán"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase">
                    Código (Prefijo)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="Ej. SM, SA"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Ej. 2440-1234"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">
                  Dirección Física
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Calle, avenida o número de local..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingBranchId ? "Guardar Cambios" : "Crear Sucursal"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}