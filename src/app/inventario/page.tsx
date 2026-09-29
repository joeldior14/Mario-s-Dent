"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Building2,
  Store,
  ArrowRightLeft,
  History,
  SlidersHorizontal,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  PackageX,
  Layers,
  Check,
  Building,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ArrowUpDown,
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

export type StockSortOrder = "NONE" | "DESC" | "ASC";

const CATEGORY_OPTIONS = [
  { value: "All", label: "Todas" },
  { value: "Resinas", label: "Resinas" },
  { value: "Endo", label: "Endodoncia" },
  { value: "Orto", label: "Ortodoncia" },
  { value: "Instrumentos", label: "Instrumentos" },
  { value: "Desechables", label: "Productos Desechables" },
];

const BRANCH_OPTIONS = [
  { value: "Santa Ana", label: "Santa Ana", desc: "Sede Matriz" },
  { value: "Ahuachapán", label: "Ahuachapán", desc: "Sucursal Occidente" },
  { value: "Sonsonate", label: "Sonsonate", desc: "Sucursal Occidente" },
  { value: "ALL", label: "Todas las sucursales", desc: "Consolidado" },
];

const SORT_OPTIONS: { value: StockSortOrder; label: string; desc: string }[] = [
  { value: "NONE", label: "Predeterminado", desc: "Sin orden por stock" },
  { value: "DESC", label: "Mayor stock", desc: "Descendente (Más unidades)" },
  { value: "ASC", label: "Menor stock", desc: "Ascendente (Críticos primero)" },
];

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

  // Ordenamiento por stock
  const [stockSort, setStockSort] = useState<StockSortOrder>("NONE");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Estados y referencias para los dropdowns personalizados
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  // Paginación (10 productos por página)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modales
  const [isHaciendaModalOpen, setIsHaciendaModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<InventoryItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [historyProduct, setHistoryProduct] = useState<InventoryItem | null>(null);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<InventoryItem | null>(null);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setIsCatDropdownOpen(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      await loadInventory();
    },
    [adjustingProduct, selectedBranch, user?.id, loadInventory]
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deletingProduct) return;
    setItems((prev) => prev.filter((it) => it.id !== deletingProduct.id));
    setDeletingProduct(null);
  }, [deletingProduct]);

  // Filtrado y ordenamiento de la lista completa
  const filteredItems = useMemo(() => {
    const list = items.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        (item.barcode && item.barcode.toLowerCase().includes(q));

      const matchCategory =
        !category ||
        category === "All" ||
        category === "Todas" ||
        item.category?.toLowerCase() === category.toLowerCase();

      return matchSearch && matchCategory;
    });

    if (stockSort === "NONE") return list;

    return [...list].sort((a, b) => {
      const stockA = getStockDisplay(a);
      const stockB = getStockDisplay(b);
      return stockSort === "DESC" ? stockB - stockA : stockA - stockB;
    });
  }, [items, search, category, stockSort, getStockDisplay]);

  // Cálculo seguro de páginas sin provocar re-renderizados en cascada
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, safePage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-4">
        {/* =========================================================================
            BARRA DE ACCIONES Y CONTROLES (DISTRIBUCIÓN 4 ARRIBA / 2 ABAJO)
           ========================================================================= */}
        <div className="space-y-3">
          {/* FILA 1: BUSCADOR + 3 SELECTORES + NUEVO PRODUCTO ALINEADO AL EXTREMO DERECHO */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap xl:flex-nowrap">
            <div className="flex items-center gap-2.5 flex-1 flex-wrap sm:flex-nowrap">
              {/* 1. Buscador */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por SKU, código de barras o producto..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 pl-9 pr-3.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs transition-colors"
                />
              </div>

              {/* 2. Selector de Categorías */}
              <div className="relative shrink-0" ref={catDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCatDropdownOpen(!isCatDropdownOpen);
                    setIsSortDropdownOpen(false);
                    setIsBranchDropdownOpen(false);
                  }}
                  className={`h-10 px-3 bg-white border rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs select-none ${
                    isCatDropdownOpen
                      ? "border-sky-500 ring-2 ring-sky-500/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">
                      Categoría
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[105px]">
                      {CATEGORY_OPTIONS.find((c) => c.value === category)?.label || "Todas"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform duration-200 ${
                      isCatDropdownOpen ? "rotate-180 text-sky-600" : ""
                    }`}
                  />
                </button>

                {isCatDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Filtrar Categoría
                    </div>
                    <div className="space-y-0.5 max-h-60 overflow-y-auto">
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = category === cat.value;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setCategory(cat.value);
                              setCurrentPage(1);
                              setIsCatDropdownOpen(false);
                            }}
                            className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-sky-50 text-sky-900 font-bold"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <span>{cat.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Selector de Orden por Stock */}
              <div className="relative shrink-0" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsSortDropdownOpen(!isSortDropdownOpen);
                    setIsCatDropdownOpen(false);
                    setIsBranchDropdownOpen(false);
                  }}
                  className={`h-10 px-3 bg-white border rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs select-none ${
                    isSortDropdownOpen
                      ? "border-sky-500 ring-2 ring-sky-500/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    stockSort !== "NONE" ? "bg-sky-500 text-white" : "bg-sky-50 text-sky-600"
                  }`}>
                    {stockSort === "DESC" ? (
                      <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                    ) : stockSort === "ASC" ? (
                      <ArrowUpWideNarrow className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">
                      Stock
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[95px]">
                      {SORT_OPTIONS.find((s) => s.value === stockSort)?.label}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform duration-200 ${
                      isSortDropdownOpen ? "rotate-180 text-sky-600" : ""
                    }`}
                  />
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Ordenar por existencias
                    </div>
                    <div className="space-y-0.5">
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = stockSort === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setStockSort(opt.value);
                              setCurrentPage(1);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-sky-50 text-sky-900 font-bold"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {opt.value === "DESC" ? (
                                <ArrowDownWideNarrow className={`w-3.5 h-3.5 ${isSelected ? "text-sky-600" : "text-slate-400"}`} />
                              ) : opt.value === "ASC" ? (
                                <ArrowUpWideNarrow className={`w-3.5 h-3.5 ${isSelected ? "text-sky-600" : "text-slate-400"}`} />
                              ) : (
                                <ArrowUpDown className={`w-3.5 h-3.5 ${isSelected ? "text-sky-600" : "text-slate-400"}`} />
                              )}
                              <div>
                                <p className="leading-tight">{opt.label}</p>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  {opt.desc}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Selector de Sucursal */}
              {isAdmin ? (
                <div className="relative shrink-0" ref={branchDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBranchDropdownOpen(!isBranchDropdownOpen);
                      setIsCatDropdownOpen(false);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`h-10 px-3 bg-white border rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs select-none ${
                      isBranchDropdownOpen
                        ? "border-sky-500 ring-2 ring-sky-500/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Store className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider">
                        Vista de Red
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                        {selectedBranch === "ALL" ? "Todas" : selectedBranch}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform duration-200 ${
                        isBranchDropdownOpen ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>

                  {isBranchDropdownOpen && (
                    <div className="absolute right-0 sm:left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                        Seleccionar Sucursal
                      </div>
                      <div className="space-y-0.5">
                        {BRANCH_OPTIONS.map((b) => {
                          const isSelected = selectedBranch === b.value;
                          return (
                            <button
                              key={b.value}
                              type="button"
                              onClick={() => {
                                setSelectedBranch(b.value);
                                setCurrentPage(1);
                                setIsBranchDropdownOpen(false);
                              }}
                              className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-sky-50 text-sky-900 font-bold"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Building
                                  className={`w-3.5 h-3.5 ${
                                    isSelected ? "text-sky-600" : "text-slate-400"
                                  }`}
                                />
                                <div>
                                  <p className="leading-tight">{b.label}</p>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    {b.desc}
                                  </span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-xl px-3 h-10 shadow-2xs select-none shrink-0">
                  <Store className="w-4 h-4 text-sky-600 mr-2 shrink-0" />
                  <div className="flex flex-col justify-center text-left leading-none">
                    <span className="text-[9px] text-sky-600 font-bold uppercase tracking-tight">
                      Sucursal Asignada
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {currentUser.branch}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN NUEVO PRODUCTO ALINEADO AL EXTREMO DERECHO DE LA FILA 1 */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsNewProductOpen(true)}
                className="flex items-center gap-1.5 px-4 h-10 bg-[#00A4FC] hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            )}
          </div>

          {/* FILA 2: CONTADOR A LA IZQUIERDA Y LAS 2 OPCIONES RESTANTES A LA DERECHA */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 flex-wrap">
            <p className="text-xs font-medium text-slate-500">
              Mostrando <strong className="text-slate-800 font-bold">{filteredItems.length}</strong> productos en inventario
            </p>

            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                {/* 1. Reporte Hacienda */}
                <button
                  type="button"
                  onClick={() => setIsHaciendaModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 h-9 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reporte Hacienda</span>
                </button>

                {/* 2. Traslado de Stock */}
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 h-9 bg-purple-50 hover:bg-purple-100 text-pruple-500 border border-purple-200 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-purple-600" />
                  <span>Traslado de Stock</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* =========================================================================
            TABLA DE INVENTARIO PROFESIONAL & ELEGANTE
           ========================================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
              <span className="text-xs font-semibold text-slate-500">
                Sincronizando inventario con la red...
              </span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-[#0284C7] text-[10px] font-black uppercase tracking-wider text-white select-none">
                      <th className="py-3 px-5 text-center">Código / SKU</th>
                      <th className="py-3 px-4 text-center">Producto / Marca</th>
                      <th className="py-3 px-4 min-w-[220px] text-center">Descripción</th>
                      <th className="py-3 px-4 text-center">Categoría</th>

                      {isAdmin && selectedBranch === "ALL" ? (
                        <>
                          <th className="py-3 px-3 text-center">Santa Ana</th>
                          <th className="py-3 px-3 text-center">Ahuachapán</th>
                          <th className="py-3 px-3 text-center">Sonsonate</th>
                          <th className="py-3 px-4 text-center font-bold text-white">Total Red</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3 px-4 text-center">
                            Stock ({isAdmin ? selectedBranch : currentUser.branch})
                          </th>
                          <th className="py-3 px-4 text-center">Otras Sucursales</th>
                        </>
                      )}

                      {isAdmin && <th className="py-3 px-4 text-center">Costo</th>}
                      <th className="py-3 px-4 text-center">Precio Venta</th>
                      {isAdmin && <th className="py-3 px-5 text-center">Acciones</th>}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100/90 text-slate-600 font-medium">
                    {paginatedItems.map((item) => {
                      const currentStock = getStockDisplay(item);
                      const otherStock = getOtherBranchesStock(item);

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-sky-50/25 transition-colors group"
                        >
                          {/* 1. SKU & Barcode */}
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-xs font-bold text-slate-800 tracking-tight">
                                {item.sku}
                              </span>
                              {item.barcode && (
                                <span className="font-mono text-[10px] text-slate-400 font-normal">
                                  {item.barcode}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 2. Producto & Marca */}
                          <td className="py-3.5 px-4">
                            <div className="max-w-[200px]">
                              <p className="font-bold text-sky-800 text-xs leading-snug group-hover:text-sky-500 transition-colors">
                                {item.name}
                              </p>
                              <span className="text-[10px] font-semibold text-slate-600 mt-0.5 block">
                                {item.brand || "Genérico"}
                              </span>
                            </div>
                          </td>

                          {/* 3. Descripción */}
                          <td className="py-3.5 px-4 text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                            {item.description || "—"}
                          </td>

                          {/* 4. Categoría */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/70">
                              {item.category}
                            </span>
                          </td>

                          {/* 5. Columnas de Stock */}
                          {isAdmin && selectedBranch === "ALL" ? (
                            <>
                              <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-700">
                                {item.branches.find((b) => b.branchId === "santa-ana")?.stock ?? 0}
                              </td>
                              <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-700">
                                {item.branches.find((b) => b.branchId === "ahuachapan")?.stock ?? 0}
                              </td>
                              <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-700">
                                {item.branches.find((b) => b.branchId === "sonsonate")?.stock ?? 0}
                              </td>
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
                                  {currentStock}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              {/* Stock Local */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center justify-center min-w-[34px] px-2.5 py-0.5 rounded-md font-bold font-mono text-xs ${
                                    currentStock === 0
                                      ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                                      : currentStock <= 5
                                      ? "bg-amber-50 text-amber-700 border border-amber-200/80"
                                      : "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                                  }`}
                                >
                                  {currentStock === 0 ? "Agotado" : currentStock}
                                </span>
                              </td>

                              {/* Stock Otras Sedes */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setSelectedProduct(item)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer select-none ${
                                    otherStock > 0
                                      ? "border-sky-200 bg-sky-50/70 text-sky-800 hover:bg-sky-100 hover:border-sky-300 shadow-2xs active:scale-95"
                                      : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-75"
                                  }`}
                                >
                                  <Building2
                                    className={`w-3.5 h-3.5 ${
                                      otherStock > 0 ? "text-sky-600" : "text-slate-400"
                                    }`}
                                  />
                                  <span>{otherStock > 0 ? `${otherStock} en red` : "Sin stock"}</span>
                                </button>
                              </td>
                            </>
                          )}

                          {/* 6. Costo (Admin) */}
                          {isAdmin && (
                            <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700 whitespace-nowrap">
                              ${item.cost.toFixed(2)}
                            </td>
                          )}

                          {/* 7. Precio Venta */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono">
                            <span className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded-lg">
                              ${item.price.toFixed(2)}
                            </span>
                          </td>

                          {/* 8. Acciones (Admin) */}
                          {isAdmin && (
                            <td className="py-3.5 px-5 text-center whitespace-nowrap">
                              <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                                {selectedBranch !== "ALL" && (
                                  <button
                                    type="button"
                                    onClick={() => setAdjustingProduct(item)}
                                    title="Ajustar existencias (Entrada / Salida)"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer mr-0.5"
                                  >
                                    <SlidersHorizontal className="w-3 h-3 text-sky-600" />
                                    <span>± Stock</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setHistoryProduct(item)}
                                  title="Auditar Kardex / Historial"
                                  className="p-1.5 text-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <History className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setEditingProduct(item)}
                                  title="Editar producto"
                                  className="p-1.5 text-amber-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDeletingProduct(item)}
                                  title="Eliminar producto"
                                  className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
              </div>

              {/* =========================================================================
                  CONTROLES DE PAGINACIÓN ELEGANTE (10 POR PÁGINA)
                 ========================================================================= */}
              {filteredItems.length > 0 && (
                <div className="px-5 py-3.5 bg-slate-50/75 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Mostrando{" "}
                    <strong className="text-slate-800 font-bold">
                      {(safePage - 1) * itemsPerPage + 1}
                    </strong>{" "}
                    a{" "}
                    <strong className="text-slate-800 font-bold">
                      {Math.min(safePage * itemsPerPage, filteredItems.length)}
                    </strong>{" "}
                    de <strong className="text-slate-800 font-bold">{filteredItems.length}</strong> registros
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* Botón Anterior */}
                    <button
                      type="button"
                      disabled={safePage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="px-2.5 h-8 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>

                    {/* Números de página */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= safePage - 1 && pageNum <= safePage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                safePage === pageNum
                                  ? "bg-sky-600 text-white shadow-xs"
                                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        if (
                          (pageNum === safePage - 2 && pageNum > 1) ||
                          (pageNum === safePage + 2 && pageNum < totalPages)
                        ) {
                          return (
                            <span key={pageNum} className="text-slate-400 text-xs px-1 select-none">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Botón Siguiente */}
                    <button
                      type="button"
                      disabled={safePage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="px-2.5 h-8 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400 gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <PackageX className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                No hay productos que coincidan
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                {search || category !== "All"
                  ? "Verifica los términos de búsqueda o selecciona otra categoría."
                  : "El catálogo está vacío. Utiliza el botón \"Nuevo Producto\" para agregar insumos."}
              </p>
            </div>
          )}
        </div>

        {/* =========================================================================
            MODALES COMPLEMENTARIOS (PRESERVADOS INTACTOS)
           ========================================================================= */}
        <BranchStockModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          currentBranch={isAdmin && selectedBranch !== "ALL" ? selectedBranch : currentUser.branch}
          product={selectedProduct}
        />

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