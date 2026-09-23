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

export interface ShiftAuditData {
  shiftId: string | null;
  status: "open" | "closed" | "none";
  auditStatus: "pending_review" | "reviewed";    // 👈 Agregar
  auditResolution: string;                       // 👈 Agregar
  auditNotes: string;                            // 👈 Agregar
  initialFund: number;
  cashSales: number;
  cardSales: number;
  transferSales: number;
  totalSales: number;
  expenses: number;
  reportedCountedCash: number;
  operatorNotes: string;
  operatorName: string;
}

export interface ResolveAuditPayload {
  shiftId: string;
  adminId?: string;
  resolutionType: string;
  notes: string;
}

// ==========================================
// SERVICIOS OPERATIVOS DE CAJERO
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
 * Consulta y desglosa las ventas del turno abierto por método de pago (Cajero en vivo)
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

/**
 * Asienta el cierre definitivo del turno operativo (Corte Z)
 */
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
    .select("id, initial_cash")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (shiftErr || !activeShift) {
    throw new Error("No existe ningún turno activo para cerrar en esta sucursal.");
  }

  // 3. CÁLCULO SEGURO DE DIFERENCIA:
  // Si en el payload difference llegó en 0 o undefined, se calcula explícitamente:
  const finalCounted = Number(countedCash) || 0;
  const finalExpected = Number(expectedCash) || 0;
  const calculatedDiff = Number((finalCounted - finalExpected).toFixed(2));
  const finalDifference = isNaN(calculatedDiff) ? Number((difference || 0).toFixed(2)) : calculatedDiff;

  const isExact = Math.abs(finalDifference) === 0;
  const autoAuditStatus = isExact ? "reviewed" : "pending_review";
  const autoResolution = isExact ? "CUADRE_EXACTO" : null;
  const autoAuditNotes = isExact ? "Arqueo conforme: cuadre de caja exacto al 100%." : null;

  // 4. Asentar el cierre con la diferencia real en Supabase
  const { error: updateErr } = await supabase
    .from("cash_shifts")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      counted_cash: Number(finalCounted.toFixed(2)),
      expected_cash: Number(finalExpected.toFixed(2)),
      total_sales: Number((totalSales || 0).toFixed(2)),
      total_expenses: Number((totalExpenses || 0).toFixed(2)),
      difference: finalDifference, // 👈 Guarda el sobrante (+) o faltante (-) real
      cashier_notes: notes?.trim() || null,
      notes: notes?.trim() || null,
      audit_status: autoAuditStatus,
      audit_resolution: autoResolution,
      audit_notes: autoAuditNotes,
    })
    .eq("id", activeShift.id);

  if (updateErr) {
    throw new Error(`Error al registrar el Corte Z: ${updateErr.message}`);
  }

  return { shiftId: activeShift.id, difference: finalDifference };
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

// ==========================================
// FUNCIÓN CONSOLIDADA DE AUDITORÍA (ADMINISTRADOR)
// ==========================================

/**
 * Consulta unificada para alimentar de forma simultánea las cuatro tarjetas
 * y el desglose de ingresos del Administrador por sucursal y fecha.
 */
export async function getAdminShiftAudit(
  branchName: string,
  dateStr: string
): Promise<ShiftAuditData> {
  const defaultData: ShiftAuditData = {
    shiftId: null,
    status: "none",
    auditStatus: "pending_review",
    auditResolution: "MERMA_ACEPTADA",
    auditNotes: "",
    initialFund: 0,
    cashSales: 0,
    cardSales: 0,
    transferSales: 0,
    totalSales: 0,
    expenses: 0,
    reportedCountedCash: 0,
    operatorNotes: "",
    operatorName: "Sin operador",
  };

  try {
    // 1. Localizar ID de la sucursal
    const { data: branch, error: branchErr } = await supabase
      .from("branches")
      .select("id")
      .ilike("name", branchName)
      .single();

    if (branchErr || !branch) return defaultData;

    // 2. Rango de 24 horas del día seleccionado (hora salvadoreña UTC-6)
    const startOfDay = `${dateStr}T00:00:00-06:00`;
    const endOfDay = `${dateStr}T23:59:59.999-06:00`;

    // 3. Buscar turno registrado en esa jornada
    const { data: shift, error: shiftErr } = await supabase
      .from("cash_shifts")
      .select("*")
      .eq("branch_id", branch.id)
      .gte("opened_at", startOfDay)
      .lte("opened_at", endOfDay)
      .order("opened_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (shiftErr || !shift) return defaultData;

    // 4. Consultar ventas y egresos vinculados al turno
    const [salesRes, expensesRes] = await Promise.all([
      supabase
        .from("sales")
        .select("payment_method, total")
        .eq("shift_id", shift.id),
      supabase
        .from("cash_movements")
        .select("amount")
        .eq("shift_id", shift.id)
        .eq("type", "egress"),
    ]);

    let cash = 0;
    let card = 0;
    let transfer = 0;
    let totalSales = 0;

    if (salesRes.data && salesRes.data.length > 0) {
      salesRes.data.forEach((s) => {
        const val = Number(s.total) || 0;
        if (s.payment_method === "cash") cash += val;
        else if (s.payment_method === "card") card += val;
        else if (s.payment_method === "transfer") transfer += val;
        totalSales += val;
      });
    } else {
      totalSales = Number(shift.total_sales) || 0;
    }

    const calculatedExpenses = (expensesRes.data || []).reduce(
      (acc, curr) => acc + (Number(curr.amount) || 0),
      Number(shift.total_expenses) || 0
    );

    return {
      shiftId: shift.id,
      status: (shift.status as "open" | "closed") || "closed",
      auditStatus: (shift.audit_status as "pending_review" | "reviewed") || "pending_review",
      auditResolution: shift.audit_resolution || "MERMA_ACEPTADA",
      auditNotes: shift.audit_notes || "",
      initialFund: Number(shift.initial_cash) || 0,
      cashSales: cash,
      cardSales: card,
      transferSales: transfer,
      totalSales,
      expenses: calculatedExpenses,
      reportedCountedCash: Number(shift.counted_cash) || 0,
      operatorNotes: shift.notes || shift.cashier_notes || "",
      operatorName: shift.cashier_name || "Maria G.",
    };
  } catch (error) {
    console.error("Error en getAdminShiftAudit:", error);
    return defaultData;
  }
}

/**
 * Registra la conciliación y dictamen contable del Administrador en 'cash_shifts'
 */
export async function resolveShiftAuditInDB(payload: ResolveAuditPayload) {
  const { shiftId, resolutionType, notes } = payload;

  if (!shiftId) {
    throw new Error("No se especificó el identificador del turno para auditar.");
  }

  const { data, error } = await supabase
    .from("cash_shifts")
    .update({
      audit_status: "reviewed",
      audit_resolution: resolutionType,
      audit_notes: notes.trim(),
    })
    .eq("id", shiftId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al asentar la resolución contable: ${error.message}`);
  }

  return data;
}