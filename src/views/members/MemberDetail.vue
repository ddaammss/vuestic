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
          <va-input v-model="detail.memberId" label="회원ID" :disabled="true" />
          <va-input v-model="detail.memberName" label="회원명" :disabled="true" />
          <va-input v-model="detail.nickName" label="닉네임" :disabled="true" />
          <va-input v-model="detail.phone" label="연락처" :disabled="true" />
          <va-input v-model="detail.email" label="이메일" :disabled="true" />
          <va-input v-model="detail.genderNm" label="성별" :disabled="true" />
          <va-input v-model="detail.emoney" label="emoney" :disabled="true" />
          <va-input v-model="detail.point" label="point" :disabled="true" />
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>상태 관리</h3>
        </div>

        <div class="form-grid">
          <va-select v-model="detail.memberType" label="회원등급" :options="memberTypeOptions" text-by="label" value-by="value" />
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>시스템 정보</h3>
        </div>

        <div class="form-grid">
          <!-- <va-input v-model="detail.loginCount" label="로그인 횟수" readonly /> -->
          <va-input v-model="detail.lastLoginAt" label="최종 로그인 일시" :disabled="true" />
          <va-input v-model="detail.createdAt" label="가입일" :disabled="true" />
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
import { ref, onMounted, computed, readonly } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rowData = route.params.memberId

onMounted(async () => {
  if (rowData) {
    await fetchDetail(rowData)
  }
})

const fetchDetail = async (data) => {
  loading.value = true
  try {
    const response = await axios.post('/member/detail', {
      memberId: data
    })
    detail.value = response.data.data
  } catch (error) {
    console.error('상세 조회 에러:', error)
  } finally {
    loading.value = false;
  }
}

const detail = ref({})

const memberTypeOptions = ref([
  { label: '일반회원', value: 0 },
  { label: '탈퇴회원', value: 1 }
])

const save = async () => {
  try {
    const saveData = {
      ...detail.value,
    }
    //console.log('저장할 데이터:', saveData)
    const response = await axios.post('/member/update', saveData)
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
  const searchData = {
    type1: route.query.type1,
    type2: route.query.type2,
    name: route.query.name,
    startDate: route.query.startDate,
    endDate: route.query.endDate,
    orderType: route.query.orderType,
    memberType: route.query.memberType,
    gender: route.query.gender
  }
  router.push({
    path: '/members/list',
    query: searchData
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 2fr));
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
