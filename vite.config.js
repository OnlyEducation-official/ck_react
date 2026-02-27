import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import compression from "vite-plugin-compression";
// import { visualizer } from "rollup-plugin-visualizer";

// ⛔ Because __dirname doesn't exist in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "brotliCompress",
    }),
    /* ❌ REMOVE FOR FINAL PRODUCTION BUILD
       Use only when analyzing bundle size
    */
    // visualizer({
    //   open: true,
    //   filename: "dist/stats.html",
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  optimizeDeps: {
    include: ["ckeditor5", "@wiris/mathtype-ckeditor5"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ This now works
    },
  },
  build: {
    minify: "esbuild",

    // 🔥 Remove console & debugger in production
    esbuild: {
      drop: ["console", "debugger"],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ["@mui/material", "@mui/icons-material"],
          reactVendor: ["react", "react-dom"],
          form: ["react-hook-form"],
        },
      },
      onwarn(warning, warn) {
        if (
          warning.code === "EVAL" &&
          warning.id?.includes("@wiris/mathtype-html-integration-devkit")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
