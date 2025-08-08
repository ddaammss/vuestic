<template>
  <!-- Custom Pagination Controls -->
  <div class="pagination-container">
    <div class="pagination-info">
      <!-- {{ paginationInfo }} -->
    </div>

    <div class="pagination-controls">
      <!-- 페이지당 항목 수 선택 -->
      <!-- <div class="per-page-selector">
            <span>페이지당 표시: </span>
            <va-select v-model="pageSize" :options="pageSizeOptions" @update:model-value="onPageSizeChange"
              style="width: 80px;" />
          </div> -->

      <!-- 페이지 버튼들 -->
      <div class="pagination-buttons">
        <va-button @click="goToPage(1)" :disabled="currentPage === 1" preset="secondary" size="small">
          처음
        </va-button>
        <va-button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" preset="secondary" size="small">
          이전
        </va-button>
        <va-button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
          :preset="page === currentPage ? 'primary' : 'secondary'" size="small" class="page-number-btn">
          {{ page }}
        </va-button>
        <va-button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPage" preset="secondary"
          size="small">
          다음
        </va-button>
        <va-button @click="goToPage(totalPage)" :disabled="currentPage === totalPage" preset="secondary" size="small">
          마지막
        </va-button>
      </div>

      <!-- 페이지 점프 -->
      <div class="page-jump">
        <!-- <span>페이지: </span>
            <va-input v-model.number="jumpPage" @keyup.enter="jumpToPage" type="number" :min="1" :max="totalPages"
              style="width: 60px;" size="small" />
            <va-button @click="jumpToPage" size="small" preset="secondary">
              이동
            </va-button> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

// Props 정의
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPage: {
    type: Number,
    required: true
  }
})

// Events 정의
const emit = defineEmits(['page-change'])

// 표시할 페이지 번호들
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const total = props.totalPage

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(total, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPage) {
    emit('page-change', page)
  }
}
</script>
