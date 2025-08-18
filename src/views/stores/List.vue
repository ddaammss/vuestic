<template>
  <div>
    <div class="table-container">
      <div class="table-header">입점사 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="search.name" label="입점사명" @keydown.enter="searchList"/>
          <va-input v-model="search.address" label="주소" @keydown.enter="searchList"/>
          <va-date-input v-model="search.startDate" label="시작일" placeholder="시작일 선택" />
          <va-date-input v-model="search.endDate" label="종료일" placeholder="종료일 선택" />
          <div class="btn-group" style="margin-left:40px ;">
            <va-button @click="datePeriod('today')">오늘</va-button>
            <va-button @click="datePeriod('week')">일주일</va-button>
            <va-button @click="datePeriod('month')">이전달</va-button>
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
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchList" icon="search">검색</va-button>
           <va-button @click="goRegist" icon="save">등록</va-button>
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
        <template #cell(statusName)="{ value }">
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
    search.value.name = route.query.name
    search.value.address = route.query.address
    search.value.startDate = route.query.startDate === null ? null : new Date(route.query.startDate)
    search.value.endDate = route.query.endDate === null ? null : new Date(route.query.endDate)
    search.value.categoryType = route.query.categoryType
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
    const response = await axios.post('/store/list', params)
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
    name: search.value.name,
    address: search.value.address,
    categoryType: search.value.categoryType,
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
  const storeCode = rowData.row.cells[0].value
  router.push({
    name: 'StoreDetail',
    params: { storeCode: storeCode },
    query: {
      name: search.value.name,
      address: '',
      startDate: search.value.startDate,
      endDate: search.value.endDate,
      categoryType: search.value.categoryType
    }
  })
}

const resetSearch = () => {
  search.value = {
    name: '',
    address: '',
    startDate: null,
    endDate: null,
    categoryType: [],
  }
}

const goRegist = () => {
  router.push('/stores/regist')
}

const deleteSelectedItem = async () => {
  selectedItems.value.forEach(item => {
    deleteItems.value.push(item.storeCode)
  })

  if (!confirm(`${deleteItems.value.length}개 항목을 삭제하시겠습니까?`)) {
    return
  }
  try {
    const deleteData = {
      storeCodeList: deleteItems.value
    }
    const response = await axios.post('/store/delete', deleteData)
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
  name: '',
  address: '',
  startDate: null,
  endDate: null,
  categoryType: [],
})

const columns = ref([
  { key: 'storeCode', label: '입점사코드' },
  { key: 'storeName', label: '입점사명' },
  { key: 'address', label: '주소' },
  { key: 'categoryName', label: '분야' },
  { key: 'statusName', label: '활성화' },
  { key: 'phone', label: '연락처' },
  { key: 'email', label: '이메일' },
  { key: 'createdAt', label: '등록일자' },
])

// 상태별 색상 반환
const getStatusColor = (value) => {
  switch (value) {
    case '활성': return 'info'
    default: return 'danger'
  }
}

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}


</script>
<style scoped>
.filter-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.filter-section {
  flex: 1;
}

.filter-label {
  font-weight: bold;
}
</style>
