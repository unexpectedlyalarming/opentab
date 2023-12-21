import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteGhPages } from "vite-plugin-gh-pages";

import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/opentab/",
  plugins: [
    react(),
    VitePWA(),
    ViteGhPages({
      // Options are optional
      branch: "pages",
      dir: "dist",
      push: true,
    }),
  ],
});
