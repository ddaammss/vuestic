<template>
  <div>
    <h1 class="page-title">배너 관리</h1>

    <div class="form-container">
      <form @submit.prevent="saveBanners">
        <!-- 메인 배너 관리 -->
        <div style="margin-bottom: 40px;">
          <h3 style="margin-bottom: 20px;">메인 배너 관리</h3>
          <div v-for="(banner, index) in mainBanners" :key="index" class="form-grid"
            style="margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 4px;">
            <va-input v-model="banner.name" :label="`배너명 ${index + 1}`" />
            <va-file-upload v-model="banner.file" :label="`파일 첨부 ${index + 1}`" type="single" />
            <va-textarea v-model="banner.description" :label="`설명 ${index + 1}`" class="form-full" />
          </div>
        </div>

        <!-- 서브 배너 관리 -->
        <div style="margin-bottom: 40px;">
          <h3 style="margin-bottom: 20px;">서브 배너 관리</h3>
          <div v-for="(banner, index) in subBanners" :key="index" class="form-grid"
            style="margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 4px;">
            <va-input v-model="banner.name" :label="`배너명 ${index + 1}`" />
            <va-file-upload v-model="banner.file" :label="`파일 첨부 ${index + 1}`" type="single" />
            <va-textarea v-model="banner.description" :label="`설명 ${index + 1}`" class="form-full" />
          </div>
        </div>

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button type="submit">저장</va-button>
          <va-button preset="secondary" @click="$router.push('/')">홈으로</va-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Banner',
  setup() {
    const mainBanners = ref([
      { name: '', file: [], description: '' },
      { name: '', file: [], description: '' },
      { name: '', file: [], description: '' },
      { name: '', file: [], description: '' }
    ])

    const subBanners = ref([
      { name: '', file: [], description: '' },
      { name: '', file: [], description: '' },
      { name: '', file: [], description: '' },
      { name: '', file: [], description: '' }
    ])

    const saveBanners = () => {
      console.log('배너 저장:', { mainBanners: mainBanners.value, subBanners: subBanners.value })
      alert('배너가 저장되었습니다.')
    }

    return {
      mainBanners,
      subBanners,
      saveBanners
    }
  }
}
</script>
