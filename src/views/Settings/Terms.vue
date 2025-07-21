<template>
  <div>
    <h1 class="page-title">이용약관</h1>

    <div class="form-container">
      <div style="margin-bottom: 20px;">
        <p>수정 후 반드시 '확인' 버튼을 눌러 주셔야 정상적으로 저장이 됩니다.</p>
      </div>

      <form @submit.prevent="saveTerms">
        <va-textarea v-model="terms" label="이용약관" :min-rows="20" class="form-full" />

        <div class="btn-group">
          <va-button type="submit">확인</va-button>
          <va-button preset="secondary" @click="$router.push('/')">홈으로</va-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Terms',
  setup() {
    const terms = ref('이용약관 내용을 입력하세요...')

    const saveTerms = () => {
      console.log('이용약관 저장:', terms.value)
      alert('이용약관이 저장되었습니다.')
    }

    return {
      terms,
      saveTerms
    }
  }
}
</script>
