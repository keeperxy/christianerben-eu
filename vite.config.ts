import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add the new allowed host
    allowedHosts: [
      "50fe7852-eb98-4875-a2bd-d6508bf54963.lovableproject.com",
      "dev.uweschwarz.eu",
      "pre.uweschwarz.eu",
    ],
  },
  optimizeDeps: {
    include: [ 'buffer' ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate chunk for react-pdf (only loaded when custom CV data is used)
          'react-pdf': ['@react-pdf/renderer'],
          // Separate chunk for docx generation (only loaded when custom CV data is used)
          'docx': ['docx'],
          // Separate chunk for CV editor (only loaded in edit mode)
          'cv-editor': ['./src/components/cv/CVEditor'],
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      buffer: path.resolve(__dirname, 'node_modules', 'buffer', 'index.js'),
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
