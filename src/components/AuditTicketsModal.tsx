"use client";

import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Receipt,
  X,
  Search,
  Calendar,
  Banknote,
  CreditCard,
  Building2,
  Printer,
  Clock,
  User,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

// ==========================================
// INTERFACES DEL MODELO
// ==========================================
export interface TicketItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface TicketRecord {
  id: string;
  ticketNumber: string;
  time: string;
  date: string;
  branch: string;
  cashier: string;
  paymentMethod: "cash" | "card" | "transfer";
  subtotal: number;
  tax: number;
  total: number;
  cashReceived?: number;
  changeReturned?: number;
  authCode?: string;
  items: TicketItem[];
}

// Interfaces auxiliares para tipar la respuesta de Supabase sin 'any'
interface SupabaseSaleItemRow {
  id: string;
  quantity: number | null;
  unit_price: number | null;
  products: { name: string } | { name: string }[] | null;
}

interface SupabaseSaleRow {
  id: string;
  ticket_number: string | null;
  payment_method: "cash" | "card" | "transfer" | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  cash_received: number | null;
  change_given: number | null;
  created_at: string;
  branches: { name: string } | { name: string }[] | null;
  profiles: { full_name: string } | { full_name: string }[] | null;
  sale_items: SupabaseSaleItemRow[] | null;
}

interface AuditTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  selectedDate: string;
  selectedShift?: string;
}

