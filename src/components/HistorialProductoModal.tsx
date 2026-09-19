"use client";

import React, { useState, useEffect, useId, useCallback } from "react";
import {
  X,
  History,
  ShoppingCart,
  ArrowRightLeft,
  ArrowDownLeft,
  ShieldAlert,
  SlidersHorizontal,
  Globe2,
  Store,
  Loader2,
  AlertCircle,
  PackageOpen,
} from "lucide-react";
import { fetchProductKardex, KardexMovementRecord } from "@/app/services/inventoryService";

interface ProductHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch?: string; // "Santa Ana", "Ahuachapán", "Sonsonate" o "ALL"
  product: {
    id?: string;
    sku: string;
    name: string;
    brand: string;
  } | null;
}

export default function ProductHistoryModal({
  isOpen,
  onClose,
  currentBranch = "Santa Ana",
  product,
}: ProductHistoryModalProps) {
  const isGlobalBranch = currentBranch === "ALL" || currentBranch === "Todas las sedes";
  
  const [movements, setMovements] = useState<KardexMovementRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAllOverride, setShowAllOverride] = useState<boolean>(false);

  const modalId = useId();
  const isViewingAll = isGlobalBranch || showAllOverride;

  // Extraemos la variable primitiva para preservar la memorización en React 19
  const productId = product?.id;

  const loadMovements = useCallback(async () => {
    if (!productId) {
      setMovements([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const filterBranch = isViewingAll ? undefined : currentBranch;
      const data = await fetchProductKardex(productId, filterBranch);
      setMovements(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar movimientos de Kardex";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [productId, isViewingAll, currentBranch]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchAsync = async () => {
      if (isMounted) {
        await loadMovements();
      }
    };

    fetchAsync();

    return () => {
      isMounted = false;
    };
  }, [isOpen, loadMovements]);

  // handleClose declarado en el cuerpo del componente antes del guard return
  const handleClose = () => {
    setShowAllOverride(false);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalId}-title`}
    >
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id={`${modalId}-title`} className="text-sm font-bold text-slate-800 leading-tight">
                  Kardex y Trazabilidad de Stock
                </h3>
                <span className="font-mono text-[10px] bg-slate-200/80 font-bold text-slate-700 px-1.5 py-0.5 rounded">
                  {product.sku}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {product.name} • <span className="text-slate-600 font-medium">{product.brand}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de contexto y filtro */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Store className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>
              Mostrando movimientos de:{" "}
              <strong className="text-slate-800">
                {isViewingAll ? "Toda la Red (Consolidado)" : currentBranch}
              </strong>
            </span>
          </div>

          {isGlobalBranch ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <Globe2 className="w-3.5 h-3.5" />
              Vista Global Automática
            </span>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 hover:border-sky-400 px-3 py-1.5 rounded-xl shadow-2xs transition-all">
              <input
                type="checkbox"
                checked={showAllOverride}
                onChange={(e) => setShowAllOverride(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-sky-600" />
                Ver todas las sucursales
              </span>
            </label>
          )}
        </div>

        {/* Alerta de error si ocurre */}
        {errorMessage && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tabla de movimientos */}
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
              <span className="text-xs font-medium">Cargando registros de auditoría...</span>
            </div>
          ) : movements.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2 bg-slate-50/30">
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Operación</th>
                  <th className="py-2.5 px-3">Sede / Responsable</th>
                  <th className="py-2.5 px-3 text-right">Cantidad</th>
                  <th className="py-2.5 px-3 text-right">Saldo</th>
                  <th className="py-2.5 px-3">Comprobante / Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {movements.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="py-2.5 px-3">
                      {row.type === "VENTA_POS" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                          <ShoppingCart className="w-3 h-3" /> Venta POS
                        </span>
                      )}
                      {row.type === "TRASLADO" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md text-[11px]">
                          <ArrowRightLeft className="w-3 h-3" /> Traslado
                        </span>
                      )}
                      {row.type === "INGRESO" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md text-[11px]">
                          <ArrowDownLeft className="w-3 h-3" /> Ingreso
                        </span>
                      )}
                      {row.type === "AJUSTE" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                          <SlidersHorizontal className="w-3 h-3" /> Ajuste
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-800 text-[11px]">{row.branch}</p>
                      <p className="text-[10px] text-slate-400">{row.user}</p>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <span className={row.quantity < 0 ? "text-rose-600" : "text-emerald-600"}>
                        {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                      {row.stockAfter}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 font-mono">
                      {row.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
              <PackageOpen className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Sin movimientos registrados</p>
              <p className="text-[11px] text-slate-400">
                No hay ingresos, traslados ni ajustes asentados para este producto en{" "}
                {isViewingAll ? "ninguna sucursal" : currentBranch}.
              </p>
            </div>
          )}
        </div>

        {/* Pie de auditoría */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-[11px]">
              Registro de auditoría contable inalterable en PostgreSQL.
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}