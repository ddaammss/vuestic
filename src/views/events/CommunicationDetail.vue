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
          <va-input v-model="detail.title" label="제목" :disabled="true" />
          <va-input v-model="detail.categoryTypeNm" label="질문 유형" :disabled="true" />
          <va-input v-model="detail.createdAt" label="등록일" :disabled="true" />
        </div>
        <div class="form-grid">
          <va-textarea v-model="detail.content" label="내용" :disabled="true" class="form-full" />
        </div>
        <div class="form-grid">
          <va-textarea v-model="detail.answer" label="답변" class="form-full" />
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>상태 관리</h3>
        </div>

        <div class="form-grid">
          <va-select v-model="detail.status" label="진행상태" :options="statusTypeOptions" text-by="label" value-by="value" />
        </div>
      </div>

      <!-- <div class="detail-section">
        <div class="section-header">
          <h3>시스템 정보</h3>
        </div>

        <div class="form-grid">
          <va-input v-model="detail.createdAt" label="등록일" :disabled="true" />
        </div>
      </div> -->

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
import { ref, onMounted, computed, readonly } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rowData = route.params.seq

onMounted(async () => {
  if (rowData) {
    await fetchDetail(rowData)
  }
})

const fetchDetail = async (data) => {
  loading.value = true
  try {
    const response = await axios.post('/communication/detail', {
      seq: data
    })
    detail.value = response.data.data
  } catch (error) {
    console.error('상세 조회 에러:', error)
  } finally {
    loading.value = false;
  }
}

const detail = ref({})

const statusTypeOptions = ref([
  { label: '접수완료', value: 0 },
  { label: '처리중', value: 1 },
  { label: '답변완료', value: 2 }
])

const save = async () => {
  try {
    const saveData = {
      ...detail.value,
    }
    const response = await axios.post('/communication/update', saveData)
    if (response.data.code === 200) {
      alert('저장되었습니다.')
      goBack()
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  }
}

const goBack = () => {
  router.push({
    path: '/events/communication/list',
  })
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 2fr));
  gap: 20px;
  margin-bottom: 16px;
}

/* 액션 버튼 영역 */
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
</style>
