<template>
  <div>
    <div class="table-container">
      <div class="table-header">예약 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-select v-model="search.type1" label="예약자 / 입점사" :options="typeOptions" text-by="label" value-by="value" />
          <va-input v-model="search.name" label=" " :disabled="search.type1 === '전체'" />
          <va-select v-model="search.type2" label="접수일자 / 예약일자 / 확정일자" :options="type2Options" text-by="label"
            value-by="value" />
          <va-date-input v-model="search.startDate" label="시작일" placeholder="시작일 선택"
            :disabled="search.type2 === '전체'" />
          <va-date-input v-model="search.endDate" label="종료일" placeholder="종료일 선택" :disabled="search.type2 === '전체'" />


          <div class="btn-group">
            <va-button @click="datePeriod('today')" :disabled="search.type2 === '전체'">오늘</va-button>
            <va-button @click="datePeriod('week')" :disabled="search.type2 === '전체'">일주일</va-button>
            <va-button @click="datePeriod('month')" :disabled="search.type2 === '전체'">이전달</va-button>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-section">
            <label class="filter-label">분야</label>
            <div class="checkbox-group">
              <va-checkbox v-model="search.categoryType" array-value="0" label="신점" />
              <va-checkbox v-model="search.categoryType" array-value="1" label="철학관" />
              <va-checkbox v-model="search.categoryType" array-value="2" label="타로" />
              <va-checkbox v-model="search.categoryType" array-value="3" label="굿당" />
              <va-checkbox v-model="search.categoryType" array-value="4" label="기도터" />
              <va-checkbox v-model="search.categoryType" array-value="5" label="사찰" />
            </div>
          </div>
          <div class="filter-section">
            <label class="filter-label">예약 상태</label>
            <div class="radio-group">
              <va-radio v-model="search.reservationType" option="전체" label="전체" />
              <va-radio v-model="search.reservationType" option="0" label="예약대기" />
              <va-radio v-model="search.reservationType" option="1" label="예약확정" />
              <va-radio v-model="search.reservationType" option="2" label="예약취소" />
            </div>
          </div>

          <div class="filter-section">
            <label class="filter-label">결제 여부</label>
            <div class="checkbox-group">
              <va-checkbox v-model="search.resultType" array-value="0" label="미결제" />
              <va-checkbox v-model="search.resultType" array-value="1" label="결제완료" />
            </div>
          </div>
        </div>
        <div>

        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchList" icon="search">검색</va-button>
          <va-button @click="resetSearch" icon="">초기화</va-button>
        </div>
      </div>

      <div class="no-selection">
        <va-alert v-if="selectedItems.length <= 0" color="info">
          총 {{ totalCount }}개
        </va-alert>
        <va-alert v-else color="danger">
          <va-icon :size="15" name="delete" style="cursor: pointer;" @click="deleteSelectedItem"></va-icon>
        </va-alert>
      </div>

      <va-data-table v-model="selectedItems" :items="list" :columns="columns" :loading="loading"
        no-data-html="🔍 검색 결과가 없습니다." selectable hoverable striped sticky-header @row:click="goDetail" clickable>
        <template #cell(reservationTypeNm)="{ value }">
          <va-badge :text="value" :color="getStatusColor(value)" />
        </template>
      </va-data-table>

      <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination>

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
    search.value.type1 = route.query.type1 === '' ? '전체' : route.query.type1
    search.value.type2 = route.query.type1 === '' ? '전체' : route.query.type2
    search.value.name = route.query.name
    search.value.startDate = route.query.startDate === null ? null : new Date(route.query.startDate)
    search.value.endDate = route.query.endDate === null ? null : new Date(route.query.endDate)
    search.value.reservationType = route.query.reservationType === '' ? '전체' : route.query.reservationType
    search.value.categoryType = route.query.categoryType
    search.value.resultType = route.query.resultType
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
    const response = await axios.post('/reservation/list', params)
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
    type1: search.value.type1 === '전체' ? '' : search.value.type1,
    type2: search.value.type2 === '전체' ? '' : search.value.type2,
    startDate: formatDateForAPI(search.value.startDate),
    endDate: formatDateForAPI(search.value.endDate),
    name: search.value.name,
    categoryType: search.value.categoryType,
    resultType: search.value.resultType,
    reservationType: search.value.reservationType === '전체' ? '' : search.value.reservationType,
    page: currentPage.value,
    pageSize: pageSize.value,
  }
}

