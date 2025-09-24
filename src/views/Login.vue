<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">관리자 로그인</h1>
      <p class="login-subtitle">ADMIN LOGIN</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">아이디</label>
          <div class="input-wrapper">
            <i class="material-icons input-icon">person</i>
            <input type="text" v-model="loginForm.username" placeholder="아이디를 입력하세요" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">패스워드</label>
          <div class="input-wrapper">
            <i class="material-icons input-icon">lock</i>
            <input type="password" v-model="loginForm.password" placeholder="패스워드를 입력하세요" class="form-input" />
          </div>
        </div>

        <div class="checkbox-wrapper">
          <input type="checkbox" id="remember" v-model="loginForm.remember" class="checkbox"/>
          <label for="remember" class="checkbox-label">로그인 상태 유지</label>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>

        <!-- <div class="forgot-password">
          <a href="#" @click.prevent="forgotPassword">메인 페이지 바로가기</a>
        </div> -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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

    // 로그인 성공시 토큰 저장 (실제 구현시)
    if (loginForm.value.remember) {
      localStorage.setItem('authToken', 'sample-token')
    }

    // 로그인 성공 시 관리자 페이지로 이동
    router.push('/')

  } catch (error) {
    console.error('로그인 실패:', error)
    alert('로그인에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isLoading.value = false
  }
}

const forgotPassword = () => {
  // 메인 페이지로 이동
  window.open('/', '_blank')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  animation: fadeInUp 0.6s ease-out;
}

.login-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 2rem;
  font-weight: 500;
  letter-spacing: 2px;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 20px;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f7fafc;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:focus + .input-icon,
.form-input:not(:placeholder-shown) + .input-icon {
  color: #667eea;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.checkbox {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  accent-color: #667eea;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
  user-select: none;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.forgot-password {
  text-align: center;
}

.forgot-password a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: #5a67d8;
  text-decoration: underline;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
