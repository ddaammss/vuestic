<template>
  <div>
    <div class="table-container">
      <div class="table-header">이벤트 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="event.name" label="이벤트명" />
          <va-date-input v-model="event.startDate" label="시작일" placeholder="시작일 선택" />
          <va-date-input v-model="event.endDate" label="종료일" placeholder="종료일 선택" />

        </div>

        <!-- <div class="filter-row">
          <div class="filter-section">
            <label class="filter-label">분야</label>
            <div class="checkbox-group">
              <va-checkbox v-model="search.categoryType" array-value="0" label="신점" />
              <va-checkbox v-model="search.categoryType" array-value="1" label="철학관" />
              <va-checkbox v-model="search.categoryType" array-value="2" label="타로" />
              <va-checkbox v-model="search.categoryType" array-value="3" label="굿당" />
              <va-checkbox v-model="search.categoryType" array-value="4" label="기도터" />
              <va-checkbox v-model="search.categoryType" array-value="5" label="사찰" />
            </div>
          </div>
          <div class="filter-section">
            <label class="filter-label">예약 상태</label>
            <div class="radio-group">
              <va-radio v-model="search.reservationType" option="전체" label="전체" />
              <va-radio v-model="search.reservationType" option="0" label="예약대기" />
              <va-radio v-model="search.reservationType" option="1" label="예약확정" />
              <va-radio v-model="search.reservationType" option="2" label="예약취소" />
            </div>
          </div>

          <div class="filter-section">
            <label class="filter-label">결제 여부</label>
            <div class="checkbox-group">
              <va-checkbox v-model="search.resultType" array-value="0" label="미결제" />
              <va-checkbox v-model="search.resultType" array-value="1" label="결제완료" />
            </div>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchList" icon="search">검색</va-button>
          <va-button @click="resetSearch" icon="">초기화</va-button>
        </div> -->
        <div class="detail-section">
          <div class="form-group">
            <div ref="quillEditor" style="height: 100px;"></div>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <va-input ref="fileInput" type="file" multiple accept="image/*" style="display: none" @change="handleFileSelect" />
          <va-button icon="upload" @click="$refs.fileInput.$el.querySelector('input').click()" :loading="isUploading"
            preset="secondary"> 이미지 선택 </va-button>

          <div v-if="selectedImages.length > 0" class="preview-grid mt-4">
            <va-card v-for="(image, index) in selectedImages" :key="index" class="image-preview-card">
              <div class="image-container">
                <img :src="image.url" :alt="image.name" class="preview-image" />
                <va-button icon="close" size="small" color="danger" class="remove-button" @click="removeImage(index)" />
              </div>
              <va-card-content>
                <div class="text-sm">{{ image.name }}</div>
              </va-card-content>
            </va-card>
          </div>
        </div>

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="searchList" icon="search">저장</va-button>
        </div>
      </div>

      <div class="no-selection">
        <va-alert v-if="selectedItems.length <= 0" color="info">
          총 {{ totalCount }}개
        </va-alert>
        <va-alert v-else color="danger">
          <va-icon :size="15" name="delete" style="cursor: pointer;" @click="deleteSelectedItem"></va-icon>
        </va-alert>
      </div>

      <va-data-table v-model="selectedItems" :items="list" :columns="columns" :loading="loading"
        no-data-html="🔍 검색 결과가 없습니다." selectable hoverable striped sticky-header @row:click="goDetail" clickable>
      </va-data-table>
      <Pagination :current-page="currentPage" :total-page="totalPage" @page-change="handlePageChange"></Pagination>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { formatDateForAPI } from '@/utils/formatters'
import Pagination from '@/components/common/Pagination.vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

onMounted(() => {
  fetList()
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
          // ['link', 'image'],
          ['link'],
          ['clean']
        ]
      }
    })

    // 🔥 핵심: 내용 변경 감지 이벤트 추가
    quill.on('text-change', () => {
      event.content = quill.root.innerHTML
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
            event.content = quill.root.innerHTML
          }
          reader.readAsDataURL(file)
        }
      }
    })

    // 기존 내용이 있다면 로드
    if (event.content) {
      quill.root.innerHTML = event.content
    }
  }
  document.head.appendChild(script)
}

const fetList = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)
    const response = await axios.post('/reservation/list', params)
    list.value = response.data.data || []
    totalPage.value = response.data.totalPage
    totalCount.value = response.data.totalCount

  } catch (error) {
    console.error('API 에러:', error)
    list.value = []
  } finally {
    loading.value = false
  }
}
const getSearchParams = () => {
  return {
    page: currentPage.value,
    pageSize: pageSize.value,
  }
}

const searchList = () => {
  if (search.value.startDate && search.value.endDate) {
    const startDate = new Date(search.value.startDate)
    const endDate = new Date(search.value.endDate)
    if (search.value.type2 != '전체') {
      if (startDate > endDate) {
        alert('시작일이 종료일보다 늦을 수 없습니다.')
        return
      }
    }
  }

  currentPage.value = 1
  selectedItems.value = []
  fetList()
}

const goDetail = (rowData) => {
  const reservationCode = rowData.row.cells[0].value

  router.push({
    name: 'ReservationDetail',
    params: { reservationCode: reservationCode },
    query: {
      name: search.value.name,
      startDate: search.value.startDate,
      endDate: search.value.endDate,

    }
  })
}

const deleteSelectedItem = async () => {
  selectedItems.value.forEach(item => {
    deleteItems.value.push(item.reservationCode)
  })

  if (!confirm(`${deleteItems.value.length}개 항목을 삭제하시겠습니까?`)) {
    return
  }
  try {
    const deleteData = {
      reservationCodeList: deleteItems.value
    }
    const response = await axios.post('/reservation/delete', deleteData)
    if (response.data.code === 200) {
      alert('삭제되었습니다.')
      selectedItems.value.length = 0;
      fetList();
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('삭제 에러:', error)
    alert('삭제 중 오류가 발생했습니다.')
  }
}


const route = useRoute()
const router = useRouter()
const loading = ref(false)
const selectedItems = ref([])
const deleteItems = ref([])
const list = ref([])
const currentPage = ref(1)
const totalCount = ref(0)
const totalPage = ref(1)
const pageSize = ref(10)
const selectedImages = ref([])
const isUploading = ref(false)
const quillEditor = ref(null)
let quill = null

const event = ref({
  name: '',
  startDate: null,
  endDate: null,
  selectedImages: '',
  content: ''
})

const columns = ref([
  { key: 'createdAt', label: '등록일' },
  { key: 'eventName', label: '이벤트명' },
  { key: 'eventDate', label: '이벤트 기간' },
])

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

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  currentPage.value = page
  fetList()
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
