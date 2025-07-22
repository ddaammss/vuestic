<template>
  <header class="header">
    <div class="header-left">
      <!-- <h1>{{ currentPageTitle }}</h1> -->
    </div>
    <div class="header-right">
      <div class="current-time">{{ currentDateTime }}</div>
      <div class="user-info">
        <span>{{ userName }}님 환영합니다</span>
      </div>
      <button @click="logout" class="logout-btn">로그아웃</button>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Header',
  setup() {
    const route = useRoute()
    const router = useRouter()
    //const authStore = useAuthStore()
    const currentDateTime = ref('')
    let timeInterval = null

    const currentPageTitle = computed(() => {
      return route.meta?.title || route.name || 'HOME'
    })

    const userName = computed(() => {
      //return authStore.userName || '관리자'
      return '관리자'
    })

    const updateDateTime = () => {
      const now = new Date()
      currentDateTime.value = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const logout = () => {
      if (confirm('로그아웃 하시겠습니까?')) {
        // authStore가 활성화되면 이 줄 사용
        // authStore.logout()
        // 중첩 라우트 구조에 맞는 로그인 경로로 이동
        router.push('/auth/login')
      }
    }

    onMounted(() => {
      updateDateTime()
      timeInterval = setInterval(updateDateTime, 1000)
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })

    return {
      currentDateTime,
      currentPageTitle,
      userName,
      logout
    }
  }
}
</script>

<style scoped>
.header {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.header-left h1 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.current-time {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.user-info {
  font-size: 14px;
  color: #2c3e50;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>
