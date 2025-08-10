<template>
  <div class="admin-layout">
    <div class="layout-container">
      <Sidebar />
      <div class="content-wrapper">
        <Header />
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue'
import Sidebar from '@/components/common/Sidebar.vue'
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  display: flex;
  height: 100%;
  gap: 0;
  /* 간격 제거 */
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  /* 마진 제거 */
  padding: 0;
  /* 패딩 제거 */
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
  margin: 0;
  /* 마진 제거 */
}

/* Header - 사이드바 옆에서만 차지하도록 */
:deep(header),
:deep(.header) {
  height: 60px !important;
  background: white !important;
  border-bottom: 1px solid #e0e0e0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0 20px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  position: relative !important;
  flex-shrink: 0 !important;
  width: 100% !important;
  margin: 0 !important;
  /* 마진 제거 */
}

:deep(.header-left) {
  display: flex !important;
  align-items: center !important;
}

:deep(.header-left h1) {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #2c3e50 !important;
  margin: 0 !important;
}

:deep(.header-right) {
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
}

:deep(.current-time) {
  font-size: 14px !important;
  color: #666 !important;
  white-space: nowrap !important;
}

:deep(.user-info) {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  font-size: 14px !important;
  color: #2c3e50 !important;
}

:deep(.logout-btn) {
  background: #e74c3c !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  transition: background 0.3s ease !important;
}

:deep(.logout-btn:hover) {
  background: #c0392b !important;
}

/* Sidebar - 고정 너비, 전체 높이, 간격 제거 */
:deep(nav),
:deep(.sidebar) {
  width: 250px !important;
  min-width: 250px !important;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%) !important;
  color: white !important;
  overflow-y: auto !important;
  height: 100vh !important;
  flex-shrink: 0 !important;
  box-shadow: none !important;
  /* 그림자 제거로 간격 효과 제거 */
  margin: 0 !important;
  /* 마진 제거 */
  padding: 0 !important;
  /* 패딩 제거 */
  border-right: 1px solid #34495e !important;
  /* 경계선만 추가 */
}

:deep(.sidebar-header) {
  padding: 20px !important;
  text-align: center !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(0, 0, 0, 0.1) !important;
  margin: 0 !important;
  /* 마진 제거 */
}

:deep(.sidebar-header .logo) {
  font-size: 24px !important;
  font-weight: bold !important;
  margin-bottom: 5px !important;
  color: #f39c12 !important;
}

:deep(.sidebar-header .subtitle) {
  font-size: 14px !important;
  opacity: 0.8 !important;
  color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.nav-menu) {
  padding: 10px 0 !important;
  margin: 0 !important;
  /* 마진 제거 */
}

:deep(.nav-item) {
  margin-bottom: 2px !important;
}

:deep(.nav-link) {
  display: flex !important;
  align-items: center !important;
  padding: 15px 20px !important;
  color: rgba(255, 255, 255, 0.8) !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  margin: 0 !important;
  /* 마진 제거 */
}

:deep(.nav-link:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

:deep(.nav-link.router-link-active) {
  background: rgba(52, 152, 219, 0.8) !important;
  color: white !important;
}

:deep(.nav-link .material-icons) {
  margin-right: 12px !important;
  font-size: 20px !important;
}

:deep(.nav-link span) {
  flex: 1 !important;
}

:deep(.expand-icon) {
  margin-left: auto !important;
  transition: transform 0.3s ease !important;
}

:deep(.expand-icon.expanded) {
  transform: rotate(180deg) !important;
}

:deep(.sub-menu) {
  background: rgba(0, 0, 0, 0.1) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
  margin: 0 !important;
  /* 마진 제거 */
}

:deep(.sub-menu .nav-link) {
  padding: 12px 20px 12px 52px !important;
  font-size: 14px !important;
  margin: 0 !important;
  /* 마진 제거 */
}

:deep(.sub-menu .nav-link:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}
:global(body.modal-open) :deep(.header) {
  filter: blur(2px) !important;
}
</style>
