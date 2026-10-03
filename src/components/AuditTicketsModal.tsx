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
  Eye,
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
                <h2 className="text-base font-black text-sky-600 tracking-tight">
                  Auditoría de Comprobantes y Tickets
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
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
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-rose-400 hover:text-white hover:bg-rose-500 transition-colors shadow-2xs cursor-pointer"
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
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-amber-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 tabular-nums">
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
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 tabular-nums">
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
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 tabular-nums">
                {counts.card}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentFilter("transfer")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                paymentFilter === "transfer"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-purple-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Transferencia</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 tabular-nums">
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
                        <span className="text-xs font-black text-slate-900 tabular-nums tracking-tight">
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
                      <span className="text-xs font-black text-slate-900 tabular-nums">
                        ${ticket.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-sky-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span>{ticket.time}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate max-w-[140px]">
                        <User className="w-3 h-3 text-sky-600 shrink-0" />
                        <span className="truncate">{ticket.cashier}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Columna derecha: Recibo digital */}
<div className="col-span-5 bg-slate-50/70 p-5 flex flex-col justify-between overflow-y-auto">
  {selectedTicket ? (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs tabular-nums text-xs text-slate-600 space-y-3">
        {/* Cabecera */}
        <div className="text-center pb-2.5 border-b border-dashed border-slate-200">
          <p className="font-black text-slate-800 text-sm tracking-wide">MARIO&apos;S DENT</p>
          <p className="text-[11px] text-slate-500 font-medium">Depósito Dental Especializado</p>

          {/* Dirección o Departamento de la sucursal */}
          <p className="text-[10px] text-slate-400 mt-0.5">
            Sucursal: {selectedTicket.branch && selectedTicket.branch !== "Sin dirección registrada"
              ? selectedTicket.branch
              : `Sucursal ${selectedTicket.branch}`}
          </p>

          {/* Ticket numérico correlativo y fecha */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span>
              Ticket: <strong>{selectedTicket.ticketNumber.replace(/^[A-Za-z]+-[A-Za-z]+-/, "")}</strong>
            </span>
            <span>
              {selectedTicket.date} • {selectedTicket.time}
            </span>
          </div>
        </div>

        {/* Detalle de Productos */}
        <div className="space-y-2 py-1.5 border-b border-dashed border-slate-200">
          {selectedTicket.items.map((it, idx) => (
            <div key={idx} className="flex justify-between items-start text-[11px]">
              <div className="pr-2 leading-tight">
                <span className="text-slate-800">{it.name}</span>
                {/* Solo si lleva 2 o más cantidades se muestra la multiplicación */}
                {it.qty > 1 && (
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {it.qty} x ${it.unitPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="font-bold text-slate-800 shrink-0">
                ${(it.qty * it.unitPrice).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="space-y-1 text-[11px] pt-1 border-b border-dashed border-slate-200 pb-2.5">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span>${selectedTicket.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>IVA (13%)</span>
            <span>${selectedTicket.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-800 pt-1">
            <span>TOTAL PAGADO:</span>
            <span className="text-emerald-600 font-extrabold text-sm">
              ${selectedTicket.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Método de pago y Atendido por debajo */}
        <div className="text-[10px] space-y-1.5 text-slate-500 pt-1">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-400">Método de cobro:</span>
            <strong className="text-slate-700 uppercase font-bold">
              {selectedTicket.paymentMethod === "cash"
                ? "Efectivo"
                : selectedTicket.paymentMethod === "card"
                ? "Tarjeta POS / Voucher"
                : "Transferencia"}
            </strong>
          </div>

          {selectedTicket.paymentMethod === "cash" && (
            <div className="flex justify-between px-1 text-[10px] text-slate-400">
              <span>Recibido: ${selectedTicket.cashReceived?.toFixed(2) ?? "0.00"}</span>
              <span>Cambio: ${selectedTicket.changeReturned?.toFixed(2) ?? "0.00"}</span>
            </div>
          )}

          {/* Atendido por ubicado debajo del método de pago */}
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            Atendido por: <strong className="text-slate-600">{selectedTicket.cashier}</strong>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => alert(`Reimprimiendo comprobante ${selectedTicket.ticketNumber}...`)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5 text-sky-600" />
        <span>Reimprimir Comprobante</span>
      </button>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
      <Eye className="w-8 h-8 stroke-[1.5] mb-2 text-slate-300" />
      <p className="text-xs">Selecciona un ticket del listado para ver su detalle.</p>
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
}