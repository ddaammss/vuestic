<template>
  <div>
    <h1 class="page-title">환불 설정</h1>

    <div class="form-container">
      <div style="margin-bottom: 20px;">
        <p>수정 후 반드시 '저장' 버튼을 눌러 주셔야 정상적으로 저장이 됩니다.</p>
      </div>

      <form @submit.prevent="saveRefund">
        <va-textarea v-model="refundPolicy" label="환불규정" :min-rows="20" class="form-full" />

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button type="submit">저장</va-button>
          <va-button preset="secondary" @click="$router.push('/')" style="margin-left: 10px;">홈으로</va-button>
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
