"use client";

import React from "react";
import { X, MapPin, Phone, Building2, AlertCircle } from "lucide-react";

interface BranchStock {
  branchId: "santa-ana" | "ahuachapan" | "sonsonate";
  branchName: string;
  stock: number;
  phone: string;
}

interface BranchStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: string; // Sucursal donde está el cajero (ej: "Santa Ana")
  product: {
    sku: string;
    name: string;
    brand: string;
    branches: BranchStock[];
  } | null;
}

export default function BranchStockModal({
  isOpen,
  onClose,
  currentBranch,
  product,
}: BranchStockModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              {product.sku}
            </span>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500">{product.brand}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de Sucursales */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>Disponibilidad en Red de Sucursales</span>
          </div>

          {product.branches.map((b) => {
            const isCurrent = b.branchName === currentBranch;
            const hasStock = b.stock > 0;

            return (
              <div
                key={b.branchId}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? "border-sky-200 bg-sky-50/40"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${isCurrent ? "text-sky-600" : "text-slate-400"}`} />
                    <span className="text-xs font-bold text-slate-800">
                      {b.branchName}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-sky-100 text-sky-700 rounded-md">
                        Tu tienda
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 pl-5">
                    <Phone className="w-3 h-3" />
                    <span>{b.phone}</span>
                  </div>
                </div>

                {/* Badge de Stock */}
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      hasStock
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}
                  >
                    {hasStock ? `${b.stock} disp.` : "Agotado"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie con sugerencia operativa */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Llama a la sucursal para apartar la pieza o coordinar el envío.</span>
        </div>
      </div>
    </div>
  );
}