"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useShift } from "@/app/context/ShiftContext";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { processSaleInDB, POSCartItem } from "@/app/services/inventoryService";
import { getNextOrderNumber } from "@/app/services/cashService";
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
  Package,
  Loader2,
  CheckCircle2,
  Coins,
} from "lucide-react";

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
            className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
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

export interface POSProduct {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  sku: string;
  quantity: number;
  price: number;
  stock: number;
}

interface DBBranchRelation {
  id: string;
  name: string;
}

interface DBBranchInventory {
  stock: number | null;
  branches: DBBranchRelation | null;
}

interface DBProductPOS {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url: string | null;
  branch_inventory: DBBranchInventory[] | null;
}

const CATEGORIES = ["All", "Orto", "Endo", "Resinas", "Instrumentos", "Desechables"];
const CASH_SUGGESTIONS = [5, 10, 20, 50, 100];

// Funciones de sincronización externa con localStorage para el carrito
function subscribeCart(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cart_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cart_change", callback);
  };
}

export default function PosPage() {
  const { isShiftOpen, cashierName } = useShift();
  const { user } = useAuth();
  
  // Garantiza que la sucursal provenga de la sesión del usuario logueado
  const currentBranch = useMemo(() => {
    return user?.branch || "Santa Ana";
  }, [user?.branch]);

  const CART_STORAGE_KEY = `pos_cart_${currentBranch}`;

  // Estado de orden
  const [orderNumber, setOrderNumber] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`pos_order_num_${currentBranch}`);
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  const [hasHydrated, setHasHydrated] = useState(false);

  const [showShiftWarning, setShowShiftWarning] = useState(false);
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [cashReceived, setCashReceived] = useState<string>("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  const scanInputRef = useRef<HTMLInputElement>(null);

  // Evita alertas de ESLint en React 19 / Next.js
  useEffect(() => {
    queueMicrotask(() => {
      setHasHydrated(true);
    });
  }, []);

  // Sincroniza el correlativo de orden con Supabase para la sucursal activa
  useEffect(() => {
    let isMounted = true;

    async function syncOrderNum() {
      if (!isShiftOpen) {
        if (isMounted) setOrderNumber(1);
        return;
      }

      try {
        const nextNum = await getNextOrderNumber(currentBranch);
        if (isMounted) {
          setOrderNumber(nextNum);
          if (typeof window !== "undefined") {
            localStorage.setItem(`pos_order_num_${currentBranch}`, nextNum.toString());
          }
        }
      } catch (err) {
        console.error("Error al sincronizar número de orden:", err);
      }
    }

    syncOrderNum();

    return () => {
      isMounted = false;
    };
  }, [currentBranch, isShiftOpen]);

  // Lectura reactiva del carrito desde localStorage
  const rawCart = useSyncExternalStore(
    subscribeCart,
    () => (typeof window !== "undefined" ? localStorage.getItem(CART_STORAGE_KEY) ?? "[]" : "[]"),
    () => "[]"
  );

  const cart: CartItem[] = useMemo(() => {
    try {
      return JSON.parse(rawCart) as CartItem[];
    } catch {
      return [];
    }
  }, [rawCart]);

  // Actualizador persistente del carrito
  const updateCartStorage = useCallback(
    (newCart: CartItem[]) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        window.dispatchEvent(new Event("cart_change"));
      }
    },
    [CART_STORAGE_KEY]
  );

  const loadBranchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          sku,
          barcode,
          name,
          brand,
          category,
          price,
          image_url,
          branch_inventory (
            stock,
            branches (
              id,
              name
            )
          )
        `)
        .order("name", { ascending: true });

      if (error) throw error;

      const rawProducts = (data ?? []) as unknown as DBProductPOS[];

      const formatted: POSProduct[] = rawProducts.map((p) => {
        const invList = p.branch_inventory ?? [];
        const branchMatch = invList.find(
          (b) => b.branches?.name?.trim().toLowerCase() === currentBranch.trim().toLowerCase()
        );

        return {
          id: p.id,
          sku: p.sku,
          barcode: p.barcode ?? undefined,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: Number(p.price),
          stock: branchMatch?.stock ?? 0,
          image: p.image_url ?? undefined,
        };
      });

      setProducts(formatted);
    } catch (err) {
      console.error("Error al cargar productos del catálogo:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch]);

  useEffect(() => {
    let isMounted = true;
    const initPOS = async () => {
      if (isMounted) {
        await loadBranchProducts();
      }
    };
    initPOS();
    return () => {
      isMounted = false;
    };
  }, [loadBranchProducts]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((prod) => {
      const matchCategory =
        activeCategory === "All" ||
        prod.category.toLowerCase() === activeCategory.toLowerCase();

      const matchSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.brand.toLowerCase().includes(q) ||
        prod.sku.toLowerCase().includes(q) ||
        (prod.barcode && prod.barcode.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleAddToCart = (product: POSProduct) => {
    if (!isShiftOpen) {
      setShowShiftWarning(true);
      return;
    }

    if (product.stock <= 0) return;

    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      if (cart[existingIndex].quantity >= product.stock) return;
      const updated = [...cart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      updateCartStorage(updated);
    } else {
      updateCartStorage([
        ...cart,
        {
          id: `cart-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          sku: product.sku,
          quantity: 1,
          price: product.price,
          stock: product.stock,
        },
      ]);
    }
  };

  const handleScannerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!isShiftOpen) {
        setShowShiftWarning(true);
        setSearchQuery("");
        return;
      }

      const code = searchQuery.trim().toLowerCase();
      if (!code) return;

      const matched = products.find(
        (p) =>
          (p.barcode && p.barcode.toLowerCase() === code) ||
          p.sku.toLowerCase() === code
      );

      if (matched) {
        handleAddToCart(matched);
        setSearchQuery("");
      } else {
        console.warn("Código no reconocido:", code);
      }
    }
  };

  const handleUpdateQty = (id: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          if (nextQty > item.stock) return item;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    updateCartStorage(updated);
  };

  const handleRemoveItem = (id: string) => {
    updateCartStorage(cart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    updateCartStorage([]);
    setCashReceived("");
  };

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const iva = Number((subtotal * 0.13).toFixed(2));
  const total = Number((subtotal + iva).toFixed(2));

  const numericCashReceived = parseFloat(cashReceived) || 0;
  const changeDue = numericCashReceived >= total ? Number((numericCashReceived - total).toFixed(2)) : 0;
  const isCashInsufficient = paymentMethod === "cash" && numericCashReceived > 0 && numericCashReceived < total;
  const canCheckout =
    cart.length > 0 &&
    isShiftOpen &&
    !isProcessing &&
    (paymentMethod !== "cash" || (numericCashReceived >= total && numericCashReceived > 0));

  // Manejador de cobro de orden conectado al backend
  const handleCheckout = async () => {
    if (!canCheckout) {
      if (!isShiftOpen) setShowShiftWarning(true);
      return;
    }

    try {
      setIsProcessing(true);

      const cartPayload: POSCartItem[] = cart.map((item) => ({
        id: item.productId,
        sku: item.sku,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        stock: item.stock,
      }));

      // 1. Guardar la venta en Supabase y descontar stock
      const result = await processSaleInDB({
        branchName: currentBranch.trim(),
        cashierId: user?.id || null,
        cashierName: cashierName || user?.name || "Cajero",
        paymentMethod,
        items: cartPayload,
        subtotal,
        tax: iva,
        total,
        cashReceived: paymentMethod === "cash" ? numericCashReceived : undefined,
        changeReturned: paymentMethod === "cash" ? changeDue : undefined,
      });

      // 2. Feedback visual y reinicio de orden (Aumentar el número correlativo)
      setTicketSuccess(result.ticketNumber);
      updateCartStorage([]);
      setCashReceived("");
      
      setOrderNumber((prev) => {
        const next = prev + 1;
        if (typeof window !== "undefined") {
          localStorage.setItem(`pos_order_num_${currentBranch}`, next.toString());
        }
        return next;
      });

      // 3. Refrescar el stock del catálogo
      await loadBranchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar la venta";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none">
      <Navbar />

      {/* Banner de turno cerrado */}
      {!isShiftOpen && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-amber-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Turno cerrado: dirígete a Caja para registrar fondo inicial y cobrar[cite: 1, 2].</span>
          </div>
          <Link
            href="/caja"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            <span>Ir a Caja</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Banner de venta exitosa */}
      {ticketSuccess && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              ¡Venta registrada con éxito! Comprobante emitido: <strong>{ticketSuccess}</strong>[cite: 1, 4]
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTicketSuccess(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* PANEL IZQUIERDO: Búsqueda, Filtros y Catálogo */}
        <main className="flex-1 p-6 overflow-y-auto space-y-5">
          <div className="border border-slate-200 rounded-xl p-3 bg-white flex items-center gap-3 shadow-2xs focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
            <Scan className="w-5 h-5 text-sky-600 shrink-0" />
            <input
              ref={scanInputRef}
              type="text"
              autoFocus
              value={searchQuery}
              onKeyDown={handleScannerKeyDown}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escanear código de barras o buscar por SKU / Nombre..."
              className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat === "All" ? "Todos" : cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-2.5">
              <Loader2 className="w-7 h-7 animate-spin text-sky-600" />
              <span className="text-xs font-medium">Cargando inventario de {currentBranch}...</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((item) => {
                const isOutOfStock = item.stock <= 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddToCart(item)}
                    className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all flex flex-col group ${
                      isOutOfStock
                        ? "border-slate-200 opacity-60 cursor-not-allowed"
                        : "border-slate-200 hover:border-sky-400 hover:shadow-md cursor-pointer active:scale-[0.98]"
                    }`}
                  >
                    <div className="h-32 bg-slate-50 relative flex items-center justify-center border-b border-slate-100 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-10 h-10 border-2 border-slate-300 border-dashed rounded-xl flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity">
                          <Package className="w-5 h-5 text-slate-400 stroke-[1.5]" />
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-slate-800 line-clamp-1">
                            {item.brand}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold shrink-0 ${
                              isOutOfStock
                                ? "bg-rose-50 text-rose-600"
                                : item.stock <= 5
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {isOutOfStock ? "Agotado" : item.stock}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                          {item.name}
                        </p>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 mt-3">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center text-slate-400 text-xs">
              No se encontraron productos coincidentes en el inventario de {currentBranch}.
            </div>
          )}
        </main>

        {/* PANEL DERECHO: Orden Actual y Cobro */}
        <aside className="w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shadow-xs shrink-0">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">Current Order</span>
              <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                #{hasHydrated ? orderNumber : "—"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearCart}
              title="Vaciar Orden Completa"
              className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto px-5 divide-y divide-slate-100"
            suppressHydrationWarning
          >
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 space-y-2">
                <span className="text-2xl">🛒</span>
                <p className="font-semibold text-slate-600">No hay productos en la orden</p>
                <p className="text-[10px] text-slate-400 max-w-[200px]">
                  Selecciona un producto del catálogo o escanea su código de barras[cite: 1, 6].
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0 pr-1">
                    <h4
                      className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 break-words"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      {item.brand} • <span className="font-mono">SKU: {item.sku}</span>
                    </p>
                  </div>

                  <div className="w-24 shrink-0 flex items-center justify-between border border-slate-200 rounded-lg bg-white shadow-2xs h-7 px-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded transition-colors cursor-pointer"
                      title="Reducir cantidad"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Aumentar cantidad"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-16 shrink-0 text-right">
                    <span className="text-xs font-extrabold text-slate-800 font-mono tabular-nums block">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="shrink-0 p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Eliminar producto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-4 border-t border-slate-100 bg-[#FAFAFA] space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>IVA (13%)</span>
              <span className="font-semibold tabular-nums">${iva.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total a Pagar</span>
              <span className="text-lg text-slate-900 tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
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
                onClick={() => {
                  setPaymentMethod("card");
                  setCashReceived("");
                }}
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
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
                onClick={() => {
                  setPaymentMethod("transfer");
                  setCashReceived("");
                }}
                className={`py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === "transfer"
                    ? "bg-sky-50 border-sky-500 text-sky-700 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Transferencia</span>
              </button>
            </div>

            {paymentMethod === "cash" && (
              <div className="pt-2 border-t border-slate-200/80 space-y-2 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Dinero Recibido ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder="0.00"
                        className={`w-full pl-6 pr-2 py-1.5 bg-white border rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none transition-colors ${
                          isCashInsufficient
                            ? "border-rose-400 focus:border-rose-500 bg-rose-50/30"
                            : "border-slate-300 focus:border-sky-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Cambio / Vuelto
                    </label>
                    <div className="relative flex items-center h-[34px] px-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <Coins className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                      <span className="font-mono font-extrabold text-sm text-emerald-700 tabular-nums">
                        ${changeDue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <button
                    type="button"
                    onClick={() => setCashReceived(total.toFixed(2))}
                    className="px-2 py-1 bg-white border border-slate-200 hover:border-sky-400 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Exacto (${total.toFixed(2)})
                  </button>
                  {CASH_SUGGESTIONS.filter((val) => val >= total).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCashReceived(val.toFixed(2))}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                {isCashInsufficient && (
                  <p className="text-[10px] font-semibold text-rose-600">
                    Faltan ${(total - numericCashReceived).toFixed(2)} para completar el pago.
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              disabled={!canCheckout}
              onClick={handleCheckout}
              className={`w-full mt-2 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
                canCheckout
                  ? "bg-[#0284C7] hover:bg-sky-700 text-white cursor-pointer active:scale-[0.99]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              <span>
                {isProcessing
                  ? "Procesando Venta..."
                  : paymentMethod === "cash" && numericCashReceived >= total && numericCashReceived > 0
                  ? `Cobrar $${total.toFixed(2)} (Entregar $${changeDue.toFixed(2)})`
                  : "Cobrar & Imprimir Ticket"}
              </span>
            </button>
          </div>
        </aside>
      </div>

      <ShiftWarningModal
        isOpen={showShiftWarning}
        onClose={() => setShowShiftWarning(false)}
      />
    </div>
  );
}