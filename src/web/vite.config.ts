import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gateway = env.VITE_GATEWAY_URL || 'http://localhost:5006'
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: gateway,
          changeOrigin: true,
        },
        '/auth': {
          target: gateway,
          changeOrigin: true,
        },
        '/users': {
          target: gateway,
          changeOrigin: true,
        },
        '/admin': {
          target: gateway,
          changeOrigin: true,
        },
      },
    },
  }
})
