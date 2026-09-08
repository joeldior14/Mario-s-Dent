"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useShift } from "@/app/context/ShiftContext";
import {
  Scan,
  Trash2,
  X,
  Minus,
  Plus,
  Banknote,
  CreditCard,
  Building2,
  Printer,
  Lock,
  ArrowRight,
} from "lucide-react";

// Modal de advertencia interno cuando no hay turno abierto
function ShiftWarningModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-800">
            Turno de Caja Requerido
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No es posible agregar artículos ni cobrar sin abrir un turno previamente. Registra tu fondo inicial para comenzar[cite: 1, 2].
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Entendido
          </button>
          <Link
            href="/caja"
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ir a Caja</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Estructura de productos del catálogo
interface DentalProduct {
  id: string;
  brand: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

// Estructura de ítems en el carrito
interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  unit?: string;
  quantity: number;
  price: number;
}

const CATEGORIES = ["All", "Ortho", "Endo", "Resins", "Instruments", "Disposables"];

const INITIAL_CATALOG: DentalProduct[] = [
  {
    id: "1",
    brand: "3M Filtek Z350",
    name: "Resina Universal A2",
    price: 850.0,
    stock: 42,
    category: "Resins",
  },
  {
    id: "2",
    brand: "Septodont",
    name: "Articaina 4% 1:100k",
    price: 920.0,
    stock: 3,
    category: "Endo",
  },
  {
    id: "3",
    brand: "Cranberry",
    name: "Guantes Nitrilo Med",
    price: 210.0,
    stock: 120,
    category: "Disposables",
  },
  {
    id: "4",
    brand: "Ultradent",
    name: "Opalescence Go 15%",
    price: 1450.0,
    stock: 15,
    category: "Ortho",
  },
  {
    id: "5",
    brand: "Mani",
    name: "Limas K-Files 25mm #15-40",
    price: 165.0,
    stock: 28,
    category: "Endo",
  },
  {
    id: "6",
    brand: "Ormco",
    name: "Brackets Mini Diamond Roth .022",
    price: 680.0,
    stock: 9,
    category: "Ortho",
  },
  {
    id: "7",
    brand: "Ivoclar Vivadent",
    name: "Tetric N-Ceram Bulk Fill IVA",
    price: 790.0,
    stock: 4,
    category: "Resins",
  },
  {
    id: "8",
    brand: "Hu-Friedy",
    name: "Fórceps 150 Universal Superior",
    price: 1850.0,
    stock: 6,
    category: "Instruments",
  },
  {
    id: "9",
    brand: "Dentsply Sirona",
    name: "Puntas de Gutapercha ProTaper F1-F3",
    price: 240.0,
    stock: 34,
    category: "Endo",
  },
  {
    id: "10",
    brand: "Mediclinic",
    name: "Baberos Odontológicos 3 Capas (x500)",
    price: 180.0,
    stock: 65,
    category: "Disposables",
  },
];

