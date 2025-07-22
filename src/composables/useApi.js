import { ref } from 'vue'
import axios from 'axios'

/**
 * API 요청 관련 컴포저블 함수
 * API 요청 상태 관리 및 에러 처리를 포함합니다.
 */
export function useApi() {
  // API 요청 상태
  const isLoading = ref(false)
  const error = ref(null)
  const data = ref(null)

  // 기본 API URL (환경 변수에서 가져오는 것이 좋음)
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

  // Axios 인스턴스 생성
  const api = axios.create({
    baseURL,
    timeout: 30000, // 30초
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  // 요청 인터셉터 설정
  api.interceptors.request.use(
    (config) => {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('token')

      // 토큰이 있으면 헤더에 추가
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 응답 인터셉터 설정
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // 401 에러 처리 (인증 만료)
      if (error.response && error.response.status === 401) {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // 로그인 페이지로 리다이렉트
        window.location.href = '/login'
      }

      return Promise.reject(error)
    }
  )

  /**
   * GET 요청 함수
   * @param {string} url - API 엔드포인트
   * @param {Object} params - 쿼리 파라미터
   * @returns {Promise} - API 응답
   */
  const get = async (url, params = {}) => {
    isLoading.value = true
    error.value = null
    data.value = null

    try {
      const response = await api.get(url, { params })
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '요청 중 오류가 발생했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * POST 요청 함수
   * @param {string} url - API 엔드포인트
   * @param {Object} payload - 요청 본문
   * @returns {Promise} - API 응답
   */
  const post = async (url, payload = {}) => {
    isLoading.value = true
    error.value = null
    data.value = null

    try {
      const response = await api.post(url, payload)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '요청 중 오류가 발생했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * PUT 요청 함수
   * @param {string} url - API 엔드포인트
   * @param {Object} payload - 요청 본문
   * @returns {Promise} - API 응답
   */
  const put = async (url, payload = {}) => {
    isLoading.value = true
    error.value = null
    data.value = null

    try {
      const response = await api.put(url, payload)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '요청 중 오류가 발생했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * PATCH 요청 함수
   * @param {string} url - API 엔드포인트
   * @param {Object} payload - 요청 본문
   * @returns {Promise} - API 응답
   */
  const patch = async (url, payload = {}) => {
    isLoading.value = true
    error.value = null
    data.value = null

    try {
      const response = await api.patch(url, payload)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '요청 중 오류가 발생했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * DELETE 요청 함수
   * @param {string} url - API 엔드포인트
   * @param {Object} params - 쿼리 파라미터
   * @returns {Promise} - API 응답
   */
  const del = async (url, params = {}) => {
    isLoading.value = true
    error.value = null
    data.value = null

    try {
      const response = await api.delete(url, { params })
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || '요청 중 오류가 발생했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 파일 업로드 함수
   * @param {string} url - API 엔드포인트
   * @param {FormData} formData - 업로드할 파일 및 데이터
   * @param {Function} progressCallback - 업로드 진행 상태 콜백
   * @returns {Promise} - API 응답
   */
  const uploadFile = async (url, formData, progressCallback = null) => {
    isLoading.value = true
    error.value = null
    data.value = null

    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressCallback) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            progressCallback(percentCompleted)
          }
        }
      })

      data.value = response.data
      return response.data
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || '파일 업로드 중 오류가 발생했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // 사주나라 API 관련 함수들

  /**
   * 입점사 목록 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getMerchants = async (params = {}) => {
    return await get('/merchants', params)
  }

  /**
   * 입점사 상세 조회
   * @param {number|string} id - 입점사 ID
   * @returns {Promise} - API 응답
   */
  const getMerchant = async (id) => {
    return await get(`/merchants/${id}`)
  }

  /**
   * 입점사 등록
   * @param {Object} merchantData - 입점사 데이터
   * @returns {Promise} - API 응답
   */
  const createMerchant = async (merchantData) => {
    return await post('/merchants', merchantData)
  }

  /**
   * 입점사 수정
   * @param {number|string} id - 입점사 ID
   * @param {Object} merchantData - 입점사 데이터
   * @returns {Promise} - API 응답
   */
  const updateMerchant = async (id, merchantData) => {
    return await put(`/merchants/${id}`, merchantData)
  }

  /**
   * 입점사 삭제
   * @param {number|string} id - 입점사 ID
   * @returns {Promise} - API 응답
   */
  const deleteMerchant = async (id) => {
    return await del(`/merchants/${id}`)
  }

  /**
   * 회원 목록 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getUsers = async (params = {}) => {
    return await get('/users', params)
  }

  /**
   * 예약 목록 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getReservations = async (params = {}) => {
    return await get('/reservations', params)
  }

  /**
   * 예약 확정
   * @param {number|string} id - 예약 ID
   * @returns {Promise} - API 응답
   */
  const confirmReservation = async (id) => {
    return await patch(`/reservations/${id}/confirm`)
  }

  /**
   * 예약 취소
   * @param {number|string} id - 예약 ID
   * @param {Object} reason - 취소 사유
   * @returns {Promise} - API 응답
   */
  const cancelReservation = async (id, reason = {}) => {
    return await patch(`/reservations/${id}/cancel`, reason)
  }

  /**
   * 매출 통계 조회
   * @param {Object} params - 검색 조건 (기간, 결제 수단 등)
   * @returns {Promise} - API 응답
   */
  const getSalesStats = async (params = {}) => {
    return await get('/stats/sales', params)
  }

  /**
   * 쿠폰 목록 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getCoupons = async (params = {}) => {
    return await get('/coupons', params)
  }

  /**
   * 쿠폰 등록
   * @param {Object} couponData - 쿠폰 데이터
   * @returns {Promise} - API 응답
   */
  const createCoupon = async (couponData) => {
    return await post('/coupons', couponData)
  }

  /**
   * 포인트 내역 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getPointHistory = async (params = {}) => {
    return await get('/points/history', params)
  }

  /**
   * 포인트 지급
   * @param {Object} pointData - 포인트 데이터 (사용자 ID, 포인트 금액, 지급 사유 등)
   * @returns {Promise} - API 응답
   */
  const givePoints = async (pointData) => {
    return await post('/points/give', pointData)
  }

  /**
   * 배너 목록 조회
   * @returns {Promise} - API 응답
   */
  const getBanners = async () => {
    return await get('/banners')
  }

  /**
   * 배너 등록
   * @param {FormData} bannerData - 배너 데이터 (이미지 포함)
   * @returns {Promise} - API 응답
   */
  const createBanner = async (bannerData) => {
    return await uploadFile('/banners', bannerData)
  }

  /**
   * 이벤트 목록 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getEvents = async (params = {}) => {
    return await get('/events', params)
  }

  /**
   * 이벤트 등록
   * @param {FormData} eventData - 이벤트 데이터 (이미지 포함)
   * @returns {Promise} - API 응답
   */
  const createEvent = async (eventData) => {
    return await uploadFile('/events', eventData)
  }

  /**
   * 광고 목록 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getAds = async (params = {}) => {
    return await get('/ads', params)
  }

  /**
   * 광고 등록
   * @param {Object} adData - 광고 데이터
   * @returns {Promise} - API 응답
   */
  const createAd = async (adData) => {
    return await post('/ads', adData)
  }

  /**
   * 1:1 문의 목록 조회
   * @param {Object} params - 검색 조건
   * @returns {Promise} - API 응답
   */
  const getInquiries = async (params = {}) => {
    return await get('/inquiries', params)
  }

  /**
   * 1:1 문의 답변 등록
   * @param {number|string} id - 문의 ID
   * @param {Object} replyData - 답변 데이터
   * @returns {Promise} - API 응답
   */
  const replyInquiry = async (id, replyData) => {
    return await post(`/inquiries/${id}/reply`, replyData)
  }

  return {
    isLoading,
    error,
    data,
    api,
    get,
    post,
    put,
    patch,
    del,
    uploadFile,
    // 사주나라 API 함수들
    getMerchants,
    getMerchant,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    getUsers,
    getReservations,
    confirmReservation,
    cancelReservation,
    getSalesStats,
    getCoupons,
    createCoupon,
    getPointHistory,
    givePoints,
    getBanners,
    createBanner,
    getEvents,
    createEvent,
    getAds,
    createAd,
    getInquiries,
    replyInquiry
  }
}
