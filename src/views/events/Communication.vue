<template>
  <div>
    <div class="table-container">
      <div class="table-header">1:1 문의 관리</div>
      <va-data-table :items="list" :columns="columns" :loading="loading" no-data-html="🔍 검색 결과가 없습니다." hoverable striped sticky-header @row:click="goDetail" clickable>
        <template #cell(statusNm)="{ value }">
          <va-badge :text="value" :color="getStatusColor(value)" />
        </template>
      </va-data-table>
      <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Pagination from '@/components/common/Pagination.vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

onMounted(() => {
  fetList()
})

const fetList = async () => {
  try {
    loading.value = true
    //console.log('API 호출 파라미터:', params)
    const params = getSearchParams()
    const response = await axios.post('/communication/list', params)
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
    page: currentPage.value,
    pageSize: pageSize.value,
  }
}

const goDetail = (rowData) => {
  const seq = rowData.row.cells[0].value
  router.push({
    name: 'CommunicationDetail',
    params: { seq: seq },
  })
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const list = ref([])
const currentPage = ref(1)
const totalCount = ref(0)
const totalPage = ref(1)
const pageSize = ref(10)

const columns = ref([
  { key: 'seq', label: '고유번호' },
  { key: 'createdAt', label: '등록일' },
  { key: 'categoryTypeNm', label: '질문 유형' },
  { key: 'title', label: '제목' },
  { key: 'createdBy', label: '구분' },
  { key: 'statusNm', label: '진행상태' },
])

const getStatusColor = (value) => {
  switch (value) {
    case '접수완료': return 'info'
    case '처리중': return 'warning'
    case '답변완료': return 'danger'
    default: return 'success'
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}
</script>

<style scope>
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

