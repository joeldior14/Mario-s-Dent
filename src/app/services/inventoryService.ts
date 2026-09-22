import { supabase } from "@/lib/supabaseClient";

export interface CreateProductPayload {
  sku: string;
  barcode?: string | null;
  name: string;
  brand: string;
  category: string;
  description: string;
  cost: number;
  price: number;
  image?: string;
  initialStock?: {
    santaAna?: number;
    ahuachapan?: number;
    sonsonate?: number;
  };
}

export interface AdjustStockPayload {
  productId: string;
  branchName: string;
  type: "add" | "remove";
  quantity: number;
  reason: string;
  userId?: string;
}

export interface UpdateProductPayload {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  brand: string;
  category: string;
  description: string;
  cost: number;
  price: number;
  image?: string;
  branches: {
    branchId: "santa-ana" | "ahuachapan" | "sonsonate";
    branchName: string;
    stock: number;
  }[];
}

export interface TransferStockPayload {
  productId: string;
  sourceBranchName: string;
  targetBranchName: string;
  quantity: number;
  userId?: string;
}

export interface KardexMovementRecord {
  id: string;
  date: string;
  type: "VENTA_POS" | "TRASLADO" | "INGRESO" | "AJUSTE";
  branch: string;
  user: string;
  quantity: number;
  stockAfter: number;
  reference: string;
}

// Interfaces internas para resolver consultas de Supabase sin usar 'any'
interface DBBranchRelation {
  id: string;
  name: string;
}

interface DBProfileRelation {
  id: string;
  full_name: string | null;
  username: string | null;
}

interface DBStockMovementQueryRow {
  id: string;
  created_at: string;
  movement_type: string;
  quantity: number;
  stock_after: number;
  reference: string | null;
  branches: DBBranchRelation | DBBranchRelation[] | null;
  profiles: DBProfileRelation | DBProfileRelation[] | null;
}

// 1. CREAR PRODUCTO
export async function createProductInDB(payload: CreateProductPayload) {
  const cleanSku = payload.sku.trim().toUpperCase();
  const cleanBarcode = payload.barcode?.trim() || null;

  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert([
      {
        sku: cleanSku,
        barcode: cleanBarcode,
        name: payload.name.trim(),
        brand: payload.brand.trim(),
        category: payload.category,
        description: payload.description.trim(),
        cost: Number(payload.cost),
        price: Number(payload.price),
        image_url: payload.image || null,
      },
    ])
    .select()
    .single();

  if (productError) {
    if (productError.code === "23505") {
      throw new Error("Ya existe un producto registrado con ese SKU o Código de Barras.");
    }
    throw productError;
  }

  const { data: branches, error: branchError } = await supabase
    .from("branches")
    .select("id, name");

  if (branchError) throw branchError;

  const inventoryRows = (branches || []).map((b) => {
    let stock = 0;
    if (b.name === "Santa Ana") stock = payload.initialStock?.santaAna ?? 0;
    if (b.name === "Ahuachapán") stock = payload.initialStock?.ahuachapan ?? 0;
    if (b.name === "Sonsonate") stock = payload.initialStock?.sonsonate ?? 0;

    return {
      branch_id: b.id,
      product_id: newProduct.id,
      stock,
      min_stock: 5,
    };
  });

  const { error: invError } = await supabase
    .from("branch_inventory")
    .insert(inventoryRows);

  if (invError) throw invError;

  return newProduct;
}

