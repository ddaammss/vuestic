<template>
  <div>
    <div class="table-container">
      <div class="table-header">광고 등록 관리</div>
      <div class="no-selection">
        <va-alert v-if="selectedItems.length <= 0" color="info">
          총 {{ totalCount }}개
        </va-alert>
        <va-alert v-else color="danger">
          <va-icon :size="15" name="delete" style="cursor: pointer;" @click="deleteSelectedItem"></va-icon>
        </va-alert>
      </div>
        <va-data-table v-model="selectedItems" :items="list" :columns="columns" :loading="loading" no-data-html="🔍 검색 결과가 없습니다." selectable hoverable striped sticky-header @row:click="goDetail"  clickable> </va-data-table>
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
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)
    const response = await axios.post('/ad/regist/list', params)
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

const goDetail = (rowData) => {
  const seq = rowData.row.rowData.seq
  router.push({
    name: 'AdRegistDetail',
    params: { seq: seq },
    query: {
      // name: search.value.name,
      // address: '',
      // startDate: search.value.startDate,
      // endDate: search.value.endDate,
      // categoryType: search.value.categoryType
    }
  })
}

const deleteSelectedItem = async () => {
  selectedItems.value.forEach(item => {
    deleteItems.value.push(item.seq)
  })
  if (!confirm(`${deleteItems.value.length}개 항목을 삭제하시겠습니까?`)) {
    return
  }
  try {
    const deleteData = {
      seqList: deleteItems.value
    }
    const response = await axios.post('/ad/regist/delete', deleteData)
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

const columns = ref([
  { key: 'createdAt', label: '신청일' },
  { key: 'categoryName', label: '분야' },
  { key: 'storeName', label: '입점사' },
  { key: 'period', label: '등록기간' },
  { key: 'ranking', label: '노출순위' },
])

const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
}
</script>
