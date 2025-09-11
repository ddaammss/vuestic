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
  server: {
    proxy: {
      // /uploads로 시작하는 요청을 8080으로 프록시
      '/uploads': {
        //target: 'http://localhost:8080',
        target: 'https://amita86tg.duckdns.org',
        changeOrigin: true
      }
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
          settings: [
            './src/views/settings/CouponDetail.vue',
            './src/views/settings/CouponList.vue',
            './src/views/settings/CouponRegist.vue',
            './src/views/settings/Privacy.vue',
            './src/views/settings/Refund.vue',
            './src/views/settings/Terms.vue'
          ],
          stores: [
            './src/views/stores/StoreDetail.vue',
            './src/views/stores/StoreList.vue',
            './src/views/stores/StoreRegist.vue'
          ],
          members: [
            './src/views/members/MemberDetail.vue',
            './src/views/members/MemberList.vue',
            './src/views/members/Point.vue'
          ],
          reservations: [
            './src/views/reservations/Cancellation.vue',
            './src/views/reservations/ReservationDetail.vue',
            './src/views/reservations/ReservationList.vue'
          ],
          login: ['./src/views/Login.vue'],
          events: [
            './src/views/events/Banner.vue',
            './src/views/events/CommunicationDetail.vue',
            './src/views/events/CommunicationList.vue',
            './src/views/events/Event.vue'
          ],
          sales: ['./src/views/sales/SalesDetail.vue',
            './src/views/sales/SalesList.vue',
            './src/views/sales/SalesRegist.vue'
          ],
          ads: ['./src/views/ads/RegistDetail.vue',
            './src/views/ads/Regist.vue',
            './src/views/ads/Request.vue'],
        }
      }
    }
  }
})
