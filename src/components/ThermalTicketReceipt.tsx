import React from "react";

export interface TicketPrintData {
  ticketNumber: string;
  branch: string;
  cashier: string;
  date: string;
  time: string;
  paymentMethod: string;
  cashReceived?: number;
  changeReturned?: number;
  subtotal: number;
  tax: number;
  total: number;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

export function ThermalTicketReceipt({ data }: { data: TicketPrintData | null }) {
  if (!data) return null;

  // Extraer el número correlativo para la visualización (ej: T-SA-00000234 -> Ticket: 00000234)
  const ticketDisplay = data.ticketNumber.match(/\d+$/)
    ? `Ticket: ${data.ticketNumber.match(/\d+$/)![0]}`
    : `Ticket: ${data.ticketNumber}`;

  return (
    <div id="thermal-print-area" className="hidden print:block text-black tabular-nums text-[14px] leading-tight">
      <div className="w-[72mm] mx-auto py-2">
        {/* Encabezado */}
        <div className="text-center">
          <p className="text-base font-black tracking-wider">MARIO&apos;S DENT</p>
          <p className="text-[14px] font-semibold">Depósito Dental Especializado</p>
          <p className="text-[14px]">Sucursal: {data.branch}</p>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Metadatos */}
        <div className="flex justify-between text-[14px]">
          <span>{ticketDisplay}</span>
          <span>{data.date} {data.time}</span>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Encabezado de Productos */}
        <div className="flex justify-between font-bold text-[14px] pb-1">
          <span>DESCRIPCIÓN</span>
          <span>TOTAL</span>
        </div>

        {/* Detalle de partidas */}
        <div className="space-y-1.5">
          {data.items.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start">
                <span className="pr-2 break-words flex-1">{item.name}</span>
                <span className="shrink-0">${item.subtotal.toFixed(2)}</span>
              </div>
              {item.quantity > 1 && (
                <p className="text-[14px] pl-2">
                  {item.quantity} x ${item.unitPrice.toFixed(2)}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Totales */}
        <div className="space-y-0.5 text-[14px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA (13%):</span>
            <span>${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-[14px] pt-1">
            <span>TOTAL PAGADO:</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Liquidación y Operador */}
        <div className="text-[14px] space-y-1">
          <div className="flex justify-between">
            <span>Método de cobro:</span>
            <span className="font-semibold uppercase">
              {data.paymentMethod === "cash" ? "Efectivo" : data.paymentMethod === "card" ? "Tarjeta" : "Transferencia"}
            </span>
          </div>
          {data.paymentMethod === "cash" && data.cashReceived !== undefined && (
            <div className="flex justify-between text-[14px]">
              <span>Recibido: ${data.cashReceived.toFixed(2)}</span>
              <span>Cambio: ${Number(data.changeReturned || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="pt-1">
            <span>Atendido por:</span>
            <span>{data.cashier}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Pie de ticket */}
        <div className="text-center text-[14px] space-y-0.5 pt-1">
          <p>¡Gracias por su preferencia!</p>
        </div>
      </div>
    </div>
  );
}