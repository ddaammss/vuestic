import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Vuestic UI
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'

// Material Icons
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// 글로벌 스타일
import './assets/styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(
  createVuestic({
    config: {
      colors: {
        primary: '#3498db',
        secondary: '#34495e',
        success: '#2ecc71',
        warning: '#f39c12',
        danger: '#e74c3c',
        info: '#17a2b8'
      }
    }
  })
)

app.mount('#app')
