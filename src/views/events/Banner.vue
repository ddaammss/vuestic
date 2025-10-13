<template>
  <div>
    <div class="table-container">
      <div class="table-header">메인배너1 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="banner.mainName" label="메인배너명" />
        </div>
        <div class="detail-section">
          <div class="form-group">
            <div ref="quillEditor" style="height: 250px;"></div>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <va-input ref="fileInput" type="file" multiple accept="image/*" style="display: none"
            @change="mainHandleFileSelect" />
          <va-button icon="upload" @click="$refs.fileInput.$el.querySelector('input').click()" :loading="isUploading"
            preset="secondary"> 이미지 선택 </va-button>

          <div v-if="mainSelectedImages.length > 0" class="preview-grid mt-4">
            <va-card v-for="(image, index) in mainSelectedImages" :key="index" class="image-preview-card">
              <div class="image-container">
                <img :src="getImageUrl(image.url || image)" :alt="image.name || image" class="preview-image" />
                <va-button icon="close" size="small" color="danger" class="remove-button"
                  @click="mainRemoveImage(index)" />
              </div>

            </va-card>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="mainSave" icon="search">저장</va-button>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="table-container">
      <div class="table-header">메인배너2 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="banner.mainName2" label="메인배너명2" />
        </div>
        <div class="detail-section">
          <div class="form-group">
            <div ref="quillEditor2" style="height: 250px;"></div>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <va-input ref="fileInput" type="file" multiple accept="image/*" style="display: none"
            @change="mainHandleFileSelect2" />
          <va-button icon="upload" @click="$refs.fileInput.$el.querySelector('input').click()" :loading="isUploading"
            preset="secondary"> 이미지 선택 </va-button>

          <div v-if="mainSelectedImages2.length > 0" class="preview-grid mt-4">
            <va-card v-for="(image, index) in mainSelectedImages2" :key="index" class="image-preview-card">
              <div class="image-container">
                <img :src="getImageUrl(image.url || image)" :alt="image.name || image" class="preview-image" />
                <va-button icon="close" size="small" color="danger" class="remove-button"
                  @click="mainRemoveImage2(index)" />
              </div>

            </va-card>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="mainSave2" icon="search">저장</va-button>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="table-container">
      <div class="table-header">서브배너 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="banner.subName" label="서브배너명" />
        </div>
        <div class="detail-section">
          <div class="form-group">
            <div ref="quillEditor3" style="height: 250px;"></div>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <va-input ref="fileInput2" type="file" multiple accept="image/*" style="display: none"
            @change="subHandleFileSelect" />
          <va-button icon="upload" @click="$refs.fileInput2.$el.querySelector('input').click()" :loading="isUploading"
            preset="secondary"> 이미지 선택 </va-button>

          <div v-if="subSelectedImages.length > 0" class="preview-grid mt-4">
            <va-card v-for="(image, index) in subSelectedImages" :key="index" class="image-preview-card">
              <div class="image-container">
                <img :src="getImageUrl(image.url || image)" :alt="image.name || image" class="preview-image" />
                <va-button icon="close" size="small" color="danger" class="remove-button"
                  @click="subRemoveImage(index)" />
              </div>
            </va-card>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="subSave" icon="search">저장</va-button>
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
  await quilljsCall2()
  await quilljsCall3()
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

