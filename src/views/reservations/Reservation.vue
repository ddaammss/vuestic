<template>
  <div>
    <div class="table-container">
      <div class="table-header">예약 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-select v-model="search.type1" label="예약자 / 입점사" :options="typeOptions" />
          <va-input v-model="search.name" label=" " />
          <va-select v-model="search.type2" label="접수일자 / 예약일자 / 확정일자" :options="type2Options" />
          <va-date-input v-model="search.startDate" label="시작일" placeholder="시작일 선택" />
          <va-date-input v-model="search.endDate" label="종료일" placeholder="종료일 선택" />
        </div>
        <div class="filter-row">
          <div class="filter-section">
            <label class="filter-label">분야</label>
            <div class="checkbox-group">
              <va-checkbox v-model="search.category_type" array-value="0" label="신점" />
              <va-checkbox v-model="search.category_type" array-value="1" label="철학관" />
              <va-checkbox v-model="search.category_type" array-value="2" label="타로" />
              <va-checkbox v-model="search.category_type" array-value="3" label="굿당" />
              <va-checkbox v-model="search.category_type" array-value="4" label="기도터" />
              <va-checkbox v-model="search.category_type" array-value="5" label="사찰" />
            </div>
          </div>

          <div class="filter-section">
            <label class="filter-label">결제 여부</label>
            <div class="checkbox-group">
              <va-checkbox v-model="search.result_type" array-value="9" label="모두" />
              <va-checkbox v-model="search.result_type" array-value="0" label="미결제" />
              <va-checkbox v-model="search.result_type" array-value="1" label="결제완료" />
            </div>
          </div>

          <div class="filter-section">
            <label class="filter-label">예약 상태</label>
            <div class="radio-group">
              <va-radio v-model="search.reservation_type" option="전체" label="전체" />
              <va-radio v-model="search.reservation_type" option="예약대기" label="예약대기" />
              <va-radio v-model="search.reservation_type" option="예약확정" label="예약확정" />
              <va-radio v-model="search.reservation_type" option="예약취소" label="예약취소" />
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
        <va-alert>
          총 {{ totalCount }}개
        </va-alert>
      </div>
      <va-data-table v-model="selectedItems" :items="list" :columns="columns" :loading="loading"
        no-data-html="🔍 검색 결과가 없습니다." selectable hoverable striped sticky-header @row:click="goDetail" clickable>
      </va-data-table>

      <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { formatDateForAPI } from '@/utils/formatters'
import Pagination from '@/components/common/Pagination.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

onMounted(() => {
  fetList()
})

const fetList = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    console.log('API 호출 파라미터:', params)
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
    type1: search.value.type1,
    type2: search.value.type2,
    startDate: formatDateForAPI(search.value.startDate),
    endDate: formatDateForAPI(search.value.endDate),
    name: search.value.name,
    categoryType: search.value.category_type,
    resultType: search.value.result_type,
    reservationType: search.value.reservation_type,
    page: currentPage.value,
    pageSize: pageSize.value,
  }
}

const goDetail = async (rowData) => {
  // const couponCode = rowData.row.cells[1].value // 쿠폰코드

  // router.push({
  //   name: 'CouponDetail',
  //   params: { couponCode: couponCode }
  // })
}

// 검색 조건
const search = ref({
  type1: '전체',
  type2: '전체',
  name: '',
  startDate: null,
  endDate: null,
  category_type: [],
  result_type: [],
  reservation_type: '전체',
})

// 타입 옵션
const typeOptions = ref(['전체', '예약자', '입점사'])
const type2Options = ref(['전체', '접수일자', '예약일자', '확정일자'])

const router = useRouter()
const loading = ref(false)
const selectedItems = ref([])
const list = ref([])

const currentPage = ref(1)
const totalCount = ref(0)
const totalPage = ref(1)
const pageSize = ref(10)

const columns = ref([
  { key: 'receiptDate', label: '접수일자' },
  { key: 'reservationDate', label: '예약일자' },
  { key: 'confirmDate', label: '확정일자' },
  { key: 'store', label: '입점사' },
  { key: 'user', label: '사용자' },
  { key: 'contact', label: '연락처' },
  { key: 'people', label: '예약인원' },
  { key: 'amount', label: '결제금액' },
  { key: 'status', label: '예약상태' },
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

// 상태별 색상 반환
const getStatusColor = (status) => {
  switch (status) {
    case '확정완료': return 'success'
    case '예약대기': return 'warning'
    case '예약취소': return 'danger'
    default: return 'info'
  }
}

// 검색 조건 초기화
const resetSearch = () => {
  search.value = {
    type1: '전체',
    type2: '전체',
    name: '',
    startDate: null,
    endDate: null,
    category_type: [],
    result_type: [],
    reservation_type: '전체',
  }
}

// 예약 수정
const editReservation = (index) => {
  console.log('예약 수정:', index)
  console.log('선택된 예약:', filteredReservations.value[index])
  alert('예약 수정 기능을 구현하세요.')
  // 실제 구현 시 수정 모달 또는 페이지 이동 로직 추가
}

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}
</script>





<style scope>
.form-grid {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
