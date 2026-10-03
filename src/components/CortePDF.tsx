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
        onclone: (clonedDoc: Document) => {
          // Remueve las hojas de estilo de Tailwind v4 del documento clonado
          // para eliminar de raíz cualquier función lab() u oklch() heredada
          const styleSheets = clonedDoc.querySelectorAll("style, link[rel='stylesheet']");
          styleSheets.forEach((s) => s.remove());
        },
      },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" as const },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Error al descargar el PDF:", error);
    alert("Hubo un error al generar la descarga del PDF.");
  }
}

const emptySubscribe = () => () => {};

export default function CorteZPDFTemplate({ data }: { data: CorteZData }) {
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

  // Estilos base estrictamente en Blanco y Negro
  const borderThin = "1px solid #000000";
  const borderThick = "2px solid #000000";
  const borderLight = "1px solid #d1d5db";

  return (
    <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -100 }}>
      <div
        id="corte-z-pdf-report"
        style={{
          width: "750px",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, Helvetica, sans-serif",
          boxSizing: "border-box",
          padding: "36px",
          fontSize: "11px",
          lineHeight: "1.4",
        }}
      >
        {/* ENCABEZADO Y MEMBRETE */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: borderThick,
            paddingBottom: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              MARIO&apos;S DENT
            </h1>
            <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: "#333333" }}>
              Depósito Dental Especializado • Sucursal {data.branch}
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: "#666666" }}>
              PBX: (503) 2440-1234 • Santa Ana, El Salvador
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Corte Z — Balance Diario
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", marginTop: "3px" }}>
              Folio: {data.folio}
            </div>
            <div style={{ fontSize: "10px", color: "#444444" }}>
              Emisión: {data.date}
            </div>
          </div>
        </div>

        {/* METADATOS DEL TURNO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            padding: "10px 14px",
            border: borderLight,
            marginBottom: "24px",
            fontSize: "11px",
          }}
        >
          <div>
            <span style={{ display: "block", fontSize: "9px", textTransform: "uppercase", color: "#666666" }}>
              Fecha
            </span>
            <strong>{data.date}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "9px", textTransform: "uppercase", color: "#666666" }}>
              Jornada
            </span>
            <strong>Completa</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "9px", textTransform: "uppercase", color: "#666666" }}>
              Cajero Responsable
            </span>
            <strong>{data.cashier}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "9px", textTransform: "uppercase", color: "#666666" }}>
              Auditor / Supervisor
            </span>
            <strong>{data.adminName}</strong>
          </div>
        </div>

        {/* TABLA PRINCIPAL DE VALORES (ESTRUCTURA CONTABLE B&N) */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "11px",
            marginBottom: "24px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: borderThick, textAlign: "left", fontSize: "10px", textTransform: "uppercase" }}>
              <th style={{ padding: "6px 0" }}>Descripción Contable</th>
              <th style={{ padding: "6px 0", textAlign: "right" }}>Monto USD</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: borderLight }}>
              <td style={{ padding: "6px 0" }}>Ventas en Efectivo</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${data.cashSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ borderBottom: borderLight }}>
              <td style={{ padding: "6px 0" }}>Ventas con Tarjeta (POS)</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${data.cardSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ borderBottom: borderLight }}>
              <td style={{ padding: "6px 0" }}>Transferencias Bancarias</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${data.transferSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ borderBottom: borderThin, fontWeight: "bold" }}>
              <td style={{ padding: "8px 0" }}>TOTAL VENTAS BRUTAS</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ color: "#666666", fontSize: "10px" }}>
              <td style={{ padding: "4px 0 2px 10px" }}>↳ Venta Gravada Neta</td>
              <td style={{ padding: "4px 0 2px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${netSales.toFixed(2)}
              </td>
            </tr>
            <tr style={{ color: "#666666", fontSize: "10px", borderBottom: borderLight }}>
              <td style={{ padding: "2px 0 6px 10px" }}>↳ IVA Débito Fiscal (13%)</td>
              <td style={{ padding: "2px 0 6px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${iva.toFixed(2)}
              </td>
            </tr>

            {/* Espacio separador */}
            <tr>
              <td colSpan={2} style={{ height: "14px" }}></td>
            </tr>

            {/* Sección Conciliación Efectivo */}
            <tr style={{ borderBottom: borderLight }}>
              <td style={{ padding: "6px 0" }}>(+) Fondo Inicial de Apertura</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${data.initialFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ borderBottom: borderLight }}>
              <td style={{ padding: "6px 0" }}>(-) Gastos Operativos Menores</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontFamily: "monospace" }}>
                -${data.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ borderBottom: borderThin }}>
              <td style={{ padding: "6px 0" }}>(=) Efectivo Teórico Esperado</td>
              <td style={{ padding: "6px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${expectedCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style={{ borderBottom: borderThick, fontWeight: "bold" }}>
              <td style={{ padding: "8px 0" }}>Efectivo Físico Contado (Arqueo)</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace" }}>
                ${data.countedCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>

            {/* Diferencia Final */}
            <tr style={{ fontWeight: "bold" }}>
              <td style={{ padding: "10px 0 0 0", fontSize: "12px", textTransform: "uppercase" }}>
                Diferencia Final de Caja
              </td>
              <td
                style={{
                  padding: "10px 0 0 0",
                  textAlign: "right",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              >
                {data.difference > 0 && "+"}
                ${data.difference.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* DICTAMEN / NOTAS */}
        <div
          style={{
            borderTop: borderThin,
            borderBottom: borderThin,
            padding: "10px 0",
            marginBottom: "40px",
            fontSize: "10px",
          }}
        >
          {data.cashierNote && (
            <div style={{ marginBottom: "4px" }}>
              <strong>Nota Cajero:</strong> <em>&ldquo;{data.cashierNote}&rdquo;</em>
            </div>
          )}
          <div>
            <strong>Dictamen de Auditoría:</strong> [{data.resolutionType}]
            {data.adminNote ? ` — ${data.adminNote}` : " — Conforme"}
          </div>
        </div>

        {/* FIRMAS DE CONFORMIDAD */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            textAlign: "center",
            fontSize: "10px",
            paddingTop: "20px",
          }}
        >
          <div>
            <div style={{ borderTop: borderThin, paddingTop: "6px", fontWeight: "bold", textTransform: "uppercase" }}>
              {data.cashier}
            </div>
            <div style={{ color: "#555555", marginTop: "2px" }}>Firma del Cajero</div>
          </div>
          <div>
            <div style={{ borderTop: borderThin, paddingTop: "6px", fontWeight: "bold", textTransform: "uppercase" }}>
              {data.adminName}
            </div>
            <div style={{ color: "#555555", marginTop: "2px" }}>Firma Supervisor / Auditor</div>
          </div>
        </div>
      </div>
    </div>
  );
}