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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//import { useAuthStore } from '@/stores/auth'
//import '@/assets/styles/header.css'

const route = useRoute()
const router = useRouter()
//const authStore = useAuthStore()

const currentDateTime = ref('')
let timeInterval = null

// 현재 페이지 제목
const currentPageTitle = computed(() => {
  return route.meta?.title || route.name || 'HOME'
})

// 사용자 이름
const userName = computed(() => {
  //return authStore.userName || '관리자'
  return '관리자'
})

// 현재 시간 업데이트
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

// 로그아웃 처리
const logout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    // authStore가 활성화되면 이 줄 사용
    // authStore.logout()
    // 중첩 라우트 구조에 맞는 로그인 경로로 이동
    router.push('/auth/login')
  }
}

// 컴포넌트 마운트 시
onMounted(() => {
  updateDateTime()
  timeInterval = setInterval(updateDateTime, 1000)
})

// 컴포넌트 언마운트 시
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
