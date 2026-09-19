"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { X, ArrowRightLeft, CheckCircle2, Search, ChevronDown, Loader2 } from "lucide-react";
import { InventoryItem } from "@/app/inventario/page";

interface TransferStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryItem[];
  onConfirmTransfer: (
    productId: string,
    sourceBranch: string,
    targetBranch: string,
    quantity: number
  ) => Promise<void> | void;
}

const BRANCHES = ["Santa Ana", "Ahuachapán", "Sonsonate"] as const;

export default function TransferStockModal({
  isOpen,
  onClose,
  products,
  onConfirmTransfer,
}: TransferStockModalProps) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [sourceBranch, setSourceBranch] = useState("Sonsonate");
  const [targetBranch, setTargetBranch] = useState("Santa Ana");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCleanClose = useCallback(() => {
    if (isTransferring) return;
    setSelectedProductId("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    setError(null);
    setQuantity(1);
    onClose();
  }, [onClose, isTransferring]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCleanClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleCleanClose]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchBrand = p.brand.toLowerCase().includes(query);
      const matchSku = p.sku.toLowerCase().includes(query);
      const matchBarcode = p.barcode ? p.barcode.toLowerCase().includes(query) : false;
      return matchName || matchBrand || matchSku || matchBarcode;
    });
  }, [products, searchTerm]);

  const currentProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  const availableInSource = useMemo(() => {
    if (!currentProduct) return 0;
    return (
      currentProduct.branches.find((b) => b.branchName === sourceBranch)?.stock ?? 0
    );
  }, [currentProduct, sourceBranch]);

  const handleSelectProduct = (prod: InventoryItem) => {
    setSelectedProductId(prod.id);
    setSearchTerm(`${prod.sku} - ${prod.name} (${prod.brand})`);
    setIsDropdownOpen(false);
    setError(null);
  };

  const handleTransfer = async () => {
    if (!selectedProductId) {
      setError("Por favor escribe y selecciona un producto a trasladar.");
      return;
    }
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

    try {
      setIsTransferring(true);
      setError(null);
      await onConfirmTransfer(selectedProductId, sourceBranch, targetBranch, quantity);
      handleCleanClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el traslado";
      setError(msg);
    } finally {
      setIsTransferring(false);
    }
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
        className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl overflow-visible flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Reabastecimiento de Sucursal</h3>
              <p className="text-[11px] text-slate-500">Mover existencias entre tiendas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCleanClose}
            disabled={isTransferring}
            aria-label="Cerrar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-5 space-y-4">
          {/* Selector con Autocompletado */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Producto a trasladar
            </label>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                disabled={isTransferring}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedProductId("");
                  setIsDropdownOpen(true);
                  setError(null);
                }}
                placeholder="Escribe el nombre, marca o SKU..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs transition-colors disabled:opacity-50"
              />
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Menú flotante de resultados filtrados */}
            {isDropdownOpen && (
              <div className="absolute z-60 left-0 right-0 mt-1 max-h-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-y-auto divide-y divide-slate-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const isSelected = p.id === selectedProductId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p)}
                        className={`w-full text-left px-3 py-2.5 text-xs transition-colors flex items-center justify-between hover:bg-sky-50 cursor-pointer ${
                          isSelected ? "bg-sky-50/70 font-bold text-sky-700" : "text-slate-700"
                        }`}
                      >
                        <div>
                          <span className="font-mono font-semibold text-[11px] text-slate-500 mr-1.5">
                            [{p.sku}]
                          </span>
                          <span>{p.name}</span>
                          <span className="text-slate-400 text-[10px] ml-1.5">({p.brand})</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No se encontraron coincidencias para &quot;{searchTerm}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Origen y Destino */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Desde (Origen)
              </label>
              <select
                value={sourceBranch}
                disabled={isTransferring}
                onChange={(e) => {
                  setSourceBranch(e.target.value);
                  setError(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Disp:{" "}
                <strong className={selectedProductId ? "text-slate-700" : "text-slate-400"}>
                  {selectedProductId ? availableInSource : "—"}
                </strong>{" "}
                unids.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Hacia (Destino)
              </label>
              <select
                value={targetBranch}
                disabled={isTransferring}
                onChange={(e) => {
                  setTargetBranch(e.target.value);
                  setError(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
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
              max={availableInSource > 0 ? availableInSource : undefined}
              value={quantity}
              disabled={isTransferring}
              onChange={(e) => {
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 0));
                setError(null);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl animate-in fade-in duration-150">
              {error}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCleanClose}
            disabled={isTransferring}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            disabled={isTransferring || !selectedProductId}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTransferring ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{isTransferring ? "Trasladando..." : "Confirmar Traslado"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}