// CONFIGURACION POR DEFECTO
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });

// CONFIGURACION PWA
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Esto actualiza la PWA automáticamente
      devOptions: {
        enabled: true, //Activamos el modo PWA en desarrollo
      },
      includeAssets: ['**/*.{png,ico}'], //Incluimos todos los assets
      manifest: {
        name: "BeanLink",
        short_name: "BL",
        description: "Red Social de café de especialidad",
        start_url: "/",
        theme_color: "#000000", // El color de la barra de navegación
        background_color: "#000000", // El color de fondo del splash screen
        display: "standalone", // Modo de pantalla completa
        icons: [
          {
            src: "/assets/icons/coffee_bean_192x192.png", // Debes incluir los iconos en tu carpeta de assets
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/icons/coffee_bean_512x512.png", // Debes incluir los iconos en tu carpeta de assets
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
