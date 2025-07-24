import { ref, computed } from 'vue'

/**
 * 날짜 및 시간 관련 유틸리티 컴포저블 함수
 * 날짜 포맷팅, 날짜 계산 등의 기능을 제공합니다.
 */
export function useDateTime() {
  const now = ref(new Date())

  // 5초마다 현재 시간 갱신
  setInterval(() => {
    now.value = new Date()
  }, 5000)

  // 요일 배열 (한글)
  const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

  // 요일 배열 (영문)
  const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // 월 배열 (한글)
  const MONTHS_KR = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월'
  ]

  // 월 배열 (영문)
  const MONTHS_EN = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  /**
   * 현재 날짜 및 시간을 포맷팅하여 반환
   * 형식: YYYY-MM-DD HH:mm:ss 요일
   */
  const currentDateTime = computed(() => {
    const year = now.value.getFullYear()
    const month = (now.value.getMonth() + 1).toString().padStart(2, '0')
    const date = now.value.getDate().toString().padStart(2, '0')
    const hours = now.value.getHours().toString().padStart(2, '0')
    const minutes = now.value.getMinutes().toString().padStart(2, '0')
    const seconds = now.value.getSeconds().toString().padStart(2, '0')
    const day = DAYS_KR[now.value.getDay()]

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds} ${day}요일`
  })

  /**
   * 현재 날짜를 포맷팅하여 반환
   * 형식: YYYY-MM-DD
   */
  const currentDate = computed(() => {
    const year = now.value.getFullYear()
    const month = (now.value.getMonth() + 1).toString().padStart(2, '0')
    const date = now.value.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${date}`
  })

  /**
   * 현재 시간을 포맷팅하여 반환
   * 형식: HH:mm:ss
   */
  const currentTime = computed(() => {
    const hours = now.value.getHours().toString().padStart(2, '0')
    const minutes = now.value.getMinutes().toString().padStart(2, '0')
    const seconds = now.value.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  })

  /**
   * 날짜 객체를 지정된 형식으로 포맷팅
   * @param {Date|string} date - 날짜 객체 또는 날짜 문자열
   * @param {string} format - 포맷 문자열 (기본값: 'YYYY-MM-DD')
   * @returns {string} - 포맷팅된 날짜 문자열
   */
  const formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = date instanceof Date ? date : new Date(date)

    if (isNaN(d.getTime())) {
      return 'Invalid Date'
    }

    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const seconds = d.getSeconds().toString().padStart(2, '0')
    const dayOfWeek = DAYS_KR[d.getDay()]

    return format
      .replace('YYYY', year)
      .replace('YY', year.toString().slice(-2))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('ddd', dayOfWeek)
  }

  /**
   * 날짜 차이 계산 (일 단위)
   * @param {Date|string} date1 - 첫 번째 날짜
   * @param {Date|string} date2 - 두 번째 날짜
   * @returns {number} - 날짜 차이 (일)
   */
  const getDaysDiff = (date1, date2) => {
    const d1 = date1 instanceof Date ? date1 : new Date(date1)
    const d2 = date2 instanceof Date ? date2 : new Date(date2)

    const diffTime = Math.abs(d2 - d1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  /**
   * 날짜에 일수 추가
   * @param {Date|string} date - 기준 날짜
   * @param {number} days - 추가할 일수
   * @returns {Date} - 계산된 날짜
   */
  const addDays = (date, days) => {
    const d = date instanceof Date ? new Date(date) : new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }

  /**
   * 날짜에 월 추가
   * @param {Date|string} date - 기준 날짜
   * @param {number} months - 추가할 월 수
   * @returns {Date} - 계산된 날짜
   */
  const addMonths = (date, months) => {
    const d = date instanceof Date ? new Date(date) : new Date(date)
    d.setMonth(d.getMonth() + months)
    return d
  }

  /**
   * 해당 월의 마지막 날짜 반환
   * @param {number} year - 연도
   * @param {number} month - 월 (1-12)
   * @returns {number} - 해당 월의 마지막 날짜
   */
  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate()
  }

  /**
   * 날짜 범위 생성 (오늘, 1주일, 1개월, 3개월)
   * @param {string} rangeType - 범위 유형 ('today', 'week', 'month', '3months')
   * @returns {Object} - 시작 날짜와 종료 날짜
   */
  const getDateRange = (rangeType) => {
    const endDate = new Date()
    let startDate = new Date()

    switch (rangeType) {
      case 'today':
        // 시작일과 종료일이 동일
        break
      case 'week':
        startDate.setDate(endDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1)
        break
      case '3months':
        startDate.setMonth(endDate.getMonth() - 3)
        break
      default:
        break
    }

    return {
      startDate,
      endDate
    }
  }
  const formatDateDot = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return {
    now,
    currentDateTime,
    currentDate,
    currentTime,
    formatDate,
    getDaysDiff,
    addDays,
    addMonths,
    getLastDayOfMonth,
    getDateRange,
    formatDateDot,
    DAYS_KR,
    DAYS_EN,
    MONTHS_KR,
    MONTHS_EN
  }
}
