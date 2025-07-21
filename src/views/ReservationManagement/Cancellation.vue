<template>
  <div>
    <h1 class="page-title">취소관리</h1>

    <div class="table-container">
      <div class="table-header">취소 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-select v-model="cancelSearch.type" label="사용자 / 입점사" :options="['전체', '사용자', '입점사']" />
          <va-date-input v-model="cancelSearch.startDate" label="시작일" />
          <va-date-input v-model="cancelSearch.endDate" label="종료일" />
        </div>
        <div class="btn-group">
          <va-button @click="searchCancellations">검색</va-button>
          <va-button preset="secondary" @click="resetCancelSearch">초기화</va-button>
        </div>
      </div>

      <va-data-table :items="cancellations" :columns="cancelColumns" :per-page="10" hoverable striped>
        <template #cell(status)="{ value }">
          <va-badge :text="value" color="danger" />
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="editCancellation(rowIndex)">수정</va-button>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Cancellation',
  setup() {
    const cancelSearch = ref({
      type: '전체',
      startDate: null,
      endDate: null
    })

    const cancellations = ref([
      { id: 1, receiptDate: '2025-05-15', reservationDate: '2025-06-15', cancelDate: '2025-05-16', store: '타로타로타로', user: '박종찬', contact: '010-0000-0000', people: '1명', amount: '15,000', status: '예약취소' }
    ])

    const cancelColumns = ref([
      { key: 'receiptDate', label: '접수일자' },
      { key: 'reservationDate', label: '예약일자' },
      { key: 'cancelDate', label: '취소일자' },
      { key: 'store', label: '입점사' },
      { key: 'user', label: '사용자' },
      { key: 'contact', label: '연락처' },
      { key: 'people', label: '예약인원' },
      { key: 'amount', label: '결제금액' },
      { key: 'status', label: '예약상태' },
      { key: 'actions', label: '수정' }
    ])

    const searchCancellations = () => {
      console.log('취소 검색:', cancelSearch.value)
    }

    const resetCancelSearch = () => {
      cancelSearch.value = {
        type: '전체',
        startDate: null,
        endDate: null
      }
    }

    const editCancellation = (index) => {
      console.log('취소 수정:', index)
      alert('취소 수정 기능을 구현하세요.')
    }

    return {
      cancelSearch,
      cancellations,
      cancelColumns,
      searchCancellations,
      resetCancelSearch,
      editCancellation
    }
  }
}
</script>
