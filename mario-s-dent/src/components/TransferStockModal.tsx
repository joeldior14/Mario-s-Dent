"use client";

import React, { useState } from "react";
import { X, ArrowRightLeft, Building2, CheckCircle2 } from "lucide-react";

interface BranchStock {
  branchId: "santa-ana" | "ahuachapan" | "sonsonate";
  branchName: string;
  stock: number;
  phone: string;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  branches: BranchStock[];
}

interface TransferStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryItem[];
  onConfirmTransfer: (
    productId: string,
    sourceBranch: string,
    targetBranch: string,
    quantity: number
  ) => void;
}

export default function TransferStockModal({
  isOpen,
  onClose,
  products,
  onConfirmTransfer,
}: TransferStockModalProps) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [sourceBranch, setSourceBranch] = useState("Sonsonate");
  const [targetBranch, setTargetBranch] = useState("Santa Ana");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId);
  const availableInSource =
    currentProduct?.branches.find((b) => b.branchName === sourceBranch)?.stock ?? 0;

  const handleTransfer = () => {
    if (sourceBranch === targetBranch) {
      setError("La sucursal de origen y destino no pueden ser iguales.");
      return;
    }
    if (quantity <= 0) {
      setError("Ingresa una cantidad válida mayor a 0.");
      return;
    }
    if (quantity > availableInSource) {
      setError(`Stock insuficiente. Solo hay ${availableInSource} unidades en ${sourceBranch}.`);
      return;
    }

    setError(null);
    onConfirmTransfer(selectedProductId, sourceBranch, targetBranch, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Reabastecimiento de Sucursal</h3>
              <p className="text-[11px] text-slate-500">Mover existencias entre tiendas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-5 space-y-4">
          {/* Producto */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Producto a trasladar
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setError(null);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} - {p.name} ({p.brand})
                </option>
              ))}
            </select>
          </div>

          {/* Origen y Destino */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Desde (Origen)
              </label>
              <select
                value={sourceBranch}
                onChange={(e) => {
                  setSourceBranch(e.target.value);
                  setError(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer"
              >
                <option value="Santa Ana">Santa Ana</option>
                <option value="Ahuachapán">Ahuachapán</option>
                <option value="Sonsonate">Sonsonate</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Disp: <strong className="text-slate-700">{availableInSource}</strong> unids.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Hacia (Destino)
              </label>
              <select
                value={targetBranch}
                onChange={(e) => {
                  setTargetBranch(e.target.value);
                  setError(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer"
              >
                <option value="Santa Ana">Santa Ana</option>
                <option value="Ahuachapán">Ahuachapán</option>
                <option value="Sonsonate">Sonsonate</option>
              </select>
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Cantidad de unidades
            </label>
            <input
              type="number"
              min="1"
              max={availableInSource}
              value={quantity}
              onChange={(e) => {
                setQuantity(parseInt(e.target.value) || 0);
                setError(null);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>

          {error && (
            <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmar Traslado</span>
          </button>
        </div>

      </div>
    </div>
  );
}