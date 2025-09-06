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
            <span class="page-title">상세 정보</span>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-header">
          <h3>기본 정보</h3>
        </div>
        <div class="form-grid">

          <va-input v-model="detail.storeName" label="입점사명" :disabled="true"/>
            <va-date-input v-model="detail.startDate" label="등록기간(시작일)" />
            <va-date-input v-model="detail.endDate" label="등록기간(종료일" />
        </div>

        <div class="checkbox-container">
  <div class="checkbox-section">
    <label class="section-label">분야</label>
    <div class="checkbox-group">
      <va-checkbox v-model="categoryFlags.type0" label="신점" />
      <va-checkbox v-model="categoryFlags.type1" label="철학관" />
      <va-checkbox v-model="categoryFlags.type2" label="타로" />
      <va-checkbox v-model="categoryFlags.type3" label="굿당" />
      <va-checkbox v-model="categoryFlags.type4" label="기도터" />
      <va-checkbox v-model="categoryFlags.type5" label="사찰" />
    </div>
  </div>

  <div class="checkbox-section">
    <label class="section-label">노출순위</label>
    <div class="checkbox-group">
      <va-checkbox v-model="rankingFlags.type1" label="1위" />
      <va-checkbox v-model="rankingFlags.type2" label="2위" />
      <va-checkbox v-model="rankingFlags.type3" label="3위" />
      <va-checkbox v-model="rankingFlags.type4" label="4위" />
      <va-checkbox v-model="rankingFlags.type5" label="5위" />
    </div>
  </div>
</div>

      </div>




      <div class="detail-section">
        <div class="section-header">
          <h3>상태 관리</h3>
        </div>
        <div class="form-grid-single-row">
          <va-select v-model="detail.status" label="활성화여부" :options="statusOptions" text-by="label" value-by="value" />
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
const rowData = route.params.seq

onMounted(async () => {
    await fetchDetail(rowData)
})

const fetchDetail = async (data) => {
  loading.value = true
  try {
    const response = await axios.post('/ad/regist/detail', {
      seq: data
    })
    detail.value = response.data.data;
    //console.log(detail.value)

    detail.value.categoryType = detail.value.categoryType.split(',').map(item => parseInt(item.trim()))
    if(detail.value.ranking != null ){
      detail.value.ranking = detail.value.ranking.split(',').map(item => parseInt(item.trim()))
    }
    setInitialFlags()


  } catch (error) {
    console.error('상세 조회 에러:', error)
  } finally {
    loading.value = false;
  }
}

const setInitialFlags = () => {
  if (Array.isArray(detail.value.categoryType)) {
    detail.value.categoryType.forEach(value => {
      categoryFlags.value[`type${value}`] = true
    })
  }
  if (Array.isArray(detail.value.ranking)) {
    detail.value.ranking.forEach(value => {
      rankingFlags.value[`type${value}`] = true
    })
  }
}

const categoryFlags = ref({
  type0: false,
  type1: false,
  type2: false,
  type3: false,
  type4: false,
  type5: false
})

const rankingFlags = ref({
  type0: false,
  type1: false,
  type2: false,
  type3: false,
  type4: false,
  type5: false
})


const detail = ref({})

const statusOptions = ref([
  { label: '신청', value: 0 },
  { label: '승인', value: 1 },
  { label: '거부', value: 2 },
  { label: '종료', value: 3 },
])

const save = async () => {
  try {
    const saveData = {
      categoryType: selectedCategories.value,
      ranking: selectedRankings.value,
      startDate: formatDateForAPI(new Date(detail.value.startDate)),
      endDate: formatDateForAPI(new Date(detail.value.endDate)),
      seq : detail.value.seq,
      status : detail.value.status

    }
    //console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/ad/regist/update', saveData)
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
    name: route.query.name,
    address: route.query.address,
    startDate: route.query.startDate,
    endDate: route.query.endDate,
    categoryType: route.query.categoryType
  }

  router.push({
    path: '/ads/regist',
    query: searchData
  })
}

  // 계산된 속성
  const selectedCategories = computed(() => {
    const selected = []
    Object.keys(categoryFlags.value).forEach(key => {
      if (categoryFlags.value[key]) {
        selected.push(key.replace('type', ''))
      }
    })
    return selected.join(',')
  })

  const selectedRankings = computed(() => {
    const selected = []
    Object.keys(rankingFlags.value).forEach(key => {
      if (rankingFlags.value[key]) {
        selected.push(key.replace('type', ''))
      }
    })
    return selected.join(',')
  })

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

/* 폼 그리드 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.checkbox-container {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.checkbox-section {
  flex: 1;
  min-width: 250px;
}

.section-label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.checkbox-group {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

</style>
