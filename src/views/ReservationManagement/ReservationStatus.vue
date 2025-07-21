<template>
  <div>
    <h1 class="page-title">예약 현황</h1>

    <div class="table-container">
      <div class="table-header">예약 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-select v-model="reservationSearch.type" label="사용자 / 입점사" :options="typeOptions" />
          <va-date-input v-model="reservationSearch.startDate" label="시작일" />
          <va-date-input v-model="reservationSearch.endDate" label="종료일" />
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">분야</label>
          <div class="checkbox-group">
            <va-checkbox v-model="reservationSearch.categories" array-value="신점" label="신점" />
            <va-checkbox v-model="reservationSearch.categories" array-value="철학관" label="철학관" />
            <va-checkbox v-model="reservationSearch.categories" array-value="타로" label="타로" />
            <va-checkbox v-model="reservationSearch.categories" array-value="굿당" label="굿당" />
            <va-checkbox v-model="reservationSearch.categories" array-value="기도터" label="기도터" />
            <va-checkbox v-model="reservationSearch.categories" array-value="사찰" label="사찰" />
          </div>
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">예약 상태</label>
          <div class="radio-group">
            <va-radio v-model="reservationSearch.status" option="전체" label="전체" />
            <va-radio v-model="reservationSearch.status" option="예약대기" label="예약대기" />
            <va-radio v-model="reservationSearch.status" option="예약확정" label="예약확정" />
            <va-radio v-model="reservationSearch.status" option="예약취소" label="예약취소" />
          </div>
        </div>
        <div class="btn-group">
          <va-button @click="searchReservations">검색</va-button>
          <va-button preset="secondary" @click="resetReservationSearch">초기화</va-button>
        </div>
      </div>

      <va-data-table :items="filteredReservations" :columns="reservationColumns" :per-page="10" hoverable striped>
        <template #cell(status)="{ value }">
          <va-badge :text="value" :color="getStatusColor(value)" />
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="editReservation(rowIndex)">수정</va-button>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ReservationStatus',
  setup() {
    const reservationSearch = ref({
      type: '전체',
      startDate: null,
      endDate: null,
      categories: [],
      status: '전체'
    })

    const typeOptions = ref(['전체', '사용자', '입점사'])

    const reservations = ref([
      { id: 1, receiptDate: '2025-05-15', reservationDate: '2025-06-15', confirmDate: '2025-05-16', store: '타로타로타로', user: '박종찬', contact: '010-0000-0000', people: '1명', amount: '15,000', status: '확정완료' },
      { id: 2, receiptDate: '2025-05-15', reservationDate: '2025-06-16', confirmDate: '-', store: '신점신점신점', user: '문시우', contact: '010-0000-0000', people: '2명', amount: '30,000', status: '예약대기' },
      { id: 3, receiptDate: '2025-05-15', reservationDate: '2025-06-17', confirmDate: '2025-05-15', store: '타로철학신점', user: '민예린', contact: '010-0000-0000', people: '1명', amount: '10,000', status: '확정완료' }
    ])

    const reservationColumns = ref([
      { key: 'receiptDate', label: '접수일자' },
      { key: 'reservationDate', label: '예약일자' },
      { key: 'confirmDate', label: '확정일자' },
      { key: 'store', label: '입점사' },
      { key: 'user', label: '사용자' },
      { key: 'contact', label: '연락처' },
      { key: 'people', label: '예약인원' },
      { key: 'amount', label: '결제금액' },
      { key: 'status', label: '예약상태' },
      { key: 'actions', label: '수정' }
    ])

    const filteredReservations = computed(() => {
      let filtered = reservations.value

      if (reservationSearch.value.status !== '전체') {
        filtered = filtered.filter(reservation =>
          reservation.status === reservationSearch.value.status
        )
      }

      return filtered
    })

    const getStatusColor = (status) => {
      switch (status) {
        case '확정완료': return 'success'
        case '예약대기': return 'warning'
        case '예약취소': return 'danger'
        default: return 'info'
      }
    }

    const searchReservations = () => {
      console.log('예약 검색:', reservationSearch.value)
    }

    const resetReservationSearch = () => {
      reservationSearch.value = {
        type: '전체',
        startDate: null,
        endDate: null,
        categories: [],
        status: '전체'
      }
    }

    const editReservation = (index) => {
      console.log('예약 수정:', index)
      alert('예약 수정 기능을 구현하세요.')
    }

    return {
      reservationSearch,
      typeOptions,
      reservations,
      reservationColumns,
      filteredReservations,
      getStatusColor,
      searchReservations,
      resetReservationSearch,
      editReservation
    }
  }
}
</script>
