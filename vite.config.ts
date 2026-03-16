import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "custom_components/z2m_lock_manager/www",
    lib: {
      entry: "src/z2m_lock_manager_panel.ts",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "z2m_lock_manager_panel.js",
      },
    },
  },
});
