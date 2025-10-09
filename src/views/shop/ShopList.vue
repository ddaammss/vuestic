<template>
  <div>
    <div class="table-container">
      <div class="table-header">쇼핑몰 상품 관리</div>
      <div class="search-form">
        <div class="form-grid">
          <va-input v-model="shop.name" label="상품명" />
          <va-input v-model="shop.price" label="가격" />
        </div>

        <div style="margin: 20px 0;">
          <va-input ref="fileInput" type="file" multiple accept="image/*" style="display: none" @change="handleFileSelect" />
          <va-button v-if="selectedImages <= 1" icon="upload" @click="$refs.fileInput.$el.querySelector('input').click()" :loading="isUploading" preset="secondary"> 이미지 선택 </va-button>

          <div v-if="selectedImages.length > 0" class="preview-grid mt-4">
            <va-card v-for="(image, index) in selectedImages" :key="index" class="image-preview-card">
              <div class="image-container">
                <img :src="getImageUrl(image.url || image)" :alt="image.name" class="preview-image" />
                <va-button icon="close" size="small" color="danger" class="remove-button" @click="removeImage(index)" />
              </div>
            </va-card>
          </div>
        </div>

        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button @click="save" icon="search">저장</va-button>
        </div>
      </div>

      <div class="no-selection">
        <va-alert v-if="selectedItems.length <= 0" color="info">
          총 {{ totalCount }} 개입니다
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
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { formatDateForAPI } from '@/utils/formatters'
import { getImageUrl } from '@/utils/imageHelper';
import Pagination from '@/components/common/Pagination.vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

onMounted(() => {
  fetList()
})

const fetList = async () => {
  try {
    loading.value = true
    const params = getSearchParams()
    //console.log('API 호출 파라미터:', params)
    const response = await axios.post('/shop/list', params)
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

const goDetail = (rowData) => {

  const seq = rowData.row.rowData.seq
  router.push({
    name: 'ShopDetail',
    params: { seq: seq },

  })
}

const deleteSelectedItem = async () => {
  selectedItems.value.forEach(item => {
    deleteItems.value.push(item.seq)
  })

  if (!confirm(`${deleteItems.value.length}개 항목을 삭제하시겠습니까?`)) {
    return
  }
  try {
    const deleteData = {
      seqList: deleteItems.value
    }
    const response = await axios.post('/shop/delete', deleteData)
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

const shop = reactive({
})

const columns = ref([
  { key: 'createdAt', label: '등록일' },
  { key: 'name', label: '상품명' },
  { key: 'price', label: '가격' },
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

const save = async () => {

  try {
    if (!shop.name) {
      alert('상품명을 입력해주세요.')
      return;
    }
    if (!shop.price) {
      alert('가격을 입력해주세요.')
      return;
    }
    if(selectedImages.value.length === 0){
      alert('이미지는 1개 이상 등록해야합니다.')
      return
    }

    let imageArray = [];
    const formData = new FormData();
    const saveData = {
      ...shop,
    }
    //console.log('저장할 데이터:', saveData)
    loading.value = true
    const response = await axios.post('/shop/insert', saveData)
    if (response.data.code === 200) {

      if (selectedImages.value.length > 0) {
        selectedImages.value.forEach((item, index) => {
          const actualFile = item.file || item;
          if (actualFile instanceof File) {
            formData.append('images', actualFile);
          }else{
            formData.append('dbImages', actualFile);
          }
        });
        formData.append('type', 'shop');
        formData.append('parentSeq', response.data.data);
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
      alert('저장되었습니다.')
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally{
    loading.value = false;
    fetList();
    shop.name = '',
    shop.price =  '',
    selectedImages.value.splice(0, selectedImages.value.length)
  }
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
