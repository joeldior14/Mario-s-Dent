export interface HaciendaItem {
  sku: string;
  name: string;
  brand: string;
  description: string;
  units: number;
  cost: number;
  price: number;
}

export function exportInventoryToCSV(
  items: HaciendaItem[],
  fiscalYear: string = "2026",
  branchName: string = "Toda la Red"
) {
  // Encabezados reglamentarios para presentación contable/fiscal
  const headers = [
    "No.",
    "Codigo_SKU",
    "Nombre_Producto",
    "Marca_Fabricante",
    "Presentacion_Unidad_Medida",
    "Existencia_Fisica_Unidades",
    "Costo_Unitario_USD",
    "Precio_Venta_USD",
    "Valor_Total_Inventario_Costo_USD",
  ];

  const rows = items.map((item, index) => {
    const totalValuedCost = item.units * item.cost;
    return [
      index + 1,
      `"${item.sku}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.brand.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      item.units,
      item.cost.toFixed(2),
      item.price.toFixed(2),
      totalValuedCost.toFixed(2),
    ].join(",");
  });

  // Calculo de totales globales
  const totalUnits = items.reduce((acc, curr) => acc + curr.units, 0);
  const totalValuation = items.reduce(
    (acc, curr) => acc + curr.units * curr.cost,
    0
  );

  const summaryRow = [
    "",
    "",
    "TOTALES GENERALES",
    "",
    "",
    totalUnits,
    "",
    "",
    totalValuation.toFixed(2),
  ].join(",");

  const csvContent =
    "sep=,\n" +
    `REPORTE OFICIAL DE INVENTARIO FISICO VALUADO - EJERCICIO FISCAL ${fiscalYear}\n` +
    `EMPRESA: MARIO'S DENT - DEPOSITO DENTAL\n` +
    `SUCURSAL: ${branchName}\n` +
    `FECHA DE CORTE: 31/12/${fiscalYear}\n\n` +
    headers.join(",") +
    "\n" +
    rows.join("\n") +
    "\n\n" +
    summaryRow;

  // Disparar descarga directa del archivo .csv
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Inventario_Fiscal_Hacienda_${fiscalYear}_${branchName.replace(/\s+/g, "_")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}