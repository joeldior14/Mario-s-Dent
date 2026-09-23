"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HaciendaReportModal from "@/components/ReporteHaciendaModal";
import DeleteProductModal from "@/components/BorrarProductoModal";
import EditProductModal, { EditProductFormData } from "@/components/EditarProductoModal";
import ProductHistoryModal from "@/components/HistorialProductoModal";
import NewProductModal, { NewProductFormData } from "@/components/NewProductModal";
import TransferStockModal from "@/components/TransferStockModal";
import BranchStockModal from "@/components/BranchStockModal";
import StockAdjustmentModal from "@/components/AjusteStockModal";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { 
  createProductInDB, 
  adjustProductStockInDB, 
  updateProductInDB, 
  transferProductStockInDB 
} from "@/app/services/inventoryService";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Building2,
  Store,
  ArrowRightLeft,
  History,
  SlidersHorizontal,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  PackageX,
} from "lucide-react";

export interface BranchStock {
  branchId: "santa-ana" | "ahuachapan" | "sonsonate";
  branchName: string;
  stock: number;
  phone: string;
}

export interface InventoryItem {
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

interface DBBranchRelation {
  id: string;
  name: string;
  phone: string | null;
}

interface DBBranchInventoryItem {
  stock: number;
  branches: DBBranchRelation | null;
}

interface DBProductQuery {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  brand: string;
  category: string;
  description: string;
  cost: number;
  price: number;
  image_url?: string | null;
  branch_inventory?: DBBranchInventoryItem[] | null;
}

export default function InventoryPage() {
  const { user } = useAuth();

  const currentUser = user || {
    name: "Mario Administrador",
    role: "admin" as "admin" | "cashier",
    branch: "Santa Ana" as "Santa Ana" | "Ahuachapán" | "Sonsonate",
  };

  const isAdmin = currentUser.role === "admin";

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedBranch, setSelectedBranch] = useState<string>(
    isAdmin ? "Santa Ana" : currentUser.branch
  );

