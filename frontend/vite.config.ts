import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  publicDir: "static",
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      "/ws": "ws://localhost:8000",
    },
  },
});
