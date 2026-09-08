"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, Plus, PackagePlus, AlertCircle, UploadCloud, Trash2 } from "lucide-react";

interface BranchStock {
  branchId: "santa-ana" | "ahuachapan" | "sonsonate";
  branchName: string;
  stock: number;
  phone: string;
}

export interface NewProductFormData {
  sku: string;
  name: string;
  brand: string;
  category: string;
  presentation: string;
  cost: number;
  price: number;
  image?: string; // <-- Campo para la URL o Base64 de la imagen
  branches: BranchStock[];
}

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: NewProductFormData) => void;
}

const CATEGORIES = ["Resins", "Endo", "Ortho", "Instruments", "Disposables"];

export default function NewProductModal({
  isOpen,
  onClose,
  onSave,
}: NewProductModalProps) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Resins");
  const [presentation, setPresentation] = useState("");
  const [cost, setCost] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  // Estado para la imagen (previsualización / carga)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stock inicial por sucursal
  const [stockSantaAna, setStockSantaAna] = useState<number | "">(0);
  const [stockAhuachapan, setStockAhuachapan] = useState<number | "">(0);
  const [stockSonsonate, setStockSonsonate] = useState<number | "">(0);

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Manejo de carga de archivo
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("El archivo seleccionado debe ser una imagen (.png, .jpg, .webp).");
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

    if (!sku.trim() || !name.trim() || !brand.trim() || !presentation.trim()) {
      setError("Por favor completa los datos obligatorios del producto.");
      return;
    }

    if (cost === "" || Number(cost) < 0 || price === "" || Number(price) < 0) {
      setError("Ingresa valores de costo y precio válidos.");
      return;
    }

    const newProduct: NewProductFormData = {
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      brand: brand.trim(),
      category,
      presentation: presentation.trim(),
      cost: Number(cost),
      price: Number(price),
      image: imagePreview || undefined,
      branches: [
        {
          branchId: "santa-ana",
          branchName: "Santa Ana",
          stock: Number(stockSantaAna) || 0,
          phone: "2440-1234",
        },
        {
          branchId: "ahuachapan",
          branchName: "Ahuachapán",
          stock: Number(stockAhuachapan) || 0,
          phone: "2413-5678",
        },
        {
          branchId: "sonsonate",
          branchName: "Sonsonate",
          stock: Number(stockSonsonate) || 0,
          phone: "2451-9012",
        },
      ],
    };

    onSave(newProduct);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSku("");
    setName("");
    setBrand("");
    setCategory("Resins");
    setPresentation("");
    setCost("");
    setPrice("");
    setImagePreview(null);
    setStockSantaAna(0);
    setStockAhuachapan(0);
    setStockSonsonate(0);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                Registrar Nuevo Producto
              </h3>
              <p className="text-[11px] text-slate-500">
                Alta de artículo e inventario inicial en la red
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-semibold text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Carga de Imagen del Producto */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
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
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 transition-opacity shadow-xs"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-sky-50/20 transition-all text-slate-400 hover:text-sky-600"
              >
                <UploadCloud className="w-6 h-6 stroke-[1.5]" />
                <span className="text-xs font-medium">
                  Haz clic para subir la imagen del artículo
                </span>
                <span className="text-[10px] text-slate-400">
                  PNG, JPG o WEBP (máx. 2MB)
                </span>
              </div>
            )}
          </div>

          {/* Fila 1: SKU y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Código / SKU *
              </label>
              <input
                type="text"
                placeholder="Ej. RS-5520"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-sky-500 shadow-2xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Nombre del producto */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              placeholder="Ej. Resina Fluida Bulk Fill"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* Fila 3: Marca y Presentación */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Marca / Fabricante *
              </label>
              <input
                type="text"
                placeholder="Ej. 3M ESPE"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Presentación *
              </label>
              <input
                type="text"
                placeholder="Ej. Jeringa (2g) / Caja (50 pcs)"
                value={presentation}
                onChange={(e) => setPresentation(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Fila 4: Costo y Precio de Venta */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Costo Unitario ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={cost}
                onChange={(e) =>
                  setCost(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Precio de Venta ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Fila 5: Stock Inicial por Sucursal */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Existencias Iniciales por Sucursal
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="block text-[11px] font-bold text-slate-700 mb-1 truncate">
                  Santa Ana
                </span>
                <input
                  type="number"
                  min="0"
                  value={stockSantaAna}
                  onChange={(e) =>
                    setStockSantaAna(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-center focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="block text-[11px] font-bold text-slate-700 mb-1 truncate">
                  Ahuachapán
                </span>
                <input
                  type="number"
                  min="0"
                  value={stockAhuachapan}
                  onChange={(e) =>
                    setStockAhuachapan(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-center focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="block text-[11px] font-bold text-slate-700 mb-1 truncate">
                  Sonsonate
                </span>
                <input
                  type="number"
                  min="0"
                  value={stockSonsonate}
                  onChange={(e) =>
                    setStockSonsonate(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-center focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar Producto</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}