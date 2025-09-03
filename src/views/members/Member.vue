<template>
  <div>
    <div class="table-container">
      <div class="table-header">회원 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-select v-model="search.type1" label="ID / 이름" :options="typeOptions" text-by="label" value-by="value" />
          <va-input v-model="search.name" label=" " :disabled="search.type1 === '전체'" @keydown.enter="searchList" />
          <va-select v-model="search.type2" label="가입일 / 접속일 / 생일" :options="type2Options" text-by="label"
            value-by="value" />
          <va-date-input v-model="search.startDate" label="시작일" placeholder="시작일 선택"
            :disabled="search.type2 === '전체'" />
            <va-date-input v-model="search.endDate" label="종료일" placeholder="종료일 선택" :disabled="search.type2 === '전체'" />
        </div>

        <div class="filter-row">
          <div class="filter-section">
            <label class="filter-label">정렬방식</label>
            <div class="radio-group">
              <va-radio v-model="search.orderType" option="0" label="가입일" />
              <va-radio v-model="search.orderType" option="1" label="접속일" />
              <va-radio v-model="search.orderType" option="2" label="최다접속" />
              <va-radio v-model="search.orderType" option="3" label="이름" />
              <va-radio v-model="search.orderType" option="4" label="ID" />
              <va-radio v-model="search.orderType" option="5" label="나이" />
              <va-radio v-model="search.orderType" option="6" label="등급" />
            </div>
          </div>
          <div class="filter-section">
            <label class="filter-label">회원등급</label>
            <div class="radio-group">
              <va-radio v-model="search.memberType" option="전체" label="전체" />
              <va-radio v-model="search.memberType" option="0" label="일반회원" />
              <va-radio v-model="search.memberType" option="1" label="탈퇴회원" />
            </div>
          </div>

          <div class="filter-section">
            <label class="filter-label">성별</label>
            <div class="radio-group">
              <va-radio v-model="search.gender" option="전체" label="전체" />
              <va-radio v-model="search.gender" option="0" label="남성" />
              <va-radio v-model="search.gender" option="1" label="여성" />
            </div>
          </div>
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
        <template #cell(resultTypeNm)="{ value }">
          <va-badge :text="value" :color="getResultTypeColor(value)" />
        </template>
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
    search.value.orderType = route.query.orderType === '' ? '0' : route.query.orderType
    search.value.memberType = route.query.memberType === '' ? '전체' : route.query.memberType
    search.value.gender = route.query.gender === '' ? '전체' : route.query.gender
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
    const response = await axios.post('/member/list', params)
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
    orderType: search.value.orderType === '0' ? '' : search.value.orderType,
    memberType: search.value.memberType === '전체' ? '' : search.value.memberType,
    gender: search.value.gender === '전체' ? '' : search.value.gender,
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
  const memberId = rowData.row.cells[0].value
  router.push({
    name: 'MemberDetail',
    params: { memberId: memberId },
    query: {
      type1: search.value.type1,
      type2: search.value.type2,
      name: search.value.name,
      startDate: search.value.startDate,
      endDate: search.value.endDate,
      orderType: search.value.orderType,
      memberType: search.value.memberType,
      gender: search.value.gender
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
    orderType: '0',
    memberType: '전체',
    gender: '전체',
  }
}

const deleteSelectedItem = async () => {
  selectedItems.value.forEach(item => {
    deleteItems.value.push(item.memberId)
  })
  if (!confirm(`${deleteItems.value.length}개 항목을 삭제하시겠습니까?`)) {
    return
  }
  try {
    const deleteData = {
      memberIdList: deleteItems.value
    }

    const response = await axios.post('/member/delete', deleteData)
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

const search = ref({
  type1: '전체',
  type2: '전체',
  name: '',
  startDate: null,
  endDate: null,
  orderType: '0',
  memberType: '전체',
  gender: '전체',
})

const columns = ref([
  { key: 'memberId', label: '아이디' },
  { key: 'memberName', label: '회원명' },
  { key: 'memberTypeNm', label: '회원등급' },
  { key: 'nickName', label: '닉네임' },
  { key: 'genderNm', label: '성별' },
  { key: 'age', label: '나이' },
  { key: 'emoney', label: 'emoney' },
  { key: 'point', label: 'point' },
])

const typeOptions = ref([{ label: '전체', value: '전체' },
{ label: 'ID', value: '0' },
{ label: '이름', value: '1' }])
const type2Options = ref([{ label: '전체', value: '전체' },
{ label: '가입일', value: '0' },
{ label: '접속일', value: '1' },
{ label: '생일', value: '2' }])

// 상태별 색상 반환
const getStatusColor = (value) => {
  switch (value) {
    case '예약확정': return 'info'
    case '예약대기': return 'warning'
    case '예약취소': return 'danger'
    default: return 'success'
  }
}

// 상태별 색상 반환
const getResultTypeColor = (value) => {
  switch (value) {
    case '결제완료': return 'success'
    case '미결제': return 'warning'
    default: return ''
  }
}

// 페이지 변경 핸들러
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
