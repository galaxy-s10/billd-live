import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/layout/index.vue';

import type { RouteRecordRaw } from 'vue-router';

export const routerName = {
  home: 'home',
  rank: 'rank',
  sponsors: 'sponsors',
  oauth: 'oauth',
  notFound: 'notFound',

  pull: 'pull',
  push: 'push',
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
        name: routerName.rank,
        path: '/rank',
        component: () => import('@/views/rank/index.vue'),
      },
      {
        name: routerName.sponsors,
        path: '/sponsors',
        component: () => import('@/views/sponsors/index.vue'),
      },
      {
        name: routerName.pull,
        path: '/pull/:roomId',
        component: () => import('@/views/pull/index.vue'),
      },
      {
        name: routerName.push,
        path: '/push',
        component: () => import('@/views/push/index.vue'),
      },
    ],
  },
  {
    name: routerName.oauth,
    path: '/oauth/:platform',
    component: () => import('@/views/oauth/index.vue'),
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
