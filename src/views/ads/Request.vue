<template>
  <div>
    <div class="table-container">
      <div class="table-header">광고 신청 관리</div>
        <va-data-table v-model="selectedItems" :items="list" :columns="columns" :loading="loading" no-data-html="🔍 검색 결과가 없습니다." hoverable striped sticky-header clickable>
         <template #cell(actions)="{ rowData }">
          <va-button size="small" @click="updateStatus(rowData.seq, 1)" > 승인 </va-button>
          <!-- <va-button size="small" color="danger" @click="updateStatus(rowData.seq, 2)"> 거부 </va-button> -->
        </template>
        </va-data-table>

        <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Pagination from '@/components/common/Pagination.vue'
import axios from 'axios'
onMounted(() => {
    fetList()
})

const fetList = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)
    const response = await axios.post('/ad/request/list', params)
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

const columns = ref([
  { key: 'createdAt', label: '신청일' },
  { key: 'categoryName', label: '분야' },
  { key: 'storeName', label: '입점사' },
  { key: 'actions', label: '관리' }
])

const updateStatus = async (data, status) => {
  loading.value = true
  try {
    const response = await axios.post('/ad/request/update', {
      seq: data,
      status : status
    })
    alert('저장되었습니다.')
    fetList()
  } catch (error) {
    console.error('업데이트 에러:', error)
  } finally {
    loading.value = false;
  }
}
const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}
</script>
