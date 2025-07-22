import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 인증 관련 컴포저블 함수
 * 로그인, 로그아웃, 인증 상태 확인 등의 기능을 제공합니다.
 */
export function useAuth() {
  const router = useRouter()
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const isLoading = ref(false)
  const error = ref(null)

  // 인증 상태 계산
  const isAuthenticated = computed(() => !!token.value)

  // 관리자 여부 확인
  const isAdmin = computed(() => {
    if (!user.value) return false
    return user.value.role === 'admin'
  })

  /**
   * 로그인 처리 함수
   * @param {string} username - 사용자 아이디
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise<boolean>} - 로그인 성공 여부
   */
  const login = async (username, password) => {
    isLoading.value = true
    error.value = null

    try {
      // API 호출로 대체해야 함
      if (username === 'admin' && password === 'admin') {
        const userData = {
          id: 1,
          username: 'admin',
          name: '관리자',
          role: 'admin'
        }

        // 로그인 성공 처리
        const authToken = 'sample_token_' + Math.random().toString(36).substring(2)

        // 로컬 스토리지에 저장
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))

        // 상태 업데이트
        token.value = authToken
        user.value = userData

        return true
      } else {
        throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (err) {
      error.value = err.message || '로그인 중 오류가 발생했습니다.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 로그아웃 처리 함수
   */
  const logout = () => {
    // 로컬 스토리지에서 제거
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // 상태 초기화
    token.value = null
    user.value = null

    // 로그인 페이지로 리다이렉트
    router.push('/login')
  }

  /**
   * 인증 확인 함수 (라우트 가드에서 사용)
   * @returns {boolean} - 인증 여부
   */
  const checkAuth = () => {
    if (!token.value) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      router.push('/login')
      return false
    }
    return true
  }

  /**
   * 토큰 갱신 함수
   * @returns {Promise<boolean>} - 갱신 성공 여부
   */
  const refreshToken = async () => {
    // 실제 구현에서는 API를 통해 토큰 갱신 로직 구현
    return true
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
    refreshToken
  }
}