// 2. AJUSTAR EXISTENCIAS MANUALMENTE (+ / -)
export async function adjustProductStockInDB(payload: AdjustStockPayload) {
  const { productId, branchName, type, quantity, reason, userId } = payload;
  const delta = type === "add" ? quantity : -quantity;

  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id")
    .eq("name", branchName)
    .single();

  if (branchErr || !branch) {
    throw new Error(`No se encontró la sucursal: ${branchName}`);
  }

  const { data: currentInv, error: invErr } = await supabase
    .from("branch_inventory")
    .select("id, stock")
    .eq("product_id", productId)
    .eq("branch_id", branch.id)
    .single();

  if (invErr || !currentInv) {
    throw new Error("No existe registro de inventario para este producto en esta sucursal.");
  }

  const currentStock = currentInv.stock ?? 0;
  const newStock = currentStock + delta;

  if (newStock < 0) {
    throw new Error(`Stock insuficiente. Solo hay ${currentStock} unidades disponibles.`);
  }

  const { error: updateErr } = await supabase
    .from("branch_inventory")
    .update({ stock: newStock })
    .eq("id", currentInv.id);

  if (updateErr) throw updateErr;

  const movementType = type === "add" ? "INGRESO" : "AJUSTE";

  const { error: movErr } = await supabase
    .from("stock_movements")
    .insert([
      {
        product_id: productId,
        branch_id: branch.id,
        user_id: userId || null,
        movement_type: movementType,
        quantity: delta,
        stock_after: newStock,
        reference: reason,
      },
    ]);

  if (movErr) {
    console.error("Error al registrar movimiento en Kardex:", movErr.message);
  }

  return { newStock };
}

// 3. ACTUALIZAR PRODUCTO Y EXISTENCIAS
export async function updateProductInDB(payload: UpdateProductPayload) {
  const cleanSku = payload.sku.trim().toUpperCase();
  const cleanBarcode = payload.barcode?.trim() || null;

  const { error: productErr } = await supabase
    .from("products")
    .update({
      sku: cleanSku,
      barcode: cleanBarcode,
      name: payload.name.trim(),
      brand: payload.brand.trim(),
      category: payload.category,
      description: payload.description.trim(),
      cost: Number(payload.cost),
      price: Number(payload.price),
      image_url: payload.image || null,
    })
    .eq("id", payload.id);

  if (productErr) {
    if (productErr.code === "23505") {
      throw new Error("Ya existe un producto con ese SKU o Código de Barras.");
    }
    throw productErr;
  }

  const { data: branchList, error: branchErr } = await supabase
    .from("branches")
    .select("id, name");

  if (branchErr) throw branchErr;

  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const updatePromises = (branchList || []).map((b) => {
    const branchData = payload.branches.find(
      (entry) => normalize(entry.branchName) === normalize(b.name)
    );
    const stockToSet = branchData ? Math.max(0, Number(branchData.stock) || 0) : 0;

    return supabase
      .from("branch_inventory")
      .upsert(
        {
          branch_id: b.id,
          product_id: payload.id,
          stock: stockToSet,
        },
        { onConflict: "branch_id,product_id" }
      );
  });

  const results = await Promise.all(updatePromises);
  const failedUpsert = results.find((r) => r.error);
  if (failedUpsert?.error) throw failedUpsert.error;

  return true;
}

// 4. ELIMINAR PRODUCTO DEL CATÁLOGO
export async function deleteProductFromDB(productId: string) {
  const { error: invErr } = await supabase
    .from("branch_inventory")
    .delete()
    .eq("product_id", productId);

  if (invErr) {
    console.error("Error al eliminar inventario de sucursales:", invErr);
    throw new Error(`Error en branch_inventory: ${invErr.message}`);
  }

  const { error: movErr } = await supabase
    .from("stock_movements")
    .delete()
    .eq("product_id", productId);

  if (movErr) {
    console.error("Error al eliminar historial de movimientos:", movErr);
    throw new Error(`Error en stock_movements: ${movErr.message}`);
  }

  const { error: productErr } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productErr) {
    console.error("Error al eliminar producto maestro:", productErr);
    throw new Error(`Error en products: ${productErr.message}`);
  }

  return true;
}

