import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */
        '@/views/Dashboard.vue'
      )
  },
  {
    path: '/stores/list',
    name: 'StoreList',
    component: () =>
      import(
        /* webpackChunkName: "store-management" */
        '@/views/StoreManagement/StoreList.vue'
      )
  },
  {
    path: '/stores/register',
    name: 'StoreRegister',
    component: () =>
      import(
        /* webpackChunkName: "store-management" */
        '@/views/StoreManagement/StoreRegister.vue'
      )
  },
  {
    path: '/reservations/status',
    name: 'ReservationStatus',
    component: () =>
      import(
        /* webpackChunkName: "reservations-management" */
        '@/views/ReservationManagement/ReservationStatus.vue'
      )
  },
  {
    path: '/reservations/cancellation',
    name: 'Cancellation',
    component: () =>
      import(
        /* webpackChunkName: "reservations-management" */
        '@/views/ReservationManagement/Cancellation.vue'
      )
  },
  {
    path: '/members/info',
    name: 'MemberInfo',
    component: () =>
      import(
        /* webpackChunkName: "members-management" */
        '@/views/MemberManagement/MemberInfo.vue'
      )
  },
  {
    path: '/members/points',
    name: 'PointManagement',
    component: () =>
      import(
        /* webpackChunkName: "members-management" */
        '@/views/MemberManagement/PointManagement.vue'
      )
  },
  {
    path: '/settings/terms',
    name: 'Terms',
    component: () =>
      import(
        /* webpackChunkName: "settings-management" */
        '@/views/Settings/Terms.vue'
      )
  },
  {
    path: '/settings/privacy',
    name: 'Privacy',
    component: () =>
      import(
        /* webpackChunkName: "settings-management" */
        '@/views/Settings/Privacy.vue'
      )
  },
  {
    path: '/settings/refund',
    name: 'Refund',
    component: () =>
      import(
        /* webpackChunkName: "settings-management" */
        '@/views/Settings/Refund.vue'
      )
  },
  {
    path: '/settings/coupon',
    name: 'Coupon',
    component: () =>
      import(
        /* webpackChunkName: "settings-management" */
        '@/views/Settings/Coupon.vue'
      )
  },
  {
    path: '/events/communication',
    name: 'Communication',
    component: () =>
      import(
        /* webpackChunkName: "events-management" */
        '@/views/EventManagement/Communication.vue'
      )
  },
  {
    path: '/events/banner',
    name: 'Banner',
    component: () =>
      import(
        /* webpackChunkName: "events-management" */
        '@/views/EventManagement/Banner.vue'
      )
  },
  {
    path: '/events/event',
    name: 'Event',
    component: () =>
      import(
        /* webpackChunkName: "events-management" */
        '@/views/EventManagement/Event.vue'
      )
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () =>
      import(
        /* webpackChunkName: "sales-management" */
        '@/views/Sales.vue/'
      )
  },
  {
    path: '/ads/requests',
    name: 'AdRequests',
    component: () =>
      import(
        /* webpackChunkName: "ads-management" */
        '@/views/AdManagement/AdRequests.vue/'
      )
  },
  {
    path: '/ads/register',
    name: 'AdRegister',
    component: () =>
      import(
        /* webpackChunkName: "ads-management" */
        '@/views/AdManagement/AdRegister.vue/'
      )
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
