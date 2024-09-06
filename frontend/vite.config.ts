import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  publicDir: "static",
  server: {
    port: 8080,
    proxy: {
      "/api": "http://localhost:8000",
      "/ws": "ws://localhost:8000",
    },
  },
});