// 5. TRASLADO DE STOCK ENTRE SUCURSALES
export async function transferProductStockInDB(payload: TransferStockPayload) {
  const { productId, sourceBranchName, targetBranchName, quantity, userId } = payload;

  if (sourceBranchName === targetBranchName) {
    throw new Error("La sucursal de origen y destino no pueden ser iguales.");
  }
  if (quantity <= 0) {
    throw new Error("La cantidad debe ser mayor a 0.");
  }

  const { data: branches, error: branchErr } = await supabase
    .from("branches")
    .select("id, name")
    .in("name", [sourceBranchName, targetBranchName]);

  if (branchErr || !branches || branches.length < 2) {
    throw new Error("No se pudieron verificar las sucursales de origen y destino.");
  }

  const sourceBranch = branches.find((b) => b.name === sourceBranchName)!;
  const targetBranch = branches.find((b) => b.name === targetBranchName)!;

  const { data: sourceInv, error: srcInvErr } = await supabase
    .from("branch_inventory")
    .select("id, stock")
    .eq("product_id", productId)
    .eq("branch_id", sourceBranch.id)
    .single();

  if (srcInvErr || !sourceInv) {
    throw new Error(`El producto no tiene registro de stock en ${sourceBranchName}.`);
  }

  const currentSourceStock = sourceInv.stock ?? 0;
  if (currentSourceStock < quantity) {
    throw new Error(
      `Stock insuficiente en ${sourceBranchName}. Disponible: ${currentSourceStock}, solicitado: ${quantity}.`
    );
  }

  const { data: targetInv } = await supabase
    .from("branch_inventory")
    .select("id, stock")
    .eq("product_id", productId)
    .eq("branch_id", targetBranch.id)
    .maybeSingle();

  const currentTargetStock = targetInv?.stock ?? 0;
  const newSourceStock = currentSourceStock - quantity;
  const newTargetStock = currentTargetStock + quantity;

  const { error: updateSrcErr } = await supabase
    .from("branch_inventory")
    .update({ stock: newSourceStock })
    .eq("id", sourceInv.id);

  if (updateSrcErr) throw updateSrcErr;

  const { error: upsertTgtErr } = await supabase
    .from("branch_inventory")
    .upsert(
      {
        branch_id: targetBranch.id,
        product_id: productId,
        stock: newTargetStock,
      },
      { onConflict: "branch_id,product_id" }
    );

  if (upsertTgtErr) throw upsertTgtErr;

  const movements = [
    {
      product_id: productId,
      branch_id: sourceBranch.id,
      user_id: userId || null,
      movement_type: "TRASLADO",
      quantity: -quantity,
      stock_after: newSourceStock,
      reference: `Traslado enviado hacia ${targetBranchName}`,
    },
    {
      product_id: productId,
      branch_id: targetBranch.id,
      user_id: userId || null,
      movement_type: "TRASLADO",
      quantity: quantity,
      stock_after: newTargetStock,
      reference: `Traslado recibido desde ${sourceBranchName}`,
    },
  ];

  const { error: movErr } = await supabase.from("stock_movements").insert(movements);
  if (movErr) {
    console.error("Aviso Kardex:", movErr.message);
  }

  return { newSourceStock, newTargetStock };
}

