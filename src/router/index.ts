import { isIPad, isMobile } from 'billd-utils';
import { createRouter, createWebHistory } from 'vue-router';

import { GoodsTypeEnum } from '@/interface';
import MobileLayout from '@/layout/mobile/index.vue';
import PcLayout from '@/layout/pc/index.vue';

import type { RouteRecordRaw } from 'vue-router';

export const commonRouterName = {
  qrcodeLogin: 'qrcodeLogin',
};

export const mobileRouterName = {
  h5: 'h5',
  h5Room: 'h5Room',
  h5Area: 'h5Area',
  h5Rank: 'h5Rank',
  h5Profile: 'h5Profile',
  ...commonRouterName,
};

export const routerName = {
  home: 'home',
  about: 'about',
  area: 'area',
  areaDetail: 'areaDetail',
  rank: 'rank',
  sponsors: 'sponsors',
  privatizationDeployment: 'privatizationDeployment',
  videoTools: 'videoTools',
  support: 'support',
  order: 'order',
  wallet: 'wallet',
  shop: 'shop',
  link: 'link',
  ad: 'ad',
  faq: 'faq',
  team: 'team',
  oauth: 'oauth',
  release: 'release',
  pushStreamDifferent: 'pushStreamDifferent',
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
            component: () => import('@/views/about/group/index.vue'),
          },
          {
            name: routerName.faq,
            path: 'faq',
            component: () => import('@/views/about/faq/index.vue'),
          },
          {
            name: routerName.team,
            path: 'team',
            component: () => import('@/views/about/team/index.vue'),
          },
          {
            name: routerName.release,
            path: 'release',
            component: () => import('@/views/about/release/index.vue'),
          },
          {
            name: routerName.pushStreamDifferent,
            path: 'pushStreamDifferent',
            component: () =>
              import('@/views/about/pushStreamDifferent/index.vue'),
          },
        ],
      },
      {
        name: routerName.area,
        path: '/area',
        component: () => import('@/views/area/index.vue'),
        children: [
          {
            name: routerName.areaDetail,
            path: '/area/:id',
            component: () => import('@/views/area/id/index.vue'),
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
        component: () => import('@/views/doc/sponsors/index.vue'),
      },
      {
        name: routerName.privatizationDeployment,
        path: '/privatizationDeployment',
        component: () =>
          import('@/views/doc/privatizationDeployment/index.vue'),
      },
      {
        name: routerName.support,
        path: '/support',
        redirect: `/shop?goodsType=${GoodsTypeEnum.support}`,
      },
      {
        name: routerName.order,
        path: '/order',
        component: () => import('@/views/order/index.vue'),
      },
      {
        name: routerName.wallet,
        path: '/wallet',
        component: () => import('@/views/wallet/index.vue'),
      },
      {
        name: routerName.videoTools,
        path: '/videoTools',
        component: () => import('@/views/videoTools/index.vue'),
      },
      {
        name: routerName.ad,
        path: '/ad',
        component: () => import('@/views/doc/ad/index.vue'),
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
        path: 'area/:id',
        component: () => import('@/views/h5/area/index.vue'),
      },
      {
        name: mobileRouterName.h5Rank,
        path: 'rank',
        component: () => import('@/views/h5/rank/index.vue'),
      },
      {
        name: mobileRouterName.h5Profile,
        path: 'profile',
        component: () => import('@/views/h5/profile/index.vue'),
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
  if (Object.keys(commonRouterName).includes(to.name as string)) {
    // 跳转通用路由
    return next();
  } else if (isMobile() && !isIPad()) {
    if (!Object.keys(mobileRouterName).includes(to.name as string)) {
      // 当前移动端，但是跳转了非移动端路由
      console.log('当前移动端，但是跳转了非移动端路由', to, from);
      if (to.name === routerName.pull) {
        return next({
          name: mobileRouterName.h5Room,
          params: { roomId: to.params.roomId },
          query: { ...to.query },
        });
      } else {
        return next({
          name: mobileRouterName.h5,
        });
      }
    } else {
      return next();
    }
  } else {
    if (Object.keys(mobileRouterName).includes(to.name as string)) {
      // 当前非移动端，但是跳转了移动端路由
      console.log('当前非移动端，但是跳转了移动端路由');
      if (to.name === mobileRouterName.h5Room) {
        // 有可能是原生webrtc或srs-webrtc
        return next({
          name: routerName.home,
        });
      } else {
        return next({
          name: routerName.home,
        });
      }
    }
    return next();
  }
});

export default router;
