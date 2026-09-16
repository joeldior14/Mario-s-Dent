"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check, Pencil, AlertCircle, UploadCloud, Trash2 } from "lucide-react";

interface BranchStock {
  branchId: "santa-ana" | "ahuachapan" | "sonsonate";
  branchName: string;
  stock: number;
  phone: string;
}

export interface EditProductFormData {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  cost: number;
  price: number;
  image?: string;
  branches: BranchStock[];
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: EditProductFormData | null;
  onSave: (updatedProduct: EditProductFormData) => void;
}

const CATEGORIES = ["Resins", "Endo", "Ortho", "Instruments", "Disposables"];

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSave,
}: EditProductModalProps) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Resins");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stockSantaAna, setStockSantaAna] = useState<number | "">(0);
  const [stockAhuachapan, setStockAhuachapan] = useState<number | "">(0);
  const [stockSonsonate, setStockSonsonate] = useState<number | "">(0);

  const [error, setError] = useState<string | null>(null);

  // Cargar datos del producto al abrir
  useEffect(() => {
    if (product && isOpen) {
      setSku(product.sku || "");
      setName(product.name || "");
      setBrand(product.brand || "");
      setCategory(product.category || "Resins");
      setDescription(product.description || "");
      setCost(product.cost ?? "");
      setPrice(product.price ?? "");
      setImagePreview(product.image || null);

      const sa = product.branches.find((b) => b.branchId === "santa-ana")?.stock ?? 0;
      const ah = product.branches.find((b) => b.branchId === "ahuachapan")?.stock ?? 0;
      const so = product.branches.find((b) => b.branchId === "sonsonate")?.stock ?? 0;

      setStockSantaAna(sa);
      setStockAhuachapan(ah);
      setStockSonsonate(so);
      setError(null);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("El archivo seleccionado debe ser una imagen válida (.png, .jpg, .webp).");
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

    if (!sku.trim() || !name.trim() || !brand.trim() || !description.trim()) {
      setError("Por favor completa los campos obligatorios del producto.");
      return;
    }

    if (cost === "" || Number(cost) < 0 || price === "" || Number(price) < 0) {
      setError("Ingresa valores numéricos válidos para costo y precio.");
      return;
    }

    const updatedData: EditProductFormData = {
      id: product.id,
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      brand: brand.trim(),
      category,
      description: description.trim(),
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

    onSave(updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                Editar Ficha de Producto
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                SKU: {product.sku}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-semibold text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Fotografía del Producto */}
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
                <span className="text-xs font-medium">Subir o actualizar imagen</span>
                <span className="text-[10px] text-slate-400">PNG, JPG o WEBP</span>
              </div>
            )}
          </div>

          {/* SKU y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Código / SKU *
              </label>
              <input
                type="text"
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

          {/* Nombre del Producto */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* Marca y Presentación */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Marca / Fabricante *
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Descripción *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Costo y Precio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Costo Unitario ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
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
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Botonera */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}