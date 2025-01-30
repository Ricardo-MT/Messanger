import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "WeChat",
        short_name: "WeChat",
        description: "A chat app",
        theme_color: "#f3f1e4",
        background_color: "#f3f1e4",
        display: "standalone",
        orientation: "portrait",
        launch_handler: {
          client_mode: ["navigate-existing", "auto"],
        },
        dir: "ltr",
        lang: "es",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
