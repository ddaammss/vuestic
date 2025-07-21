<template>
  <div>
    <h1 class="page-title">소통방</h1>

    <div class="table-container">
      <div class="table-header">1:1 문의 관리</div>
      <va-data-table :items="inquiries" :columns="inquiryColumns" :per-page="10" hoverable striped>
        <template #cell(status)="{ value }">
          <va-badge :text="value" :color="getInquiryStatusColor(value)" />
        </template>
        <template #cell(type)="{ value }">
          <va-badge :text="value" color="info" />
        </template>
        <template #cell(userType)="{ value }">
          <va-badge :text="value" :color="value === '사용자' ? 'primary' : 'success'" />
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="viewInquiry(rowIndex)">보기</va-button>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Communication',
  setup() {
    const inquiries = ref([
      { id: 1, date: '2025-05-21', type: '오류/수정', title: '예약 오류 문의 드려요', userType: '사용자', status: '접수완료' },
      { id: 2, date: '2025-05-20', type: '결제', title: '정산 언제 되나요 ??', userType: '입점사', status: '처리중' },
      { id: 3, date: '2025-05-20', type: '오류/수정', title: '메인 이미지 수정 어떻게 하나요??', userType: '사용자', status: '답변완료' },
      { id: 4, date: '2025-05-19', type: '오류/수정', title: '전화번호 변경해 주세요.', userType: '입점사', status: '답변완료' },
      { id: 5, date: '2025-05-18', type: '오류/수정', title: '예약 오류 문의 드려요', userType: '사용자', status: '답변완료' },
      { id: 6, date: '2025-05-17', type: '결제', title: '정산 언제 되나요 ??', userType: '입점사', status: '답변완료' }
    ])

    const inquiryColumns = ref([
      { key: 'date', label: '등록일' },
      { key: 'type', label: '질문 유형' },
      { key: 'title', label: '제목' },
      { key: 'userType', label: '구분' },
      { key: 'status', label: '진행상태' },
      { key: 'actions', label: '관리' }
    ])

    const getInquiryStatusColor = (status) => {
      switch (status) {
        case '답변완료': return 'success'
        case '처리중': return 'warning'
        case '접수완료': return 'info'
        default: return 'info'
      }
    }

    const viewInquiry = (index) => {
      console.log('문의 보기:', index)
      alert('문의 상세보기 기능을 구현하세요.')
    }

    return {
      inquiries,
      inquiryColumns,
      getInquiryStatusColor,
      viewInquiry
    }
  }
}
</script>
