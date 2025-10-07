<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      <va-progress-circle indeterminate size="large" />
    </div>
    <div class="table-container">
      <div class="table-header">
        <div class="header-content">
          <div class="header-left">
            <span class="page-title">입점사 등록</span>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-header">
          <h3>기본 정보</h3>
        </div>
        <div class="form-grid">
          <va-input v-model="storeName" label="입점사명" :rules="[value => !!value || '입점사명은 필수입니다.']" />
          <va-input v-model="ceoName" label="대표자명" />
          <va-input v-model="phone" label="연락처" />
          <va-input v-model="email" label="이메일" />
        </div>

        <!-- 주소 입력 영역 -->
        <div class="address-section">
          <div class="address-row">
            <va-input
              v-model="zipCode"
              label="우편번호"
              readonly
              class="postcode-input"
            />
            <va-button
              @click="execDaumPostcode"
              icon="search"
              class="address-search-btn"
            >
              우편번호 찾기
            </va-button>
            <va-input
              v-model="address"
              label="주소"
              style="width: 50%;"
              readonly
            />
            <va-input
              v-model="addressDetail"
              label="상세주소"
              placeholder="상세주소를 입력하세요"
            />
          </div>
        </div>

        <div class="form-grid-single-row">
          <va-input v-model="description" style="width: 580px;" label="입점사 한 줄 설명" />
          <va-select v-model="startTime" label="영업 시간" :options="timeOptions" />
          <va-select v-model="endTime" :options="timeOptions" />
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
          <div ref="quillEditor" style="height: 100px;"></div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>상품 관리</h3>
        </div>
        <div>
          <div>
            <div v-for="(product, index) in products" :key="index" class="form-grid">
              <va-input v-model="product.name" label="상품명" placeholder="상품명을 입력하세요" />
              <va-input v-model="product.price" label="가격" placeholder="가격을 입력하세요" />
              <div v-if="index === 0">
                <va-button @click="addProduct" icon="add" style="margin-top: 25px;" preset="secondary">추가</va-button>
              </div>
              <div v-else>
                <va-button @click="removeProduct(index)" preset="secondary" icon="delete" style="margin-top: 25px; margin-right: 8px;"> 삭제 </va-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>이미지 관리</h3>
        </div>
        <va-input ref="fileInput" type="file" multiple accept="image/*" style="display: none" @change="handleFileSelect"/>
        <va-button icon="upload" @click="$refs.fileInput.$el.querySelector('input').click()" :loading="isUploading" preset="secondary"> 이미지 선택 </va-button>
        <div v-if="selectedImages.length > 0" class="preview-grid mt-4">
          <va-card v-for="(image, index) in selectedImages" :key="index" class="image-preview-card">
            <div class="image-container">
              <va-button icon="close" size="small" color="danger" class="remove-button" @click="removeImage(index)"/>
            </div>
            <va-card-content>
              <div class="text-sm">{{ image.name || image }}</div>
            </va-card-content>
          </va-card>
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
import { ref, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const quillEditor = ref(null)
let quill = null

const selectedImages = ref([])
const isUploading = ref(false)
const fileInput = ref(null)
const storeName = ref()
const ceoName = ref()
const phone = ref()
const email = ref()
const zipCode = ref('')
const address = ref()
const addressDetail = ref()
const description = ref()
const startTime = ref()
const endTime = ref()
const memo = ref()
let categoryType = []
const products = ref([
  { name: '', price: '' }
])

onMounted(async () => {
  quilljsCall()
  loadDaumPostcodeScript()
})

// Daum 우편번호 스크립트 로드
const loadDaumPostcodeScript = () => {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Daum Postcode script load failed'))
    document.head.appendChild(script)
  })
}

