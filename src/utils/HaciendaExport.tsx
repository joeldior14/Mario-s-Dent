import { supabase } from "@/lib/supabaseClient";

export interface HaciendaItem {
  sku: string;
  barcode?: string | null;
  name: string;
  brand: string;
  description: string;
  units: number;
  cost: number;
  price: number;
}

interface DBBranchInfo {
  id: string;
  name: string;
}

interface DBBranchInventoryRecord {
  stock: number | null;
  branches: DBBranchInfo | null;
}

interface DBProductExportRecord {
  sku: string;
  barcode: string | null;
  name: string;
  brand: string;
  description: string | null;
  cost: number;
  price: number;
  branch_inventory: DBBranchInventoryRecord[] | null;
}

export function exportInventoryToCSV(
  items: HaciendaItem[],
  fiscalYear: string = "2026",
  branchName: string = "Toda la Red"
) {
  const headers = [
    "No.",
    "Codigo_SKU",
    "Codigo_Barras",
    "Nombre_Producto",
    "Marca_Fabricante",
    "Descripcion_Presentacion",
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
      `"${item.barcode ?? ""}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.brand.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      item.units,
      item.cost.toFixed(2),
      item.price.toFixed(2),
      totalValuedCost.toFixed(2),
    ].join(",");
  });

  const totalUnits = items.reduce((acc, curr) => acc + curr.units, 0);
  const totalValuation = items.reduce(
    (acc, curr) => acc + curr.units * curr.cost,
    0
  );

  const summaryRow = [
    "",
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
    `ESTABLECIMIENTO / SUCURSAL: ${branchName}\n` +
    `FECHA DE CORTE: 31/12/${fiscalYear}\n\n` +
    headers.join(",") +
    "\n" +
    rows.join("\n") +
    "\n\n" +
    summaryRow;

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedBranch = branchName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Inventario_Fiscal_Hacienda_${fiscalYear}_${sanitizedBranch}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportHaciendaDirectFromDB(
  branchName: string = "ALL",
  fiscalYear: string = "2026"
) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      sku,
      barcode,
      name,
      brand,
      description,
      cost,
      price,
      branch_inventory (
        stock,
        branches (
          id,
          name
        )
      )
    `)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Error al exportar inventario desde Supabase: ${error.message}`);
  }

  const isAll = branchName === "ALL" || branchName === "Toda la Red";
  const productList = (data ?? []) as unknown as DBProductExportRecord[];

  const haciendaItems: HaciendaItem[] = productList.map((p) => {
    let units = 0;
    const invList: DBBranchInventoryRecord[] = p.branch_inventory ?? [];

    if (isAll) {
      units = invList.reduce(
        (acc: number, curr: DBBranchInventoryRecord) => acc + (curr.stock ?? 0),
        0
      );
    } else {
      const match = invList.find(
        (b: DBBranchInventoryRecord) =>
          b.branches?.name?.toLowerCase() === branchName.toLowerCase()
      );
      units = match?.stock ?? 0;
    }

    return {
      sku: p.sku,
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      description: p.description ?? "Unidad",
      units,
      cost: Number(p.cost),
      price: Number(p.price),
    };
  });

  exportInventoryToCSV(
    haciendaItems,
    fiscalYear,
    isAll ? "Toda la Red (Consolidado)" : branchName
  );
}