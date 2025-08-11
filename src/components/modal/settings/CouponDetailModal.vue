<template>
  <va-modal v-model="isOpen" size="large" max-width="800px" :hide-default-actions="true" overlay overlay-opacity="0.6">
    <template #header>
      <div class="modal-header">
        <h3>쿠폰 상세 정보</h3>
      </div>
    </template>

    <div class="coupon-detail-content">
      <div class="form-section">
        <h4>기본 정보</h4>
        <div class="form-grid">
          <va-input v-model="form.couponName" label="쿠폰명" placeholder="쿠폰명을 입력하세요"
            :rules="[value => !!value || '쿠폰명은 필수입니다.']" />

          <va-select v-model="form.category" label="쿠폰 종류" :options="categoryOptions" text-by="text" value-by="value" />

          <va-select v-model="form.status" label="쿠폰 상태" :options="statusOptions" text-by="text" value-by="value" />
        </div>
      </div>

      <div class="form-section">
        <h4>할인 정보</h4>
        <div class="form-grid">
          <va-select v-model="form.discountType" label="할인 방식" :options="discountTypeOptions" text-by="text"
            value-by="value" @update:model-value="handleDiscountTypeChange" />

          <va-input v-model="form.discountValue" label="할인값" type="number"
            :suffix="form.discountType === 'percent' ? '%' : '원'" placeholder="할인값을 입력하세요"
            :rules="[value => !!value || '할인값은 필수입니다.']" />

          <va-input v-model="form.maxDiscountAmount" label="최대 할인 금액" type="number" suffix="원" placeholder="최대 할인 금액"
            :disabled="form.discountType === 'fixed'" />
        </div>
      </div>

      <div class="form-section">
        <h4>발급 정보</h4>
        <div class="form-grid">
          <va-date-input v-model="form.issueDate" label="발급일" placeholder="발급일을 선택하세요" />
          <va-input v-model="form.maxIssueCount" label="총 발급 건수" type="number" placeholder="발급 건수를 입력하세요" />
          <va-date-input v-model="form.startDate" label="유효기간(시작일)" placeholder="유효기간(시작일)을 선택하세요" />
          <va-date-input v-model="form.endDate" label="유효기간(종료일)" placeholder="유효기간(종료일)을 선택하세요" />
        </div>
      </div>

      <div class="form-section">
        <h4>사용 조건</h4>
        <div class="form-grid">
          <va-input v-model="form.minOrderAmount" label="최소 주문 금액" type="number" suffix="원" placeholder="최소 주문 금액" />
          <!-- <va-input v-model="form.usageLimit" label="사용 횟수 제한" type="number" placeholder="사용 제한 횟수" /> -->
        </div>


        <!-- <va-textarea
          v-model="form.description"
          label="쿠폰 설명"
          placeholder="쿠폰에 대한 상세 설명을 입력하세요"
          :max-rows="4"
        /> -->
      </div>
      <div class="form-section">
        <h4>지급대상자</h4>
        <div class="form-grid">
          <div class="form-grid">
            <va-button @click="searchMember">회원검색</va-button>
            <va-button @click="searchMember">전체삭제</va-button>
          </div>
        </div>
      </div>

    </div>

    <template #footer>
      <div class="modal-footer">
        <va-button preset="secondary" @click="closeModal">취소</va-button>
        <va-button @click="saveCoupon" :loading="saving">저장</va-button>
      </div>
    </template>
  </va-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatDateForAPI } from '@/utils/formatters'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  couponData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'saved'])

const isOpen = computed({
  get: () => props.show,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  }
})

const saving = ref(false)

// 폼 데이터
const form = ref({
  couponCode: '',
  couponName: '',
  category: 0,
  status: 0,
  discountType: 'percent',
  discountValue: '',
  maxDiscountAmount: '',
  issueDate: '',
  expireDate: '',
  maxIssueCount: '',
  minOrderAmount: '',
  description: '',
  createdAt: '',
  updatedAt: '',
  startDate: '',
  endDate: ''
})

