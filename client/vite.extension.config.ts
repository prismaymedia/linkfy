import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "popup.html"),
      },
      output: {
        entryFileNames: "popup.js",
        chunkFileNames: "chunk-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "popup.css";
          }
          return assetInfo.name || "assets/[name]-[hash][extname]";
        },
      },
    },
    outDir: path.resolve(__dirname, "../chrome-addon/dist"),
    emptyOutDir: true,
    target: "es2015",
    assetsInlineLimit: 0,
  },
}); 