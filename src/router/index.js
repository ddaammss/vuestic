import { createRouter, createWebHistory } from 'vue-router'

// 레이아웃 컴포넌트
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
//const BlankLayout = () => import('@/layouts/BlankLayout.vue')

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
const StoreList = () => import('@/views/stores/StoreList.vue')
const StoreDetail = () => import('@/views/stores/StoreDetail.vue')
const StoreRegist = () => import('@/views/stores/StoreRegist.vue')

// 회원 관리
const MemberList = () => import('@/views/members/MemberList.vue')
const MemberDetail = () => import('@/views/members/MemberDetail.vue')
const Point = () => import('@/views/members/Point.vue')

// 예약 관리
const ReservationList = () => import('@/views/reservations/ReservationList.vue')
const ReservationDetail = () => import('@/views/reservations/ReservationDetail.vue')
const ReservationsCancellation = () => import('@/views/reservations/Cancellation.vue')

// 이벤트 관리
const CommunicationList = () => import('@/views/events/CommunicationList.vue')
const CommunicationDetail = () => import('@/views/events/CommunicationDetail.vue')
const EventsBanner = () => import('@/views/events/Banner.vue')
const EventList = () => import('@/views/events/Event.vue')
const EventDetail = () => import('@/views/events/EventDetail.vue')

// 매출 관리
const SalesList = () => import('@/views/sales/SalesList.vue')
const SalesDetail = () => import('@/views/sales/SalesDetail.vue')
const SalesRegist = () => import('@/views/sales/SalesRegist.vue')

// 광고 관리
const AdRequest = () => import('@/views/ads/Request.vue')
const AdRegistDetail = () => import('@/views/ads/RegistDetail.vue')
const AdRegist = () => import('@/views/ads/Regist.vue')

// 쇼핑몰 상품 관리
const ShopList = () => import('@/views/shop/ShopList.vue')
const ShopDetail = () => import('@/views/shop/ShopDetail.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth',
    //component: BlankLayout,
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
        path: 'dashboard',
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
            path: 'coupon/list',
            name: 'CouponList',
            component: CouponList,
            meta: { title: '쿠폰 관리' }
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
            path: 'detail/:seq?',
            name: 'StoreDetail',
            component: StoreDetail,
            meta: { title: '입점사 상세' }
          },
          {
            path: 'regist',
            name: 'StoreRegist',
            component: StoreRegist,
            meta: { title: '입점사 등록' }
          }
        ]
      },

      // 회원관리
      {
        path: 'members',
        children: [
          {
            path: 'list',
            name: 'MemberList',
            component: MemberList,
            meta: { title: '회원관리' }
          },
          {
            path: 'detail/:memberId?',
            name: 'MemberDetail',
            component: MemberDetail,
            meta: { title: '회원상세' }
          },
          {
            path: 'point',
            name: 'Point',
            component: Point,
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
            meta: { title: '예약관리' }
          },
          {
            path: 'detail/:reservationCode?',
            name: 'ReservationDetail',
            component: ReservationDetail,
            meta: { title: '예약상세' }
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
            path: 'communication/list',
            name: 'CommunicationList',
            component: CommunicationList,
            meta: { title: '소통방' }
          },
          {
            path: 'communication/detail/:seq?',
            name: 'CommunicationDetail',
            component: CommunicationDetail,
            meta: { title: '소통방 상세' }
          },
          {
            path: 'banner',
            name: 'EventsBanner',
            component: EventsBanner,
            meta: { title: '배너 관리' }
          },
          {
            path: 'event/list',
            name: 'EventList',
            component: EventList,
            meta: { title: '이벤트 관리' }
          },
          {
            path: 'event/detail/:seq?',
            name: 'EventDetail',
            component: EventDetail,
            meta: { title: '이벤트 상세' }
          }
        ]
      },

      // 매출 관리
      {
        path: 'sales',
        children: [
          {
            path: 'list',
            name: 'Sales',
            component: SalesList,
            meta: { title: '매출관리' }
          },
          {
            path: 'detail/:seq?',
            name: 'SalesDetail',
            component: SalesDetail,
            meta: { title: '매출상세' }
          },
          {
            path: 'regist',
            name: 'SalesRegist',
            component: SalesRegist,
            meta: { title: '매출등록' }
          },
        ]
      },

      // 광고 관리
      {
        path: 'ads',
        children: [
          {
            path: 'request',
            name: 'AdRequest',
            component: AdRequest,
            meta: { title: '광고 신청 현황' }
          },
          {
            path: 'regist',
            name: 'AdRegist',
            component: AdRegist,
            meta: { title: '광고 등록' }
          },
          {
            path: 'detail/:seq?',
            name: 'AdRegistDetail',
            component: AdRegistDetail,
            meta: { title: '광고 등록 상세' }
          }

        ]
      },
      // 쇼핑몰 상품 관리
      {
        path: 'shop',
        children: [
          {
            path: 'list',
            name: 'ShopList',
            component: ShopList,
            meta: { title: '쇼핑몰 상품 관리' }
          },
          {
            path: 'detail/:seq?',
            name: 'ShopDetail',
            component: ShopDetail,
            meta: { title: '쇼핑몰 상품 상세' }
          }
        ]
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 라우터 가드 (인증 체크)
router.beforeEach((to, from, next) => {
  // const isAuthenticated = localStorage.getItem('authToken') !== null
  // if (to.meta?.requiresAuth && !isAuthenticated) {
  //   next('/auth/login')
  // } else if (to.path === '/auth/login' && isAuthenticated) {
  //   next('/')
  // } else {
  //   next()
  // }
   next()
})

export default router
