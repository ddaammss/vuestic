import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks: {
          // 벤더 라이브러리들을 별도 청크로 분리
          vendor: ['vue', 'vue-router', 'pinia'],
          vuestic: ['vuestic-ui'],

          // 페이지별로 청크 분리
          dashboard: ['./src/views/Dashboard.vue'],
          'store-management': ['./src/views/stores/List.vue', './src/views/stores/Register.vue'],
          'member-management': ['./src/views/members/Info.vue', './src/views/members/Points.vue']
        }
      }
    }
  }
})
