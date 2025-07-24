<template>
  <div>

    <div class="form-container">
      <form @submit.prevent="saveRefund">
        <div class="form-group">
          <va-textarea v-model="refundPolicy" label="환불규정" max-rows="20" style="width: 2000px;" class="form-full" />
        </div>

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button type="submit">저장</va-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Refund',
  setup() {
    const refundPolicy = ref('환불규정 내용을 입력하세요...')

    const saveRefund = () => {
      console.log('환불규정 저장:', refundPolicy.value)
      alert('환불규정이 저장되었습니다.')
    }

    return {
      refundPolicy,
      saveRefund
    }
  }
}
</script>
