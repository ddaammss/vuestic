import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
    userName: (state) => state.user?.name || '',
    userRole: (state) => state.user?.role || ''
  },

  actions: {
    // 로그인
    login(userData) {
      this.user = userData
      this.isAuthenticated = true
      this.token = 'fake-jwt-token-' + Date.now() // 실제 환경에서는 서버에서 받은 JWT 토큰

      // 로컬 스토리지에 저장 (새로고침 시에도 로그인 상태 유지)
      localStorage.setItem('auth_token', this.token)
      localStorage.setItem('user_data', JSON.stringify(userData))
    },

    // 로그아웃
    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null

      // 로컬 스토리지에서 제거
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('rememberMe')
    },

    // 앱 시작 시 로그인 상태 복원
    restoreAuth() {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')

      if (token && userData) {
        try {
          this.token = token
          this.user = JSON.parse(userData)
          this.isAuthenticated = true
          return true
        } catch (error) {
          console.error('Failed to restore auth:', error)
          this.logout() // 잘못된 데이터가 있으면 로그아웃
        }
      }
      return false
    },

    // 토큰 검증 (실제 환경에서는 서버에 요청)
    async validateToken() {
      if (!this.token) return false

      try {
        // 실제 환경에서는 서버 API 호출
        // const response = await api.validateToken(this.token)
        // return response.valid

        // 시뮬레이션: 토큰이 있으면 유효하다고 가정
        return true
      } catch (error) {
        console.error('Token validation failed:', error)
        this.logout()
        return false
      }
    }
  }
})
