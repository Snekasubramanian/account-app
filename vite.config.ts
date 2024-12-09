import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [visualizer()],
    },
  },
  plugins: [react(),
    VitePWA({
      includeAssets: ['favicon.ico', 'robots.txt', 'manifest.json', 'sw.js'],
      manifest: {
        "name": "JAR",
        "short_name": "JAR",
        "start_url": "/",
        "display": "standalone",
        "background_color": "",
        "description": "JAR",
        icons: [
          {
            "src": "images/warning.svg",
            "type": "image/svg"
          },
          {
            src: 'images/WhatsApp-icon.svg',
            type: 'image/svg'
          }
        ],
      },
    })],
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'https://uat19c.camsfinserv.com',
      },
    },
  },
});
