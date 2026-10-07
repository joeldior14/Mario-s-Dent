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

export interface PendingDiscrepancyAlert {
  shiftId: string;
  branchName: string;
  difference: number;
  closedAt: string;
}

export interface ShiftAuditData {
  shiftId: string | null;
  status: "open" | "closed" | "none";
  auditStatus: "pending_review" | "reviewed" | "none";
  auditResolution: string;
  auditNotes: string;
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
  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (!branch) return [];

  const { data: activeShift } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!activeShift) return [];

  const { data: movements, error } = await supabase
    .from("cash_movements")
    .select("id, amount, description, created_at")
    .eq("shift_id", activeShift.id)
    .order("created_at", { ascending: false });

  if (error || !movements) return [];

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

  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (!branch) return initial;

  const { data: activeShift } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!activeShift) return initial;

  const { data: sales } = await supabase
    .from("sales")
    .select("payment_method, total")
    .eq("shift_id", activeShift.id);

  if (!sales || sales.length === 0) return initial;

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

  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (branchErr || !branch) {
    throw new Error(`No se encontró la sucursal: ${branchName}`);
  }

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

  const finalCounted = Number(countedCash) || 0;
  const finalExpected = Number(expectedCash) || 0;
  const calculatedDiff = Number((finalCounted - finalExpected).toFixed(2));
  const finalDifference = isNaN(calculatedDiff) ? Number((difference || 0).toFixed(2)) : calculatedDiff;

  const isExact = Math.abs(finalDifference) === 0;
  const autoAuditStatus = isExact ? "reviewed" : "pending_review";
  const autoResolution = isExact ? "CUADRE_EXACTO" : null;
  const autoAuditNotes = isExact ? "Arqueo conforme: cuadre de caja exacto al 100%." : null;

  const { error: updateErr } = await supabase
    .from("cash_shifts")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      counted_cash: Number(finalCounted.toFixed(2)),
      difference: finalDifference,
      cashier_notes: notes?.trim() || null,
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
  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .ilike("name", branchName)
    .single();

  if (!branch) return 1;

  const { data: activeShift } = await supabase
    .from("cash_shifts")
    .select("id")
    .eq("branch_id", branch.id)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!activeShift) return 1;

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

export async function getPendingDiscrepancyAlert(): Promise<PendingDiscrepancyAlert | null> {
  const { data, error } = await supabase
    .from("cash_shifts")
    .select(`
      id,
      difference,
      closed_at,
      branches (
        name
      )
    `)
    .eq("status", "closed")
    .eq("audit_status", "pending_review")
    .neq("difference", 0)
    .order("closed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const branchData = Array.isArray(data.branches) ? data.branches[0] : data.branches;

  return {
    shiftId: data.id,
    branchName: branchData?.name || "Sucursal",
    difference: Number(data.difference),
    closedAt: data.closed_at,
  };
}

/**
 * Consulta unificada para alimentar métricas y dictamen contable.
 * Si el día no tiene turnos registrados, devuelve ceros absolutos y dictamen limpio.
 */
export async function getAdminShiftAudit(
  branchName: string,
  dateStr: string
): Promise<ShiftAuditData> {
  const defaultCleanData: ShiftAuditData = {
    shiftId: null,
    status: "none",
    auditStatus: "none",
    auditResolution: "",
    auditNotes: "",
    initialFund: 0,
    cashSales: 0,
    cardSales: 0,
    transferSales: 0,
    totalSales: 0,
    expenses: 0,
    reportedCountedCash: 0,
    operatorNotes: "",
    operatorName: "Sin turno registrado",
  };

  try {
    const { data: branch, error: branchErr } = await supabase
      .from("branches")
      .select("id")
      .ilike("name", branchName)
      .single();

    if (branchErr || !branch) return defaultCleanData;

    // Rango del día en hora de El Salvador (UTC-6)
    const startOfDay = `${dateStr}T00:00:00-06:00`;
    const endOfDay = `${dateStr}T23:59:59.999-06:00`;

    // Consulta con join a la tabla profiles para obtener el nombre del cajero
    const { data: shift, error: shiftErr } = await supabase
      .from("cash_shifts")
      .select(`
        *,
        profiles:cashier_id (
          full_name,
          username
        )
      `)
      .eq("branch_id", branch.id)
      .gte("opened_at", startOfDay)
      .lte("opened_at", endOfDay)
      .order("opened_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (shiftErr || !shift) return defaultCleanData;

    // Consultar ventas y egresos
    const [salesRes, expensesRes] = await Promise.all([
      supabase
        .from("sales")
        .select("payment_method, total")
        .eq("shift_id", shift.id),
      supabase
        .from("cash_movements")
        .select("amount")
        .eq("shift_id", shift.id),
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

    let expenses = 0;
    if (shift.status === "closed" && shift.total_expenses !== null && shift.total_expenses !== undefined) {
      expenses = Number(shift.total_expenses) || 0;
    } else {
      expenses = Number((expensesRes.data || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0));
    }

    const cashierProfile = shift.profiles as { full_name?: string; username?: string } | null;
    const realCashierName = cashierProfile?.full_name || cashierProfile?.username || "Sin cajero asignado";

    return {
      shiftId: shift.id,
      status: (shift.status as "open" | "closed") || "closed",
      auditStatus: (shift.audit_status as "pending_review" | "reviewed") || "pending_review",
      auditResolution: shift.audit_resolution || "",
      auditNotes: shift.audit_notes || "",
      initialFund: Number(shift.initial_cash) || 0,
      cashSales: cash,
      cardSales: card,
      transferSales: transfer,
      totalSales,
      expenses,
      reportedCountedCash: Number(shift.counted_cash) || 0,
      operatorNotes: shift.notes || shift.cashier_notes || "",
      operatorName: realCashierName,
    };
  } catch (error) {
    console.error("Error en getAdminShiftAudit:", error);
    return defaultCleanData;
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