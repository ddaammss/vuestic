<template>
  <div>
    <!-- <h1 class="page-title">개인정보 취급방침</h1> -->

    <div class="form-container">
      <!-- <div style="margin-bottom: 20px;">
        <p>수정 후 반드시 '저장' 버튼을 눌러 주셔야 정상적으로 저장이 됩니다.</p>
      </div> -->

      <form @submit.prevent="savePrivacy">
        <div class="form-group">
          <va-textarea v-model="privacy" label="개인정보 취급방침" max-rows="30" style="width: 2000px;" class=" form-full" />
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
