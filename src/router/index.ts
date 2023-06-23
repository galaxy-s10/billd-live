import { isIPad, isMobile } from 'billd-utils';
import { createRouter, createWebHistory } from 'vue-router';

import MobileLayout from '@/layout/mobile/index.vue';
import PcLayout from '@/layout/pc/index.vue';

import type { RouteRecordRaw } from 'vue-router';

export const mobileRouterName = {
  h5: 'h5',
  h5Room: 'h5Room',
  h5Area: 'h5Area',
};

export const routerName = {
  home: 'home',
  about: 'about',
  account: 'account',
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
  ...mobileRouterName,
};

// 默认路由
export const defaultRoutes: RouteRecordRaw[] = [
  {
    name: routerName.oauth,
    path: '/oauth/:platform',
    component: () => import('@/views/oauth/index.vue'),
  },
  {
    path: '/',
    component: PcLayout,
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
        name: routerName.account,
        path: '/account',
        component: () => import('@/views/account/index.vue'),
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
    path: '/h5',
    component: MobileLayout,
    children: [
      {
        name: mobileRouterName.h5,
        path: '',
        component: () => import('@/views/h5/index.vue'),
      },
      {
        name: mobileRouterName.h5Area,
        path: 'area/:areaId',
        component: () => import('@/views/h5/area/index.vue'),
      },
    ],
  },
  {
    name: mobileRouterName.h5Room,
    path: '/h5/:roomId',
    component: () => import('@/views/h5/room/index.vue'),
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

router.beforeEach((to, from, next) => {
  if (to.name === routerName.oauth) {
    return next();
  }
  if (isMobile() && !isIPad()) {
    if (!Object.keys(mobileRouterName).includes(to.name as string)) {
      // 当前移动端，但是跳转了非移动端路由
      return next({ name: mobileRouterName.h5 });
    } else {
      return next();
    }
  } else {
    if (Object.keys(mobileRouterName).includes(to.name as string)) {
      // 当前非移动端，但是跳转了移动端路由
      return next({ name: routerName.home });
    }
    return next();
  }
});

export default router;
