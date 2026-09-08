"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import NewProductModal, { NewProductFormData } from "@/components/NewProductModal";
import TransferStockModal from "@/components/TransferStockModal";
import BranchStockModal from "@/components/BranchStockModal";
import { useAuth } from "@/app/context/AuthContext";
import {
  Search,
  Plus,
  Minus,
  Pencil,
  Trash2,
  ChevronDown,
  Building2,
  Store,
  ArrowRightLeft,
  History,
} from "lucide-react";

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
  category: string;
  presentation: string;
  cost: number;
  price: number;
  image?: string;
  branches: BranchStock[];
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    id: "1",
    sku: "RS-305A",
    name: "Resina Universal A2",
    brand: "3M Filtek Z350",
    category: "Resins",
    presentation: "Jeringa (4g)",
    cost: 550.0,
    price: 850.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 0, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 14, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 28, phone: "2451-9012" },
    ],
  },
  {
    id: "2",
    sku: "AN-1024",
    name: "Articaina 4% 1:100k",
    brand: "Septodont",
    category: "Endo",
    presentation: "Caja (50 Cartuchos)",
    cost: 620.0,
    price: 920.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 3, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 0, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 12, phone: "2451-9012" },
    ],
  },
  {
    id: "3",
    sku: "DP-8820",
    name: "Guantes Nitrilo Med",
    brand: "Cranberry",
    category: "Disposables",
    presentation: "Caja (100 pcs)",
    cost: 130.0,
    price: 210.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 120, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 45, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 60, phone: "2451-9012" },
    ],
  },
  {
    id: "4",
    sku: "OR-9002",
    name: "Opalescence Go 15%",
    brand: "Ultradent",
    category: "Ortho",
    presentation: "Kit (10 Blísteres)",
    cost: 980.0,
    price: 1450.0,
    image: "/diente.jpg",
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 15, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 5, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 10, phone: "2451-9012" },
    ],
  },
  {
    id: "5",
    sku: "EN-5510",
    name: "Limas K-Files 25mm #15-40",
    brand: "Mani",
    category: "Endo",
    presentation: "Caja (6 pcs)",
    cost: 105.0,
    price: 165.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 28, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 12, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 16, phone: "2451-9012" },
    ],
  },
  {
    id: "6",
    sku: "OR-7721",
    name: "Brackets Mini Diamond Roth .022",
    brand: "Ormco",
    category: "Ortho",
    presentation: "Caso (20 pcs)",
    cost: 420.0,
    price: 680.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 9, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 4, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 8, phone: "2451-9012" },
    ],
  },
  {
    id: "7",
    sku: "RS-9912",
    name: "Tetric N-Ceram Bulk Fill IVA",
    brand: "Ivoclar Vivadent",
    category: "Resins",
    presentation: "Jeringa (3.5g)",
    cost: 510.0,
    price: 790.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 4, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 2, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 6, phone: "2451-9012" },
    ],
  },
  {
    id: "8",
    sku: "IN-3301",
    name: "Fórceps 150 Universal Superior",
    brand: "Hu-Friedy",
    category: "Instruments",
    presentation: "Unidad Quirúrgica",
    cost: 1250.0,
    price: 1850.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 6, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 2, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 4, phone: "2451-9012" },
    ],
  },
  {
    id: "9",
    sku: "EN-4420",
    name: "Puntas de Gutapercha ProTaper F1-F3",
    brand: "Dentsply Sirona",
    category: "Endo",
    presentation: "Caja (60 pcs)",
    cost: 155.0,
    price: 240.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 34, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 15, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 20, phone: "2451-9012" },
    ],
  },
  {
    id: "10",
    sku: "DP-1105",
    name: "Baberos Odontológicos 3 Capas (x500)",
    brand: "Mediclinic",
    category: "Disposables",
    presentation: "Paquete (500 pcs)",
    cost: 115.0,
    price: 180.0,
    branches: [
      { branchId: "santa-ana", branchName: "Santa Ana", stock: 65, phone: "2440-1234" },
      { branchId: "ahuachapan", branchName: "Ahuachapán", stock: 30, phone: "2413-5678" },
      { branchId: "sonsonate", branchName: "Sonsonate", stock: 40, phone: "2451-9012" },
    ],
  },
];

