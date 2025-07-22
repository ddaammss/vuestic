<template>
  <div>
    <h1 class="page-title">이용약관</h1>
    <div class="form-container">
      <div style="margin-bottom: 20px;">
        <p>수정 후 반드시 '저장' 버튼을 눌러 주셔야 정상적으로 저장이 됩니다.</p>
      </div>

      <form @submit.prevent="saveTerms">
        <div class="form-group">
          <div ref="editorContainer"></div>
        </div>

        <!-- <div class="btn-group" style="margin-top: 20px;">
          <va-button type="submit">확인</va-button>
          <va-button preset="secondary" @click="$router.push('/')">홈으로</va-button>
        </div> -->
        <div class="btn-group" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <va-button type="submit">저장</va-button>
          <va-button preset="secondary" @click="$router.push('/')" style="margin-left: 10px;">홈으로</va-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'Terms',
  setup() {
    const editorContainer = ref(null);
    const terms = ref('이용약관 내용을 입력하세요...');
    let editor = null;

    onMounted(async () => {
      // CDN에서 CKEditor 스크립트 로드
      const script = document.createElement('script');
      script.src = 'https://cdn.ckeditor.com/ckeditor5/36.0.0/classic/ckeditor.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // CKEditor 초기화
        window.ClassicEditor
          .create(editorContainer.value, {
            toolbar: [
              'heading', '|',
              'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
              'indent', 'outdent', '|',
              'blockQuote', 'insertTable', 'undo', 'redo'
            ],
          })
          .then(editorInstance => {
            editor = editorInstance;
            //editor.setData(terms.value);

            // 내용 변경 시 terms 업데이트
            editor.model.document.on('change:data', () => {
              terms.value = editor.getData();
            });
          })
          .catch(error => {
            console.error(error);
          });
      };
    });

    onBeforeUnmount(() => {
      // 컴포넌트 제거 시 에디터 인스턴스 제거
      if (editor) {
        editor.destroy();
      }
    });

    const saveTerms = () => {
      // 현재 에디터 내용 가져오기
      if (editor) {
        terms.value = editor.getData();
      }

      console.log('이용약관 저장:', terms.value);
      alert('이용약관이 저장되었습니다.');
    };

    return {
      terms,
      saveTerms,
      editorContainer
    };
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

/* CKEditor 높이 조정 */
:deep(.ck-editor__editable_inline) {
  min-height: 400px;
  max-height: 600px;
}
</style>
