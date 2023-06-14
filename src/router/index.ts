import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/layout/index.vue';

import type { RouteRecordRaw } from 'vue-router';

export const routerName = {
  home: 'home',
  about: 'about',
  rank: 'rank',
  sponsors: 'sponsors',
  support: 'support',
  order: 'order',
  shop: 'shop',
  link: 'link',
  ad: 'ad',
  faq: 'faq',
  team: 'team',
  oauth: 'oauth',
  release: 'release',
  notFound: 'notFound',
  group: 'group',
  profile: 'profile',

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
        name: routerName.about,
        path: '/about',
        children: [
          {
            name: routerName.group,
            path: 'group',
            component: () => import('@/views/group/index.vue'),
          },
          {
            name: routerName.faq,
            path: 'faq',
            component: () => import('@/views/faq/index.vue'),
          },
          {
            name: routerName.team,
            path: 'team',
            component: () => import('@/views/team/index.vue'),
          },
          {
            name: routerName.release,
            path: 'release',
            component: () => import('@/views/release/index.vue'),
          },
        ],
      },
      {
        name: routerName.rank,
        path: '/rank',
        component: () => import('@/views/rank/index.vue'),
      },
      {
        name: routerName.shop,
        path: '/shop',
        component: () => import('@/views/shop/index.vue'),
      },
      {
        name: routerName.profile,
        path: '/profile/:userId',
        component: () => import('@/views/profile/index.vue'),
      },
      {
        name: routerName.sponsors,
        path: '/sponsors',
        component: () => import('@/views/sponsors/index.vue'),
      },
      {
        name: routerName.support,
        path: '/support',
        component: () => import('@/views/support/index.vue'),
      },
      {
        name: routerName.order,
        path: '/order',
        component: () => import('@/views/order/index.vue'),
      },
      {
        name: routerName.ad,
        path: '/ad',
        component: () => import('@/views/ad/index.vue'),
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
