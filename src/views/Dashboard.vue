<template>
  <div>
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
      <!-- <div class="stat-card">
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
      </div> -->
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <i class="material-icons" style="margin-right: 8px;">event</i> 예약 현황
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
            <va-button preset="secondary" size="small" @click="$router.push('/reservations/list')"> 더 보기 </va-button>
          </div>
        </div>
      </div>

      <!-- 매출 현황 카드 - 새로운 디자인 -->
      <div class="card">
        <div class="card-header">
          <i class="material-icons" style="margin-right: 8px;">question_answer</i> Q&A 문의
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
            <va-button preset="secondary" size="small" @click="$router.push('/events/communication/list')"> 더 보기 </va-button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <i class="material-icons" style="margin-right: 8px;">campaign</i> 광고 문의
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
            <va-button preset="secondary" size="small" @click="$router.push('/ads/request')"> 더 보기 </va-button>
          </div>
        </div>
      </div>

      <div class="card sales-card">
        <div class="card-header">
          <i class="material-icons" style="margin-right: 8px;">analytics</i> 매출 현황
          <div class="date-range">
            <span>{{ salesPeriod.start }} ~ {{ salesPeriod.end }}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="sales-stats">
            <div class="sales-stat-card">
              <div class="sales-number">{{ salesData.confirmed }}건</div>
              <div class="sales-label">예약 확정</div>
            </div>
            <div class="sales-stat-card">
              <div class="sales-number">{{ salesData.pending }}건</div>
              <div class="sales-label">예약 취소</div>
            </div>
            <div class="sales-stat-card">
              <div class="sales-number">{{ formatNumber(salesData.revenue) }}원</div>
              <div class="sales-label">매출</div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 15px;">
            <va-button preset="secondary" size="small" @click="$router.push('/sales/list')"> 더 보기 </va-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/utils/formatters'

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

const salesData = ref({
  confirmed: 100,
  pending: 10,
  revenue: 1000000
})

const getSalesPeriod = () => {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1) // 이전 달 1일
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0) // 이전 달 마지막 일

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return {
    start: formatDate(lastMonth),
    end: formatDate(lastDayOfLastMonth)
  }
}

const salesPeriod = ref(getSalesPeriod())

const getStatusColor = (status) => {
  switch (status) {
    case '확정완료': return 'success'
    case '예약대기': return 'warning'
    case '예약취소': return 'danger'
    default: return 'info'
  }
}
</script>

<style scoped>
.sales-card {
  grid-column: span 3; /* 더 넓은 공간 차지 */
}

.date-range {
  margin-left: auto;
  font-size: 0.9rem;
  color: #666;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.sales-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.sales-stat-card {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-left: 4px solid #007bff;
}

.sales-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.sales-label {
  font-size: 0.9rem;
  color: #666;
}

.sales-chart-container {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-title {
  font-weight: bold;
  color: #333;
}

.chart-legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 5px;
}

.legend-color.revenue {
  background: #007bff;
}

.legend-color.reservations {
  background: #28a745;
}

.simple-bar-chart {
  height: 120px;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 80px;
  padding: 0 10px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 2px;
}

.bar-container {
  display: flex;
  align-items: flex-end;
  height: 60px;
  gap: 2px;
}

.bar {
  width: 8px;
  min-height: 3px;
  border-radius: 2px 2px 0 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.bar:hover {
  opacity: 0.8;
}

.revenue-bar {
  background: linear-gradient(to top, #007bff, #0056b3);
}

.reservation-bar {
  background: linear-gradient(to top, #28a745, #1e7e34);
}

.bar-label {
  font-size: 0.7rem;
  color: #666;
  margin-top: 5px;
  writing-mode: horizontal-tb;
}

/* 반응형 */
@media (max-width: 768px) {
  .sales-card {
    grid-column: span 1;
  }

  .sales-stats {
    grid-template-columns: 1fr;
  }
}

/* 기존 스타일들 */
.alert-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  background: #34495e;
}

.card-content {
  padding: 15px 20px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.list-item:last-child {
  border-bottom: none;
}
</style>
