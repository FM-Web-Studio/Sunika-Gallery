import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  envPrefix: ['FIREBASE_', 'ADMIN_'],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
          react: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'react-router-dom'],
        },
      },
    },
  },
  server: { port: 3000 },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
  },
});
