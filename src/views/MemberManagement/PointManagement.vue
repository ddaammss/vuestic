<template>
  <div>
    <h1 class="page-title">포인트관리</h1>

    <div class="form-container">
      <h3 style="margin-bottom: 20px;">포인트 설정</h3>
      <p style="margin-bottom: 20px; color: #666;">각종 이벤트에서 사용할 수 있는 포인트를 설정합니다.</p>

      <form @submit.prevent="savePointSettings">
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">사용여부</label>
          <div class="radio-group">
            <va-radio v-model="pointSettings.enabled" :option="true" label="사용함" />
            <va-radio v-model="pointSettings.enabled" :option="false" label="사용안함" />
          </div>
        </div>

        <div v-if="pointSettings.enabled" style="margin-top: 20px;">
          <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <p style="color: #856404;">포인트는 현금처럼 사용할 수 없으며 각 회원의 적립금으로만 사용가능합니다.</p>
            <p style="color: #856404;">포인트는 회원의 적립금에서 각종 이벤트 참여 시, 포인트에 상품권 등 부수적인 기능에 활용가능합니다.</p>
          </div>

          <div class="form-grid">
            <va-input v-model="pointSettings.earnRate" label="포인트 명칭" placeholder="point" />
            <va-input v-model="pointSettings.unit" label="포인트 단위" placeholder="점" />
          </div>

          <div class="form-grid">
            <va-input v-model="pointSettings.minPoints" label="최소 사용 포인트" type="number" placeholder="0" />
            <va-input v-model="pointSettings.maxPoints" label="최대 보유 포인트" type="number" placeholder="0" />
          </div>

          <div class="form-grid">
            <va-input v-model="pointSettings.purchaseRate" label="상품구매시 상품 가격의" type="number" placeholder="0" />
            <span style="align-self: center;">% 를 회원에게 포인트로 지급</span>
          </div>
        </div>

        <div class="btn-group">
          <va-button type="submit">등록하기</va-button>
          <va-button preset="secondary" @click="$router.push('/')">홈으로</va-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PointManagement',
  setup() {
    const pointSettings = ref({
      enabled: true,
      earnRate: 'point',
      unit: '점',
      minPoints: 0,
      maxPoints: 0,
      purchaseRate: 0
    })

    const savePointSettings = () => {
      console.log('포인트 설정 저장:', pointSettings.value)
      alert('포인트 설정이 저장되었습니다.')
    }

    return {
      pointSettings,
      savePointSettings
    }
  }
}
</script>
