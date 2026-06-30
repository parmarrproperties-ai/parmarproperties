import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "./static",
  base: "/",
  server: {
    host: true, // Expose on LAN — use the Network URL printed in terminal to open on phone
  },
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "assets", replacement: path.resolve(__dirname, "assets") },
    ],
  },
});
