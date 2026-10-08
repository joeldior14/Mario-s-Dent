"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import {
  fetchBranchesFromDB,
  createBranchInDB,
  updateBranchInDB,
  toggleBranchStatusInDB,
  deleteBranchFromDB,
  BranchRecord,
} from "@/app/services/inventoryService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BranchManagementModal({ isOpen, onClose, onSuccess }: Props) {
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    address: "",
  });

  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await fetchBranchesFromDB();
      setBranches(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar sucursales";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga asíncrona segura sin cascading renders
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const executeLoad = async () => {
      if (isMounted) {
        await loadBranches();
      }
    };

    executeLoad();

    return () => {
      isMounted = false;
    };
  }, [isOpen, loadBranches]);

  const handleCloseModal = () => {
    setShowForm(false);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setEditingBranchId(null);
    setFormData({ name: "", code: "", phone: "", address: "" });
    setErrorMessage(null);
    setShowForm(true);
  };

  const handleOpenEdit = (branch: BranchRecord) => {
    setEditingBranchId(branch.id);
    setFormData({
      name: branch.name,
      code: branch.code,
      phone: branch.phone === "Sin teléfono" ? "" : branch.phone,
      address: branch.address === "Sin dirección registrada" ? "" : branch.address,
    });
    setErrorMessage(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert("El nombre y el código de la sucursal son obligatorios.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      if (editingBranchId) {
        await updateBranchInDB(editingBranchId, formData);
      } else {
        await createBranchInDB(formData);
      }

      await loadBranches();
      setShowForm(false);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar la sucursal";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleActive = async (branch: BranchRecord) => {
    try {
      setIsProcessing(true);
      await toggleBranchStatusInDB(branch.id, branch.isActive);
      setBranches((prev) =>
        prev.map((b) => (b.id === branch.id ? { ...b, isActive: !b.isActive } : b))
      );
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al alternar estado";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar la sucursal "${name}"?`)) return;

    try {
      setIsProcessing(true);
      await deleteBranchFromDB(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar la sucursal";
      alert(msg);
    } finally {
      setIsProcessing(false);
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
              <h2 className="text-sm font-bold text-sky-600">
                Gestión de Sucursales
              </h2>
              <p className="text-xs text-slate-700">
                Administración de sedes y puntos de venta de Mario&apos;s Dent
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notificación de Error */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Contenido / Lista y Formulario */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
              <span className="text-xs">Cargando sucursales desde la base de datos...</span>
            </div>
          ) : !showForm ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {branches.length} sucursales registradas
                </span>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] tabular-nums font-bold">
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
                        disabled={isProcessing}
                        onClick={() => handleToggleActive(branch)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
                          branch.isActive
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {branch.isActive ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => handleOpenEdit(branch)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => handleDelete(branch.id, branch.name)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
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
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-sky-700 uppercase">
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
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400 tabular-nums uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-sky-700 uppercase">
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
                <label className="text-[11px] font-bold text-sky-700 uppercase">
                  Dirección
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
                  disabled={isProcessing}
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBranchId ? "Guardar Cambios" : "Crear Sucursal"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}