<template>
  <div>
    <h1 class="page-title">회원 정보 관리</h1>

    <div class="table-container">
      <div class="table-header">회원 정보 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="memberSearch.keyword" label="검색어 (이름, 이메일)" />
          <va-select v-model="memberSearch.memberType" label="회원구분" :options="memberTypeOptions" />
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">정렬방식</label>
          <div class="radio-group">
            <va-radio v-model="memberSearch.sortBy" option="가입일순" label="가입일순" />
            <va-radio v-model="memberSearch.sortBy" option="최근접속순" label="최근접속순" />
            <va-radio v-model="memberSearch.sortBy" option="포인트순" label="포인트순" />
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchMembers">검색</va-button>
          <!-- <va-button preset="secondary" @click="resetMemberSearch">초기화</va-button> -->
        </div>
      </div>

      <va-data-table :items="members" :columns="memberColumns" :per-page="10" hoverable striped>
        <template #cell(memberType)="{ value }">
          <va-badge :text="value" :color="value === '일반회원' ? 'primary' : 'success'" />
        </template>
        <template #cell(points)="{ value }">
          {{ formatNumber(value) }}
        </template>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="editMember(rowIndex)">수정</va-button>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { formatNumber } from '@/utils/formatters'

export default {
  name: 'MemberInfo',
  setup() {
    const memberSearch = ref({
      keyword: '',
      memberType: '전체',
      sortBy: '가입일순'
    })

    const memberTypeOptions = ref(['전체', '일반회원', '입점사'])

    const members = ref([
      { id: 1, username: 'user123', name: '홍길동', memberType: '일반회원', registerDate: '2025-05-01', lastLogin: '2025-05-15', points: 1000 },
      { id: 2, username: 'store456', name: '김사장', memberType: '입점사', registerDate: '2025-04-15', lastLogin: '2025-05-14', points: 5000 },
      { id: 3, username: 'user789', name: '이회원', memberType: '일반회원', registerDate: '2025-05-10', lastLogin: '2025-05-13', points: 500 },
      { id: 4, username: 'user456', name: '박회원', memberType: '일반회원', registerDate: '2025-04-20', lastLogin: '2025-05-12', points: 2000 },
      { id: 5, username: 'store789', name: '최사장', memberType: '입점사', registerDate: '2025-04-10', lastLogin: '2025-05-11', points: 8000 }
    ])

    const memberColumns = ref([
      { key: 'username', label: '아이디' },
      { key: 'name', label: '이름' },
      { key: 'memberType', label: '회원구분' },
      { key: 'registerDate', label: '가입일' },
      { key: 'lastLogin', label: '최근접속' },
      { key: 'points', label: '포인트' },
      { key: 'actions', label: '관리' }
    ])

    const searchMembers = () => {
      console.log('회원 검색:', memberSearch.value)
    }

    const resetMemberSearch = () => {
      memberSearch.value = {
        keyword: '',
        memberType: '전체',
        sortBy: '가입일순'
      }
    }

    const editMember = (index) => {
      console.log('회원 수정:', index)
      alert('회원 수정 기능을 구현하세요.')
    }

    return {
      memberSearch,
      memberTypeOptions,
      members,
      memberColumns,
      searchMembers,
      resetMemberSearch,
      editMember,
      formatNumber
    }
  }
}
</script>