  // Modales
  const [isHaciendaModalOpen, setIsHaciendaModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<InventoryItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [historyProduct, setHistoryProduct] = useState<InventoryItem | null>(null);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<InventoryItem | null>(null);

  const loadInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select(`
          id,
          sku,
          barcode,
          name,
          brand,
          category,
          description,
          cost,
          price,
          image_url,
          branch_inventory (
            stock,
            branches (
              id,
              name,
              phone
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const queryData = (data ?? []) as unknown as DBProductQuery[];

      const formatted: InventoryItem[] = queryData.map((item) => ({
        id: item.id,
        sku: item.sku,
        barcode: item.barcode,
        name: item.name,
        brand: item.brand,
        category: item.category,
        description: item.description,
        cost: Number(item.cost),
        price: Number(item.price),
        image: item.image_url ?? undefined,
        branches: (item.branch_inventory ?? []).map((bi) => {
          const branchName = bi.branches?.name ?? "Sin sede";
          const branchSlug = branchName
            .toLowerCase()
            .replace(/á/g, "a")
            .replace(/ /g, "-") as "santa-ana" | "ahuachapan" | "sonsonate";

          return {
            branchId: branchSlug,
            branchName,
            stock: bi.stock ?? 0,
            phone: bi.branches?.phone ?? "",
          };
        }),
      }));

      setItems(formatted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar el inventario";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initLoad = async () => {
      if (isMounted) {
        await loadInventory();
      }
    };

    initLoad();

    return () => {
      isMounted = false;
    };
  }, [loadInventory]);

  const handleUpdateProduct = useCallback(
    async (updated: EditProductFormData) => {
      await updateProductInDB({
        id: updated.id,
        sku: updated.sku,
        barcode: updated.barcode,
        name: updated.name,
        brand: updated.brand,
        category: updated.category,
        description: updated.description,
        cost: updated.cost,
        price: updated.price,
        image: updated.image,
        branches: updated.branches,
      });

      // Refrescar el inventario en tiempo real desde Supabase
      await loadInventory();
    },
    [loadInventory]
  );

  const handleSaveNewProduct = useCallback(
    async (newProd: NewProductFormData) => {
      try {
        setIsLoading(true);

        const prodWithStock = newProd as unknown as {
          stockSantaAna?: number;
          stockAhuachapan?: number;
          stockSonsonate?: number;
          stock?: number;
        };

        await createProductInDB({
          sku: newProd.sku,
          barcode: newProd.barcode,
          name: newProd.name,
          brand: newProd.brand || "Genérico",
          category: newProd.category,
          description: newProd.description || "",
          cost: Number(newProd.cost),
          price: Number(newProd.price),
          image: newProd.image,
          initialStock: {
            santaAna: prodWithStock.stockSantaAna ?? prodWithStock.stock ?? 0,
            ahuachapan: prodWithStock.stockAhuachapan ?? 0,
            sonsonate: prodWithStock.stockSonsonate ?? 0,
          },
        });

        await loadInventory();
        setIsNewProductOpen(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error al registrar el producto";
        alert(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [loadInventory]
  );

  const handleConfirmTransfer = useCallback(
    async (
      productId: string,
      sourceBranch: string,
      targetBranch: string,
      qty: number
    ) => {
      await transferProductStockInDB({
        productId,
        sourceBranchName: sourceBranch,
        targetBranchName: targetBranch,
        quantity: qty,
        userId: user?.id,
      });

      // Refrescar existencias reales en vivo
      await loadInventory();
    },
    [user?.id, loadInventory]
  );

  const getStockDisplay = useCallback(
    (item: InventoryItem) => {
      const branchToLookup = isAdmin ? selectedBranch : currentUser.branch;

      if (isAdmin && branchToLookup === "ALL") {
        return item.branches.reduce((acc, curr) => acc + curr.stock, 0);
      }
      return item.branches.find((b) => b.branchName === branchToLookup)?.stock ?? 0;
    },
    [isAdmin, selectedBranch, currentUser.branch]
  );

  const getOtherBranchesStock = useCallback(
    (item: InventoryItem) => {
      const currentBaseBranch = isAdmin ? selectedBranch : currentUser.branch;
      return item.branches
        .filter((b) => b.branchName !== currentBaseBranch)
        .reduce((acc, curr) => acc + curr.stock, 0);
    },
    [isAdmin, selectedBranch, currentUser.branch]
  );

  const handleConfirmAdjustment = useCallback(
    async (type: "add" | "remove", quantity: number, reason: string) => {
      if (!adjustingProduct) return;

      const targetBranch = selectedBranch === "ALL" ? "Santa Ana" : selectedBranch;

      await adjustProductStockInDB({
        productId: adjustingProduct.id,
        branchName: targetBranch,
        type,
        quantity,
        reason,
        userId: user?.id,
      });
      // Refrescar el inventario completo desde la base de datos
      await loadInventory();
    },
    [adjustingProduct, selectedBranch, user?.id, loadInventory]
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deletingProduct) return;
    setItems((prev) => prev.filter((it) => it.id !== deletingProduct.id));
    setDeletingProduct(null);
  }, [deletingProduct]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Coincidencia por texto en buscador
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        (item.barcode && item.barcode.toLowerCase().includes(q));

      // 2. Coincidencia por categoría (Ignora si es "All" o "Todas las categorías")
      const matchCategory =
        !category ||
        category === "All" ||
        category === "Todas las categorías" ||
        item.category?.toLowerCase() === category.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [items, search, category]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* BARRA SUPERIOR DE ACCIONES */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1">
            {/* Buscador */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por SKU, código de barras o producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[38px] pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs transition-colors"
              />
            </div>

            {/* Selector de Categorías */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none h-[38px] bg-white border border-slate-200 rounded-xl pl-3.5 pr-8 text-xs font-semibold text-slate-600 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer"
              >
                <option value="All">Todas las categorías</option>
                <option value="Resinas">Resinas</option>
                <option value="Endo">Endo</option>
                <option value="Orto">Orto</option>
                <option value="Instrumentos">Instrumentos</option>
                <option value="Desechables">Productos Desechables</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Selector de Sucursal */}
            {isAdmin ? (
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl pl-3 pr-8 h-[38px] shadow-2xs hover:border-slate-300 transition-colors">
                <Store className="w-3.5 h-3.5 text-sky-600 mr-2 shrink-0" />
                <div className="flex flex-col justify-center text-left leading-none pointer-events-none">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                    Vista de Red
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {selectedBranch === "ALL" ? "Todas las sedes" : selectedBranch}
                  </span>
                </div>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="appearance-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="Santa Ana">Santa Ana</option>
                  <option value="Ahuachapán">Ahuachapán</option>
                  <option value="Sonsonate">Sonsonate</option>
                  <option value="ALL">Todas las sucursales (Consolidado)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-xl px-3 h-[38px] shadow-2xs select-none">
                <Store className="w-4 h-4 text-sky-600 mr-2 shrink-0" />
                <div className="flex flex-col justify-center text-left leading-none">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                    Sucursal Asignada
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {currentUser.branch}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* BOTONES DE ACCIÓN (Exclusivos para Administrador) */}
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsHaciendaModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 h-[38px] bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reporte Hacienda</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTransferModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 h-[38px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
                <span>Traslado de Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNewProductOpen(true)}
                className="flex items-center gap-1.5 px-4 h-[38px] bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          )}
        </div>

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TABLA DE INVENTARIO */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2.5">
              <Loader2 className="w-7 h-7 animate-spin text-sky-600" />
              <span className="text-xs font-medium">Cargando inventario de sucursales...</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3.5 px-6">SKU / Barcode</th>
                  <th className="py-3.5 px-4">Producto / Marca</th>
                  <th className="py-3.5 px-4">Descripción</th>
                  <th className="py-3.5 px-4">Categoría</th>

                  {isAdmin && selectedBranch === "ALL" ? (
                    <>
                      <th className="py-3.5 px-3 text-center">Santa Ana</th>
                      <th className="py-3.5 px-3 text-center">Ahuachapán</th>
                      <th className="py-3.5 px-3 text-center">Sonsonate</th>
                      <th className="py-3.5 px-4 text-center font-black text-sky-700">Total Red</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3.5 px-4 text-center">
                        Stock ({isAdmin ? selectedBranch : currentUser.branch})
                      </th>
                      <th className="py-3.5 px-4 text-center">Otras Sucursales</th>
                    </>
                  )}

                  {/* Columna de Costo: EXCLUSIVA de Admin */}
                  {isAdmin && <th className="py-3.5 px-4 text-right">Costo</th>}

                  <th className="py-3.5 px-4 text-right">Precio Venta</th>
                  {isAdmin && <th className="py-3.5 px-6 text-right">Acciones</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {filteredItems.map((item) => {
                  const currentStock = getStockDisplay(item);
                  const otherStock = getOtherBranchesStock(item);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <p className="font-mono text-xs font-semibold text-slate-700">{item.sku}</p>
                        {item.barcode && (
                          <p className="font-mono text-[10px] text-slate-400 leading-none mt-0.5">
                            {item.barcode}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.brand}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">{item.description}</td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                          {item.category}
                        </span>
                      </td>

                      {/* COLUMNAS DE STOCK */}
                      {isAdmin && selectedBranch === "ALL" ? (
                        <>
                          <td className="py-3.5 px-3 text-center font-mono font-medium">
                            {item.branches.find((b) => b.branchId === "santa-ana")?.stock ?? 0}
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-medium">
                            {item.branches.find((b) => b.branchId === "ahuachapan")?.stock ?? 0}
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-medium">
                            {item.branches.find((b) => b.branchId === "sonsonate")?.stock ?? 0}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              {currentStock}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`font-bold tabular-nums px-2 py-0.5 rounded-md ${
                                currentStock === 0
                                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                                  : currentStock <= 5
                                  ? "bg-amber-50 text-amber-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {currentStock === 0 ? "Agotado" : currentStock}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(item)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                otherStock > 0
                                  ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 cursor-pointer shadow-2xs active:scale-95"
                                  : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                              }`}
                            >
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{otherStock > 0 ? `${otherStock} en red` : "Sin stock"}</span>
                            </button>
                          </td>
                        </>
                      )}

                      {/* Celda de Costo: Oculta para cajeros */}
                      {isAdmin && (
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-500">
                          ${item.cost.toFixed(2)}
                        </td>
                      )}

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                        ${item.price.toFixed(2)}
                      </td>

                      {/* Acciones: Exclusivo Admin */}
                      {isAdmin && (
                        <td className="py-3.5 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {selectedBranch !== "ALL" && (
                              <button
                                type="button"
                                onClick={() => setAdjustingProduct(item)}
                                title="Ajustar existencias (Entrada / Salida)"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors shadow-2xs cursor-pointer mr-1"
                              >
                                <SlidersHorizontal className="w-3 h-3 text-sky-600" />
                                <span>± Stock</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setHistoryProduct(item)}
                              title="Auditar Kardex / Historial de Movimientos"
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingProduct(item)}
                              title="Editar producto"
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingProduct(item)}
                              title="Eliminar producto"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
              <PackageX className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">
                No hay productos en inventario
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm">
                {search || category !== "All"
                  ? "No se encontraron coincidencias para los filtros aplicados."
                  : "El catálogo está vacío. Utiliza el botón \"Nuevo Producto\" para comenzar a poblar la base de datos."}
              </p>
            </div>
          )}
        </div>

        {/* Modal de Stock en Otras Sucursales */}
        <BranchStockModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          currentBranch={isAdmin && selectedBranch !== "ALL" ? selectedBranch : currentUser.branch}
          product={selectedProduct}
        />

        {/* Modal de Ajuste de Stock */}
        {adjustingProduct && (
          <StockAdjustmentModal
            isOpen={!!adjustingProduct}
            onClose={() => setAdjustingProduct(null)}
            productName={adjustingProduct.name}
            sku={adjustingProduct.sku}
            branchName={selectedBranch === "ALL" ? "Santa Ana" : selectedBranch}
            currentStock={getStockDisplay(adjustingProduct)}
            onConfirm={handleConfirmAdjustment}
          />
        )}

        {/* Modales Admin */}
        {isAdmin && (
          <>
            <NewProductModal
              isOpen={isNewProductOpen}
              onClose={() => setIsNewProductOpen(false)}
              onSave={handleSaveNewProduct}
            />

            <TransferStockModal
              isOpen={isTransferModalOpen}
              onClose={() => setIsTransferModalOpen(false)}
              products={items}
              onConfirmTransfer={handleConfirmTransfer}
            />

            <ProductHistoryModal
              isOpen={!!historyProduct}
              onClose={() => setHistoryProduct(null)}
              product={historyProduct}
              currentBranch={selectedBranch}
            />

            <EditProductModal
              isOpen={!!editingProduct}
              onClose={() => setEditingProduct(null)}
              product={editingProduct}
              onSave={handleUpdateProduct}
            />

            <DeleteProductModal
              isOpen={!!deletingProduct}
              onClose={() => setDeletingProduct(null)}
              onConfirm={handleConfirmDelete}
              product={deletingProduct}
            />

            <HaciendaReportModal
              isOpen={isHaciendaModalOpen}
              onClose={() => setIsHaciendaModalOpen(false)}
              products={items}
            />
          </>
        )}
      </main>
    </div>
  );
}