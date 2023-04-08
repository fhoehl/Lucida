import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // lib: {
    //   entry: 'src/my-element.ts',
    //   formats: ['es'],
    // },
    // rollupOptions: {
    //   external: /^lit/,
    // },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html}', 'assets/*.png'],
      }
    }),
  ],
});
