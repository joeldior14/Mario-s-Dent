"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";

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

const ALL_MOCK_TICKETS: TicketRecord[] = [
  {
    id: "tk-1",
    ticketNumber: "T-SA-1045",
    time: "10:14 AM",
    date: "2026-09-08",
    branch: "Santa Ana",
    cashier: "Maria G.",
    paymentMethod: "cash",
    subtotal: 79.65,
    tax: 10.35,
    total: 90.0,
    cashReceived: 100.0,
    changeReturned: 10.0,
    items: [
      { name: "Resina Filtek Z250 XT (A2)", qty: 2, unitPrice: 32.5 },
      { name: "Alginato Hydrogum 5 (453g)", qty: 1, unitPrice: 25.0 },
    ],
  },
  {
    id: "tk-2",
    ticketNumber: "T-SA-1044",
    time: "09:48 AM",
    date: "2026-09-08",
    branch: "Santa Ana",
    cashier: "Maria G.",
    paymentMethod: "card",
    subtotal: 42.48,
    tax: 5.52,
    total: 48.0,
    authCode: "AUTH-882190",
    items: [
      { name: "Lidocaína 2% c/Epinefrina (Caja x 50)", qty: 1, unitPrice: 48.0 },
    ],
  },
  {
    id: "tk-3",
    ticketNumber: "T-SA-1030",
    time: "04:20 PM",
    date: "2026-09-07",
    branch: "Santa Ana",
    cashier: "Maria G.",
    paymentMethod: "cash",
    subtotal: 120.0,
    tax: 15.6,
    total: 135.6,
    cashReceived: 150.0,
    changeReturned: 14.4,
    items: [{ name: "Opalescence Go 15%", qty: 2, unitPrice: 67.8 }],
  },
  {
    id: "tk-4",
    ticketNumber: "T-SA-1029",
    time: "11:15 AM",
    date: "2026-09-07",
    branch: "Santa Ana",
    cashier: "Maria G.",
    paymentMethod: "transfer",
    subtotal: 65.0,
    tax: 8.45,
    total: 73.45,
    authCode: "SPEI-44910",
    items: [{ name: "Guantes Nitrilo Med (Caja x 100)", qty: 5, unitPrice: 14.69 }],
  },
];

function normalizeDate(rawDate?: string): string {
  if (!rawDate) return "2026-09-08";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const targetDate = useMemo(() => normalizeDate(selectedDate), [selectedDate]);

  // Filtrado de comprobantes
  const filteredTickets = useMemo(() => {
    return ALL_MOCK_TICKETS.filter((t) => {
      const matchDate = t.date === targetDate;
      const matchBranch = t.branch.toLowerCase().includes(branchName.toLowerCase());
      const matchSearch =
        t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchMethod = paymentFilter === "ALL" || t.paymentMethod === paymentFilter;

      return matchDate && matchBranch && matchSearch && matchMethod;
    });
  }, [targetDate, branchName, searchTerm, paymentFilter]);

  // Derivación en render para evitar llamadas síncronas en hooks
  const selectedTicket = useMemo(() => {
    if (filteredTickets.length === 0) return null;
    return filteredTickets.find((t) => t.id === selectedTicketId) ?? filteredTickets[0];
  }, [filteredTickets, selectedTicketId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-4xl h-[620px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
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
                Sucursal: <strong className="text-slate-700">{branchName}</strong> • {selectedShift}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-bold text-slate-700 font-mono">
                {targetDate}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
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
              type="button"
              onClick={() => setPaymentFilter("ALL")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                paymentFilter === "ALL" ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              Todos ({filteredTickets.length})
            </button>
            <button
              type="button"
              onClick={() => setPaymentFilter("cash")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                paymentFilter === "cash" ? "bg-white text-emerald-700 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              <Banknote className="w-3 h-3" /> Efectivo
            </button>
            <button
              type="button"
              onClick={() => setPaymentFilter("card")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                paymentFilter === "card" ? "bg-white text-sky-700 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              <CreditCard className="w-3 h-3" /> Tarjeta
            </button>
            <button
              type="button"
              onClick={() => setPaymentFilter("transfer")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                paymentFilter === "transfer" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500"
              }`}
            >
              <Building2 className="w-3 h-3" /> Transf.
            </button>
          </div>
        </div>

        {/* Split View */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Columna izquierda: Lista de tickets */}
          <div className="col-span-7 border-r border-slate-100 overflow-y-auto divide-y divide-slate-100 bg-white">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
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
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
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

          {/* Columna derecha: Recibo digital */}
          <div className="col-span-5 bg-slate-50/70 p-5 flex flex-col justify-between overflow-y-auto">
            {selectedTicket ? (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs font-mono text-xs text-slate-600 space-y-3">
                  <div className="text-center pb-2 border-b border-dashed border-slate-200">
                    <p className="font-black text-slate-800 text-sm">MARIO&apos;S DENT</p>
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
                        <p>Recibido: ${selectedTicket.cashReceived?.toFixed(2)}</p>
                        <p>Cambio: ${selectedTicket.changeReturned?.toFixed(2)}</p>
                      </>
                    ) : (
                      <p>Voucher / Auth: {selectedTicket.authCode}</p>
                    )}
                    <p>Atendió: {selectedTicket.cashier}</p>
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