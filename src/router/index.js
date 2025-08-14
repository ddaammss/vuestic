import { createRouter, createWebHistory } from 'vue-router'

// 레이아웃 컴포넌트
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const BlankLayout = () => import('@/layouts/BlankLayout.vue')

// 페이지 컴포넌트들
const Dashboard = () => import('@/views/Dashboard.vue')
const Login = () => import('@/views/Login.vue')

// 설정 관련 컴포넌트들
const Terms = () => import('@/views/settings/Terms.vue')
const Privacy = () => import('@/views/settings/Privacy.vue')
const Refund = () => import('@/views/settings/Refund.vue')
const CouponList = () => import('@/views/settings/CouponList.vue')
const CouponDetail = () => import('@/views/settings/CouponDetail.vue')
const CouponRegist = () => import('@/views/settings/CouponRegist.vue')

// 입점사 관리
const StoreList = () => import('@/views/stores/List.vue')
const StoreDetail = () => import('@/views/stores/Detail.vue')
const StoreRegister = () => import('@/views/stores/Register.vue')

// 회원 관리
const MembersInfo = () => import('@/views/members/Info.vue')
const MembersPoints = () => import('@/views/members/Points.vue')

// 예약 관리
const ReservationList = () => import('@/views/reservations/Reservation.vue')
const ReservationDetail = () => import('@/views/reservations/ReservationDetail.vue')
const ReservationsCancellation = () => import('@/views/reservations/Cancellation.vue')

// 이벤트 관리
const EventsCommunication = () => import('@/views/events/Communication.vue')
const EventsBanner = () => import('@/views/events/Banner.vue')
const EventsEvent = () => import('@/views/events/Event.vue')

// 매출 관리
const Sales = () => import('@/views/Sales.vue')

// 광고 관리
const AdsRequests = () => import('@/views/ads/Requests.vue')
const AdsRegister = () => import('@/views/ads/Register.vue')

const routes = [
  // 인증 관련 페이지들 (BlankLayout)
  {
    path: '/auth',
    component: BlankLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: {
          title: '로그인',
          requiresAuth: false
        }
      }
    ]
  },

  // 관리자 페이지들 (AdminLayout)
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'HOME'
        }
      },

      // 설정관리
      {
        path: 'settings',
        children: [
          {
            path: 'terms',
            name: 'Terms',
            component: Terms,
            meta: { title: '이용약관' }
          },
          {
            path: 'privacy',
            name: 'Privacy',
            component: Privacy,
            meta: { title: '개인정보 취급방침' }
          },
          {
            path: 'refund',
            name: 'Refund',
            component: Refund,
            meta: { title: '환불 설정' }
          },
          {
            path: 'coupon',
            name: 'CouponList',
            component: CouponList,
            meta: { title: '쿠폰 설정' }
          },
          {
            path: 'coupon/detail/:couponCode?', // 파라미터 추가
            name: 'CouponDetail',
            component: CouponDetail,
            meta: { title: '쿠폰 상세' }
          },
          {
            path: 'coupon/regist',
            name: 'CouponRegist',
            component: CouponRegist,
            meta: { title: '쿠폰 등록' }
          }
        ]
      },

      // 입점사관리
      {
        path: 'stores',
        children: [
          {
            path: 'list',
            name: 'StoreList',
            component: StoreList,
            meta: { title: '입점사 관리' }
          },
          {
            path: 'detail/:storeCode?',
            name: 'StoreDetail',
            component: StoreDetail,
            meta: { title: '입점사 상세' }
          },
          {
            path: 'register',
            name: 'StoreRegister',
            component: StoreRegister,
            meta: { title: '입점사 등록' }
          }
        ]
      },

      // 회원관리
      {
        path: 'members',
        children: [
          {
            path: 'info',
            name: 'MembersInfo',
            component: MembersInfo,
            meta: { title: '회원정보관리' }
          },
          {
            path: 'points',
            name: 'MembersPoints',
            component: MembersPoints,
            meta: { title: '포인트관리' }
          }
        ]
      },

      // 예약관리
      {
        path: 'reservations',
        children: [
          {
            path: 'list',
            name: 'ReservationList',
            component: ReservationList,
            meta: { title: '예약현황' }
          },
          {
            path: 'detail/:reservationNo?',
            name: 'ReservationDetail',
            component: ReservationDetail,
            meta: { title: '예약 상세' }
          },
          {
            path: 'cancellation',
            name: 'ReservationsCancellation',
            component: ReservationsCancellation,
            meta: { title: '취소관리' }
          }
        ]
      },

      // 이벤트 관리
      {
        path: 'events',
        children: [
          {
            path: 'communication',
            name: 'EventsCommunication',
            component: EventsCommunication,
            meta: { title: '소통방' }
          },
          {
            path: 'banner',
            name: 'EventsBanner',
            component: EventsBanner,
            meta: { title: '배너 관리' }
          },
          {
            path: 'event',
            name: 'EventsEvent',
            component: EventsEvent,
            meta: { title: '이벤트 관리' }
          }
        ]
      },

      // 매출 관리
      {
        path: 'sales',
        name: 'Sales',
        component: Sales,
        meta: { title: '매출 관리' }
      },

      // 광고 관리
      {
        path: 'ads',
        children: [
          {
            path: 'requests',
            name: 'AdsRequests',
            component: AdsRequests,
            meta: { title: '광고 신청 현황' }
          },
          {
            path: 'register',
            name: 'AdsRegister',
            component: AdsRegister,
            meta: { title: '광고 등록' }
          }
        ]
      }
    ]
  },

  // 레거시 로그인 경로 리다이렉트
  {
    path: '/login',
    redirect: '/auth/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 라우터 가드 (인증 체크)
router.beforeEach((to, from, next) => {
  const isAuthenticated = true // 실제로는 인증 상태를 체크

  if (to.meta?.requiresAuth && !isAuthenticated) {
    next('/auth/login')
  } else if (to.path === '/auth/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
