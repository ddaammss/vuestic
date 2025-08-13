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
          <router-link to="/reservations/list" class="nav-link" active-class="active">예약 관리</router-link>
          <!-- <router-link to="/reservations/cancellation" class="nav-link" active-class="active">취소 관리</router-link> -->
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

<script setup>
import { ref } from 'vue'
//import '@/assets/styles/sidebar.css'
defineOptions({
  name: 'Sidebar'
})
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
</script>
