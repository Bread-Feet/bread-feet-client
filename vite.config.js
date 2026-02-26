import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      react({
        babel: {
          plugins: [
            [
              "babel-plugin-styled-components",
              {
                displayName: !isProd,
                fileName: false,
              },
            ],
          ],
        },
      }),
      VitePWA({
        strategies: "generateSW",
        filename: "sw.js",
        registerType: "prompt",
        devOptions: { enabled: false },
        manifest: {
          name: "BreadFeet",
          short_name: "BreadFeet",
          start_url: "/",
          display: "standalone",
          background_color: "#7C4628",
          theme_color: "#7C4628",
          icons: [
            { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
            { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
          ],
        },
      }),
    ],
  };
});
