<template>
  <div>
    <div class="table-container">
      <div class="table-header">매출 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="search.name" label="입점사명" @keydown.enter="searchList"/>
          <va-date-input v-model="search.startDate" label="결제일(시작일)" placeholder="시작일 선택" />
          <va-date-input v-model="search.endDate" label="결제일(종료일)" placeholder="종료일 선택" />
          <div class="btn-group" style="margin-left:40px ;">
            <va-button @click="datePeriod('today')">오늘</va-button>
            <va-button @click="datePeriod('week')">일주일</va-button>
            <va-button @click="datePeriod('month')">이전달</va-button>
            <va-button @click="datePeriod('3month')">3개월</va-button>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-section" style="flex: 1;">
            <label class="filter-label" style="font-weight: bold;">결제 수단</label>
            <div class="checkbox-group">
              <va-checkbox v-model="search.payType" array-value="0" label="실시간 계좌이체" />
              <va-checkbox v-model="search.payType" array-value="1" label="무통장입금" />
              <va-checkbox v-model="search.payType" array-value="2" label="카드" />
              <va-checkbox v-model="search.payType" array-value="3" label="휴대폰" />
            </div>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchList" icon="search">검색</va-button>
           <va-button @click="goRegist" icon="save">등록</va-button>
          <va-button @click="resetSearch" icon="">초기화</va-button>
        </div>
      </div>

      <div class="no-selection">
        <va-alert v-if="selectedItems.length <= 0" color="info">
          총 {{ list.length - 1 }}개
        </va-alert>
      </div>
      <div class="scrollable-table">
        <va-data-table v-model="selectedItems" :items="list" :columns="columns" :loading="loading" no-data-html="🔍 검색 결과가 없습니다." hoverable striped sticky-header @row:click="goDetail" clickable>
          <template #cell(salesDate)="{ value }">
            <span :style="{ color: value === '합계' ? 'red' : 'inherit' }">{{ value }} </span>
          </template>
          <template #cell(salesPrice)="{ value, rowData }">
            <span :style="{ color: rowData.salesDate === '합계' ? 'red' : 'inherit' }"> {{ value }} </span>
          </template>
        </va-data-table>
      </div>
      <!-- <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination> -->

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { formatDateForAPI } from '@/utils/formatters'
import Pagination from '@/components/common/Pagination.vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'


onMounted(() => {
  if (Object.keys(route.query).length > 0) {
    search.value.startDate = route.query.startDate === null ? null : new Date(route.query.startDate)
    search.value.endDate = route.query.endDate === null ? null : new Date(route.query.endDate)
    search.value.name = route.query.name
    search.value.payType = route.query.payType
    searchList()
  } else {
    fetList()
  }
})

const fetList = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)
    const response = await axios.post('/sales/list', params)
    list.value = response.data.data || []
    totalPage.value = response.data.totalPage
    totalCount.value = response.data.totalCount
    if(list.value.length == 1 && list.value[0].salesDate === '합계'){
      list.value = []
    }
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
    name: search.value.name,
    payType: search.value.payType,
    page: currentPage.value,
    pageSize: pageSize.value,
  }
}

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


const goDetail = (rowData) => {
  if (rowData.row.rowData.seq === '') {
    return;
  }

  const seq = rowData.row.rowData.seq
  router.push({
    name: 'SalesDetail',
    params: { seq: seq },
    query: {
      startDate: search.value.startDate,
      endDate: search.value.endDate,
      name: search.value.name,
      payType: search.value.payType
    }
  })
}

const resetSearch = () => {
  search.value = {
    startDate: null,
    endDate: null,
    name: '',
    payType: [],
  }
}

const goRegist = () => {
  router.push('/sales/regist')
}

const datePeriod = (period) => {
  const today = new Date()
  selectedPeriod.value = period

  switch (period) {
    case 'today':
      search.value.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      search.value.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
      break

    case 'week':
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      search.value.startDate = new Date(weekAgo.getFullYear(), weekAgo.getMonth(), weekAgo.getDate())
      search.value.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
      break

    case 'month':
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      search.value.startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate())
      search.value.endDate = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), lastDayOfPrevMonth.getDate(), 23, 59, 59)
      break

      case '3month':
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1) // 3개월 전 첫째 날
      const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0) // 이전 달의 마지막 날
      search.value.startDate = new Date(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth(), threeMonthsAgo.getDate())
      search.value.endDate = new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), lastDayOfPreviousMonth.getDate(), 23, 59, 59)
      break
  }
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const selectedItems = ref([])
const list = ref([])
const currentPage = ref(1)
const totalCount = ref(0)
const totalPage = ref(1)
const pageSize = ref(10)

const selectedPeriod = ref('today')

const search = ref({
  startDate: null,
  endDate: null,
  name: '',
  payType: [],
})

const columns = ref([
  { key: 'salesDate', label: '결제일' },
  { key: 'storeName', label: '입점사명' },
  { key: 'payName', label: '결제수단' },
  { key: 'salesPrice', label: '결제금액' },
  { key: 'createdAt', label: '등록일자' },
])

</script>

<style scoped>
.scrollable-table {
  height: 700px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
</style>
