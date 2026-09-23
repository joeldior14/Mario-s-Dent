"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Receipt,
  Printer,
  Eye,
  CreditCard,
  Banknote,
  Building2,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  fetchTicketsByBranchAndDate,
  TicketRecordAudit,
} from "@/app/services/inventoryService";

function normalizeDate(rawDate?: string): string {
  if (!rawDate) return new Date().toISOString().split("T")[0];
  if (rawDate.includes("-")) {
    const parts = rawDate.split("-");
    if (parts[0].length === 4) return rawDate;
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  if (rawDate.includes("/")) {
    const parts = rawDate.split("/");
    if (parts[2]?.length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }
  return rawDate;
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
  const [tickets, setTickets] = useState<TicketRecordAudit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [selectedTicket, setSelectedTicket] = useState<TicketRecordAudit | null>(null);

  const targetDate = useMemo(() => normalizeDate(selectedDate), [selectedDate]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function loadTickets() {
      setIsLoading(true);
      try {
        const data = await fetchTicketsByBranchAndDate(branchName, targetDate);
        if (isMounted) {
          setTickets(data);
          setSelectedTicket(data.length > 0 ? data[0] : null);
        }
      } catch (err) {
        console.error("Error al cargar tickets:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, [isOpen, branchName, targetDate]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.items.some((i) => i.name.toLowerCase().includes(q));

      const matchMethod = paymentFilter === "ALL" || t.paymentMethod === paymentFilter;

      return matchSearch && matchMethod;
    });
  }, [tickets, searchTerm, paymentFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-4xl h-[640px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* CABECERA */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Auditoría de Comprobantes y Tickets
              </h2>
              <p className="text-[11px] text-slate-400">
                Sucursal: <strong className="text-slate-600">{branchName}</strong> • {selectedShift}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-bold text-slate-700 font-mono">
                {targetDate}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="px-6 py-2.5 border-b border-slate-100 bg-white flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por folio o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              onClick={() => setPaymentFilter("ALL")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                paymentFilter === "ALL" ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              Todos ({filteredTickets.length})
            </button>
            <button
              onClick={() => setPaymentFilter("cash")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                paymentFilter === "cash" ? "bg-white text-emerald-700 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              <Banknote className="w-3 h-3" /> Efectivo
            </button>
            <button
              onClick={() => setPaymentFilter("card")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                paymentFilter === "card" ? "bg-white text-sky-700 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              <CreditCard className="w-3 h-3" /> Tarjeta
            </button>
            <button
              onClick={() => setPaymentFilter("transfer")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                paymentFilter === "transfer" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              <Building2 className="w-3 h-3" /> Transf.
            </button>
          </div>
        </div>

        {/* CUERPO DIVIDIDO */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* LADO IZQUIERDO: LISTADO */}
          <div className="col-span-7 border-r border-slate-100 overflow-y-auto divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                <p className="text-xs">Consultando comprobantes en base de datos...</p>
              </div>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-sky-50/70 border-l-4 border-l-sky-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {t.ticketNumber}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {t.paymentMethod}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {t.time} • Cajero: {t.cashier}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      ${t.total.toFixed(2)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Receipt className="w-8 h-8 stroke-[1.5] text-slate-300 mb-2" />
                <p className="text-xs">No hay tickets para la fecha {targetDate}.</p>
              </div>
            )}
          </div>

          {/* LADO DERECHO: DETALLE DEL TICKET */}
          <div className="col-span-5 bg-slate-50/70 p-5 flex flex-col justify-between overflow-y-auto">
            {selectedTicket ? (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs font-mono text-xs text-slate-600 space-y-3">
                  <div className="text-center pb-2 border-b border-dashed border-slate-200">
                    <p className="font-black text-slate-800 text-sm">MARIOS DENT</p>
                    <p className="text-[10px] text-slate-400 uppercase">Sucursal {selectedTicket.branch}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Folio: <strong>{selectedTicket.ticketNumber}</strong></p>
                    <p className="text-[10px] text-slate-400">{selectedTicket.date} • {selectedTicket.time}</p>
                  </div>

                  <div className="space-y-1.5 py-1 border-b border-dashed border-slate-200">
                    {selectedTicket.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-start text-[11px]">
                        <span className="pr-2 leading-tight">{it.qty}x {it.name}</span>
                        <span className="font-bold text-slate-800 shrink-0">
                          ${(it.qty * it.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-[11px] pt-1 border-b border-dashed border-slate-200 pb-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span>${selectedTicket.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>IVA (13%)</span>
                      <span>${selectedTicket.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 pt-1">
                      <span>TOTAL COBRADO</span>
                      <span>${selectedTicket.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-[10px] space-y-0.5 text-slate-500">
                    <p>Método: <strong className="uppercase">{selectedTicket.paymentMethod}</strong></p>
                    {selectedTicket.paymentMethod === "cash" ? (
                      <>
                        <p>Recibido: ${selectedTicket.cashReceived?.toFixed(2) ?? "0.00"}</p>
                        <p>Cambio: ${selectedTicket.changeReturned?.toFixed(2) ?? "0.00"}</p>
                      </>
                    ) : (
                      <p>Voucher / Auth: {selectedTicket.authCode || "N/A"}</p>
                    )}
                    <p>Atendió: {selectedTicket.cashier}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Reimprimiendo comprobante archivado ${selectedTicket.ticketNumber}...`)}
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