"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: {
    id: string;
    sku: string;
    name: string;
    brand: string;
    branches?: { stock: number }[];
  } | null;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}: DeleteProductModalProps) {
  if (!isOpen || !product) return null;

  const totalStockInNetwork =
    product.branches?.reduce((acc, curr) => acc + curr.stock, 0) ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Cabecera de Alerta */}
        <div className="p-4 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950 leading-tight">
                Eliminar Producto
              </h3>
              <p className="text-[11px] text-rose-600/80 font-medium">
                Acción permanente del catálogo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo / Detalle del Producto */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <p className="leading-relaxed">
            ¿Estás seguro de que deseas eliminar este producto del sistema? Esta
            acción dará de baja el artículo en **todas las sucursales**.
          </p>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                {product.sku}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Existencia total:{" "}
                <strong className="text-slate-800 font-mono">
                  {totalStockInNetwork} unid.
                </strong>
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800 leading-snug">
              {product.name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Fabricante: {product.brand}
            </p>
          </div>

          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Si el producto tiene registros previos en el Kardex o ventas
              asociadas, se recomienda archivar en lugar de borrar para
              mantener la integridad contable.
            </span>
          </div>
        </div>

        {/* Botonera de Acción */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Definitivamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}