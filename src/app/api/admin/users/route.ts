import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cliente con permisos de superadministrador (solo corre en el servidor)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, username, branchId, role, password } = body;

    if (!fullName || !username || !branchId || !password) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben estar presentes." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const email = `${cleanUsername}@mariosdent.com`;

    // 1. Crear el usuario en auth.users con contraseña lista y confirmado
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username: cleanUsername,
          full_name: fullName.trim(),
          role: role || "cashier",
          branch_id: branchId,
        },
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Asegurar el registro en la tabla profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: authData.user.id,
        username: cleanUsername,
        full_name: fullName.trim(),
        role: role || "cashier",
        branch_id: branchId,
      });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}