// 6. CONSULTAR MOVIMIENTOS KARDEX
export async function fetchProductKardex(
  productId: string,
  branchName?: string
): Promise<KardexMovementRecord[]> {
  let query = supabase
    .from("stock_movements")
    .select(`
      id,
      created_at,
      movement_type,
      quantity,
      stock_after,
      reference,
      branches (
        id,
        name
      ),
      profiles (
        id,
        full_name,
        username
      )
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (branchName && branchName !== "ALL" && branchName !== "Todas las sedes") {
    const { data: branchData } = await supabase
      .from("branches")
      .select("id")
      .ilike("name", branchName)
      .maybeSingle();

    if (branchData) {
      query = query.eq("branch_id", branchData.id);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error al consultar Kardex:", error);
    throw new Error(`Error en Kardex: ${error.message}`);
  }

  const movementRows = (data ?? []) as unknown as DBStockMovementQueryRow[];

  return movementRows.map((row) => {
    const branchRecord = Array.isArray(row.branches) ? row.branches[0] : row.branches;
    const profileRecord = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    const dateObj = new Date(row.created_at);
    const formattedDate = dateObj.toLocaleDateString("es-SV", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return {
      id: row.id,
      date: formattedDate,
      type: row.movement_type as "VENTA_POS" | "TRASLADO" | "INGRESO" | "AJUSTE",
      branch: branchRecord?.name ?? "Sin sede",
      user: profileRecord?.full_name ?? profileRecord?.username ?? "Sistema",
      quantity: Number(row.quantity),
      stockAfter: Number(row.stock_after),
      reference: row.reference ?? "Sin detalle",
    };
  });
}

export interface POSCartItem {
  id: string; // product_id
  sku: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface CheckoutPayload {
  branchName: string;
  cashierId?: string | null;
  cashierName?: string | null;
  paymentMethod: "cash" | "card" | "transfer";
  items: POSCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  cashReceived?: number;
  changeReturned?: number;
}

export async function processSaleInDB(payload: CheckoutPayload) {
  const {
    branchName,
    cashierId,
    paymentMethod,
    items,
    subtotal,
    tax,
    total,
    cashReceived,
    changeReturned,
  } = payload;

  if (!items || items.length === 0) {
    throw new Error("El carrito no tiene productos.");
  }

  // 1. Obtener la sucursal actual
  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id, name")
    .ilike("name", branchName)
    .single();

  if (branchErr || !branch) {
    throw new Error(`No se encontró la sucursal: ${branchName}`);
  }

  // 2. Obtener el turno abierto de la sucursal
  const { data: activeShift, error: shiftErr } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (shiftErr || !activeShift) {
    throw new Error("No hay un turno de caja abierto en esta sucursal para asociar la venta.");
  }

  // 3. Generar número de ticket único
  const branchCode = branch.name.substring(0, 2).toUpperCase();
  const ticketNumber = `T-${branchCode}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 4. Insertar cabecera en 'sales'
  const { data: saleData, error: saleErr } = await supabase
    .from("sales")
    .insert([
      {
        ticket_number: ticketNumber,
        branch_id: branch.id,
        shift_id: activeShift.id,
        cashier_id: cashierId || null,
        payment_method: paymentMethod,
        subtotal: Number(subtotal),
        tax: Number(tax),
        total: Number(total),
        cash_received: cashReceived ? Number(cashReceived) : null,
        change_given: changeReturned ? Number(changeReturned) : null,
        created_at: new Date().toISOString(),
      },
    ])
    .select("id")
    .single();

  if (saleErr || !saleData) {
    throw new Error(`Error al guardar en tabla 'sales': ${saleErr?.message || "Desconocido"}`);
  }

  const saleId = saleData.id;

  // 5. Insertar renglones en 'sale_items', descontar stock y registrar Kardex
  for (const item of items) {
    // A) Insertar detalle de venta
    const { error: itemErr } = await supabase.from("sale_items").insert([
      {
        sale_id: saleId,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      },
    ]);

    if (itemErr) {
      console.error("Error al registrar renglón en sale_items:", itemErr.message);
    }

    // B) Consultar stock actual
    const { data: invRecord } = await supabase
      .from("branch_inventory")
      .select("id, stock")
      .eq("product_id", item.id)
      .eq("branch_id", branch.id)
      .maybeSingle();

    const currentStock = invRecord?.stock ?? 0;
    const newStock = Math.max(0, currentStock - item.quantity);

    // C) Actualizar inventario de la sucursal
    if (invRecord) {
      await supabase
        .from("branch_inventory")
        .update({ stock: newStock })
        .eq("id", invRecord.id);
    }

    // D) Registrar movimiento en Kardex (stock_movements)
    await supabase.from("stock_movements").insert([
      {
        product_id: item.id,
        branch_id: branch.id,
        user_id: cashierId || null,
        movement_type: "VENTA_POS",
        quantity: -item.quantity,
        stock_after: newStock,
        reference: `Ticket #${ticketNumber}`,
      },
    ]);
  }

  return { ticketNumber, total, saleId };
}