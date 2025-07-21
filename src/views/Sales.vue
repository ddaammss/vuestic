<template>
  <div>
    <h1 class="page-title">매출 통계</h1>

    <div class="table-container">
      <div class="table-header">매출 통계</div>
      <div class="search-form">
        <div class="form-grid">
          <va-date-input v-model="salesSearch.startDate" label="시작일" />
          <va-date-input v-model="salesSearch.endDate" label="종료일" />
          <va-select v-model="salesSearch.period" label="기간별 조회" :options="periodOptions" />
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">결제 수단</label>
          <div class="checkbox-group">
            <va-checkbox v-model="salesSearch.paymentMethods" array-value="실시간계좌이체" label="실시간계좌이체" />
            <va-checkbox v-model="salesSearch.paymentMethods" array-value="무통장입금" label="무통장입금" />
            <va-checkbox v-model="salesSearch.paymentMethods" array-value="카드" label="카드" />
            <va-checkbox v-model="salesSearch.paymentMethods" array-value="휴대폰" label="휴대폰" />
          </div>
        </div>
        <div class="btn-group">
          <va-button @click="searchSales">검색</va-button>
          <va-button preset="secondary" @click="resetSalesSearch">초기화</va-button>
        </div>
      </div>

      <!-- 매출 요약 -->
      <div style="padding: 20px; background: #f8f9fa;">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ formatNumber(salesSummary.totalSales) }}</div>
            <div class="stat-label">총 매출</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ formatNumber(salesSummary.totalRefund) }}</div>
            <div class="stat-label">총 환불</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ formatNumber(salesSummary.netSales) }}</div>
            <div class="stat-label">순 매출</div>
          </div>
        </div>
      </div>

      <va-data-table :items="salesData" :columns="salesColumns" :per-page="10" hoverable striped />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { formatNumber } from '@/utils/formatters'

export default {
  name: 'Sales',
  setup() {
    const salesSearch = ref({
      startDate: null,
      endDate: null,
      period: '일별',
      paymentMethods: []
    })

    const periodOptions = ref(['일별', '월별', '연별'])

    const salesSummary = ref({
      totalSales: 1000000,
      totalRefund: 50000,
      netSales: 950000
    })

    const salesData = ref([
      { date: '2025-05-15', totalAmount: 55000, bankTransfer: 15000, deposit: 40000, card: 0, mobile: 0, refund: 0, netSales: 55000 },
      { date: '2025-05-14', totalAmount: 80000, bankTransfer: 30000, deposit: 50000, card: 0, mobile: 0, refund: 10000, netSales: 70000 },
      { date: '2025-05-13', totalAmount: 120000, bankTransfer: 50000, deposit: 70000, card: 0, mobile: 0, refund: 0, netSales: 120000 }
    ])

    const salesColumns = ref([
      { key: 'date', label: '접수일자' },
      { key: 'totalAmount', label: '결제금액' },
      { key: 'bankTransfer', label: '계좌이체' },
      { key: 'deposit', label: '무통장' },
      { key: 'card', label: '카드' },
      { key: 'mobile', label: '휴대폰' },
      { key: 'refund', label: '환불금액' },
      { key: 'netSales', label: '순매출' }
    ])

    const searchSales = () => {
      console.log('매출 검색:', salesSearch.value)
    }

    const resetSalesSearch = () => {
      salesSearch.value = {
        startDate: null,
        endDate: null,
        period: '일별',
        paymentMethods: []
      }
    }

    return {
      salesSearch,
      periodOptions,
      salesSummary,
      salesData,
      salesColumns,
      searchSales,
      resetSalesSearch,
      formatNumber
    }
  }
}
</script>
