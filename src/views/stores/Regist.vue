<template>
  <div>
    <h1 class="page-title">입점사 등록</h1>

    <div class="form-container">
      <form @submit.prevent="registerStore">
        <div class="form-grid">
          <va-input v-model="newStore.name" label="입점사명" required />
          <va-input v-model="newStore.address" label="주소" required />
        </div>

        <div class="form-grid">
          <va-select v-model="newStore.startTime" label="시작 시간" :options="timeOptions" />
          <va-select v-model="newStore.endTime" label="종료 시간" :options="timeOptions" />
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">분야</label>
          <div class="checkbox-group">
            <va-checkbox v-model="newStore.categories" array-value="신점" label="신점" />
            <va-checkbox v-model="newStore.categories" array-value="철학관" label="철학관" />
            <va-checkbox v-model="newStore.categories" array-value="타로" label="타로" />
            <va-checkbox v-model="newStore.categories" array-value="굿당" label="굿당" />
            <va-checkbox v-model="newStore.categories" array-value="기도터" label="기도터" />
            <va-checkbox v-model="newStore.categories" array-value="사찰" label="사찰" />
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 15px;">상품</h3>
          <div v-for="(product, index) in newStore.products" :key="index"
            style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
            <div class="form-grid">
              <va-input v-model="product.name" :label="`상품명 ${index + 1}`" />
              <va-input v-model="product.price" :label="`가격 ${index + 1}`" type="number" />
            </div>
            <va-button @click="removeProduct(index)" preset="secondary" size="small" style="margin-top: 10px;">
              삭제
            </va-button>
          </div>
          <va-button @click="addProduct" preset="secondary">상품 추가</va-button>
        </div>

        <va-textarea v-model="newStore.description" label="입점사 설명" class="form-full" />

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button type="submit">저장</va-button>
          <!-- <va-button preset="secondary" @click="resetNewStore">초기화</va-button> -->
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'StoreRegister',
  setup() {
    const newStore = ref({
      name: '',
      address: '',
      startTime: '09:00',
      endTime: '24:00',
      categories: [],
      products: [{ name: '', price: 0 }],
      description: ''
    })

    const timeOptions = ref([
      '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
      '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
    ])

    const addProduct = () => {
      newStore.value.products.push({ name: '', price: 0 })
    }

    const removeProduct = (index) => {
      if (newStore.value.products.length > 1) {
        newStore.value.products.splice(index, 1)
      }
    }

    const registerStore = () => {
      console.log('입점사 등록:', newStore.value)
      alert('입점사가 등록되었습니다.')
    }

    const resetNewStore = () => {
      newStore.value = {
        name: '',
        address: '',
        startTime: '09:00',
        endTime: '24:00',
        categories: [],
        products: [{ name: '', price: 0 }],
        description: ''
      }
    }

    return {
      newStore,
      timeOptions,
      addProduct,
      removeProduct,
      registerStore,
      resetNewStore
    }
  }
}
</script>
