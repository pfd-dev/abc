import { defineConfig } from 'vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

   plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tienda de discos retro',
        short_name: 'Rock-Store',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#8B8B8B',
        icons: [
          {
            src: '/assets/logo_transparent-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/logo_transparent-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // Carpeta raíz del proyecto
  root: '.',          

  // Carpeta de archivos estáticos (opcional)
  publicDir: 'public', 

  base: './',

  // Configuración de build (compilación)
  build: {
    // Carpeta donde se generan los archivos al hacer `npm run build`
    outDir: 'dist',

    // Opciones para Rollup (empaquetador)
    rollupOptions: {
      input: {
        // Entradas HTML para generar páginas distintas
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'pages/login.html'),
        gestionar: resolve(__dirname, 'pages/gestionar.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
        newUser: resolve(__dirname, 'pages/newUser.html')
      },
    },

    // Borra el contenido anterior de dist en cada build
    emptyOutDir: true
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 3000,       // Puerto local (http://localhost:3000)
    open: true        // Abre el navegador al iniciar
  }
})
