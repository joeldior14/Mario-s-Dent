"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import {
  Search,
  Plus,
  Minus,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  presentation: string;
  stock: number;
  minStock: number;
  lot: string;
  daysToExpire: number;
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    id: "1",
    sku: "RS-305A",
    name: "Resina Universal A2",
    brand: "3M Filtek Z350",
    category: "Resins",
    presentation: "Jeringa (4g)",
    stock: 42,
    minStock: 10,
    lot: "CR-4491-X",
    daysToExpire: 45,
  },
  {
    id: "2",
    sku: "AN-1024",
    name: "Articaina 4% 1:100k",
    brand: "Septodont",
    category: "Endo",
    presentation: "Caja (50 Cartuchos)",
    stock: 3,
    minStock: 8,
    lot: "L-2023-88",
    daysToExpire: 15,
  },
  {
    id: "3",
    sku: "DP-8820",
    name: "Guantes Nitrilo Med",
    brand: "Cranberry",
    category: "Disposables",
    presentation: "Caja (100 pcs)",
    stock: 120,
    minStock: 25,
    lot: "CB-9902",
    daysToExpire: 410,
  },
  {
    id: "4",
    sku: "OR-9002",
    name: "Opalescence Go 15%",
    brand: "Ultradent",
    category: "Ortho",
    presentation: "Kit (10 Blísteres)",
    stock: 15,
    minStock: 5,
    lot: "OB-112-Q",
    daysToExpire: 200,
  },
  {
    id: "5",
    sku: "EN-5510",
    name: "Limas K-Files 25mm #15-40",
    brand: "Mani",
    category: "Endo",
    presentation: "Caja (6 pcs)",
    stock: 28,
    minStock: 10,
    lot: "MN-8841",
    daysToExpire: 310,
  },
  {
    id: "6",
    sku: "OR-7721",
    name: "Brackets Mini Diamond Roth .022",
    brand: "Ormco",
    category: "Ortho",
    presentation: "Caso (20 pcs)",
    stock: 9,
    minStock: 5,
    lot: "OM-4029",
    daysToExpire: 550,
  },
  {
    id: "7",
    sku: "RS-9912",
    name: "Tetric N-Ceram Bulk Fill IVA",
    brand: "Ivoclar Vivadent",
    category: "Resins",
    presentation: "Jeringa (3.5g)",
    stock: 4,
    minStock: 6,
    lot: "IV-5510",
    daysToExpire: 25,
  },
  {
    id: "8",
    sku: "IN-3301",
    name: "Fórceps 150 Universal Superior",
    brand: "Hu-Friedy",
    category: "Instruments",
    presentation: "Unidad Quirúrgica",
    stock: 6,
    minStock: 3,
    lot: "HF-0091",
    daysToExpire: 999,
  },
  {
    id: "9",
    sku: "EN-4420",
    name: "Puntas Gutapercha ProTaper F1-F3",
    brand: "Dentsply Sirona",
    category: "Endo",
    presentation: "Caja (60 pcs)",
    stock: 34,
    minStock: 12,
    lot: "DS-7744",
    daysToExpire: 180,
  },
  {
    id: "10",
    sku: "DP-1105",
    name: "Baberos Odontológicos 3 Capas",
    brand: "Mediclinic",
    category: "Disposables",
    presentation: "Paquete (500 pcs)",
    stock: 65,
    minStock: 20,
    lot: "MC-2231",
    daysToExpire: 720,
  },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_DATA);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterExpiring, setFilterExpiring] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || item.category === category;
      const matchLow = filterLowStock ? item.stock <= item.minStock : true;
      const matchExp = filterExpiring ? item.daysToExpire <= 30 : true;
      return matchSearch && matchCat && matchLow && matchExp;
    });
  }, [items, search, category, filterLowStock, filterExpiring]);

  const handleStockDelta = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, stock: Math.max(0, it.stock + delta) } : it))
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* BARRA DE ACCIONES SUPERIOR */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Buscador */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 shadow-2xs transition-colors"
              />
            </div>

            {/* Selector de Categorías */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-slate-600 focus:outline-none focus:border-sky-500 shadow-2xs cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Resins">Resins</option>
                <option value="Endo">Endo</option>
                <option value="Ortho">Ortho</option>
                <option value="Instruments">Instruments</option>
                <option value="Disposables">Disposables</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Checkboxes de filtros */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 ml-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterLowStock}
                  onChange={(e) => setFilterLowStock(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-0"
                />
                <span>Stock Bajo</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterExpiring}
                  onChange={(e) => setFilterExpiring(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-0"
                />
                <span>Próximo a Vencer</span>
              </label>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* TABLA DE INVENTARIO */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                <th className="py-3.5 px-6">SKU</th>
                <th className="py-3.5 px-4">Name / Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Presentation</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4">Lot</th>
                <th className="py-3.5 px-4">Expiration</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-[11px] text-slate-400">{item.sku}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.brand}</p>
                  </td>
                  <td className="py-3.5 px-4">{item.category}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.presentation}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold tabular-nums ${
                        item.stock <= item.minStock ? "text-rose-600" : "text-slate-700"
                      }`}
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{item.lot}</td>
                  <td className="py-3.5 px-4">
                    {item.daysToExpire > 365 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        N/A
                      </span>
                    ) : item.daysToExpire <= 30 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                        Exp {item.daysToExpire} days
                      </span>
                    ) : item.daysToExpire <= 90 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                        Exp {item.daysToExpire} days
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Exp {item.daysToExpire} days
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs mr-2">
                        <button
                          onClick={() => handleStockDelta(item.id, -1)}
                          className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleStockDelta(item.id, 1)}
                          className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-sky-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No se encontraron productos coincidentes con los filtros seleccionados.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}