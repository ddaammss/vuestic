<template>
  <div>
    <div class="table-container">
      <!-- 페이지 헤더 -->
      <div class="table-header">
        <div class="header-content">
          <div class="header-left">
            <span class="page-title">쿠폰 등록</span>
          </div>
        </div>
      </div>

      <!-- 쿠폰 기본 정보 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>기본 정보</h3>
        </div>

        <div class="form-grid">
          <va-input v-model="detail.couponName" label="쿠폰명" :rules="[value => !!value || '쿠폰명은 필수입니다.']" />
          <va-select v-model="detail.category" label="쿠폰 종류" :options="categoryOptions" text-by="label" value-by="value" />
          <va-select v-model="detail.status" label="쿠폰 상태" :options="statusOptions" text-by="label" value-by="value" />
          <va-input v-model="detail.minOrderAmount" label="최소 주문 금액"  />
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
          <va-input v-model="detail.maxDiscountAmount" label="최대 할인 금액"  />
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
          <va-button @click="saveCoupon" icon="save">저장</va-button>
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

const router = useRouter()

// 쿠폰 상세 데이터
const detail = ref({
  couponCode: '',
  couponName: '',
  category: 9,
  status: 0,
  couponType: 0,
  discountValue: 0,
  maxDiscountAmount: 0,
  issueDate: new Date(),
  startDate: new Date(),
  endDate: new Date(),
  maxIssueCount: 0,
  minOrderAmount: 0,
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

const saveCoupon = async () => {
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
  router.push('/settings/coupon')
}
</script>

<style scoped>
/* 기본 컨테이너 - 목록 페이지와 동일 */
.table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

/* 헤더 영역 */
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

.coupon-code-badge {
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