const quilljsCall2 = async () => {
  const link = document.createElement('link')
  link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  // JS 로드
  const script2 = document.createElement('script')
  script2.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js'
  script2.onload = () => {
    quill2 = new window.Quill(quillEditor2.value, {
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
    quill2.on('text-change', () => {
      banner.mainContent2 = quill2.root.innerHTML
    })

    // 기존 내용이 있다면 로드
    if (banner.mainContent2) {
      quill2.root.innerHTML = banner.mainContent2
    }
  }
  document.head.appendChild(script2)
}

const quilljsCall3 = async () => {
  const link = document.createElement('link')
  link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  // JS 로드
  const script3 = document.createElement('script')
  script3.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js'
  script3.onload = () => {
    quill3 = new window.Quill(quillEditor3.value, {
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
    quill3.on('text-change', () => {
      banner.subContent = quill3.root.innerHTML
    })

    // 기존 내용이 있다면 로드
    if (banner.subContent) {
      quill3.root.innerHTML = banner.subContent
    }
  }
  document.head.appendChild(script3)
}

const mainBanner = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)
    const response = await axios.post('/banner/main', params)

    Object.assign(banner, response.data.data)
    mainSelectedImages.value = banner.mainImages;
    mainSelectedImages2.value = banner.mainImages2;
    subSelectedImages.value = banner.subImages;
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
const mainSelectedImages2 = ref([])
const subSelectedImages = ref([])
const isUploading = ref(false)
const quillEditor = ref(null)
const quillEditor2 = ref(null)
const quillEditor3 = ref(null)
let quill = null
let quill2 = null
let quill3 = null

const banner = reactive({
  mainName: '',
  mainName2: '',
  subName: '',
  mainSelectedImages: [],
  mainSelectedImages2: [],
  subSelectedImages: [],
  mainContent: '',
  mainContent2: '',
  subContent: '',
  type: ''
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

    if (mainSelectedImages.value.length === 0) {
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
        } else {
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
      name: banner.mainName,
      content: banner.mainContent,
      type: 0,
    }
    //console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/banner/update', saveData)

    if (response.data.code === 200) {
      alert('저장되었습니다.')
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
    loading.value = false;
    mainBanner();
  }
}

const mainHandleFileSelect2 = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        mainSelectedImages2.value.push({
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
const mainRemoveImage2 = (index) => {
  mainSelectedImages2.value.splice(index, 1)
}

const mainSave2 = async () => {
  try {
    if (!banner.mainName2) {
      alert('메인배너명2를 입력해주세요.')
      return;
    }

    if (mainSelectedImages2.value.length === 0) {
      alert('이미지는 1개 이상 등록해야합니다.')
      return
    }

    let imageArray = [];
    const formData = new FormData();
    if (mainSelectedImages2.value.length > 0) {
      mainSelectedImages2.value.forEach((item, index) => {
        const actualFile = item.file || item;
        if (actualFile instanceof File) {
          formData.append('images', actualFile);
        } else {
          formData.append('dbImages', actualFile);
        }
      });
      formData.append('type', 'mainBanner2');
      formData.append('parentSeq', banner.mainSeq2);
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
      seq : banner.mainSeq2,
      name: banner.mainName2,
      content: banner.mainContent2,
      type: 2,
    }
    //console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/banner/update', saveData)

    if (response.data.code === 200) {
      alert('저장되었습니다.')
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
    loading.value = false;
    mainBanner();
  }
}

const subHandleFileSelect = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        subSelectedImages.value.push({
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
const subRemoveImage = (index) => {
  subSelectedImages.value.splice(index, 1)
}

const subSave = async () => {
  try {
    if (!banner.subName) {
      alert('서브배너명을 입력해주세요.')
      return;
    }

    if (subSelectedImages.value.length === 0) {
      alert('이미지는 1개 이상 등록해야합니다.')
      return
    }

    let imageArray = [];
    const formData = new FormData();
    if (subSelectedImages.value.length > 0) {
      subSelectedImages.value.forEach((item, index) => {
        const actualFile = item.file || item;
        if (actualFile instanceof File) {
          formData.append('images', actualFile);
        } else {
          formData.append('dbImages', actualFile);
        }
      });
      formData.append('type', 'subBanner');
      formData.append('parentSeq', banner.subSeq);
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
      seq: banner.subSeq,
      name: banner.subName,
      content: banner.subContent,
      type: 1,
    }
    console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/banner/update', saveData)

    if (response.data.code === 200) {
      alert('저장되었습니다.')
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
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
