<template>
  <div>
    <h1 class="page-title">개인정보 취급방침</h1>

    <div class="form-container">
      <div style="margin-bottom: 20px;">
        <p>수정 후 반드시 '확인' 버튼을 눌러 주셔야 정상적으로 저장이 됩니다.</p>
      </div>

      <form @submit.prevent="savePrivacy">
        <va-textarea v-model="privacy" label="개인정보 취급방침" :min-rows="20" class="form-full" />

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
  name: 'Privacy',
  setup() {
    const privacy = ref('개인정보 취급방침 내용을 입력하세요...')

    const savePrivacy = () => {
      console.log('개인정보 취급방침 저장:', privacy.value)
      alert('개인정보 취급방침이 저장되었습니다.')
    }

    return {
      privacy,
      savePrivacy
    }
  }
}
</script>
