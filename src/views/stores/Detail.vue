<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      <va-progress-circle indeterminate size="large" />
    </div>
    <div class="table-container">
      <!-- 페이지 헤더 -->
      <div class="table-header">
        <div class="header-content">
          <div class="header-left">
            <span class="page-title">상세 정보</span>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-header">
          <h3>기본 정보</h3>
          <div class="info-badge">{{ detail.storeCode }}</div>
        </div>
        <div class="form-grid">

          <va-input v-model="detail.storeName" label="입점사명" :rules="[value => !!value || '입점사명은 필수입니다.']" />
          <va-input v-model="detail.ceoName" label="대표자명" />
          <va-input v-model="detail.phone" label="연락처" />
          <va-input v-model="detail.email" label="이메일" />
          <va-input v-model="detail.address" label="주소" />
          <va-input v-model="detail.addressDetail" label="상세주소" />
        </div>
        <div class="form-grid-single-row">
          <va-input v-model="detail.description" style="width: 580px;" label="입점사 한 줄 설명" />
          <va-select v-model="detail.startTime" label="영업 시간" :options="timeOptions" />
          <va-select v-model="detail.endTime" :options="timeOptions" />
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: bold;">분야</label>
          <div class="checkbox-group">
            <va-checkbox v-model="categoryFlags.type0" label="신점" />
            <va-checkbox v-model="categoryFlags.type1" label="철학관" />
            <va-checkbox v-model="categoryFlags.type2" label="타로" />
            <va-checkbox v-model="categoryFlags.type3" label="굿당" />
            <va-checkbox v-model="categoryFlags.type4" label="기도터" />
            <va-checkbox v-model="categoryFlags.type5" label="사찰" />
          </div>
        </div>

        <label for="quill1" class="form-label">입점사 설명</label>
        <div class="form-group">
          <div ref="quillEditor" style="height: 400px;"></div>
        </div>
      </div>


      <div class="detail-section">
        <div class="section-header">
          <h3>상품 관리</h3>
        </div>
        <div>
          <div v-if="detail.products?.length > 0">
            <div v-for="(product, index) in detail.products" :key="product.productCode || index" class="form-grid">
              <va-input v-model="product.name" label="상품명" placeholder="상품명을 입력하세요" />
              <va-input v-model="product.price" label="가격" type="number" placeholder="가격을 입력하세요" />

              <div v-if="index === 0">
                <va-button @click="addProduct" icon="add" style="margin-top: 25px;" preset="secondary">
                  추가
                </va-button>
              </div>

              <div v-else>
                <va-button @click="removeProduct(index)" preset="secondary" icon="delete"
                  style="margin-top: 25px; margin-right: 8px;">
                  삭제
                </va-button>
              </div>
            </div>
          </div>









          <div v-else>
            <div v-for="(product, index) in products" :key="index" class="form-grid">
              <va-input v-model="product.name" label="상품명" placeholder="상품명을 입력하세요" />
              <va-input v-model="product.price" label="가격" type="number" placeholder="가격을 입력하세요" />

              <div v-if="index === 0">
                <va-button @click="addProduct" icon="add" style="margin-top: 25px;" preset="secondary">
                  추가
                </va-button>
              </div>

              <div v-else>
                <va-button @click="removeProduct(index)" preset="secondary" icon="delete"
                  style="margin-top: 25px; margin-right: 8px;">
                  삭제
                </va-button>
              </div>
            </div>
          </div>









        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>상태 관리</h3>
        </div>
        <div class="form-grid-single-row">
          <va-select v-model="detail.status" label="활성화여부" :options="statusOptions" text-by="label" value-by="value" />
        </div>
      </div>

      <div class="action-section">
        <div class="btn-group">
          <va-button @click="save" icon="save">저장</va-button>
          <va-button preset="secondary" @click="goBack"> 목록으로 </va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, readonly, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateForAPI } from '@/utils/formatters'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rowData = route.params.storeCode
const quillEditor = ref(null)
let quill = null
const products = ref([
  { name: '', price: '' }
])

onMounted(async () => {
  if (rowData) {
    await fetchDetail(rowData)
  }
  quilljsCall()
})

