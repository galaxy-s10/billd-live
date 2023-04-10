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
    ],
  },
];
const router = createRouter({
  routes: defaultRoutes,
  history: createWebHistory(),
});

export default router;
