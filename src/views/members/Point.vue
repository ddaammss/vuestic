<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      <va-progress-circle indeterminate size="large" />
    </div>
    <div class="table-container">
      <div class="table-header">포인트 관리</div>
      <div class="detail-section">
        <div class="section-header">
          <h3>포인트 설정</h3>
        </div>

        <div class="form-grid">
          <va-input v-model="point.pointName" label="포인트 명칭" :messages="['포인트를 \'점수\', \'마일리지\', \'누적포인트\ 등으로 명칭을 변경 할 수 있습니다.']"/>
          <va-input v-model="point.pointUnit" label="포인트 단위" :messages="['예) 점, p, point, 포인트']" />
          <va-input v-model="point.minUsePoint" label="최소 사용 포인트"  :messages="['포인트를 사용 할 수 있는 최소 단위를 설정합니다. 예) 3000원으로 설정 시 0 ~ 2,999원까지는 사용 할 수 없음.']"/>
          <va-input v-model="point.maxHoldPoint" label="최대 보유 포인트"  :messages="['포인트를 보유 할 수 있는 최대값을 설정합니다.']"/>
          <va-input v-model="point.buyPoint" label="회원 구매 포인트 (%)" :messages="['회원이 상품구매시 상품 가격의 일정 비율을 포인트로 적립해 줍니다.']"/>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>상태 관리</h3>
        </div>

        <div class="form-grid">
          <va-select v-model="point.status" label="사용여부" :options="statusOptions" text-by="label" value-by="value"/>
            <va-alert color="danger" inert="" class="mt-2">
            <div class="alert-content">
              <div>포인트는 현금처럼 사용 될 수 없으며, 각 회원의 점수로만 사용가능합니다.</div>
              <div>포인트는 회원의 점수로써 각종 이벤트 참여, 포인트제 상품권 등 부수적인 기능에 활용 가능합니다.</div>
            </div>
          </va-alert>
        </div>
      </div>

      <div class="action-section">
        <div class="btn-group">
          <va-button @click="save" icon="save">저장</va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

onMounted(() => {
    fetList()
})

const fetList = async () => {
  try {
    loading.value = true
    const response = await axios.post('/point/setting')
    point.value = response.data.data
  } catch (error) {
    console.error('API 에러:', error)
  } finally {
    loading.value = false
  }
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const point = ref({
})

const statusOptions = ref([
  { label: '사용', value: 0 },
  { label: '사용안함', value: 1 }
])

const save = async () => {
  try {
    const saveData = {
      ...point.value,
      minUsePoint : point.value.minUsePoint.replace(/,/g,''),
      maxHoldPoint : point.value.maxHoldPoint.replace(/,/g,'')
    }
    console.log('저장할 데이터:', saveData)
    const response = await axios.post('/point/update', saveData)
    if (response.data.code === 200) {
      alert('저장되었습니다.')
      fetList()
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  }
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 3fr));
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
