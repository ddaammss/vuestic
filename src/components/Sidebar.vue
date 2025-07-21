<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <div class="logo">사주나라</div>
      <div class="subtitle">관리자</div>
    </div>

    <div class="nav-menu">
      <div class="nav-item">
        <router-link to="/" class="nav-link" exact-active-class="active">
          <i class="material-icons">dashboard</i>
          <span>HOME</span>
        </router-link>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('settings')">
          <i class="material-icons">settings</i>
          <span>설정관리</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.settings }">expand_more</i>
        </a>
        <div v-show="openMenus.settings" class="sub-menu">
          <router-link to="/settings/terms" class="nav-link">이용약관</router-link>
          <router-link to="/settings/privacy" class="nav-link">개인정보 취급방침</router-link>
          <router-link to="/settings/refund" class="nav-link">환불 설정</router-link>
          <router-link to="/settings/coupon" class="nav-link">쿠폰 설정</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('stores')">
          <i class="material-icons">store</i>
          <span>입점사관리</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.stores }">expand_more</i>
        </a>
        <div v-show="openMenus.stores" class="sub-menu">
          <router-link to="/stores/list" class="nav-link">입점사 관리</router-link>
          <router-link to="/stores/register" class="nav-link">입점사 등록</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('members')">
          <i class="material-icons">people</i>
          <span>회원관리</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.members }">expand_more</i>
        </a>
        <div v-show="openMenus.members" class="sub-menu">
          <router-link to="/members/info" class="nav-link">회원정보관리</router-link>
          <router-link to="/members/points" class="nav-link">포인트관리</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('reservations')">
          <i class="material-icons">event</i>
          <span>예약관리</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.reservations }">expand_more</i>
        </a>
        <div v-show="openMenus.reservations" class="sub-menu">
          <router-link to="/reservations/status" class="nav-link">예약현황</router-link>
          <router-link to="/reservations/cancellation" class="nav-link">취소관리</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('events')">
          <i class="material-icons">celebration</i>
          <span>이벤트 관리</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.events }">expand_more</i>
        </a>
        <div v-show="openMenus.events" class="sub-menu">
          <router-link to="/events/communication" class="nav-link">소통방</router-link>
          <router-link to="/events/banner" class="nav-link">배너 관리</router-link>
          <router-link to="/events/event" class="nav-link">이벤트 관리</router-link>
        </div>
      </div>

      <div class="nav-item">
        <router-link to="/sales" class="nav-link">
          <i class="material-icons">analytics</i>
          <span>매출 관리</span>
        </router-link>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('ads')">
          <i class="material-icons">campaign</i>
          <span>광고 관리</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.ads }">expand_more</i>
        </a>
        <div v-show="openMenus.ads" class="sub-menu">
          <router-link to="/ads/requests" class="nav-link">광고 신청 현황</router-link>
          <router-link to="/ads/register" class="nav-link">광고 등록</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Sidebar',
  setup() {
    const openMenus = ref({
      settings: false,
      stores: false,
      members: false,
      reservations: false,
      events: false,
      ads: false
    })

    const toggleMenu = (menu) => {
      openMenus.value[menu] = !openMenus.value[menu]
    }

    return {
      openMenus,
      toggleMenu
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #fbbf24;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.nav-menu {
  padding: 20px 0;
}

.nav-item {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.nav-link:hover,
.nav-link.active,
.nav-link.router-link-exact-active {
  background: rgba(255, 255, 255, 0.1);
  color: #fbbf24;
  border-right: 3px solid #fbbf24;
}

.nav-link i {
  margin-right: 12px;
  font-size: 20px;
}

.expand-icon {
  margin-left: auto !important;
  margin-right: 0 !important;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.sub-menu {
  background: rgba(0, 0, 0, 0.2);
  padding-left: 40px;
}

.sub-menu .nav-link {
  padding: 8px 20px;
  font-size: 14px;
}

.sub-menu .nav-link i {
  display: none;
}
</style>
