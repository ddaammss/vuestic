<template>
  <div>
    <h1 class="page-title">광고 신청 현황</h1>

    <div class="table-container">
      <div class="table-header">광고 신청 현황</div>
      <va-data-table :items="adRequests" :columns="adRequestColumns" :per-page="10" hoverable striped>
        <template #cell(status)="{ value }">
          <va-badge :text="value" :color="getAdStatusColor(value)" />
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button v-if="adRequests[rowIndex].status === '대기중'" size="small" @click="approveAd(rowIndex)"
            style="margin-right: 5px;">
            승인
          </va-button>
          <va-button v-if="adRequests[rowIndex].status === '대기중'" size="small" preset="danger"
            @click="rejectAd(rowIndex)">
            거절
          </va-button>
          <span v-else>-</span>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AdRequests',
  setup() {
    const adRequests = ref([
      { id: 1, requestDate: '2025-05-15', title: '신점 광고', store: '신점신점신점', status: '대기중' },
      { id: 2, requestDate: '2025-05-15', title: '타로 광고', store: '타로타로타로', status: '승인됨' },
      { id: 3, requestDate: '2025-05-15', title: '철학관 광고', store: '신점타로철학', status: '거절됨' },
      { id: 4, requestDate: '2025-05-14', title: '굿당 광고', store: '굿당굿당굿당', status: '대기중' },
      { id: 5, requestDate: '2025-05-13', title: '기도터 광고', store: '기도터기도터', status: '승인됨' }
    ])

    const adRequestColumns = ref([
      { key: 'requestDate', label: '신청일' },
      { key: 'title', label: '제목' },
      { key: 'store', label: '입점사' },
      { key: 'status', label: '상태' },
      { key: 'actions', label: '관리' }
    ])

    const getAdStatusColor = (status) => {
      switch (status) {
        case '승인됨': return 'success'
        case '대기중': return 'warning'
        case '거절됨': return 'danger'
        default: return 'info'
      }
    }

    const approveAd = (index) => {
      adRequests.value[index].status = '승인됨'
      alert('광고가 승인되었습니다.')
    }

    const rejectAd = (index) => {
      if (confirm('정말 거절하시겠습니까?')) {
        adRequests.value[index].status = '거절됨'
        alert('광고가 거절되었습니다.')
      }
    }

    return {
      adRequests,
      adRequestColumns,
      getAdStatusColor,
      approveAd,
      rejectAd
    }
  }
}
</script>
