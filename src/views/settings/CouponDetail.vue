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
          <va-select v-model="detail.category" label="쿠폰 종류" :options="categoryOptions" text-by="label" value-by="value" />
          <va-select v-model="detail.status" label="쿠폰 상태" :options="statusOptions" text-by="label" value-by="value" />
          <va-input v-model="detail.minOrderAmount" label="최소 주문 금액" />
        </div>
      </div>

      <!-- 할인 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>할인 정보</h3>
        </div>

        <div class="form-grid">
          <va-select v-model="detail.couponType" label="할인 종류" :options="discountTypeOptions" text-by="label" value-by="value" />
          <va-input v-model="detail.discountValue" label="할인값" :rules="[value => !!value || '할인값은 필수입니다.']" />
          <va-input v-model="detail.maxDiscountAmount" label="최대 할인 금액" />
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
          <va-input v-model="detail.maxIssueCount" label="총 발급 건수" />
        </div>
      </div>

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
  category: 9,
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
  { label: 'ALL', value: 9 },
  { label: '신점', value: 0 },
  { label: '철학관', value: 1 },
  { label: '타로', value: 2 },
  { label: '굿당', value: 3 },
  { label: '기도터', value: 4 },
  { label: '사찰', value: 5 }
])

const statusOptions = ref([
  { label: '발급 대기', value: 0 },
  { label: '발급중', value: 1 },
  { label: '발급 중지', value: 2 },
  { label: '만료', value: 3 }
])

const discountTypeOptions = ref([
  { label: '정율 할인 (%)', value: 0 },
  { label: '정액 할인 (원)', value: 1 }
])

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
    path: '/settings/coupon/list',
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


/* 섹션 스타일 */
.detail-section {
  margin-bottom: 22px;
  padding: 20px;
  background: var(--va-background-secondary);
  border-left: 4px solid var(--va-primary);
}

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