export default function AuditTicketsModal({
  isOpen,
  onClose,
  branchName,
  selectedDate,
  selectedShift = "Jornada Completa",
}: AuditTicketsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | "cash" | "card" | "transfer">("ALL");
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Consulta de ventas reales a Supabase
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchTickets() {
      setIsLoading(true);
      try {
        const startOfDay = `${selectedDate}T00:00:00.000Z`;
        const endOfDay = `${selectedDate}T23:59:59.999Z`;

        const { data, error } = await supabase
          .from("sales")
          .select(`
            id,
            ticket_number,
            payment_method,
            subtotal,
            tax,
            total,
            cash_received,
            change_given,
            created_at,
            branches!inner(name),
            profiles(full_name),
            sale_items(
              id,
              quantity,
              unit_price,
              products(name)
            )
          `)
          .ilike("branches.name", `%${branchName.trim()}%`)
          .gte("created_at", startOfDay)
          .lte("created_at", endOfDay)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (isMounted) {
          const queryRows = (data ?? []) as unknown as SupabaseSaleRow[];

          const formatted: TicketRecord[] = queryRows.map((s) => {
            const dateObj = new Date(s.created_at);
            const branchObj = Array.isArray(s.branches) ? s.branches[0] : s.branches;
            const profileObj = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;

            return {
              id: s.id,
              ticketNumber: s.ticket_number || `T-${s.id.slice(0, 6)}`,
              time: dateObj.toLocaleTimeString("es-SV", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              date: selectedDate,
              branch: branchObj?.name || branchName,
              cashier: profileObj?.full_name || "Cajero Asignado",
              paymentMethod: s.payment_method || "cash",
              subtotal: Number(s.subtotal || 0),
              tax: Number(s.tax || 0),
              total: Number(s.total || 0),
              cashReceived: s.cash_received ? Number(s.cash_received) : undefined,
              changeReturned: s.change_given ? Number(s.change_given) : undefined,
              items: (s.sale_items || []).map((it) => {
                const prodObj = Array.isArray(it.products) ? it.products[0] : it.products;
                return {
                  name: prodObj?.name || "Insumo Dental",
                  qty: Number(it.quantity || 1),
                  unitPrice: Number(it.unit_price || 0),
                };
              }),
            };
          });

          setTickets(formatted);
          setSelectedTicket(formatted.length > 0 ? formatted[0] : null);
        }
      } catch (err) {
        console.error("Error al obtener tickets para auditoría:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchTickets();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedDate, branchName]);

  // Contadores para los botones de filtro
  const counts = useMemo(() => {
    return {
      all: tickets.length,
      cash: tickets.filter((t) => t.paymentMethod === "cash").length,
      card: tickets.filter((t) => t.paymentMethod === "card").length,
      transfer: tickets.filter((t) => t.paymentMethod === "transfer").length,
    };
  }, [tickets]);

  // Filtrado reactivo en memoria
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.cashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchMethod = paymentFilter === "ALL" || t.paymentMethod === paymentFilter;
      return matchSearch && matchMethod;
    });
  }, [tickets, searchTerm, paymentFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      {/* Contenedor Adaptable con altura dinámica de pantalla */}
      <div className="bg-white border border-slate-200 w-full max-w-6xl h-[88vh] max-h-[820px] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* =========================================================================
            CABECERA PRINCIPAL (Sincronizada con Sede y Fecha)
           ========================================================================= */}
        <header className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Auditoría de Comprobantes y Tickets
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  <ShieldCheck className="w-3 h-3 text-sky-600" />
                  Fiscalización Diaria
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                <span>Sucursal: <strong className="text-slate-800">{branchName}</strong></span>
                <span>•</span>
                <span>{selectedShift}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>{selectedDate}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* =========================================================================
            BARRA DE BÚSQUEDA Y FILTROS POR MÉTODO DE PAGO
           ========================================================================= */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por folio, cajero o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setPaymentFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                paymentFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 font-mono">
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentFilter("cash")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                paymentFilter === "cash"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Efectivo</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 font-mono">
                {counts.cash}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentFilter("card")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                paymentFilter === "card"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Tarjeta</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 font-mono">
                {counts.card}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentFilter("transfer")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                paymentFilter === "transfer"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Transferencia</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 font-mono">
                {counts.transfer}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CUERPO EN 2 COLUMNAS CON SCROLL INDEPENDIENTE
           ========================================================================= */}
        <div className="flex-1 grid grid-cols-12 min-h-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/40">
          
          {/* COLUMNA IZQUIERDA: Listado de Transacciones */}
          <div className="col-span-12 md:col-span-5 lg:col-span-5 h-full overflow-y-auto p-4 space-y-2.5">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold">Cargando tickets de la jornada...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/60">
                <FileSpreadsheet className="w-10 h-10 text-slate-300 mb-2.5" />
                <p className="text-xs font-bold text-slate-700">No hay tickets registrados</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
                  No se encontraron ventas para {selectedDate} en la sucursal {branchName}.
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-500/10"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 font-mono tracking-tight">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            ticket.paymentMethod === "cash"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : ticket.paymentMethod === "card"
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          }`}
                        >
                          {ticket.paymentMethod === "cash"
                            ? "Efectivo"
                            : ticket.paymentMethod === "card"
                            ? "Tarjeta"
                            : "Transf."}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900 font-mono">
                        ${ticket.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>{ticket.time}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate max-w-[140px]">
                        <User className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="truncate">{ticket.cashier}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* COLUMNA DERECHA: Visor del Comprobante Digital */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7 h-full overflow-y-auto p-4 md:p-6 flex items-center justify-center">
            {selectedTicket ? (
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-lg p-6 space-y-4 font-mono">
                {/* Membrete del Ticket */}
                <div className="text-center border-b border-dashed border-slate-200 pb-4">
                  <h3 className="text-sm font-black tracking-wider text-slate-900 uppercase">
                    MARIO&apos;S DENT
                  </h3>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                    Depósito Dental Especializado
                  </p>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Sucursal: {selectedTicket.branch}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <span>Folio: <strong className="text-slate-900">{selectedTicket.ticketNumber}</strong></span>
                    <span>{selectedTicket.date} • {selectedTicket.time}</span>
                  </div>
                </div>

                {/* Lista de Insumos Facturados */}
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="pb-1.5 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Descripción</span>
                    <span>Total</span>
                  </div>
                  {selectedTicket.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between gap-2">
                      <div className="truncate pr-2 font-sans">
                        <p className="font-bold text-slate-800 text-xs truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.qty} x ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        ${(item.qty * item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotales y Cierre Contable */}
                <div className="pt-3 border-t border-dashed border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedTicket.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (13%):</span>
                    <span>${selectedTicket.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-100">
                    <span>TOTAL PAGADO:</span>
                    <span className="text-emerald-600">${selectedTicket.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Información de Liquidación */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Método de cobro:</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {selectedTicket.paymentMethod === "cash"
                        ? "Efectivo en Gaveta"
                        : selectedTicket.paymentMethod === "card"
                        ? "Tarjeta POS / Voucher"
                        : "Transferencia Bancaria"}
                    </span>
                  </div>
                  {selectedTicket.paymentMethod === "cash" && selectedTicket.cashReceived !== undefined && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Efectivo entregado:</span>
                        <span className="font-bold text-slate-800">
                          ${selectedTicket.cashReceived.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cambio devuelto:</span>
                        <span className="font-bold text-emerald-600">
                          ${(selectedTicket.changeReturned || 0).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-sans">
                  <span>Atendido por: {selectedTicket.cashier}</span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1 text-sky-600 font-bold hover:underline cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Reimprimir Copia
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-400">
                <Receipt className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-600">Selecciona un ticket del listado</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Haz clic sobre una venta a la izquierda para inspeccionar su comprobante térmico digital.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}