<template>
  <div class="login-container">
    <h1 class="login-title">관리자 로그인</h1>
    <p class="login-subtitle">ADMIN LOGIN</p>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label class="form-label">아이디</label>
        <div style="position: relative;">
          <i class="material-icons input-icon">person</i>
          <input type="text" v-model="loginForm.username" placeholder="아이디를 입력하세요" class="form-input" required />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">패스워드</label>
        <div style="position: relative;">
          <i class="material-icons input-icon">lock</i>
          <input type="password" v-model="loginForm.password" placeholder="패스워드를 입력하세요" class="form-input" required />
        </div>
      </div>

      <div class="checkbox-wrapper">
        <input type="checkbox" id="remember" v-model="loginForm.remember" class="checkbox" />
        <label for="remember" class="checkbox-label">로그인 상태 유지</label>
      </div>

      <button type="submit" class="login-button" :disabled="isLoading">
        {{ isLoading ? '로그인 중...' : '로그인' }}
      </button>

      <div class="forgot-password">
        <a href="#" @click.prevent="forgotPassword">메인 페이지 바로가기</a>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)

    const loginForm = ref({
      username: '',
      password: '',
      remember: false
    })

    const handleLogin = async () => {
      if (!loginForm.value.username || !loginForm.value.password) {
        alert('아이디와 패스워드를 모두 입력해주세요.')
        return
      }

      isLoading.value = true

      try {
        // 실제 로그인 로직 구현
        // 예: API 호출
        await new Promise(resolve => setTimeout(resolve, 1500)) // 임시 딜레이

        // 로그인 성공 시 관리자 페이지로 이동 (중첩 라우트 구조)
        router.push('/')

      } catch (error) {
        console.error('로그인 실패:', error)
        alert('로그인에 실패했습니다. 다시 시도해주세요.')
      } finally {
        isLoading.value = false
      }
    }

    const forgotPassword = () => {
      // 메인 페이지로 이동하거나 다른 처리
      window.open('/', '_blank')
    }

    return {
      loginForm,
      isLoading,
      handleLogin,
      forgotPassword
    }
  }
}
</script>

<style scoped>
/* 추가적인 컴포넌트 전용 스타일이 필요한 경우 여기에 작성 */
.login-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.checkbox {
  accent-color: #6c7ae0;
}
</style>
