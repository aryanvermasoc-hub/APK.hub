import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'APK.hub',
        short_name: 'APK.hub',
        description: 'Community APK & Web App Platform',
        theme_color: '#030712', // Your bg-gray-950 color
        background_color: '#030712',
        display: 'standalone',
        icons: [
  {
    src: '/icons/icon-192x192.png', // Added /icons/
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: '/icons/icon-512x512.png', // Added /icons/
    sizes: '512x512',
    type: 'image/png'
  }
]
      }
    })
  ],
})