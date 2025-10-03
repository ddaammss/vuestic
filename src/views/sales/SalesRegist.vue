<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      <va-progress-circle indeterminate size="large" />
    </div>
    <div class="table-container">
      <!-- 페이지 헤더 -->
      <div class="table-header">
        <div class="header-content">
          <div class="header-left">
            <span class="page-title">매출 등록</span>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-header">
          <h3>기본 정보</h3>
        </div>
        <div class="form-grid">

          <!-- <va-input v-model="detail.searchText" class="search-input" label="입점사명" :rules="[value => !!value || '입점사명은 필수입니다.']" /> @input="handleInput" -->
          <div class="search-container">
            <va-input v-model="detail.searchText" class="search-input" label="입점사명" :rules="[value => !!value || '입점사명은 필수입니다.']" @focus="handleFocus" @blur="hideResults" @mousedown="handleInput" />

            <!-- 검색 결과 드롭다운 -->
            <div v-if="showResults && detail.searchText && filteredStores.length > 0" class="search-results">
              <div
                v-for="store in filteredStores" :key="store.storeCode"  @mousedown="selectStore(store)" class="result-item" >
                <div class="store-name">{{ store.storeName }}</div>
                <!-- <div class="store-code">{{ store.storeCode }}</div> -->
              </div>
            </div>

            <!-- 검색 결과 없음 -->
            <div v-if="showResults && detail.searchText && filteredStores.length === 0" class="search-results">
              <div class="no-results">검색 결과가 없습니다.</div>
            </div>
          </div>

          <va-input v-model="detail.salesPrice" label="결제금액" :rules="[value => !!value || '결제금액은 필수입니다.']" />
          <va-date-input v-model="detail.salesDate" label="결제일" />

        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: bold;">결제수단</label>
          <div class="radio-group">
            <va-radio v-model="detail.payType" option="0" label="실시간 계좌이체" :checked="detail.payType === '0'"/>
            <va-radio v-model="detail.payType" option="1" label="무통장입금" :checked="detail.payType === '1'"/>
            <va-radio v-model="detail.payType" option="2" label="카드" :checked="detail.payType === '2'" />
            <va-radio v-model="detail.payType" option="3" label="휴대폰" :checked="detail.payType === '3'"/>
          </div>
        </div>
      </div>

      <div class="action-section">
        <div class="btn-group">
          <va-button @click="save" icon="save">저장</va-button>
          <va-button preset="secondary" @click="goBack"> 목록으로 </va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, readonly, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateForAPI } from '@/utils/formatters'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const detail = ref({})
const showResults = ref(false)
const isSelected = ref(false)  // 선택 여부 플래그

const stores = ref([])

// 입점사 목록 조회 API
const fetchStores = async () => {
  try {
    loading.value = true
    const saveData = {
      ...detail.value,
    }

    const response = await axios.post('/sales/store/list',saveData)
    stores.value = response.data.data
  } catch (error) {
    console.error('입점사 목록 조회 실패:', error)
    // 에러 처리 (토스트 메시지 등)
  } finally {
    loading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 조회
onMounted(() => {
  fetchStores()
})

const save = async () => {
  try {
    const saveData = {
      ...detail.value,
      salesPrice : detail.value.salesPrice.replace(/,/g,''),
      salesDate: formatDateForAPI(new Date(detail.value.salesDate)),
      storeCode : detail.value.storeCode
    }
    console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/sales/upsert', saveData)
    if (response.data.code === 200) {
      alert('저장되었습니다.')
      goBack()
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  }finally{
    loading.value = false;
  }
}

const goBack = () => {
  const searchData = {
    startDate: route.query.startDate,
    endDate: route.query.endDate,
    name: route.query.name,
    payType : route.query.payType
  }

  router.push({
    path: '/sales/list',
    query: searchData
  })
}


// 실시간 검색 필터링
const filteredStores = computed(() => {
  if (!detail.value.searchText || detail.value.searchText.length < 3) {
    return []
  }

  const search = detail.value.searchText
  return stores.value.filter(store =>
    store.storeName.toLowerCase().includes(search) ||
    store.storeCode.toLowerCase().includes(search)
  )
})

// 포커스 시 처리
const handleFocus = () => {
  // 이미 선택된 값이 있으면 초기화
  if (isSelected.value) {
    detail.value.searchText = ''
    detail.value.storeCode = ''
    detail.value.storeName = ''
    isSelected.value = false
    showResults.value = true
  }
}

// 입력 시 처리
const handleInput = () => {
  detail.searchText = ''
  showResults.value = true
  isSelected.value = false  // 입력 시작하면 선택 상태 해제
}

// 입점사 선택
const selectStore = (store) => {

  detail.value.searchText = store.storeName
  detail.value.storeCode = store.storeCode
  detail.value.storeName = store.storeName
  isSelected.value = true  // 선택 완료 플래그
  showResults.value = false
}

// blur 이벤트 처리
const hideResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.table-header {
  margin-bottom: 32px;
  border-radius: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 섹션 스타일 */
.detail-section {
  margin-bottom: 22px;
  padding: 20px;
  background: var(--va-background-secondary);
  border-left: 4px solid var(--va-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--va-background-border);
}

.section-header h3 {
  margin: 0;
  color: var(--va-primary);
  font-size: 18px;
  font-weight: 600;
}

.info-badge {
  background: var(--va-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 14px;
}

/* 폼 그리드 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.action-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid var(--va-background-border);
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}





.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 검색 컨테이너 */
.search-container {
  position: relative;
}

/* 검색 결과 드롭다운 */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
}

.result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.result-item:last-child {
  border-bottom: none;
}

.store-name {
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}

.store-code {
  font-size: 12px;
  color: #999;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>
