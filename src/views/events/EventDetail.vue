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
        </div>
        <div class="form-grid">

          <va-input v-model="detail.eventName" label="이벤트명" :rules="[value => !!value || '이벤트명은 필수입니다.']" />
          <va-date-input v-model="detail.startDate" label="이벤트 시작일" />
          <va-date-input v-model="detail.endDate" label="이벤트 종료일" />
        </div>

        <label for="quill1" class="form-label">이벤트 설명</label>
        <div class="form-group">
          <div ref="quillEditor" style="height: 200px;"></div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-header">
          <h3>이미지 관리</h3>
        </div>
        <va-input ref="fileInput" type="file" multiple accept="image/*" style="display: none"
          @change="handleFileSelect" />
        <va-button icon="upload" @click="$refs.fileInput.$el.querySelector('input').click()" :loading="isUploading"
          preset="secondary"> 이미지 선택 </va-button>
        <div v-if="selectedImages.length > 0" class="preview-grid mt-4">
          <va-card v-for="(image, index) in selectedImages" :key="index" class="image-preview-card">
            <div class="image-container">
              <img :src="getImageUrl(image.url || image)" :alt="image.name || image" class="preview-image" />
              <va-button icon="close" size="small" color="danger" class="remove-button" @click="removeImage(index)" />
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
import { ref, onMounted, reactive, computed, readonly, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateForAPI } from '@/utils/formatters'
import { getImageUrl } from '@/utils/imageHelper';
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rowData = route.params.seq
const quillEditor = ref(null)
let quill = null

const selectedImages = ref([])
const isUploading = ref(false)
const fileInput = ref(null)

onMounted(async () => {
  await fetchDetail(rowData)
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
          //['link', 'image'],
          ['link'],
          ['clean']
        ]
      }
    })

    // 🔥 핵심: 내용 변경 감지 이벤트 추가
    quill.on('text-change', () => {
      detail.content = quill.root.innerHTML
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
            detail.content = quill.root.innerHTML
          }
          reader.readAsDataURL(file)
        }
      }
    })

    // 기존 내용이 있다면 로드
    if (detail.content) {
      quill.root.innerHTML = detail.content
    }
  }
  document.head.appendChild(script)
}


const fetchDetail = async (data) => {
  loading.value = true
  try {
    const response = await axios.post('/event/detail', {
      seq: data,
    })
    Object.assign(detail, response.data.data)
    selectedImages.value = detail.images;
    //console.log(detail)

  } catch (error) {
    console.error('상세 조회 에러:', error)
  } finally {
    loading.value = false;
  }
}

const detail = reactive({})

//------------------------------------------------------------------------------------------------- 이미지 처리 함수
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

// 이미지 제거
const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const save = async () => {

  try {
    if (!detail.eventName) {
      alert('이벤트 명을 입력해주세요.')
      return;
    }

    if (selectedImages.value.length === 0) {
      alert('이미지는 1개 이상 등록해야합니다.')
      return
    }

    let imageArray = [];
    const formData = new FormData();
    if (selectedImages.value.length > 0) {
      selectedImages.value.forEach((item, index) => {
        const actualFile = item.file || item;
        if (actualFile instanceof File) {
          formData.append('images', actualFile);
        } else {
          formData.append('dbImages', actualFile);
        }
      });
      formData.append('type', 'event');
      formData.append('parentSeq', detail.seq);

      // 서버로 전송
      try {
        const uploadResponse = await axios.post('/common/upload/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageArray = uploadResponse.data.imagePaths; // 서버에서 반환한 경로들
      } catch (error) {
        console.error('업로드 실패:', error.response?.data);
      }
    }
    const saveData = {
      ...detail,
      seq: detail.seq,
      startDate: formatDateForAPI(new Date(detail.startDate)),
      endDate: formatDateForAPI(new Date(detail.endDate)),
      images: imageArray,
    }

    //console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/event/update', saveData)
    if (response.data.code === 200) {
      alert('저장되었습니다.')
      goBack()
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
    loading.value = false;
  }
}

const goBack = () => {
  router.push({
    path: '/events/event/list',
  })
}
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
