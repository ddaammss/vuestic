<template>
  <div>
    <div class="table-container">
      <div class="table-header">쿠폰 </div>
      <div class="search-form">
        <div class="form-grid">
          <va-date-input v-model="coupon.startDate" label="쿠폰 시작일" />
          <va-date-input v-model="coupon.endDate" label="쿠폰 종료일" />
        </div>
        <div class="form-grid">
          <va-select v-model="coupon.couponState" label="쿠폰 상태" :options="couponStateOptions" />
          <va-select v-model="coupon.category" label="쿠폰 종류" :options="categoryOptions" />
        </div>

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchCoupons">검색</va-button>
        </div>
      </div>

      <div v-if="selectedItems.length > 0" class="selected-info mb-4">
        <va-alert color="success">
          ✅ {{ selectedItems.length }}개 항목이 선택되었습니다.
          <!-- <va-button size="small" @click="clearSelection" class="ml-2">
            선택 해제
          </va-button> -->
        </va-alert>
      </div>

      <!-- <div v-else class="no-selection mb-4">
        <va-alert color="info">
          ℹ️ 선택된 항목이 없습니다. 체크박스를 클릭해보세요.
        </va-alert>
      </div> -->

      <va-data-table v-model="selectedItems" :items="coupons" :columns="couponColumns" :per-page="10" selectable
        hoverable striped>
        <template #cell(name)="{ value }">
          <va-badge :text="value" :color="value === '활성' ? 'success' : 'warning'" />
        </template>
        <template #cell(useCount)="{ value }">
          {{ formatNumber(value) }}
        </template>
      </va-data-table>

    </div>
  </div>
</template>


<script>
import { ref, computed, watch } from 'vue'
import { formatNumber } from '@/utils/formatters'

export default {
  name: 'Coupon',
  setup() {

    const couponSearch = ref({
      keyword: '',
      couponType: '전체',
      sortBy: '가입일순'
    })
    const selectedItems = ref([])
    const loading = ref(false)
    const perPage = ref(10)
    const statusFilter = ref('')

    const coupon = ref({
      startDate: null,
      endDate: null,
      couponState: '전체',
      category: '전체',
    })

    const couponStateOptions = ref(['전체', '발급 대기', '발급중', '발급 중지'])
    const categoryOptions = ref(['전체', '신점', '철학관', '타로', '굿당', '기도터', '사찰'])

    const coupons = ref([
      {
        id: 1,
        state: '신규회원 할인',
        type: '정률할인',
        number: '10%',
        name: '활성',
        // discount: '2025-05-01',
        // maxDiscount: 10000,
        startDate: '2025-12-31',
        endDate: '2025-12-31',
        regDate: '2025-10-31',
        useCount: 15000
      },
      {
        id: 2,
        state: '첫구매 특가',
        type: '5000',
        number: '정액할인',
        name: '비활성',
        // discount: '2025-06-01',
        // maxDiscount: 5000,
        startDate: '2025-12-31',
        endDate: '2025-12-31',
        regDate: '2025-11-01',
        useCount: 7500
      }
    ])

    const couponColumns = ref([
      { key: 'state', label: '쿠폰상태' },
      { key: 'type', label: '쿠폰종류' },
      { key: 'number', label: '쿠폰번호' },
      { key: 'name', label: '쿠폰명' },
      //{ key: 'discount', label: '할인액/율' },
      //{ key: 'maxDiscount', label: '최대할인금액' },
      { key: 'startDate', label: '시작일' },
      { key: 'endDate', label: '종료일' },
      { key: 'regDate', label: '등록일' },
      { key: 'useCount', label: '사용 건수' },
    ])
    const saveCoupon = () => {
      console.log('쿠폰 저장:', coupon.value)
      alert('쿠폰이 저장되었습니다.')
    }

    // const resetCoupon = () => {
    //   coupon.value = {
    //     startDate: null,
    //     endDate: null,
    //     category: '전체',
    //     couponState: '전체',
    //     name: '',
    //     type: '정률할인',
    //     discountValue: 0,
    //     maxDiscount: 0,
    //     description: ''
    //   }
    // }

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

    const searchCoupons = () => {
      console.log('회원 검색:', couponSearch.value)
    }


    return {
      selectedItems,
      coupon,
      categoryOptions,
      couponStateOptions,
      coupons,
      searchCoupons,
      couponColumns,
      saveCoupon,
      //resetCoupon,
      editCoupon,
      deleteCoupon,
      formatNumber,
    }
  }
}
</script>
