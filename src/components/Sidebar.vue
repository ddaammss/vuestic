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
          <span>설정</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.settings }">expand_more</i>
        </a>
        <div v-show="openMenus.settings" class="sub-menu">
          <router-link to="/settings/terms" class="nav-link" active-class="active">이용약관</router-link>
          <router-link to="/settings/privacy" class="nav-link" active-class="active">개인정보 취급방침</router-link>
          <router-link to="/settings/refund" class="nav-link" active-class="active">환불 설정</router-link>
          <router-link to="/settings/coupon" class="nav-link" active-class="active">쿠폰 설정</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('stores')">
          <i class="material-icons">store</i>
          <span>입점사</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.stores }">expand_more</i>
        </a>
        <div v-show="openMenus.stores" class="sub-menu">
          <router-link to="/stores/list" class="nav-link" active-class="active">입점사 관리</router-link>
          <router-link to="/stores/register" class="nav-link" active-class="active">입점사 등록</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('members')">
          <i class="material-icons">people</i>
          <span>회원</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.members }">expand_more</i>
        </a>
        <div v-show="openMenus.members" class="sub-menu">
          <router-link to="/members/info" class="nav-link" active-class="active">회원 정보 관리</router-link>
          <router-link to="/members/points" class="nav-link" active-class="active">포인트 관리</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('reservations')">
          <i class="material-icons">event</i>
          <span>예약</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.reservations }">expand_more</i>
        </a>
        <div v-show="openMenus.reservations" class="sub-menu">
          <router-link to="/reservations/status" class="nav-link" active-class="active">예약 관리</router-link>
          <router-link to="/reservations/cancellation" class="nav-link" active-class="active">취소 관리</router-link>
        </div>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('events')">
          <i class="material-icons">celebration</i>
          <span>이벤트 </span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.events }">expand_more</i>
        </a>
        <div v-show="openMenus.events" class="sub-menu">
          <router-link to="/events/communication" class="nav-link" active-class="active">소통방</router-link>
          <router-link to="/events/banner" class="nav-link" active-class="active">배너 관리</router-link>
          <router-link to="/events/event" class="nav-link" active-class="active">이벤트 관리</router-link>
        </div>
      </div>

      <div class="nav-item">
        <router-link to="/sales" class="nav-link" active-class="active">
          <i class="material-icons">analytics</i>
          <span>매출</span>
        </router-link>
      </div>

      <div class="nav-item">
        <a class="nav-link" @click="toggleMenu('ads')">
          <i class="material-icons">campaign</i>
          <span>광고</span>
          <i class="material-icons expand-icon" :class="{ expanded: openMenus.ads }">expand_more</i>
        </a>
        <div v-show="openMenus.ads" class="sub-menu">
          <router-link to="/ads/requests" class="nav-link" active-class="active">광고 신청 현황</router-link>
          <router-link to="/ads/register" class="nav-link" active-class="active">광고 등록</router-link>
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
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  overflow-y: auto;
  height: 100vh;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #f39c12;
}

.subtitle {
  font-size: 14px;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.8);
}

.nav-menu {
  padding: 10px 0;
}

.nav-item {
  margin-bottom: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Active 상태 스타일 */
.nav-link.active {
  background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
  color: white;
  font-weight: 600;
  box-shadow: inset 3px 0 0 #f39c12;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #f39c12;
}

.nav-link .material-icons {
  margin-right: 12px;
  font-size: 20px;
}

.nav-link span {
  flex: 1;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.sub-menu {
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.sub-menu .nav-link {
  padding: 12px 20px 12px 52px;
  font-size: 14px;
}

.sub-menu .nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.sub-menu .nav-link.active {
  background: linear-gradient(90deg, rgba(52, 152, 219, 0.8) 0%, rgba(41, 128, 185, 0.8) 100%);
  color: white;
  font-weight: 500;
  box-shadow: inset 3px 0 0 #f39c12;
}
</style>
