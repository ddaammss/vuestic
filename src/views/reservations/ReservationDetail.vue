<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      <va-progress-circle indeterminate size="large" />
    </div>
    <div class="table-container">
      <!-- 페이지 헤더 -->
      <div class="table-header">
        <div class="header-content">
          <div class="header-left">
            <span class="page-title">상세 정보</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>기본 정보</h3>
          <div class="info-badge">{{ detail.reservationCode }}</div>
        </div>

        <div class="form-grid">
          <va-input v-model="detail.reserverName" label="예약자" readonly />
          <va-input v-model="detail.storeName" label="입점사" readonly />
          <va-input v-model="detail.reserverPhone" label="연락처" readonly />
          <va-input v-model="detail.guestCount" label="예약인원" readonly />
          <va-input v-model="detail.paymentAmount" label="결제금액" input-class="va-text-right" readonly
            style="color: red;" />
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>예약 정보</h3>
        </div>

        <div class="form-grid">
          <va-input v-model="detail.createdAt" label="접수일자" readonly />
          <va-input v-model="detail.reservationDate" label="예약일자" readonly />
          <va-input v-model="detail.confirmDate" label="확정일자" readonly />
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>상태 관리</h3>
        </div>

        <div class="form-grid">
          <va-select v-model="detail.resultType" label="결제여부" :options="resultTypeOptions" text-by="label"
            value-by="value" />
          <va-select v-model="detail.reservationType" label="예약상태" :options="reservationTypeOptions" text-by="label"
            value-by="value" />
        </div>
      </div>

      <div class="action-section">
        <div class="btn-group">
          <va-button @click="save" icon="save">저장</va-button>
          <va-button preset="secondary" @click="goBack"> 목록으로 </va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, readonly } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateForAPI } from '@/utils/formatters'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rowData = route.params.reservationCode

onMounted(async () => {
  if (rowData) {
    await fetchDetail(rowData)
  }
})

const fetchDetail = async (data) => {
  loading.value = true
  try {
    const response = await axios.post('/reservation/detail', {
      reservationCode: data
    })
    detail.value = response.data.data

    //console.log(response.data.data);
  } catch (error) {
    console.error('상세 조회 에러:', error)
  } finally {
    loading.value = false;
  }
}

const detail = ref({
  reservationCode: '',
  // storeName: '',
  // categoryType: 0,
  // status: 0,
  // discountValue: '',
  // maxDiscountAmount: '',
  // issueDate: '',
  // startDate: '',
  // endDate: '',
  // maxIssueCount: '',
  // minOrderAmount: '',
  // description: '',
  // createdAt: '',
  // updatedAt: '',
  // createdBy: '',
  resultType:0,
  reservationType:0
})


const reservationTypeOptions = ref([
  { label: '예약대기', value: 0 },
  { label: '예약확정', value: 1 },
  { label: '예약취소', value: 2 },
])

const resultTypeOptions = ref([
  { label: '미결제', value: 0 },
  { label: '결제완료', value: 1 }
])

const save = async () => {
  try {
    const saveData = {
      ...detail.value,
    }
    console.log(detail.value)
    //console.log('저장할 데이터:', saveData)
    const response = await axios.post('/reservation/update', saveData)
    if (response.data.code === 200) {
      alert('저장되었습니다.')
      goBack()
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  }
}

const goBack = () => {
  const searchData = {
    type1: route.query.type1,
    type2: route.query.type2,
    name: route.query.name,
    startDate: route.query.startDate,
    endDate: route.query.endDate,
    reservationType: route.query.reservationType,
    categoryType: route.query.categoryType,
    resultType: route.query.resultType
  }

  router.push({
    path: '/reservations/list',
    query: searchData
  })
}
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.table-header {
  margin-bottom: 32px;
  border-radius: 12px;
}

/* .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 상태 배지 */
/* .coupon-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  min-width: 80px;
} */

/* .status-waiting {
  background: #fef3cd;
  color: #664d03;
}

.status-active {
  background: #d1edff;
  color: #055160;
}

.status-stopped {
  background: #f8d7da;
  color: #721c24;
}

.status-expired {
  background: #e2e3e5;
  color: #41464b;
} */

/* 섹션 스타일 */
.detail-section {
  margin-bottom: 22px;
  padding: 20px;
  background: var(--va-background-secondary);
  border-left: 4px solid var(--va-primary);
}

/* .detail-section::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  width: 60px;
  height: 16px;
  background: var(--va-primary);
  border-radius: 4px;
} */

/* .readonly-section {
  background: var(--va-background-element);
  border-left-color: #6c757d;
} */

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--va-background-border);
}

.section-header h3 {
  margin: 0;
  color: var(--va-primary);
  font-size: 18px;
  font-weight: 600;
}

.info-badge {
  background: var(--va-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 14px;
}

/* 폼 그리드 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 2fr));
  gap: 20px;
  margin-bottom: 16px;
}

/* 액션 버튼 영역 */
.action-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid var(--va-background-border);
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
