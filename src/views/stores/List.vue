<template>
  <div>
    <h1 class="page-title">입점사 관리</h1>

    <div class="table-container">
      <div class="table-header">입점사 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="storeSearch.name" label="입점사명" />
          <va-input v-model="storeSearch.address" label="주소" />
          <va-date-input v-model="storeSearch.startDate" label="시작일" />
          <va-date-input v-model="storeSearch.endDate" label="종료일" />
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">분야</label>
          <div class="checkbox-group">
            <va-checkbox v-model="storeSearch.categories" array-value="신점" label="신점" />
            <va-checkbox v-model="storeSearch.categories" array-value="철학관" label="철학관" />
            <va-checkbox v-model="storeSearch.categories" array-value="타로" label="타로" />
            <va-checkbox v-model="storeSearch.categories" array-value="굿당" label="굿당" />
            <va-checkbox v-model="storeSearch.categories" array-value="기도터" label="기도터" />
            <va-checkbox v-model="storeSearch.categories" array-value="사찰" label="사찰" />
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchStores">검색</va-button>
          <!-- <va-button preset="secondary" @click="resetStoreSearch">초기화</va-button> -->
        </div>
      </div>

      <va-data-table :items="filteredStores" :columns="storeColumns" :per-page="10" hoverable striped>
        <template #cell(actions)="{ rowIndex }">
          <va-button size="small" @click="editStore(rowIndex)">수정</va-button>
        </template>
      </va-data-table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'StoreList',
  setup() {
    const storeSearch = ref({
      name: '',
      address: '',
      startDate: null,
      endDate: null,
      categories: []
    })

    const stores = ref([
      { id: 1, registerDate: '2025-05-01', name: '신통방통타로', address: '서울 은평', category: '신점', owner: '박종찬' },
      { id: 2, registerDate: '2025-05-01', name: '신통방통타로', address: '서울 마포', category: '타로', owner: '문시우' },
      { id: 3, registerDate: '2025-05-01', name: '신통방통타로', address: '서울 구로', category: '철학관', owner: '민예린' }
    ])

    const storeColumns = ref([
      { key: 'registerDate', label: '등록일자' },
      { key: 'name', label: '입점사명' },
      { key: 'address', label: '주소' },
      { key: 'category', label: '분야' },
      { key: 'owner', label: '예약자' },
      { key: 'actions', label: '수정' }
    ])

    const filteredStores = computed(() => {
      let filtered = stores.value

      if (storeSearch.value.name) {
        filtered = filtered.filter(store =>
          store.name.includes(storeSearch.value.name)
        )
      }

      if (storeSearch.value.address) {
        filtered = filtered.filter(store =>
          store.address.includes(storeSearch.value.address)
        )
      }

      if (storeSearch.value.categories.length > 0) {
        filtered = filtered.filter(store =>
          storeSearch.value.categories.includes(store.category)
        )
      }

      return filtered
    })

    const searchStores = () => {
      console.log('입점사 검색:', storeSearch.value)
    }

    const resetStoreSearch = () => {
      storeSearch.value = {
        name: '',
        address: '',
        startDate: null,
        endDate: null,
        categories: []
      }
    }

    const editStore = (index) => {
      console.log('입점사 수정:', index)
      alert('입점사 수정 기능을 구현하세요.')
    }

    return {
      storeSearch,
      stores,
      storeColumns,
      filteredStores,
      searchStores,
      resetStoreSearch,
      editStore
    }
  }
}
</script>