export default function InventoryPage() {
  const { user } = useAuth();

  const currentUser = user || {
    name: "Mario Administrador",
    role: "admin" as "admin" | "cashier",
    branch: "Santa Ana" as "Santa Ana" | "Ahuachapán" | "Sonsonate",
  };

  const isAdmin = currentUser.role === "admin";

  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_DATA);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // El administrador puede alternar; el cajero queda anclado a su sucursal fija
  const [selectedBranch, setSelectedBranch] = useState<string>(
    isAdmin ? "Santa Ana" : currentUser.branch
  );

  // Modales
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [historyProduct, setHistoryProduct] = useState<InventoryItem | null>(null);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Guardar nuevo producto (solo Admin)
  const handleSaveNewProduct = (newProd: NewProductFormData) => {
    const itemToAdd: InventoryItem = {
      id: crypto.randomUUID(),
      ...newProd,
    };
    setItems((prev) => [itemToAdd, ...prev]);
  };

  // Reabastecimiento entre sucursales (solo Admin)
  const handleConfirmTransfer = (
    productId: string,
    sourceBranch: string,
    targetBranch: string,
    qty: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;

        const updatedBranches = item.branches.map((b) => {
          if (b.branchName === sourceBranch) {
            return { ...b, stock: Math.max(0, b.stock - qty) };
          }
          if (b.branchName === targetBranch) {
            return { ...b, stock: b.stock + qty };
          }
          return b;
        });

        return { ...item, branches: updatedBranches };
      })
    );
  };

  // Stock local de la sucursal activa
  const getStockDisplay = (item: InventoryItem) => {
    const branchToLookup = isAdmin ? selectedBranch : currentUser.branch;

    if (isAdmin && branchToLookup === "ALL") {
      return item.branches.reduce((acc, curr) => acc + curr.stock, 0);
    }
    return item.branches.find((b) => b.branchName === branchToLookup)?.stock ?? 0;
  };

  // Stock disponible en las demás sucursales
  const getOtherBranchesStock = (item: InventoryItem) => {
    const currentBaseBranch = isAdmin ? selectedBranch : currentUser.branch;
    return item.branches
      .filter((b) => b.branchName !== currentBaseBranch)
      .reduce((acc, curr) => acc + curr.stock, 0);
  };

  // Ajuste rápido de stock en mostrador (solo Admin)
  const handleStockDelta = (itemId: string, delta: number) => {
    if (!isAdmin) return;

    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;

        const targetBranch = selectedBranch === "ALL" ? "Santa Ana" : selectedBranch;

        const updatedBranches = it.branches.map((b) => {
          if (b.branchName === targetBranch) {
            return { ...b, stock: Math.max(0, b.stock + delta) };
          }
          return b;
        });

        return { ...it, branches: updatedBranches };
      })
    );
  };

  // Eliminar producto del catálogo (solo Admin)
  const handleDeleteProduct = (id: string) => {
    if (!isAdmin) return;
    if (confirm("¿Estás seguro de que deseas eliminar este producto del catálogo general?")) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || item.category === category;
      return matchSearch && matchCat;
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
                placeholder="Buscar por SKU, producto o marca..."
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
                <option value="Resins">Resinas</option>
                <option value="Endo">Endo</option>
                <option value="Ortho">Orto</option>
                <option value="Instruments">Instrumentos</option>
                <option value="Disposables">Productos Desechables</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Selector dinámico para Admin / Ficha fija para Cajero */}
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

          {/* BOTONES DE ACCIÓN: Solo para Administrador */}
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 h-[38px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
                <span>Traslado de Stock</span>
              </button>

              <button
                onClick={() => setIsNewProductOpen(true)}
                className="flex items-center gap-1.5 px-4 h-[38px] bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          )}
        </div>

        {/* TABLA DE INVENTARIO */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-4">Producto / Marca</th>
                <th className="py-3.5 px-4">Presentación</th>

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
                    {/* Columna visible tanto para Cajero como para Admin */}
                    <th className="py-3.5 px-4 text-center">Otras Sucursales</th>
                  </>
                )}

                <th className="py-3.5 px-4 text-right">Costo</th>
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
                    <td className="py-3.5 px-6 font-mono text-[11px] text-slate-400">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.brand}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.presentation}</td>

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

                        {/* BOTÓN AZUL "EN RED" - OPERABLE POR EL CAJERO Y EL ADMIN */}
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

                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-500">
                      ${item.cost.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                      ${item.price.toFixed(2)}
                    </td>

                    {/* COLUMNA ACCIONES: Solo visible para el Administrador */}
                    {isAdmin && (
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {selectedBranch !== "ALL" && (
                            <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs mr-1">
                              <button
                                type="button"
                                onClick={() => handleStockDelta(item.id, -1)}
                                title="Quitar 1 unidad de stock"
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-l-lg transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStockDelta(item.id, 1)}
                                title="Agregar 1 unidad de stock"
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-r-lg transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setHistoryProduct(item)}
                            title="Auditar Kardex / Historial de Movimientos"
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => alert(`Editar ficha de ${item.name}`)}
                            title="Editar producto"
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(item.id)}
                            title="Eliminar producto"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

        {/* MODAL DE OTRAS SUCURSALES (Abierto tanto por Cajero como por Admin) */}
        <BranchStockModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          currentBranch={isAdmin && selectedBranch !== "ALL" ? selectedBranch : currentUser.branch}
          product={selectedProduct}
        />

        {/* MODALES EXCLUSIVOS DEL ADMINISTRADOR */}
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
          </>
        )}
      </main>
    </div>
  );
}