<template>
  <div>
    <div class="table-container">
      <div class="table-header">쿠폰 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-date-input v-model="search.startDate" label="쿠폰 시작일" placeholder="시작일 선택" clearable highlightWeekend />
          <va-date-input v-model="search.endDate" label="쿠폰 종료일" placeholder="종료일 선택" clearable highlightWeekend />
          <va-select v-model="search.couponState" label="쿠폰 상태" :options="couponStateOptions" text-by="text"
            value-by="value" />
          <va-select v-model="search.category" label="쿠폰 종류" :options="categoryOptions" text-by="text"
            value-by="value" />
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchList">검색</va-button>
          <va-button @click="resetSearch">초기화</va-button>
        </div>
      </div>

      <!-- <div v-if="selectedItems.length > 0" class="selected-info">
        <va-alert color="success">
          총 {{ pageSize }}개 중 {{ selectedItems.length }}개 항목이 선택되었습니다.✅
        </va-alert>
      </div> -->
      <div class="no-selection">
        <va-alert>
          총 {{ totalCount }}개 <!-- ℹ️ -->
        </va-alert>
      </div>

      <va-data-table v-model="selectedItems" :items="list" :columns="columns" :loading="loading"
        no-data-html="🔍 검색 결과가 없습니다." selectable hoverable striped sticky-header show-expand="true">
        <template #cell(actions)="{ row }">
          <VaButton preset="plain" icon="edit" @click="row.toggleRowDetails()" />
          <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(row)" />
        </template>
      </va-data-table>

      <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination>
    </div>
  </div>
</template>


<script setup>


import { ref, computed, watch, onMounted } from 'vue'
import { formatDateForAPI } from '@/utils/formatters'
import Pagination from '@/components/Pagination.vue'
import axios from 'axios'
onMounted(() => {
  fetList()
})

const fetList = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)

    const response = await axios.post('/settings/coupon/list', params)

    list.value = response.data.data || []
    totalPage.value = response.data.totalPage
    totalCount.value = response.data.totalCount

  } catch (error) {
    console.error('API 에러:', error)
    list.value = []
  } finally {
    loading.value = false
  }
}

const getSearchParams = () => {
  return {
    startDate: formatDateForAPI(search.value.startDate),
    endDate: formatDateForAPI(search.value.endDate),
    category: search.value.category === '전체' ? '' : search.value.category,
    status: search.value.couponState === '전체' ? '' : search.value.couponState,
    page: currentPage.value,
    pageSize: pageSize.value,
  }
}

const loading = ref(false)
const selectedItems = ref([])
const list = ref([])

const currentPage = ref(1)
const totalCount = ref(0)
const totalPage = ref(1)
const pageSize = ref(10)

const search = ref({
  startDate: null,
  endDate: null,
  couponState: '전체',
  category: '전체',
})
const resetSearch = () => {
  search.value = {
    startDate: null,
    endDate: null,
    couponState: '전체',
    category: '전체',
  }
}
const columns = ref([
  { key: 'statusName', label: '쿠폰상태' },
  { key: 'couponCode', label: '쿠폰번호' },
  { key: 'categoryName', label: '쿠폰종류' },
  { key: 'couponName', label: '쿠폰명' },
  { key: 'discountDisplay', label: '할인액/율' },
  { key: 'maxDiscountAmount', label: '최대할인금액' },
  { key: 'issueDate', label: '발급일' },
  { key: 'expireDate', label: '유효기간' },
  { key: 'maxIssueCount', label: '총 발급건수' },
  { key: 'createdAt', label: '등록일' },
  { key: 'actions', label: '' },
])

const couponStateOptions = ref([
  { text: '전체', value: "전체" },
  { text: '발급 대기', value: 0 },
  { text: '발급중', value: 1 },
  { text: '발급 중지', value: 2 },
  { text: '만료', value: 3 }
])

const categoryOptions = ref([
  { text: '전체', value: "전체" },
  { text: '신점', value: 0 },
  { text: '철학관', value: 1 },
  { text: '타로', value: 2 },
  { text: '굿당', value: 3 },
  { text: '기도터', value: 4 },
  { text: '사찰', value: 5 }
])


const searchList = () => {
  if (search.value.startDate && search.value.endDate) {
    const startDate = new Date(search.value.startDate)
    const endDate = new Date(search.value.endDate)

    if (startDate > endDate) {
      alert('시작일이 종료일보다 늦을 수 없습니다.')
      return
    }
  }

  currentPage.value = 1
  selectedItems.value = []
  fetList()
}

// 필터 조건 변경 감시
// watch(() => coupon.value, () => {
//   currentPage.value = 1
//   selectedItems.value = []
// }, { deep: true })



const saveCoupon = () => {
  console.log('쿠폰 저장:', search.value)
  alert('쿠폰이 저장되었습니다.')
}

const editCoupon = (index) => {
  console.log('쿠폰 수정:', index)
  alert('쿠폰 수정 기능을 구현하세요.')
}

const deleteItemById = (id) => {
  console.log(id)
}
// 페이지 변경 핸들러
const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}
const handleCellClick = (event) => {
  console.log('🔥 셀 클릭 이벤트 발생!')
  console.log('Event object:', event)

  // 바로 라우팅 (return false 제거)
  // if (event.item?.id) {
  //   router.push({
  //     name: 'CouponDetail',
  //     params: { id: event.item.id }
  //   })
  // }
}
</script>
