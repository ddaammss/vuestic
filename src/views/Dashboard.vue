<template>
  <div>
    <h1 class="page-title">대시보드</h1>

    <div class="alert-balance">
      <div>
        <strong>알림톡 잔액:</strong> {{ formatNumber(12345) }}원
      </div>
      <va-button size="small">충전</va-button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ formatNumber(1234) }}</div>
        <div class="stat-label">일일 접속자</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ formatNumber(12345) }}</div>
        <div class="stat-label">주간 접속자</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ formatNumber(123456) }}</div>
        <div class="stat-label">월간 접속자</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">3</div>
        <div class="stat-label">확정 대기</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">2</div>
        <div class="stat-label">확정 완료</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ formatNumber(1000000) }}</div>
        <div class="stat-label">확정 매출 (원)</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <i class="material-icons" style="margin-right: 8px;">event</i>
          예약 현황
        </div>
        <div class="card-content">
          <div v-for="reservation in recentReservations" :key="reservation.id" class="list-item">
            <div>
              <strong>{{ reservation.name }}</strong><br>
              <small>{{ reservation.date }}</small>
            </div>
            <va-badge :text="reservation.status" :color="getStatusColor(reservation.status)" />
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <va-button preset="secondary" size="small" @click="$router.push('/reservations/status')">
              예약 현황 더 보기
            </va-button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="material-icons" style="margin-right: 8px;">question_answer</i>
          1:1 문의
        </div>
        <div class="card-content">
          <div v-for="inquiry in recentInquiries" :key="inquiry.id" class="list-item">
            <div>
              <strong>{{ inquiry.title }}</strong><br>
              <small>{{ inquiry.author }} - {{ inquiry.date }}</small>
            </div>
            <va-badge :text="inquiry.type" color="info" />
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <va-button preset="secondary" size="small" @click="$router.push('/events/communication')">
              1:1 문의 더 보기
            </va-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { formatNumber } from '@/utils/formatters'

export default {
  name: 'Dashboard',
  setup() {
    const recentReservations = ref([
      { id: 1, name: '박종찬', date: '2025-05-14', status: '확정완료' },
      { id: 2, name: '문시우', date: '2025-05-13', status: '확정완료' },
      { id: 3, name: '민예린', date: '2025-05-15', status: '예약대기' }
    ])

    const recentInquiries = ref([
      { id: 1, title: '광고 문의 드려요', author: '민예린', date: '2025-05-14', type: '광고' },
      { id: 2, title: '예약 취소 가능한가요', author: '최효정', date: '2025-05-13', type: '예약' },
      { id: 3, title: '정보 수정 요청 드려요', author: '김승일', date: '2025-05-13', type: '정보수정' }
    ])

    const getStatusColor = (status) => {
      switch (status) {
        case '확정완료': return 'success'
        case '예약대기': return 'warning'
        case '예약취소': return 'danger'
        default: return 'info'
      }
    }

    return {
      recentReservations,
      recentInquiries,
      formatNumber,
      getStatusColor
    }
  }
}
</script>
