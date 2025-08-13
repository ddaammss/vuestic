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
          <!-- <div class="header-right">
            <div class="coupon-status" :class="getStatusClass(detail.status)">
              {{ getStatusText(detail.status) }}
            </div>
          </div> -->
        </div>
      </div>

      <!-- 쿠폰 기본 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>기본 정보</h3>
          <div class="info-badge">{{ detail.couponCode }}</div>
        </div>

        <div class="form-grid">

          <va-input v-model="detail.couponName" label="쿠폰명" :rules="[value => !!value || '쿠폰명은 필수입니다.']" />

          <va-select v-model="detail.category" label="쿠폰 종류" :options="categoryOptions" text-by="text"
            value-by="value" />

          <va-select v-model="detail.status" label="쿠폰 상태" :options="statusOptions" text-by="text" value-by="value" />

          <va-input v-model="detail.minOrderAmount" label="최소 주문 금액" type="number" suffix="원" />
        </div>
      </div>

      <!-- 할인 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>할인 정보</h3>
        </div>

        <div class="form-grid">
          <va-select v-model="detail.couponType" label="할인 종류" :options="discountTypeOptions" text-by="text"
            value-by="value" />
          <!-- @update:model-value="handleDiscountTypeChange"  -->
          <va-input v-model="detail.discountValue" label="할인값" type="number"
            :suffix="detail.discountType === 'percent' ? '%' : '원'" :rules="[value => !!value || '할인값은 필수입니다.']" />

          <va-input v-model="detail.maxDiscountAmount" label="최대 할인 금액" type="number" suffix="원" />
        </div>
      </div>

      <!-- 발급 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>발급 정보</h3>
        </div>

        <div class="form-grid">
          <va-date-input v-model="detail.issueDate" label="발급일" />

          <va-date-input v-model="detail.startDate" label="유효기간(시작일)" />
          <va-date-input v-model="detail.endDate" label="유효기간(종료일)" />

          <va-input v-model="detail.maxIssueCount" label="총 발급 건수" type="number" />
        </div>
      </div>

      <!-- 사용 조건 -->
      <!-- <div class="detail-section">
        <div class="section-header">
          <h3>사용 조건</h3>
        </div>

        <div class="form-grid">

          <va-input v-model="detail.usageLimit" label="사용 횟수 제한" type="number" :readonly="!isEditMode" />
        </div>

        <va-textarea v-model="detail.description" label="쿠폰 설명" :readonly="!isEditMode" :max-rows="4" class="full-width" />
      </div> -->

      <!-- 시스템 정보 -->
      <!-- <div class="detail-section readonly-section">
        <div class="section-header">
          <h3>시스템 정보</h3>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">쿠폰 코드:</span>
            <span class="value">{{ detail.couponCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">등록일:</span>
            <span class="value">{{ detail.createdAt }}</span>
          </div>
          <div class="info-item">
            <span class="label">수정일:</span>
            <span class="value">{{ detail.updatedAt || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">등록자:</span>
            <span class="value">{{ detail.createdBy || '관리자' }}</span>
          </div>
        </div>
      </div> -->

      <!-- 액션 버튼 -->
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
const rowData = route.params.couponCode

onMounted(async () => {
  if (rowData) {
    await fetchDetail(rowData)
  }
})

const fetchDetail = async (data) => {
  loading.value = true
  try {
    const response = await axios.post('/settings/coupon/detail', {
      couponCode: data
    })
    detail.value = response.data.data
  } catch (error) {
    console.error('상세 조회 에러:', error)
  } finally {
    loading.value = false;
  }
}

// 쿠폰 상세 데이터
const detail = ref({
  couponCode: '',
  couponName: '',
  category: 0,
  status: 0,
  couponType: '',
  discountValue: '',
  maxDiscountAmount: '',
  issueDate: '',
  startDate: '',
  endDate: '',
  maxIssueCount: '',
  minOrderAmount: '',
  description: '',
  createdAt: '',
  updatedAt: '',
  createdBy: ''
})

const categoryOptions = ref([
  { text: '신점', value: 0 },
  { text: '철학관', value: 1 },
  { text: '타로', value: 2 },
  { text: '굿당', value: 3 },
  { text: '기도터', value: 4 },
  { text: '사찰', value: 5 }
])

const statusOptions = ref([
  { text: '발급 대기', value: 0 },
  { text: '발급중', value: 1 },
  { text: '발급 중지', value: 2 },
  { text: '만료', value: 3 }
])

const discountTypeOptions = ref([
  { text: '정율 할인 (%)', value: 0 },
  { text: '정액 할인 (원)', value: 1 }
])

// 상태별 클래스 반환
// const getStatusClass = (status) => {
//   const statusClasses = {
//     0: 'status-waiting',
//     1: 'status-active',
//     2: 'status-stopped',
//     3: 'status-expired'
//   }
//   return statusClasses[status] || 'status-default'
// }

// 상태 텍스트 반환
// const getStatusText = (status) => {
//   const statusTexts = {
//     0: '발급 대기',
//     1: '발급중',
//     2: '발급 중지',
//     3: '만료'
//   }
//   return statusTexts[status] || '알 수 없음'
// }

// 할인 타입 변경 시 처리
// const handleDiscountTypeChange = (type) => {
//   detail.value.maxDiscountAmount = '0'
// }

const save = async () => {
  try {
    // 유효성 검사
    if (!detail.value.couponName) {
      alert('쿠폰명을 입력해주세요.')
      return;
    }

    if (!detail.value.discountValue) {
      alert('할인값을 입력해주세요.')
      return;
    }
    const saveData = {
      ...detail.value,
      issueDate: formatDateForAPI(new Date(detail.value.issueDate)),
      startDate: formatDateForAPI(new Date(detail.value.startDate)),
      endDate: formatDateForAPI(new Date(detail.value.endDate))
    }
    //console.log('저장할 데이터:', saveData)
    const response = await axios.post('/settings/coupon/upsert', saveData)
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
    startDate: route.query.startDate,
    endDate: route.query.endDate,
    category: route.query.category,
    status: route.query.status
  }

  router.push({
    path: '/settings/coupon',
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 16px;
}

/* .full-width {
  grid-column: 1 / -1;
} */

/* 정보 그리드 */
/* .info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
} */

/* .info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--va-background-border);
}

.info-item .label {
  font-weight: 600;
  color: var(--va-text-secondary);
  flex-shrink: 0;
}

.info-item .value {
  font-weight: 500;
  color: var(--va-text-primary);
  font-family: monospace;
  text-align: right;
} */

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

/* 반응형 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .btn-group {
    justify-content: stretch;
  }

  .btn-group>* {
    flex: 1;
  }

  /* .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-item .value {
    text-align: left;
  }*/
}
</style>
