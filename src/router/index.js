import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { title: "HOME" },
  },
  {
    path: "/stores/list",
    name: "StoreList",
    component: () => import("@/views/StoreManagement/StoreList.vue"),
    meta: { title: "입점사 관리" },
  },
  {
    path: "/stores/register",
    name: "StoreRegister",
    component: () => import("@/views/StoreManagement/StoreRegister.vue"),
    meta: { title: "입점사 등록" },
  },
  {
    path: "/reservations/status",
    name: "ReservationStatus",
    component: () => import("@/views/ReservationManagement/ReservationStatus.vue"),
    meta: { title: "예약현황" },
  },
  {
    path: "/reservations/cancellation",
    name: "Cancellation",
    component: () => import("@/views/ReservationManagement/Cancellation.vue"),
    meta: { title: "취소관리" },
  },
  {
    path: "/members/info",
    name: "MemberInfo",
    component: () => import("@/views/MemberManagement/MemberInfo.vue"),
    meta: { title: "회원정보관리" },
  },
  {
    path: "/members/points",
    name: "PointManagement",
    component: () => import("@/views/MemberManagement/PointManagement.vue"),
    meta: { title: "포인트관리" },
  },
  {
    path: "/settings/terms",
    name: "Terms",
    component: () => import("@/views/Settings/Terms.vue"),
    meta: { title: "이용약관" },
  },
  {
    path: "/settings/privacy",
    name: "Privacy",
    component: () => import("@/views/Settings/Privacy.vue"),
    meta: { title: "개인정보 취급방침" },
  },
  {
    path: "/settings/refund",
    name: "Refund",
    component: () => import("@/views/Settings/Refund.vue"),
    meta: { title: "환불 설정" },
  },
  {
    path: "/settings/coupon",
    name: "Coupon",
    component: () => import("@/views/Settings/Coupon.vue"),
    meta: { title: "쿠폰 설정" },
  },
  {
    path: "/events/communication",
    name: "Communication",
    component: () => import("@/views/EventManagement/Communication.vue"),
    meta: { title: "소통방" },
  },
  {
    path: "/events/banner",
    name: "Banner",
    component: () => import("@/views/EventManagement/Banner.vue"),
    meta: { title: "배너 관리" },
  },
  {
    path: "/events/event",
    name: "Event",
    component: () => import("@/views/EventManagement/Event.vue"),
    meta: { title: "이벤트 관리" },
  },
  {
    path: "/sales",
    name: "Sales",
    component: () => import("@/views/Sales.vue"),
    meta: { title: "매출 관리" },
  },
  {
    path: "/ads/requests",
    name: "AdRequests",
    component: () => import("@/views/AdManagement/AdRequests.vue"),
    meta: { title: "광고 신청 현황" },
  },
  {
    path: "/ads/register",
    name: "AdRegister",
    component: () => import("@/views/AdManagement/AdRegister.vue"),
    meta: { title: "광고 등록" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