const quilljsCall = async () => {
  const link = document.createElement('link')
  link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  // JS 로드
  const script = document.createElement('script')
  script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js'
  script.onload = () => {
    quill = new window.Quill(quillEditor.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['link'],
          ['clean']
        ]
      }
    })

    // 🔥 핵심: 내용 변경 감지 이벤트 추가
    quill.on('text-change', () => {
      detail.value.memo = quill.root.innerHTML
    })

    // 이미지 핸들러 커스터마이징
    quill.getModule('toolbar').addHandler('image', () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()

      input.onchange = () => {
        const file = input.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const range = quill.getSelection()
            quill.insertEmbed(range.index, 'image', e.target.result)
            // 🔥 이미지 삽입 후 content 업데이트
            detail.value.memo = quill.root.innerHTML
          }
          reader.readAsDataURL(file)
        }
      }
    })

    // 기존 내용이 있다면 로드
    if (detail.value.memo) {
      quill.root.innerHTML = detail.value.memo
    }
  }
  document.head.appendChild(script)
}


const fetchDetail = async (data) => {
  loading.value = true
  try {
    const response = await axios.post('/store/detail', {
      storeCode: data
    })


    Object.assign(detail.value, response.data.data)
    detail.value.categoryType = detail.value.categoryType.split(',').map(item => parseInt(item.trim()))
    console.log(detail.value.products)

    setInitialFlags()
  } catch (error) {
    console.error('상세 조회 에러:', error)
  } finally {
    loading.value = false;
  }
}

const setInitialFlags = () => {
  if (Array.isArray(detail.value.categoryType)) {
    detail.value.categoryType.forEach(value => {
      categoryFlags[`type${value}`] = true
    })
  }
}

const categoryFlags = reactive({
  type0: false,
  type1: false,
  type2: false,
  type3: false,
  type4: false,
  type5: false
})

const detail = ref({
  storeCode: '',
  storeName: '',
  ceoName: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  categoryType: [],
  status: 0,
  phone: '',
  email: '',
  description: '',
  memo: '',
  startTime: '',
  endTime: '',
})

const statusOptions = ref([
  { label: '활성', value: 0 },
  { label: '비활성', value: 1 },
])

const timeOptions = ref([
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
])

const addProduct = () => {
  detail.products.value.push({ name: '', price: '' })
}

const removeProduct = (index) => {
  if (products.value.length > 1) {
    products.value.splice(index, 1)
  }
}

const save = async () => {
  try {
    if (!detail.value.storeName) {
      alert('입점사를 입력해주세요.')
      return;
    }

    const validProducts = products.value.filter(product =>
      product.name.trim() !== '' && product.price !== ''
    )

    if (validProducts.length === 0) {
      alert('상품은 1개 이상 등록해야합니다.')
      return
    }

    const saveData = {
      ...detail.value,
      categoryType: detail.value.categoryType.join(','),
      products: validProducts
    }
    //console.log('저장할 데이터:', saveData)
    const response = await axios.post('/store/upsert', saveData)
    if (response.data.code === 200) {
      alert('저장되었습니다.')
      goBack()
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  }
}

const goBack = () => {
  const searchData = {
    name: route.query.name,
    address: route.query.address,
    startDate: route.query.startDate,
    endDate: route.query.endDate,
    categoryType: route.query.categoryType
  }

  router.push({
    path: '/stores/list',
    query: searchData
  })
}

watch(categoryFlags, () => {
  detail.value.categoryType = []
  Object.keys(categoryFlags).forEach((key, index) => {
    if (categoryFlags[key]) {
      detail.value.categoryType.push(index)
    }
  })
}, { deep: true })

</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.table-header {
  margin-bottom: 32px;
  border-radius: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 섹션 스타일 */
.detail-section {
  margin-bottom: 22px;
  padding: 20px;
  background: var(--va-background-secondary);
  border-left: 4px solid var(--va-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--va-background-border);
}

.section-header h3 {
  margin: 0;
  color: var(--va-primary);
  font-size: 18px;
  font-weight: 600;
}

.info-badge {
  background: var(--va-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 14px;
}

/* 폼 그리드 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.action-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid var(--va-background-border);
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.form-label {
  display: block;
  font-weight: bold;
  font-size: 12px;
  color: #154EC1;
  margin-bottom: 8px;
}
</style>
