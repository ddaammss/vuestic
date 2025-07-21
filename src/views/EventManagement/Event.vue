<template>
  <div>
    <h1 class="page-title">이벤트 관리</h1>

    <!-- 이벤트 등록 -->
    <div class="form-container" style="margin-bottom: 30px;">
      <h3 style="margin-bottom: 20px;">이벤트 등록</h3>

      <form @submit.prevent="registerEvent">
        <div class="form-grid">
          <va-input v-model="newEvent.name" label="이벤트명" required />
          <div style="display: flex; gap: 10px;">
            <va-date-input v-model="newEvent.startDate" label="시작일" style="flex: 1;" />
            <span style="align-self: center;">~</span>
            <va-date-input v-model="newEvent.endDate" label="종료일" style="flex: 1;" />
          </div>
        </div>

        <va-textarea v-model="newEvent.description" label="설명" class="form-full" />

        <div style="margin: 20px 0;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">파일첨부</label>
          <va-file-upload v-model="newEvent.files" type="gallery" />
        </div>

        <div class="btn-group">
          <va-button type="submit">확인</va-button>
          <va-button preset="secondary" @click="resetEvent">초기화</va-button>
        </div>
      </form>
    </div>

    <!-- 기존 이벤트 목록 -->
    <div class="table-container">
      <div class="table-header">등록된 이벤트 목록</div>
      <va-data-table :items="events" :columns="eventColumns" :per-page="10" hoverable striped>
        <template #cell(status)="{ value }">
          <va-badge :text="value" :color="getEventStatusColor(value)" />
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="editEvent(rowIndex)">수정</va-button>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Event',
  setup() {
    const newEvent = ref({
      name: '',
      startDate: null,
      endDate: null,
      description: '',
      files: []
    })

    const events = ref([
      { id: 1, registerDate: '2025-05-15', title: '오픈 이벤트', endDate: '2025-05-16', status: '진행중' },
      { id: 2, registerDate: '2025-05-15', title: '설날 이벤트', endDate: '2025-05-16', status: '종료' },
      { id: 3, registerDate: '2025-05-15', title: '빅 이벤트', endDate: '2025-06-01', status: '진행중' }
    ])

    const eventColumns = ref([
      { key: 'registerDate', label: '등록일' },
      { key: 'title', label: '제목' },
      { key: 'endDate', label: '종료일' },
      { key: 'status', label: '상태' },
      { key: 'actions', label: '관리' }
    ])

    const getEventStatusColor = (status) => {
      switch (status) {
        case '진행중': return 'success'
        case '종료': return 'danger'
        case '대기중': return 'warning'
        default: return 'info'
      }
    }

    const registerEvent = () => {
      console.log('이벤트 등록:', newEvent.value)
      const event = {
        id: events.value.length + 1,
        registerDate: new Date().toISOString().split('T')[0],
        title: newEvent.value.name,
        endDate: newEvent.value.endDate,
        status: '진행중'
      }
      events.value.push(event)
      alert('이벤트가 등록되었습니다.')
      resetEvent()
    }

    const resetEvent = () => {
      newEvent.value = {
        name: '',
        startDate: null,
        endDate: null,
        description: '',
        files: []
      }
    }

    const editEvent = (index) => {
      console.log('이벤트 수정:', index)
      alert('이벤트 수정 기능을 구현하세요.')
    }

    return {
      newEvent,
      events,
      eventColumns,
      getEventStatusColor,
      registerEvent,
      resetEvent,
      editEvent
    }
  }
}
</script>
