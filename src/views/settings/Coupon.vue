<template>
  <div>
    <h1 class="page-title">쿠폰 설정</h1>

    <div class="form-container">
      <form @submit.prevent="saveCoupon">
        <div class="form-grid">
          <va-date-input v-model="coupon.startDate" label="쿠폰 시작일" />
          <va-date-input v-model="coupon.endDate" label="쿠폰 종료일" />
        </div>

        <div class="form-grid">
          <va-select v-model="coupon.category" label="쿠폰 카테고리" :options="categoryOptions" />
          <va-select v-model="coupon.targetUser" label="쿠폰 사용 대상" :options="targetUserOptions" />
        </div>

        <va-input v-model="coupon.name" label="쿠폰명" class="form-full" />

        <div style="margin: 20px 0;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">쿠폰종류</label>
          <div class="radio-group">
            <va-radio v-model="coupon.type" option="정률할인" label="정률할인" />
            <va-radio v-model="coupon.type" option="정액할인" label="정액할인" />
          </div>
        </div>

        <div class="form-grid">
          <va-input v-model="coupon.discountValue" :label="coupon.type === '정률할인' ? '할인율 (%)' : '할인금액 (원)'"
            type="number" />
          <va-input v-model="coupon.maxDiscount" label="최대 할인금액 (원)" type="number" />
        </div>

        <va-textarea v-model="coupon.description" label="쿠폰 설명" class="form-full" />

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button type="submit">저장</va-button>
          <!-- <va-button preset="secondary" @click="resetCoupon">초기화</va-button> -->
        </div>
      </form>
    </div>

    <!-- 기존 쿠폰 목록 -->
    <div class="table-container" style="margin-top: 30px;">
      <div class="table-header">등록된 쿠폰 목록</div>
      <va-data-table :items="coupons" :columns="couponColumns" :per-page="10" hoverable striped>
        <template #cell(status)="{ value }">
          <va-badge :text="value" :color="value === '활성' ? 'success' : 'danger'" />
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="editCoupon(rowIndex)" style="margin-right: 5px;">수정</va-button>
          <va-button size="small" preset="danger" @click="deleteCoupon(rowIndex)">삭제</va-button>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Coupon',
  setup() {
    const coupon = ref({
      startDate: null,
      endDate: null,
      category: '전체',
      targetUser: '전체',
      name: '',
      type: '정률할인',
      discountValue: 0,
      maxDiscount: 0,
      description: ''
    })

    const categoryOptions = ref(['전체', '신점', '철학관', '타로', '굿당', '기도터', '사찰'])
    const targetUserOptions = ref(['전체', '신규회원', '기존회원'])

    const coupons = ref([
      { id: 1, name: '신규회원 할인', type: '정률할인', value: '10%', status: '활성', startDate: '2025-05-01', endDate: '2025-12-31' },
      { id: 2, name: '여름 특가', type: '정액할인', value: '5000원', status: '비활성', startDate: '2025-06-01', endDate: '2025-08-31' }
    ])

    const couponColumns = ref([
      { key: 'name', label: '쿠폰명' },
      { key: 'type', label: '할인타입' },
      { key: 'value', label: '할인값' },
      { key: 'startDate', label: '시작일' },
      { key: 'endDate', label: '종료일' },
      { key: 'status', label: '상태' },
      { key: 'actions', label: '관리' }
    ])

    const saveCoupon = () => {
      console.log('쿠폰 저장:', coupon.value)
      alert('쿠폰이 저장되었습니다.')
    }

    const resetCoupon = () => {
      coupon.value = {
        startDate: null,
        endDate: null,
        category: '전체',
        targetUser: '전체',
        name: '',
        type: '정률할인',
        discountValue: 0,
        maxDiscount: 0,
        description: ''
      }
    }

    const editCoupon = (index) => {
      console.log('쿠폰 수정:', index)
      alert('쿠폰 수정 기능을 구현하세요.')
    }

    const deleteCoupon = (index) => {
      if (confirm('정말 삭제하시겠습니까?')) {
        coupons.value.splice(index, 1)
        alert('쿠폰이 삭제되었습니다.')
      }
    }

    return {
      coupon,
      categoryOptions,
      targetUserOptions,
      coupons,
      couponColumns,
      saveCoupon,
      resetCoupon,
      editCoupon,
      deleteCoupon
    }
  }
}
</script>