const searchList = () => {
  if (search.value.startDate && search.value.endDate) {
    const startDate = new Date(search.value.startDate)
    const endDate = new Date(search.value.endDate)
    if (search.value.type2 != '전체') {
      if (startDate > endDate) {
        alert('시작일이 종료일보다 늦을 수 없습니다.')
        return
      }
    }
  }

  currentPage.value = 1
  selectedItems.value = []
  fetList()
}

const goDetail = (rowData) => {
  const reservationNo = rowData.row.cells[0].value

  router.push({
    name: 'ReservationDetail',
    params: { reservationNo: reservationNo },
    query: {
      type1: search.value.type1,
      type2: search.value.type2,
      name: search.value.name,
      startDate: search.value.startDate,
      endDate: search.value.endDate,
      reservationType: search.value.reservationType,
      categoryType: search.value.categoryType,
      resultType: search.value.resultType
    }
  })
}

const resetSearch = () => {
  search.value = {
    type1: '전체',
    type2: '전체',
    name: '',
    startDate: null,
    endDate: null,
    categoryType: [],
    resultType: [],
    reservationType: '전체',
  }
}

const deleteSelectedItem = async () => {
  selectedItems.value.forEach(item => {
    deleteItems.value.push(item.reservationNo)
  })


  if (!confirm(`${deleteItems.value.length}개 항목을 삭제하시겠습니까?`)) {
    return
  }
  try {
    const deleteData = {
      reservationNoList: deleteItems.value
    }
    const response = await axios.post('/reservation/delete', deleteData)
    if (response.data.code === 200) {
      alert('삭제되었습니다.')
      selectedItems.value.length = 0;
      fetList();
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('삭제 에러:', error)
    alert('삭제 중 오류가 발생했습니다.')
  }
}

const datePeriod = (period) => {
  const today = new Date()
  selectedPeriod.value = period

  switch (period) {
    case 'today':
      // 오늘: 당일 00:00:00 ~ 23:59:59
      search.value.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      search.value.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
      break

    case 'week':
      // 일주일전: 7일 전 00:00:00 ~ 오늘 23:59:59
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      search.value.startDate = new Date(weekAgo.getFullYear(), weekAgo.getMonth(), weekAgo.getDate())
      search.value.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
      break

    case 'month':
      // 이전달: 전달 1일 00:00:00 ~ 전달 말일 23:59:59
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      search.value.startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate())
      search.value.endDate = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), lastDayOfPrevMonth.getDate(), 23, 59, 59)
      break
  }
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const selectedItems = ref([])
const deleteItems = ref([])
const list = ref([])
const currentPage = ref(1)
const totalCount = ref(0)
const totalPage = ref(1)
const pageSize = ref(10)

const selectedPeriod = ref('today')

const search = ref({
  type1: '전체',
  type2: '전체',
  name: '',
  startDate: null,
  endDate: null,
  categoryType: [],
  resultType: [],
  reservationType: '전체',
})

const columns = ref([
  { key: 'reservationNo', label: '예약번호' },
  { key: 'createdAt', label: '접수일자' },
  { key: 'reservationDate', label: '예약일자' },
  { key: 'confirmDate', label: '확정일자' },
  { key: 'storeNo', label: '입점사' },
  { key: 'reserverName', label: '예약자' },
  { key: 'reserverPhone', label: '연락처' },
  { key: 'guestCount', label: '예약인원' },
  { key: 'paymentAmount', label: '결제금액' },
  { key: 'reservationTypeNm', label: '예약상태' }
])

const typeOptions = ref([{ label: '전체', value: '전체' },
{ label: '예약자', value: '0' },
{ label: '입점사', value: '1' }])
const type2Options = ref([{ label: '전체', value: '전체' },
{ label: '접수일자', value: '0' },
{ label: '예약일자', value: '1' },
{ label: '확정일자', value: '2' }])

// 상태별 색상 반환
const getStatusColor = (value) => {
  switch (value) {
    case '예약확정': return 'info'
    case '예약대기': return 'warning'
    case '예약취소': return 'danger'
    default: return 'success'
  }
}

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}
</script>

<style scope>
.form-grid {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.filter-row {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.filter-section {
  flex: 1;
}

.filter-label {
  font-weight: bold;
}
</style>