// 옵션들
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
  { text: '정율 할인 (%)', value: 'percent' },
  { text: '정액 할인 (원)', value: 'fixed' }
])

// 쿠폰 데이터 변경 시 폼 업데이트
watch(() => props.couponData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    form.value = {
      couponCode: newData.couponCode || '',
      couponName: newData.couponName || '',
      category: newData.category || 0,
      status: newData.status || 0,
      discountType: newData.discountType || 'percent',
      discountValue: newData.discountValue || null,
      maxDiscountAmount: newData.maxDiscountAmount || null,
      issueDate: newData.issueDate || null,
      expireDate: newData.expireDate || null,
      maxIssueCount: newData.maxIssueCount || null,
      minOrderAmount: newData.minOrderAmount || null,
      usageLimit: newData.usageLimit || null,
      description: newData.description || '',
      createdAt: newData.createdAt || '',
      updatedAt: newData.updatedAt || '',
      startDate: newData.startDate || '',
      endDate: newData.endDate || ''
    }
  }
}, { immediate: true, deep: true })

// 할인 타입 변경 시 처리
const handleDiscountTypeChange = (type) => {
  if (type === 'fixed') {
    form.value.maxDiscountAmount = null
  }
}

// 저장 함수
const saveCoupon = async () => {
  try {
    saving.value = true

    // 유효성 검사
    if (!form.value.couponName) {
      alert('쿠폰명을 입력해주세요.')
      return
    }

    if (!form.value.discountValue) {
      alert('할인값을 입력해주세요.')
      return
    }

    // API 호출할 데이터 준비
    const saveData = {
      ...form.value,
      issueDate: formatDateForAPI(form.value.issueDate),
      expireDate: formatDateForAPI(form.value.expireDate)
    }

    // TODO: 실제 API 호출
    // await axios.put(`/settings/coupon/${form.value.couponCode}`, saveData)

    console.log('저장할 데이터:', saveData)

    // 성공 처리
    alert('쿠폰이 성공적으로 저장되었습니다.')
    emit('saved', saveData)
    closeModal()

  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
    saving.value = false
  }
}

// 모달 닫기
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* 모달 전체 오버레이 강화 */
:deep(.va-modal__overlay) {
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(2px);
}

/* 모달 컨테이너 z-index 강화 */
:deep(.va-modal__container) {
  z-index: 9999 !important;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--va-background-border);
}

.modal-header h3 {
  margin: 0;
  color: var(--va-primary);
  font-size: 20px;
  font-weight: 600;
}

.coupon-code {
  background: var(--va-background-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  font-family: monospace;
  font-weight: bold;
  color: var(--va-text-primary);
  border: 1px solid var(--va-background-border);
}

.coupon-detail-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.form-section {
  margin-bottom: 32px;
  padding: 20px;
  background: var(--va-background-secondary);
  border-radius: 12px;
  border-left: 4px solid var(--va-primary);
}

.form-section h4 {
  margin: 0 0 16px 0;
  color: var(--va-primary);
  font-size: 16px;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.readonly-info {
  margin-top: 24px;
  padding: 20px;
  background: var(--va-background-element);
  border-radius: 12px;
  border: 1px solid var(--va-background-border);
}

.readonly-info h4 {
  margin: 0 0 16px 0;
  color: var(--va-text-primary);
  font-size: 16px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--va-background-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 500;
  color: var(--va-text-secondary);
}

.info-item .value {
  font-weight: 600;
  color: var(--va-text-primary);
  font-family: monospace;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
}

/* 스크롤바 스타일링 */
.coupon-detail-content::-webkit-scrollbar {
  width: 6px;
}

.coupon-detail-content::-webkit-scrollbar-track {
  background: var(--va-background-secondary);
  border-radius: 3px;
}

.coupon-detail-content::-webkit-scrollbar-thumb {
  background: var(--va-primary);
  border-radius: 3px;
}

.coupon-detail-content::-webkit-scrollbar-thumb:hover {
  background: var(--va-primary-dark);
}

/* 반응형 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
