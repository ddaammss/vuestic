<template>
  <div>
    <div class="table-container">
      <div class="table-header">메인배너 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="banner.mainName" label="이벤트명" />
        </div>
        <div class="detail-section">
          <div class="form-group">
            <div ref="quillEditor" style="height: 250px;"></div>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <va-input ref="fileInput" type="file" multiple accept="image/*" style="display: none" @change="mainHandleFileSelect" />
          <va-button icon="upload" @click="$refs.fileInput.$el.querySelector('input').click()" :loading="isUploading"
            preset="secondary"> 이미지 선택 </va-button>

          <div v-if="mainSelectedImages.length > 0" class="preview-grid mt-4">
            <va-card v-for="(image, index) in mainSelectedImages" :key="index" class="image-preview-card">
              <div class="image-container">
                <img :src="getImageUrl(image.url || image)" :alt="image.name || image" class="preview-image" />
                <va-button icon="close" size="small" color="danger" class="remove-button" @click="mainRemoveImage(index)" />
              </div>
              <va-card-content>
                <div class="text-sm">{{ image.name || image }}</div>
              </va-card-content>
            </va-card>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="mainSave" icon="search">저장</va-button>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { getImageUrl } from '@/utils/imageHelper';
import axios from 'axios'

onMounted(async () => {
  await mainBanner()
  await quilljsCall()
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
          ['link'],
          ['clean']
        ]
      }
    })

    // 🔥 핵심: 내용 변경 감지 이벤트 추가
    quill.on('text-change', () => {
      banner.mainContent = quill.root.innerHTML
    })

    // 기존 내용이 있다면 로드
    if (banner.mainContent) {
      quill.root.innerHTML = banner.mainContent
    }
  }
  document.head.appendChild(script)
}

const mainBanner = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)
    const response = await axios.post('/banner/main', params)

    Object.assign(banner, response.data.data)
    mainSelectedImages.value = banner.images;
  } catch (error) {
    console.error('API 에러:', error)
  } finally {
    loading.value = false
  }
}
const getSearchParams = () => {
  return {
    page: 1,
    pageSize: 10,
  }
}

const loading = ref(false)
const mainSelectedImages = ref([])
const isUploading = ref(false)
const quillEditor = ref(null)
let quill = null

const banner = reactive({
  mainName: '',
  subName:'',
  mainSelectedImages: [],
  subSelectedImages: [],
  mainContent: '',
  subContent: '',
  type : ''
})

const mainHandleFileSelect = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        mainSelectedImages.value.push({
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
const mainRemoveImage = (index) => {
  mainSelectedImages.value.splice(index, 1)
}

const mainSave = async () => {
  try {
    if (!banner.mainName) {
      alert('메인배너명을 입력해주세요.')
      return;
    }

    if(mainSelectedImages.value.length === 0){
      alert('이미지는 1개 이상 등록해야합니다.')
      return
    }

    let imageArray = [];
    const formData = new FormData();
    if (mainSelectedImages.value.length > 0) {
        mainSelectedImages.value.forEach((item, index) => {
          const actualFile = item.file || item;
          if (actualFile instanceof File) {
            formData.append('images', actualFile);
          }else{
            formData.append('dbImages', actualFile);
          }
        });
        formData.append('type', 'mainBanner');
        formData.append('parentSeq', banner.seq);
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
      ...banner,
      type : 0,
    }
    console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/banner/mainUpdate', saveData)

    if (response.data.code === 200) {
      alert('저장되었습니다.')
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally{
    loading.value = false;
    mainBanner();
  }
}
</script>

<style scope>
.filter-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.filter-section {
  flex: 1;
}

.filter-label {
  font-weight: bold;
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
