<template>
  <div>
    <h1 class="page-title">광고 등록</h1>

    <!-- 광고 등록 폼 -->
    <div class="form-container" style="margin-bottom: 30px;">
      <h3 style="margin-bottom: 20px;">광고 등록</h3>

      <form @submit.prevent="registerAd">
        <div class="form-grid">
          <va-input v-model="newAd.storeName" label="입점사 검색" />
          <div style="display: flex; gap: 10px;">
            <va-date-input v-model="newAd.startDate" label="시작일" style="flex: 1;" />
            <span style="align-self: center;">~</span>
            <va-date-input v-model="newAd.endDate" label="종료일" style="flex: 1;" />
          </div>
        </div>

        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">광고 분야</label>
          <div class="checkbox-group horizontal-checkboxes">
            <va-checkbox v-model="newAd.categories" array-value="신점" label="신점" />
            <va-checkbox v-model="newAd.categories" array-value="철학관" label="철학관" />
            <va-checkbox v-model="newAd.categories" array-value="타로" label="타로" />
            <va-checkbox v-model="newAd.categories" array-value="굿당" label="굿당" />
            <va-checkbox v-model="newAd.categories" array-value="기도터" label="기도터" />
            <va-checkbox v-model="newAd.categories" array-value="사찰" label="사찰" />
          </div>
        </div>

        <div style="margin: 20px 0;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">노출 순위</label>
          <div class="checkbox-group horizontal-checkboxes">
            <va-checkbox v-model="newAd.positions" array-value="1위" label="1위" />
            <va-checkbox v-model="newAd.positions" array-value="2위" label="2위" />
            <va-checkbox v-model="newAd.positions" array-value="3위" label="3위" />
            <va-checkbox v-model="newAd.positions" array-value="4위" label="4위" />
            <va-checkbox v-model="newAd.positions" array-value="5위" label="5위" />
          </div>
        </div>

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button type="submit">저장</va-button>
          <!-- <va-button preset="secondary" @click="resetAd">취소</va-button> -->
        </div>
      </form>
    </div>

    <!-- 기존 광고 목록 -->
    <div class="table-container">
      <div class="table-header">등록된 광고 목록</div>
      <va-data-table :items="ads" :columns="adColumns" :per-page="10" hoverable striped selectable>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="editAd(rowIndex)" style="margin-right: 5px;">수정</va-button>
          <va-button size="small" preset="danger" @click="deleteAd(rowIndex)">삭제</va-button>
        </template>
      </va-data-table>

      <!-- <div class="btn-group" style="margin-top: 20px; margin-top: 20px; display: flex; justify-content: flex-end;">
        <va-button @click="registerSelectedAds">저장</va-button>
        <va-button preset="secondary" @click="editSelectedAds">수정하기</va-button>
        <va-button preset="danger" @click="deleteSelectedAds">삭제하기</va-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AdRegister',
  setup() {
    const newAd = ref({
      storeName: '',
      startDate: null,
      endDate: null,
      categories: [],
      positions: []
    })

    const ads = ref([
      { id: 1, number: 1, registerDate: '2025-05-01', store: '타로타로타로', period: '2025-06-01 ~ 2025-06-31', category: '신점', position: '1위' }
    ])

    const adColumns = ref([
      { key: 'number', label: '번호' },
      { key: 'registerDate', label: '등록일' },
      { key: 'store', label: '입점사' },
      { key: 'period', label: '등록기간' },
      { key: 'category', label: '등록 분야' },
      { key: 'position', label: '등록 순위' },
      { key: 'actions', label: '관리' }
    ])

    const registerAd = () => {
      console.log('광고 등록:', newAd.value)
      const ad = {
        id: ads.value.length + 1,
        number: ads.value.length + 1,
        registerDate: new Date().toISOString().split('T')[0],
        store: newAd.value.storeName,
        period: `${newAd.value.startDate} ~ ${newAd.value.endDate}`,
        category: newAd.value.categories.join(', '),
        position: newAd.value.positions.join(', ')
      }
      ads.value.push(ad)
      alert('광고가 등록되었습니다.')
      resetAd()
    }

    const resetAd = () => {
      newAd.value = {
        storeName: '',
        startDate: null,
        endDate: null,
        categories: [],
        positions: []
      }
    }

    const editAd = (index) => {
      console.log('광고 수정:', index)
      alert('광고 수정 기능을 구현하세요.')
    }

    const deleteAd = (index) => {
      if (confirm('정말 삭제하시겠습니까?')) {
        ads.value.splice(index, 1)
        alert('광고가 삭제되었습니다.')
      }
    }

    const registerSelectedAds = () => {
      alert('선택된 광고들을 등록합니다.')
    }

    const editSelectedAds = () => {
      alert('선택된 광고들을 수정합니다.')
    }

    const deleteSelectedAds = () => {
      if (confirm('선택된 광고들을 정말 삭제하시겠습니까?')) {
        alert('선택된 광고들이 삭제되었습니다.')
      }
    }

    return {
      newAd,
      ads,
      adColumns,
      registerAd,
      resetAd,
      editAd,
      deleteAd,
      registerSelectedAds,
      editSelectedAds,
      deleteSelectedAds
    }
  }
}
</script>
<style scoped>
.horizontal-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}
</style>
