import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings for optional TensorFlow backends
        if (warning.code === 'UNRESOLVED_IMPORT' && 
            (warning.exporter?.includes('@tensorflow/tfjs-backend-webgpu') ||
             warning.exporter?.includes('@mediapipe'))) {
          return;
        }
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    exclude: ['@tensorflow/tfjs-backend-webgpu'],
  },
}));
