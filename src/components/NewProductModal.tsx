"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Plus, Package, UploadCloud, Trash2 } from "lucide-react";
import { BranchStock } from "@/app/inventario/page";

export interface NewProductFormData {
  sku: string;
  barcode?: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  cost: number;
  price: number;
  image?: string;
  branches: BranchStock[];
}

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: NewProductFormData) => void;
}

const CATEGORIES = [
  "Resins",
  "Endo",
  "Ortho",
  "Instruments",
  "Disposables",
] as const;

export default function NewProductModal({
  isOpen,
  onClose,
  onSave,
}: NewProductModalProps) {
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cerrar al presionar Escape y bloquear scroll de fondo
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCleanClose = useCallback(() => {
    setSku("");
    setBarcode("");
    setName("");
    setCategory(CATEGORIES[0]);
    setDescription("");
    setCost("");
    setPrice("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
    onClose();
  }, [onClose]);

  // Manejo de carga de imagen local (Base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("El archivo seleccionado debe ser una imagen (.png, .jpg, .webp)[cite: 1].");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numCost = parseFloat(cost);
    const numPrice = parseFloat(price);

    if (!sku.trim() || !name.trim() || !description.trim()) {
      setError("Por favor completa los campos obligatorios (*).");
      return;
    }

    if (isNaN(numCost) || numCost < 0 || isNaN(numPrice) || numPrice < 0) {
      setError("Ingresa valores monetarios válidos.");
      return;
    }

    const initialBranches: BranchStock[] = [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 0, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 0, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 0, phone: "2451-9012" },
    ];

    onSave({
      sku: sku.trim().toUpperCase(),
      barcode: barcode.trim() || undefined,
      name: name.trim(),
      brand: "Genérico",
      category,
      description: description.trim(),
      cost: numCost,
      price: numPrice,
      image: imagePreview || undefined,
      branches: initialBranches,
    });

    handleCleanClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleCleanClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Cabecera */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Registrar Nuevo Producto
              </h3>
              <p className="text-[11px] text-slate-400">
                Alta de artículo para catálogo comercial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCleanClose}
            aria-label="Cerrar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Formulario con scroll independiente */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-semibold">
              {error}
            </div>
          )}

          {/* Área de Carga / Previsualización de Imagen */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Fotografía del Producto
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-slate-50/50 hover:bg-sky-50/20 transition-all text-slate-400 hover:text-sky-600"
              >
                <UploadCloud className="w-5 h-5 stroke-[1.5]" />
                <span className="text-xs font-medium">
                  Haz clic para subir la imagen del artículo[cite: 1]
                </span>
                <span className="text-[10px] text-slate-400">
                  PNG, JPG o WEBP (máx. 2MB)[cite: 1]
                </span>
              </div>
            )}
          </div>

          {/* Fila 1: Código/SKU y Código de Barras */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Código / SKU *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. RS-5520"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Código de Barras
              </label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Escanea o escribe código..."
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Fila 2: Nombre del Producto */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Resina Fluida Bulk Fill"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          {/* Fila 3: Categoría y Descripción */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Descripción *
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Jeringa (2g) / Caja (50 pcs)"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Fila 4: Costo y Precio de Venta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Costo Unitario ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-9 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Precio de Venta ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-9 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Pie de acciones */}
          <footer className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleCleanClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0284C7] hover:bg-sky-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Producto</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}