import { outputStaticUrl } from 'script/constant';
import { createRouter, createWebHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

// 默认路由
export const defaultRoutes: RouteRecordRaw[] = [
  {
    // name: '',
    path: '/',
    component: () => import('@/views/home/home.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/login.vue'),
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('@/views/about/about.vue'),
  },
];
const router = createRouter({
  routes: defaultRoutes,
  history: createWebHistory(
    outputStaticUrl(process.env.NODE_ENV === 'production')
  ),
});

export default router;