export default function PosPage() {
  const { isShiftOpen } = useShift();
  const [showShiftWarning, setShowShiftWarning] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");

  // Estado del Carrito de Compras
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "c1",
      productId: "2",
      name: "Articaina 4%",
      brand: "Septodont",
      quantity: 1,
      price: 920.0,
    },
    {
      id: "c2",
      productId: "3",
      name: "Guantes Nitrilo",
      brand: "Cranberry",
      unit: "Med",
      quantity: 2,
      price: 210.0,
    },
  ]);

  // Filtro reactivo de productos (por categoría y por búsqueda)
  const filteredProducts = useMemo(() => {
    return INITIAL_CATALOG.filter((prod) => {
      const matchCategory =
        activeCategory === "All" || prod.category === activeCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Agregar producto con validación de turno
  const handleAddToCart = (product: DentalProduct) => {
    if (!isShiftOpen) {
      setShowShiftWarning(true);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          quantity: 1,
          price: product.price,
        },
      ];
    });
  };

  // Validación de escaneo continuo con lector o teclado
  const handleScannerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!isShiftOpen) {
        setShowShiftWarning(true);
      }
    }
  };

  // Modificar cantidad individual (+ / -)
  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remover un producto individual con la "X"
  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Vaciar carrito completo con el icono de papelera
  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
  };

  // Cálculos dinámicos en vivo
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const iva = subtotal * 0.13; // 13% IVA
  const total = subtotal + iva;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      {/* 1. Navbar con estatus y hora sincronizados */}
      <Navbar />

      {/* 2. Cuerpo del POS (2 Columnas) */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL IZQUIERDO: Búsqueda, Filtros y Catálogo */}
        <main className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Barra de Búsqueda y Escáner Continuo */}
          <div
            className={`border-2 rounded-xl p-3 bg-white flex items-center gap-3 shadow-xs transition-colors ${
              !isShiftOpen ? "border-amber-300 bg-amber-50/20" : "border-sky-500"
            }`}
          >
            <Scan
              className={`w-6 h-6 shrink-0 ${
                !isShiftOpen ? "text-amber-500" : "text-sky-600"
              }`}
            />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onKeyDown={handleScannerKeyDown}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                !isShiftOpen
                  ? "Turno cerrado: dirígete a Caja para registrar fondo inicial y cobrar..."
                  : "Scan Barcode or Type Product Code..."
              }
              className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 text-xs px-2"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Categorías (Pills) */}
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cuadrícula de Productos */}
          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddToCart(item)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col group active:scale-[0.98]"
              >
                {/* Cuadro de Imagen o Placeholder */}
                <div className="h-32 bg-slate-50 relative flex items-center justify-center border-b border-slate-100 group-hover:bg-sky-50/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl border-2 border-slate-300 border-dashed flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity">
                    <span className="text-xs font-bold text-slate-400">🦷</span>
                  </div>
                </div>

                {/* Detalles del Producto */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">
                        {item.brand}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                          item.stock <= 5
                            ? "bg-rose-50 text-rose-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 mt-3">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No se encontraron productos coincidentes con la búsqueda.
            </div>
          )}
        </main>

        {/* PANEL DERECHO: Orden Actual y Cobro */}
        <aside className="w-[380px] bg-white border-l border-slate-200 flex flex-col h-full shadow-xs">
          {/* Cabecera del Carrito */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800">Current Order</span>
            <button
              type="button"
              onClick={handleClearCart}
              title="Vaciar Orden Completa"
              className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Listado de Artículos en la Orden */}
          <div className="flex-1 overflow-y-auto px-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 space-y-2">
                <span className="text-2xl">🛒</span>
                <p>No hay productos en la orden actual.</p>
                <p className="text-[10px] text-slate-300">
                  Selecciona un producto o escanea un código.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.brand} {item.unit && `• ${item.unit}`}
                    </p>
                  </div>

                  {/* Selector de Cantidades - / + */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white mr-3 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="p-1 hover:bg-slate-100 text-slate-500 transition-colors rounded-l-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs px-2 font-bold text-slate-700 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="p-1 hover:bg-slate-100 text-slate-500 transition-colors rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal del ítem */}
                  <span className="text-xs font-bold text-slate-800 mr-2 min-w-[60px] text-right tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Remover ítem individual */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-300 hover:text-slate-600 transition-colors p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Resumen de Pago y Totales */}
          <div className="px-5 py-4 border-t border-slate-100 bg-[#FAFAFA] space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-slate-500">
              <span>IVA (13%)</span>
              <span className="font-semibold tabular-nums">${iva.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span className="text-lg text-slate-900 tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Selector de Métodos de Pago */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === "cash"
                    ? "bg-sky-50 border-sky-500 text-sky-700 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === "card"
                    ? "bg-sky-50 border-sky-500 text-sky-700 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("transfer")}
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === "transfer"
                    ? "bg-sky-50 border-sky-500 text-sky-700 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Transferencia</span>
              </button>
            </div>

            {/* Botón de Cobro con validación de turno */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => {
                if (!isShiftOpen) {
                  setShowShiftWarning(true);
                  return;
                }
                alert("Procesando cobro e imprimiendo ticket...");
              }}
              className={`w-full mt-3 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
                cart.length > 0
                  ? "bg-[#0284C7] hover:bg-sky-700 text-white cursor-pointer active:scale-[0.99]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Cobrar & Imprimir Ticket</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Modal de Advertencia de Turno Requerido */}
      <ShiftWarningModal
        isOpen={showShiftWarning}
        onClose={() => setShowShiftWarning(false)}
      />
    </div>
  );
}