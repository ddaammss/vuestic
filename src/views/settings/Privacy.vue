<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      <va-progress-circle indeterminate size="large" />
    </div>
    <div class="table-container">
      <div class="table-header">개인정보 취급방침 관리</div>
      <div class="search-form">
        <form @submit.prevent="save">
          <div class="form-group">
            <div ref="quillEditor" style="height: 400px;"></div>
          </div>
          <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <va-button @click="save" icon="save">저장</va-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const quillEditor = ref(null)
const content = ref('')
let quill = null
const loading = ref(false)

onMounted(() => {
  quilljsCall()
  fetDetail()
})

// CSS 로드
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
      content.value = quill.root.innerHTML
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
            content.value = quill.root.innerHTML
          }
          reader.readAsDataURL(file)
        }
      }
    })

    // 기존 내용이 있다면 로드
    if (content.value) {
      quill.root.innerHTML = content.value
    }
  }
  document.head.appendChild(script)
}

const fetDetail = async () => {
  loading.value = true
  try {
    // axios는 기본적으로 JSON을 처리하므로 헤더 생략 가능
    const response = await axios.post('/settings/privacy/detail', {
      type: 'privacy'
    })
    if (quill && response.data.data.content) {
      quill.root.innerHTML = response.data.data.content
      content.value = response.data.data.content
    }

  } catch (error) {
    console.error('API 에러:', error)
  } finally {
    loading.value = false
  }
}

const save = async () => {
  try {

    if (quill) {
      content.value = quill.root.innerHTML
    }

    const saveData = {
      type: 'privacy',
      content: content.value
    }
    console.log('저장할 데이터:', saveData)
    const response = await axios.post('/settings/privacy/upsert', saveData)
    if (response.data.code === 200) {
      alert('저장되었습니다.')
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장 중 오류가 발생했습니다.')
  }
}
</script>