// 우편번호 찾기 실행
const execDaumPostcode = async () => {
  try {
    await loadDaumPostcodeScript()

    new window.daum.Postcode({
      oncomplete: function(data) {
        let roadAddr = data.roadAddress
        let extraRoadAddr = ''

        // 법정동명이 있을 경우 추가
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname
        }

        // 건물명이 있고, 공동주택일 경우 추가
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName)
        }

        // 표시할 참고항목이 있을 경우, 괄호까지 추가
        if (extraRoadAddr !== '') {
          extraRoadAddr = ' (' + extraRoadAddr + ')'
        }

        // 우편번호와 주소 정보 할당
        zipCode.value = data.zonecode
        address.value = roadAddr + extraRoadAddr

        // 상세주소 입력 필드에 포커스
        setTimeout(() => {
          const detailInput = document.querySelector('input[placeholder="상세주소를 입력하세요"]')
          if (detailInput) detailInput.focus()
        }, 100)
      }
    }).open()
  } catch (error) {
    console.error('우편번호 API 로드 실패:', error)
    alert('우편번호 서비스를 불러오는데 실패했습니다.')
  }
}

const quilljsCall = async () => {
  const link = document.createElement('link')
  link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

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
          ['link'],
          ['clean']
        ]
      }
    })

    quill.on('text-change', () => {
      memo.value = quill.root.innerHTML
    })

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
            memo.value = quill.root.innerHTML
          }
          reader.readAsDataURL(file)
        }
      }
    })
  }
  document.head.appendChild(script)
}

const categoryFlags = reactive({
  type0: false,
  type1: false,
  type2: false,
  type3: false,
  type4: false,
  type5: false
})

const timeOptions = ref([
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
])

const addProduct = () => {
  products.value.push({ name: '', price: '' })
}

const removeProduct = (index) => {
  if (products.value.length > 1) {
    products.value.splice(index, 1)
  }
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file: file,
          name: file.name,
          url: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const save = async () => {
  try {
    if (storeName.value == undefined) {
      alert('입점사를 입력해주세요.')
      return
    }

    if (categoryType.length == 0) {
      alert('분야를 선택해주세요.')
      return
    }

    let prd = products.value.filter(product =>
      product.name.trim() !== '' && product.price !== ''
    )

    if (prd.length === 0) {
      alert('상품은 1개 이상 등록해야합니다.')
      return
    }
    if(selectedImages.value.length === 0){
      alert('이미지는 1개 이상 등록해야합니다.')
      return
    }

    const saveData = {
      storeName: storeName.value,
      ceoName : ceoName.value,
      phone : phone.value,
      email : email.value,
      zipCode: zipCode.value,
      address : address.value,
      addressDetail : addressDetail.value,
      description : description.value,
      startTime : startTime.value,
      endTime : endTime.value,
      categoryType: categoryType.join(','),
      memo : memo.value,
      products: prd,
    }

    loading.value = true
    const response = await axios.post('/store/upsert', saveData)
    if (response.data.code === 200) {
      let imageArray = []
      const formData = new FormData()
      if (selectedImages.value.length > 0) {
        selectedImages.value.forEach((item, index) => {
          const actualFile = item.file || item
          if (actualFile instanceof File) {
            formData.append('images', actualFile)
          } else {
            formData.append('dbImages', actualFile)
          }
        })
        formData.append('type', 'store')
        formData.append('parentSeq', response.data.data)

        try {
          const uploadResponse = await axios.post('/common/upload/images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          imageArray = uploadResponse.data.imagePaths
        } catch (error) {
          console.error('업로드 실패:', error.response?.data)
        }
      }
      alert('저장되었습니다.')
      goBack()
    } else {
      alert(response.data.message)
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
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
  categoryType = []
  Object.keys(categoryFlags).forEach((key, index) => {
    if (categoryFlags[key]) {
      categoryType.push(index)
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* 주소 입력 영역 스타일 */
.address-section {
  margin-bottom: 20px;
}

.address-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 16px;
}

.address-full-row {
  margin-bottom: 16px;
  width: 100%;
}

.postcode-input {
  max-width: 200px;
}

.address-search-btn {
  margin-bottom: 2px;
  white-space: nowrap;
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

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.image-container {
  position: relative;
  height: 150px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
