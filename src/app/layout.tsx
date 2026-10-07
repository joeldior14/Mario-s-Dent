import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ShiftProvider } from "@/app/context/ShiftContext";
import { AuthProvider } from "@/app/context/AuthContext";

// Tipografía geométrica y nítida para la interfaz del sistema
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Tipografía para balances, precios y números de arqueo
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

// ✅ Metadata con el tipo correcto y rutas limpias hacia public/
export const metadata: Metadata = {
  title: "Mario's Dent - Depósito Dental",
  description: "Punto de venta e inventario dental",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/mariosdent.jpg",
    apple: "/mariosdent.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${jakarta.variable} ${mono.variable}`}>
      <body className={`${jakarta.className} antialiased bg-[#F8FAFC] text-slate-800`}>
        <AuthProvider>
          <ShiftProvider>{children}</ShiftProvider>
        </AuthProvider>
      </body>
    </html>
  );
}