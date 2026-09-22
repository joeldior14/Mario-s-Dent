import { supabase } from "@/lib/supabaseClient";

// ==========================================
// INTERFACES Y TIPOS
// ==========================================

export interface OpenShiftPayload {
  branchName: string;
  cashierId: string;
  initialCash: number;
}

export interface ExpensePayload {
  branchName: string;
  amount: number;
  category: string;
  concept: string;
}

export interface ShiftSalesBreakdown {
  cash: number;
  card: number;
  transfer: number;
  total: number;
}

export interface CloseShiftPayload {
  branchName: string;
  countedCash: number;
  expectedCash: number;
  totalSales: number;
  totalExpenses: number;
  difference: number;
  notes?: string;
}

// ==========================================
// SERVICIOS DE CAJA
// ==========================================

/**
 * Registra la apertura de turno en la tabla 'cash_shifts' de Supabase
 */
export async function openCashShiftInDB(payload: OpenShiftPayload) {
  const { branchName, cashierId, initialCash } = payload;

  // 1. Obtener la sucursal activa
  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (branchErr || !branch) {
    throw new Error(`No se encontró la sucursal: ${branchName}`);
  }

  // 2. Verificar si ya existe un turno abierto en la sucursal
  const { data: existingShift } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .maybeSingle();

  if (existingShift) {
    throw new Error("Ya existe un turno abierto en esta sucursal.");
  }

  // 3. Insertar el nuevo turno
  const { data, error } = await supabase
    .from("cash_shifts")
    .insert([
      {
        branch_id: branch.id,
        cashier_id: cashierId || null,
        initial_cash: Number(initialCash),
        status: "open",
        opened_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al abrir turno: ${error.message}`);
  }

  return data;
}

/**
 * Registra un egreso o gasto menor en la tabla 'cash_movements'
 */
export async function recordExpenseInDB(payload: ExpensePayload) {
  const { branchName, amount, category, concept } = payload;

  // 1. Obtener la sucursal
  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (branchErr || !branch) {
    throw new Error(`No se encontró la sucursal: ${branchName}`);
  }

  // 2. Obtener el turno abierto
  const { data: activeShift, error: shiftErr } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (shiftErr || !activeShift) {
    throw new Error("No hay un turno abierto para registrar gastos.");
  }

  // 3. Insertar el movimiento de egreso
  const fullDescription = `${category} - ${concept}`;

  const { data, error } = await supabase
    .from("cash_movements")
    .insert([
      {
        shift_id: activeShift.id,
        amount: Number(amount),
        type: "egress",
        description: fullDescription,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar el gasto: ${error.message}`);
  }

  return data;
}

/**
 * Consulta todos los gastos menores asociados al turno abierto actual
 */
export async function fetchCurrentShiftExpenses(branchName: string) {
  // 1. Obtener la sucursal
  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (!branch) return [];

  // 2. Obtener el turno abierto
  const { data: activeShift } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!activeShift) return [];

  // 3. Obtener los egresos de 'cash_movements'
  const { data: movements, error } = await supabase
    .from("cash_movements")
    .select("id, amount, description, created_at")
    .eq("shift_id", activeShift.id)
    .order("created_at", { ascending: false });

  if (error || !movements) return [];

  // 4. Mapear a la estructura que consume el estado de la UI
  return movements.map((m) => {
    const parts = (m.description || "").split(" - ");
    return {
      id: m.id,
      amount: Number(m.amount),
      category: parts[0] || "Gasto Operativo",
      concept: parts.slice(1).join(" - ") || m.description,
      time: new Date(m.created_at).toLocaleTimeString("es-SV", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });
}

/**
 * Consulta y desglosa las ventas del turno abierto por método de pago
 */
export async function getShiftSalesBreakdown(branchName: string): Promise<ShiftSalesBreakdown> {
  const initial: ShiftSalesBreakdown = { cash: 0, card: 0, transfer: 0, total: 0 };

  // 1. Localizar sucursal
  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (!branch) return initial;

  // 2. Localizar turno abierto
  const { data: activeShift } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!activeShift) return initial;

  // 3. Obtener ventas del turno
  const { data: sales } = await supabase
    .from("sales")
    .select("payment_method, total")
    .eq("shift_id", activeShift.id);

  if (!sales || sales.length === 0) return initial;

  // 4. Sumar por cada método de pago
  return sales.reduce((acc, sale) => {
    const amount = Number(sale.total) || 0;
    if (sale.payment_method === "cash") acc.cash += amount;
    else if (sale.payment_method === "card") acc.card += amount;
    else if (sale.payment_method === "transfer") acc.transfer += amount;
    acc.total += amount;
    return acc;
  }, initial);
}

export async function closeCashShiftInDB(payload: CloseShiftPayload) {
  const {
    branchName,
    countedCash,
    expectedCash,
    totalSales,
    totalExpenses,
    difference,
    notes,
  } = payload;

  // 1. Obtener la sucursal activa
  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (branchErr || !branch) {
    throw new Error(`No se encontró la sucursal: ${branchName}`);
  }

  // 2. Buscar el turno abierto actual
  const { data: activeShift, error: shiftErr } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (shiftErr || !activeShift) {
    throw new Error("No existe ningún turno activo para cerrar en esta sucursal.");
  }

  // 3. Asentar el cierre con los nombres exactos de tus columnas
  const { error: updateErr } = await supabase
    .from("cash_shifts")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      counted_cash: Number(countedCash.toFixed(2)),   // 👈 Asegúrate que diga counted_cash y NO final_cash
      expected_cash: Number(expectedCash.toFixed(2)),
      total_sales: Number(totalSales.toFixed(2)),
      total_expenses: Number(totalExpenses.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      cashier_notes: notes?.trim() || null,
      notes: notes?.trim() || null,
    })
    .eq("id", activeShift.id);

  if (updateErr) {
    throw new Error(`Error al registrar el Corte Z: ${updateErr.message}`);
  }

  return { shiftId: activeShift.id };
}

/**
 * Obtiene el número correlativo de la siguiente orden según las ventas del turno abierto
 */
export async function getNextOrderNumber(branchName: string): Promise<number> {
  // 1. Obtener sucursal
  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (!branch) return 1;

  // 2. Obtener turno abierto
  const { data: activeShift } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!activeShift) return 1;

  // 3. Contar ventas realizadas en este turno
  const { count, error } = await supabase
    .from("sales")
    .select("*", { count: "exact", head: true })
    .eq("shift_id", activeShift.id);

  if (error || count === null) return 1;

  return count + 1;
}

export async function getShiftInitialFundByDate(branchName: string, dateStr: string): Promise<number> {
  // 1. Obtener el ID de la sucursal
  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (branchErr || !branch) return 0.0;

  // 2. Definir el rango del día en hora local salvadoreña (UTC-6)
  // "YYYY-MM-DD" -> Rango ISO completo
  const startOfDay = `${dateStr}T00:00:00-06:00`;
  const endOfDay = `${dateStr}T23:59:59.999-06:00`;

  // 3. Buscar el turno registrado en ese día
  const { data: shift, error: shiftErr } = await supabase
    .from("cash_shifts")
    .select("initial_cash")
    .eq("branch_id", branch.id)
    .gte("opened_at", startOfDay)
    .lte("opened_at", endOfDay)
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (shiftErr || !shift) return 0.0;

  return Number(shift.initial_cash) || 0.0;
}