import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Obtener cookie de sesión
  const sessionRaw = request.cookies.get("marios_dent_session")?.value;
  let userSession: { role: "admin" | "cashier"; branch: string } | null = null;

  if (sessionRaw) {
    try {
      userSession = JSON.parse(decodeURIComponent(sessionRaw));
    } catch {
      userSession = null;
    }
  }

  // 2. Detectar si el dispositivo es un teléfono móvil
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  // CASO A: EL USUARIO NO HA INICIADO SESIÓN
  if (!userSession) {
    // Si intenta entrar a cualquier módulo protegido, lo manda directo al login
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Si ya está en /login, lo deja estar ahí
    return NextResponse.next();
  }

  // CASO B: EL USUARIO YA TIENE SESIÓN INICIADA
  // Si intenta volver a entrar a /login o a la raíz /, lo manda a su pantalla correspondiente
  if (pathname === "/login" || pathname === "/") {
    if (isMobile || userSession.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/caja", request.url));
    }
  }

  // CASO C: REGLAS PARA DISPOSITIVOS MÓVILES (TELÉFONO)
  // En el teléfono solo se permite estar en /dashboard
  if (isMobile) {
    if (pathname !== "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // CASO D: REGLAS POR ROL EN COMPUTADORA DE ESCRITORIO
  // Administrador: solo puede ver /caja, /inventario, /dashboard (NO /pos)
  if (userSession.role === "admin") {
    if (pathname === "/pos") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Cajero: solo puede ver /caja, /pos, /inventario (NO /dashboard)
  if (userSession.role === "cashier") {
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/caja", request.url));
    }
  }

  return NextResponse.next();
}

// MATCHER EXPLÍCITO: Protege exactamente estas rutas sin depender de regex complejas
export const config = {
  matcher: [
    "/",
    "/login",
    "/caja/:path*",
    "/pos/:path*",
    "/inventario/:path*",
    "/dashboard/:path*",
  ],
};