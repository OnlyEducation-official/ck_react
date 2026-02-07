import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ⛔ Because __dirname doesn't exist in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["ckeditor5", "@wiris/mathtype-ckeditor5"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ This now works
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://proxy-event.ckeditor.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
