<template>
  <div>
    <div class="table-container">
      <div class="table-header">쿠폰 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-date-input v-model="search.startDate" label="쿠폰 시작일" placeholder="시작일 선택" />
          <va-date-input v-model="search.endDate" label="쿠폰 종료일" placeholder="종료일 선택" />
          <va-select v-model="search.status" label="쿠폰 상태" :options="statusOptions" text-by="label" value-by="value" />
          <va-select v-model="search.category" label="쿠폰 종류" :options="categoryOptions" text-by="label"
            value-by="value" />
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchList" icon="search">검색</va-button>
          <va-button @click="goRegist" icon="save">등록</va-button>
          <va-button @click="resetSearch" icon="">초기화</va-button>
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
        no-data-html="🔍 검색 결과가 없습니다." selectable hoverable striped sticky-header @row:click="goDetail" clickable>
        <!-- <template #cell(actions)="{ row }">
          <VaButton preset="plain" icon="delete" class="ml-3" @click="deleteItemById(row)" />
        </template> -->
      </va-data-table>

      <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination>
    </div>

    <!-- <CouponDetailModal :show="showDetailModal" :coupon-data="selectedDetail" @close="closeDetailModal"
      @saved="handleCouponSaved" /> -->

  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { formatDateForAPI } from '@/utils/formatters'
import Pagination from '@/components/common/Pagination.vue'
import { useRouter, useRoute } from 'vue-router'

import CouponDetailModal from '@/components/modal/settings/CouponDetailModal.vue'
import axios from 'axios'

onMounted(() => {
  if (Object.keys(route.query).length > 0) {
    search.value.startDate = new Date(route.query.startDate)
    search.value.endDate = new Date(route.query.endDate)
    search.value.status = route.query.status === '' ? '전체' : route.query.status
    search.value.category = route.query.category === '' ? '전체' : route.query.category
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
    status: search.value.status === '전체' ? '' : search.value.status,
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

const goDetail = async (rowData) => {
  const couponCode = rowData.row.cells[1].value // 쿠폰코드
  router.push({
    name: 'CouponDetail',
    params: { couponCode: couponCode },
    query: {
      startDate: search.value.startDate,
      endDate: search.value.endDate,
      status: search.value.status === '전체' ? '' : search.value.status,
      category: search.value.category === '전체' ? '' : search.value.category
    }
  })
}

const resetSearch = () => {
  search.value = {
    startDate: null,
    endDate: null,
    status: '전체',
    category: '전체',
  }
}

const goRegist = async () => {
  router.push('/settings/coupon/regist')
}

// const fetchDetail = async (rowData) => {
//   const couponCode = rowData.row.cells[1].value // 쿠폰코드
//   const params = getDetailParams(couponCode)
//   try {
//     // 상세 데이터 조회 API 호출
//     const response = await axios.post('/settings/coupon/detail', params)
//     console.log(response.data.data)
//     selectedDetail.value = response.data.data || rowData.item
//   } catch (error) {
//     console.error('상세 조회 에러:', error)
//     // API 에러 시 기본 데이터 사용
//     //selectedDetail.value = rowData.item
//   }
//   //showDetailModal.value = true
// }

const route = useRoute()
const router = useRouter()
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
  status: '전체',
  category: '전체',
})

// 모달 관련 추가
const showDetailModal = ref(false)
const selectedDetail = ref({})


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
])

const statusOptions = ref([
  { label: '전체', value: "전체" },
  { label: '발급 대기', value: '0' },
  { label: '발급중', value: '1' },
  { label: '발급 중지', value: '2' },
  { label: '만료', value: '3' }
])

const categoryOptions = ref([
  { label: '전체', value: "전체" },
  { label: '신점', value: '0' },
  { label: '철학관', value: '1' },
  { label: '타로', value: '2' },
  { label: '굿당', value: '3' },
  { label: '기도터', value: '4' },
  { label: '사찰', value: '5' }
])




// 필터 조건 변경 감시
// watch(() => coupon.value, () => {
//   currentPage.value = 1
//   selectedItems.value = []
// }, { deep: true })


// 모달 닫기
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedDetail.value = {}
}

// 쿠폰 저장 후 처리
const handleCouponSaved = (savedData) => {
  console.log('쿠폰 저장 완료:', savedData)
  // 목록 새로고침
  fetList()
  // 모달 닫기
  closeDetailModal()
}

const deleteItemById = (id) => {
  console.log(id.item)
}
// 페이지 변경 핸들러
const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}
</script>
