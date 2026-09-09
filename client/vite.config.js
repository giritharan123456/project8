import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // In dev mode (npm run dev:client, port 5173) forward any /api/...
    // request to the Express server on :4000 instead of letting Vite's
    // own SPA fallback swallow it and return index.html.
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          lucide: ["lucide-react"],
          pdf: ["jspdf", "jspdf-autotable"],
          excel: ["xlsx"],
        },
      },
    },
  },
});
