import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mario's Dent - Depósito Dental",
    short_name: "Mario's Dent",
    description: "Sistema POS y Control de Inventario Clínico",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0284C7",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}