<template>
  <header class="header">
    <div class="breadcrumb">
      사주나라 관리자 > {{ currentPageTitle }}
    </div>
    <div class="header-right">
      <div class="datetime">{{ currentDateTime }}</div>
      <va-button preset="secondary" size="small">
        1:1 문의
      </va-button>
      <va-button preset="secondary" size="small">
        광고 신청
      </va-button>
      <va-button preset="secondary" size="small" @click="logout">
        로그아웃
      </va-button>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const route = useRoute()
    const currentDateTime = ref('')
    let timeInterval = null

    const currentPageTitle = computed(() => {
      return route.meta?.title || route.name || 'HOME'
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
        alert('로그아웃 되었습니다.')
        // 실제 로그아웃 로직 구현
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
      logout
    }
  }
}
</script>

<style scoped>
.header {
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.datetime {
  font-size: 14px;
  color: #666;
}
</style>
