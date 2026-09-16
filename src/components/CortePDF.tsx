"use client";

import React, { useSyncExternalStore } from "react";

export interface CorteZData {
  folio: string;
  branch: string;
  date: string;
  cashier: string;
  adminName: string;
  initialFund: number;
  cashSales: number;
  cardSales: number;
  transferSales: number;
  expenses: number;
  countedCash: number;
  difference: number;
  cashierNote: string;
  adminNote: string;
  resolutionType: string;
}

export async function downloadCorteZPDF(filename?: string) {
  const element = document.getElementById("corte-z-pdf-report");
  if (!element) return;

  try {
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: filename || "Corte-Z-Diario.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" as const },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Error al descargar el PDF:", error);
    alert("Hubo un error al generar la descarga del PDF.");
  }
}

// Suscripción segura para hidratación sin cascading renders
const emptySubscribe = () => () => {};

export default function CorteZPDFTemplate({ data }: { data: CorteZData }) {
  // Garantiza que solo renderice en cliente sin disparar useEffect ni cascading renders
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) return null;

  const expectedCash = data.initialFund + data.cashSales - data.expenses;
  const totalSales = data.cashSales + data.cardSales + data.transferSales;
  const iva = totalSales * 0.13;
  const netSales = totalSales - iva;

  return (
    <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -100 }}>
      <div
        id="corte-z-pdf-report"
        style={{
          width: "800px",
          minHeight: "1050px",
          backgroundColor: "#ffffff",
          color: "#0f172a",
        }}
        className="font-sans text-xs p-10 box-border"
      >
        {/* ENCABEZADO Y MEMBRETE */}
        <div
          style={{ borderColor: "#0f172a" }}
          className="flex justify-between items-start border-b-2 pb-3 mb-5"
        >
          <div>
            <h1
              style={{ color: "#0f172a" }}
              className="text-xl font-black uppercase tracking-tight"
            >
              MARIO&apos;S DENT
            </h1>
            <p style={{ color: "#475569" }} className="text-xs font-semibold">
              Depósito Dental Especializado • Sucursal {data.branch}
            </p>
            <p style={{ color: "#64748b" }} className="text-[10px]">
              PBX: (503) 2440-1234 • Santa Ana, El Salvador
            </p>
          </div>
          <div className="text-right">
            <span
              style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
              className="inline-block font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider"
            >
              Corte Z - Auditoría Diaria
            </span>
            <p
              suppressHydrationWarning
              style={{ color: "#1e293b" }}
              className="font-mono font-bold text-xs mt-1.5"
            >
              Folio: {data.folio}
            </p>
            <p
              suppressHydrationWarning
              style={{ color: "#64748b" }}
              className="text-[10px]"
            >
              Fecha de Emisión: {data.date}
            </p>
          </div>
        </div>

        {/* METADATOS DE LA JORNADA */}
        <div
          style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
          className="grid grid-cols-4 gap-4 p-3 border rounded-lg mb-6 text-[11px]"
        >
          <div>
            <span
              style={{ color: "#94a3b8" }}
              className="block text-[9px] uppercase font-bold"
            >
              Fecha Auditada
            </span>
            <strong suppressHydrationWarning style={{ color: "#1e293b" }}>
              {data.date}
            </strong>
          </div>
          <div>
            <span
              style={{ color: "#94a3b8" }}
              className="block text-[9px] uppercase font-bold"
            >
              Jornada
            </span>
            <strong style={{ color: "#1e293b" }}>Jornada Completa</strong>
          </div>
          <div>
            <span
              style={{ color: "#94a3b8" }}
              className="block text-[9px] uppercase font-bold"
            >
              Cajero Responsable
            </span>
            <strong style={{ color: "#1e293b" }}>{data.cashier}</strong>
          </div>
          <div>
            <span
              style={{ color: "#94a3b8" }}
              className="block text-[9px] uppercase font-bold"
            >
              Auditor / Supervisor
            </span>
            <strong style={{ color: "#1e293b" }}>{data.adminName}</strong>
          </div>
        </div>

        {/* DOS COLUMNAS: INGRESOS VS ARQUEO */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Columna Izquierda: Ingresos por forma de pago */}
          <div style={{ borderColor: "#e2e8f0" }} className="border rounded-lg p-4">
            <h2
              style={{ color: "#1e293b", borderColor: "#e2e8f0" }}
              className="text-[11px] font-bold uppercase tracking-wider border-b pb-2 mb-3"
            >
              1. Desglose de Ventas e Ingresos
            </h2>
            <table className="w-full text-[11px]">
              <tbody style={{ borderColor: "#f1f5f9" }} className="divide-y">
                <tr>
                  <td style={{ color: "#475569" }} className="py-1.5">
                    Ventas en Efectivo
                  </td>
                  <td className="py-1.5 font-mono text-right font-semibold">
                    ${data.cashSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#475569" }} className="py-1.5">
                    Ventas con Tarjeta (POS)
                  </td>
                  <td className="py-1.5 font-mono text-right font-semibold">
                    ${data.cardSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#475569" }} className="py-1.5">
                    Transferencias Bancarias
                  </td>
                  <td className="py-1.5 font-mono text-right font-semibold">
                    ${data.transferSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr
                  style={{ borderColor: "#cbd5e1" }}
                  className="font-bold border-t"
                >
                  <td style={{ color: "#0f172a" }} className="pt-2">
                    TOTAL INGRESOS BRUTOS
                  </td>
                  <td
                    style={{ color: "#075985" }}
                    className="pt-2 font-mono text-right"
                  >
                    ${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr style={{ color: "#64748b" }} className="text-[10px]">
                  <td className="pt-1">IVA Débito Fiscal (13%)</td>
                  <td className="pt-1 font-mono text-right">${iva.toFixed(2)}</td>
                </tr>
                <tr style={{ color: "#64748b" }} className="text-[10px]">
                  <td className="pt-0.5">Ventas Gravadas Netas</td>
                  <td className="pt-0.5 font-mono text-right">${netSales.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Columna Derecha: Conciliación de Efectivo Físico */}
          <div style={{ borderColor: "#e2e8f0" }} className="border rounded-lg p-4">
            <h2
              style={{ color: "#1e293b", borderColor: "#e2e8f0" }}
              className="text-[11px] font-bold uppercase tracking-wider border-b pb-2 mb-3"
            >
              2. Conciliación de Efectivo (Arqueo)
            </h2>
            <table className="w-full text-[11px]">
              <tbody style={{ borderColor: "#f1f5f9" }} className="divide-y">
                <tr>
                  <td style={{ color: "#475569" }} className="py-1.5">
                    (+) Fondo Inicial de Caja
                  </td>
                  <td className="py-1.5 font-mono text-right font-semibold">
                    ${data.initialFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#475569" }} className="py-1.5">
                    (+) Ventas en Efectivo
                  </td>
                  <td className="py-1.5 font-mono text-right font-semibold">
                    ${data.cashSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#475569" }} className="py-1.5">
                    (-) Gastos Menores en Efectivo
                  </td>
                  <td
                    style={{ color: "#dc2626" }}
                    className="py-1.5 font-mono text-right font-semibold"
                  >
                    -${data.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr
                  style={{ borderColor: "#cbd5e1" }}
                  className="font-bold border-t"
                >
                  <td style={{ color: "#1e293b" }} className="pt-2">
                    Efectivo Teórico Esperado
                  </td>
                  <td className="pt-2 font-mono text-right">
                    ${expectedCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#475569" }} className="py-1.5">
                    Efectivo Físico Contado
                  </td>
                  <td className="py-1.5 font-mono text-right font-semibold">
                    ${data.countedCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr
                  style={{ borderColor: "#cbd5e1" }}
                  className="font-bold border-t"
                >
                  <td style={{ color: "#0f172a" }} className="pt-2">
                    DIFERENCIA FINAL
                  </td>
                  <td
                    style={{
                      color: data.difference < 0 ? "#dc2626" : "#15803d",
                    }}
                    className="pt-2 font-mono text-right"
                  >
                    {data.difference >= 0
                      ? `+$${data.difference.toFixed(2)}`
                      : `-$${Math.abs(data.difference).toFixed(2)}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DICTAMEN DE AUDITORÍA */}
        <div style={{ borderColor: "#e2e8f0" }} className="border rounded-lg p-4 mb-10">
          <h2
            style={{ color: "#1e293b", borderColor: "#e2e8f0" }}
            className="text-[11px] font-bold uppercase tracking-wider border-b pb-2 mb-2"
          >
            3. Dictamen y Resolución de Auditoría
          </h2>
          <div className="space-y-1.5 text-[11px]">
            <p>
              <strong style={{ color: "#334155" }}>Justificación de la Cajera:</strong>{" "}
              <span style={{ color: "#475569" }} className="italic">
                &ldquo;{data.cashierNote}&rdquo;
              </span>
            </p>
            <p>
              <strong style={{ color: "#334155" }}>Dictamen del Administrador:</strong>{" "}
              <span
                style={{ color: "#0f172a" }}
                className="font-mono font-bold uppercase"
              >
                [{data.resolutionType}]
              </span>{" "}
              — {data.adminNote}
            </p>
          </div>
        </div>

        {/* FIRMAS DE CONFORMIDAD */}
        <div className="grid grid-cols-2 gap-16 pt-12 text-center text-[10px]">
          <div>
            <div
              style={{ borderColor: "#94a3b8", color: "#1e293b" }}
              className="border-t pt-2 font-bold"
            >
              {data.cashier}
            </div>
            <p style={{ color: "#64748b" }}>Firma del Cajero en Turno</p>
          </div>
          <div>
            <div
              style={{ borderColor: "#94a3b8", color: "#1e293b" }}
              className="border-t pt-2 font-bold"
            >
              {data.adminName}
            </div>
            <p style={{ color: "#64748b" }}>Firma del Administrador / Auditor</p>
          </div>
        </div>
      </div>
    </div>
  );
}