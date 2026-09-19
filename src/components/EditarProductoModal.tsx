"use client";

import React, { useState, useRef, useId } from "react";
import Image from "next/image";
import {
  X,
  Check,
  Pencil,
  AlertCircle,
  UploadCloud,
  Trash2,
  Loader2,
} from "lucide-react";

export interface BranchStock {
  branchId: "santa-ana" | "ahuachapan" | "sonsonate";
  branchName: string;
  stock: number;
  phone: string;
}

export interface EditProductFormData {
  id: string;
  sku: string;
  barcode?: string | null;
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
  onSave: (updatedProduct: EditProductFormData) => Promise<void> | void;
}

const CATEGORIES = ["Resins", "Endo", "Ortho", "Instruments", "Disposables"];

function EditProductFormContent({
  product,
  onClose,
  onSave,
}: {
  product: EditProductFormData;
  onClose: () => void;
  onSave: (updatedProduct: EditProductFormData) => Promise<void> | void;
}) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sku, setSku] = useState<string>(product.sku || "");
  const [barcode, setBarcode] = useState<string>(product.barcode || "");
  const [name, setName] = useState<string>(product.name || "");
  const [brand, setBrand] = useState<string>(product.brand || "");
  const [category, setCategory] = useState<string>(product.category || CATEGORIES[0]);
  const [description, setDescription] = useState<string>(product.description || "");
  const [cost, setCost] = useState<number | "">(product.cost ?? "");
  const [price, setPrice] = useState<number | "">(product.price ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(product.image || null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estados de stock por sucursal
  const [stockSantaAna, setStockSantaAna] = useState<number | "">(
    product.branches.find((b) => b.branchId === "santa-ana")?.stock ?? 0
  );
  const [stockAhuachapan, setStockAhuachapan] = useState<number | "">(
    product.branches.find((b) => b.branchId === "ahuachapan")?.stock ?? 0
  );
  const [stockSonsonate, setStockSonsonate] = useState<number | "">(
    product.branches.find((b) => b.branchId === "sonsonate")?.stock ?? 0
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen válida (.png, .jpg, .webp).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe superar los 2MB de peso.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sku.trim() || !name.trim() || !brand.trim() || !description.trim()) {
      setError("Por favor completa los campos obligatorios del producto.");
      return;
    }

    const numericCost = typeof cost === "number" ? cost : parseFloat(cost);
    const numericPrice = typeof price === "number" ? price : parseFloat(price);

    if (isNaN(numericCost) || numericCost < 0 || isNaN(numericPrice) || numericPrice < 0) {
      setError("Ingresa valores monetarios numéricos válidos para costo y precio.");
      return;
    }

    const updatedData: EditProductFormData = {
      id: product.id,
      sku: sku.trim().toUpperCase(),
      barcode: barcode.trim() || null,
      name: name.trim(),
      brand: brand.trim(),
      category,
      description: description.trim(),
      cost: numericCost,
      price: numericPrice,
      image: imagePreview || undefined,
      branches: [
        {
          branchId: "santa-ana",
          branchName: "Santa Ana",
          stock: Math.max(0, Number(stockSantaAna) || 0),
          phone: "2440-1234",
        },
        {
          branchId: "ahuachapan",
          branchName: "Ahuachapán",
          stock: Math.max(0, Number(stockAhuachapan) || 0),
          phone: "2413-5678",
        },
        {
          branchId: "sonsonate",
          branchName: "Sonsonate",
          stock: Math.max(0, Number(stockSonsonate) || 0),
          phone: "2451-9012",
        },
      ],
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(updatedData);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar el producto";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Pencil className="w-4 h-4" />
          </div>
          <div>
            <h3 id={`${formId}-title`} className="text-sm font-bold text-slate-800 leading-tight">
              Editar Ficha de Producto
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">SKU: {product.sku}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
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

        {/* Carga de Imagen */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Fotografía del Producto
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            disabled={isSubmitting}
          />

          {imagePreview ? (
            <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full p-2">
                <Image
                  src={imagePreview}
                  alt="Vista previa"
                  fill
                  unoptimized={imagePreview.startsWith("data:")}
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isSubmitting}
                className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 transition-opacity shadow-xs cursor-pointer z-10 disabled:opacity-40"
                title="Eliminar imagen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className={`w-full h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-50/50 transition-all text-slate-400 ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-sky-400 hover:bg-sky-50/20 hover:text-sky-600 cursor-pointer"
              }`}
            >
              <UploadCloud className="w-5 h-5 stroke-[1.5]" />
              <span className="text-xs font-medium">Subir o actualizar imagen</span>
              <span className="text-[10px] text-slate-400">PNG, JPG o WEBP (Máx. 2MB)</span>
            </div>
          )}
        </div>

        {/* SKU y Código de Barras */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${formId}-sku`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Código / SKU *
            </label>
            <input
              id={`${formId}-sku`}
              type="text"
              value={sku}
              disabled={isSubmitting}
              onChange={(e) => setSku(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-sky-500 shadow-2xs uppercase disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`${formId}-barcode`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Código de Barras (EAN/UPC)
            </label>
            <input
              id={`${formId}-barcode`}
              type="text"
              value={barcode}
              disabled={isSubmitting}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Opcional / Lector"
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-sky-500 shadow-2xs disabled:opacity-50"
            />
          </div>
        </div>

        {/* Nombre y Categoría */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Nombre del Producto *
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={name}
              disabled={isSubmitting}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`${formId}-category`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Categoría *
            </label>
            <select
              id={`${formId}-category`}
              value={category}
              disabled={isSubmitting}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Marca y Descripción */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${formId}-brand`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Marca / Fabricante *
            </label>
            <input
              id={`${formId}-brand`}
              type="text"
              value={brand}
              disabled={isSubmitting}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`${formId}-desc`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Descripción *
            </label>
            <input
              id={`${formId}-desc`}
              type="text"
              value={description}
              disabled={isSubmitting}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs disabled:opacity-50"
              required
            />
          </div>
        </div>

        {/* Costo y Precio */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${formId}-cost`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Costo Unitario ($) *
            </label>
            <input
              id={`${formId}-cost`}
              type="number"
              step="0.01"
              min="0"
              value={cost}
              disabled={isSubmitting}
              onChange={(e) =>
                setCost(e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-sky-500 shadow-2xs disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`${formId}-price`}
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Precio de Venta ($) *
            </label>
            <input
              id={`${formId}-price`}
              type="number"
              step="0.01"
              min="0"
              value={price}
              disabled={isSubmitting}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs disabled:opacity-50"
              required
            />
          </div>
        </div>

        {/* Existencias por Sucursal */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Existencias por Sucursal
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-semibold mb-1">
                Santa Ana
              </span>
              <input
                type="number"
                min="0"
                value={stockSantaAna}
                disabled={isSubmitting}
                onChange={(e) =>
                  setStockSantaAna(
                    e.target.value === "" ? "" : parseInt(e.target.value, 10)
                  )
                }
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-semibold mb-1">
                Ahuachapán
              </span>
              <input
                type="number"
                min="0"
                value={stockAhuachapan}
                disabled={isSubmitting}
                onChange={(e) =>
                  setStockAhuachapan(
                    e.target.value === "" ? "" : parseInt(e.target.value, 10)
                  )
                }
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-semibold mb-1">
                Sonsonate
              </span>
              <input
                type="number"
                min="0"
                value={stockSonsonate}
                disabled={isSubmitting}
                onChange={(e) =>
                  setStockSonsonate(
                    e.target.value === "" ? "" : parseInt(e.target.value, 10)
                  )
                }
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Botonera */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{isSubmitting ? "Actualizando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSave,
}: EditProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <EditProductFormContent
        key={product.id}
        product={product}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}