import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import type { ViteUserConfig as VitestUserConfigInterface } from "vitest/config";
import svgr from "vite-plugin-svgr";
import path from "path";

const vitestConfig: VitestUserConfigInterface = {
  test: {
    globals: true,
    environment: "jsdom",
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: vitestConfig.test,
});
