import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/layout/index.vue';

import type { RouteRecordRaw } from 'vue-router';

// 默认路由
export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: 'home',
        path: '/',
        component: () => import('@/views/home/index.vue'),
      },
      {
        name: 'push',
        path: '/push',
        component: () => import('@/views/push/index.vue'),
      },
      {
        name: 'pull',
        path: '/:roomId',
        component: () => import('@/views/pull/index.vue'),
      },
      {
        name: 'bilibiliPush',
        path: '/bilibiliPush',
        component: () => import('@/views/bilibiliPush/index.vue'),
      },
      {
        name: 'test1',
        path: '/test1',
        component: () => import('@/views/test1/index.vue'),
      },
      {
        name: 'srsDemoOne',
        path: '/srs-demo1',
        component: () => import('@/views/srs-demo1/index.vue'),
      },
    ],
  },
];
const router = createRouter({
  routes: defaultRoutes,
  history: createWebHistory(),
});

export default router;
