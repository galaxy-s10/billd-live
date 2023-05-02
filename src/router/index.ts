import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/layout/index.vue';

import type { RouteRecordRaw } from 'vue-router';

export const routerName = {
  aliPay: 'aliPay',
  sponsors: 'sponsors',
  home: 'home',
  notFound: 'notFound',
  bilibiliPush: 'bilibiliPush',
  test1: 'test1',
  webrtcPush: 'webrtcPush',
  webrtcPull: 'webrtcPull',
  srsWebRtcPush: 'srsWebRtcPush',
  srsWebRtcPull: 'srsWebRtcPull',
};

// 默认路由
export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: routerName.home,
        path: '/',
        component: () => import('@/views/home/index.vue'),
      },
      {
        name: routerName.sponsors,
        path: '/sponsors',
        component: () => import('@/views/sponsors/index.vue'),
      },
      {
        name: routerName.bilibiliPush,
        path: '/bilibiliPush',
        component: () => import('@/views/bilibiliPush/index.vue'),
      },
      {
        name: routerName.test1,
        path: '/test1',
        component: () => import('@/views/test1/index.vue'),
      },
      {
        name: routerName.webrtcPush,
        path: '/webrtc-push',
        component: () => import('@/views/webrtc-push/index.vue'),
      },
      {
        name: routerName.webrtcPull,
        path: '/webrtc-pull/:roomId',
        component: () => import('@/views/webrtc-pull/index.vue'),
      },
      {
        name: routerName.srsWebRtcPush,
        path: '/srs-webrtc-push',
        component: () => import('@/views/srs-webrtc-push/index.vue'),
      },
      {
        name: routerName.srsWebRtcPull,
        path: '/srs-webrtc-pull/:roomId',
        component: () => import('@/views/srs-webrtc-pull/index.vue'),
      },
    ],
  },
  {
    name: routerName.aliPay,
    path: '/ali-pay',
    component: () => import('@/views/aliPay/index.vue'),
  },
];
const router = createRouter({
  routes: [
    ...defaultRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: routerName.notFound,
      component: () => import('@/views/notFound.vue'),
    },
  ],
  history: createWebHistory(),
});

export default router;
