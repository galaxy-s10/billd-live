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
  h5My: 'h5My',
  h5Shop: 'h5Shop',
  h5ShopDetail: 'h5ShopDetail',
  h5Store: 'h5Store',
  h5StoreDetail: 'h5StoreDetail',
  h5privatizationDeployment: 'h5privatizationDeployment',
  ...commonRouterName,
};

export const routerName = {
  home: 'home',
  about: 'about',
  doc: 'doc',
  api: 'api',
  guide: 'guide',
  area: 'area',
  areaDetail: 'areaDetail',
  rank: 'rank',
  sponsors: 'sponsors',
  privatizationDeployment: 'privatizationDeployment',
  videoTools: 'videoTools',
  frameScreenshotByCanvas: 'frameScreenshotByCanvas',
  frameScreenshotByWebcodec: 'frameScreenshotByWebcodec',
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
  author: 'author',
  pushStreamDifferent: 'pushStreamDifferent',
  notFound: 'notFound',
  group: 'group',
  my: 'my',
  center: 'center',
  centerUser: 'centerUser',
  centerUserInfo: 'centerUserInfo',
  centerUserIncome: 'centerUserIncome',
  centerLiveRoom: 'centerLiveRoom',
  centerLiveRoomInfo: 'centerLiveRoomInfo',
  centerLiveRoomStartLive: 'centerLiveRoomStartLive',
  centerLiveData: 'centerLiveData',
  centerLiveDataOverview: 'centerLiveDataOverview',
  centerLiveDataRecord: 'centerLiveDataRecord',
  user: 'user',
  download: 'download',
  downloadLive: 'downloadLive',
  downloadRemoteDesktop: 'downloadRemoteDesktop',

  pull: 'pull',
  push: 'push',
  store: 'store',
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
            name: routerName.author,
            path: 'author',
            component: () => import('@/views/about/author/index.vue'),
          },
        ],
      },
      {
        name: routerName.doc,
        path: '/doc',
        children: [
          {
            name: routerName.faq,
            path: 'faq',
            component: () => import('@/views/doc/faq/index.vue'),
          },
          {
            name: routerName.ad,
            path: 'ad',
            component: () => import('@/views/doc/ad/index.vue'),
          },
          {
            name: routerName.api,
            path: 'api',
            component: () => import('@/views/doc/api/index.vue'),
          },
          {
            name: routerName.guide,
            path: 'guide',
            component: () => import('@/views/doc/guide/index.vue'),
          },
          {
            name: routerName.pushStreamDifferent,
            path: 'pushStreamDifferent',
            component: () =>
              import('@/views/doc/pushStreamDifferent/index.vue'),
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
        name: routerName.my,
        path: '/my',
        component: () => import('@/views/my/index.vue'),
      },
      {
        name: routerName.center,
        path: '/center',
        component: () => import('@/views/center/index.vue'),
        children: [
          {
            name: routerName.centerUser,
            path: 'user',
            component: () => import('@/views/center/user/index.vue'),
            children: [
              {
                name: routerName.centerUserInfo,
                path: 'info',
                component: () => import('@/views/center/user/info/index.vue'),
              },
              {
                name: routerName.centerUserIncome,
                path: 'income',
                component: () => import('@/views/center/user/income/index.vue'),
              },
            ],
          },
          {
            name: routerName.centerLiveRoom,
            path: 'liveroom',
            component: () => import('@/views/center/liveroom/index.vue'),
            children: [
              {
                name: routerName.centerLiveRoomInfo,
                path: 'info',
                component: () =>
                  import('@/views/center/liveroom/info/index.vue'),
              },
              {
                name: routerName.centerLiveRoomStartLive,
                path: 'start-live',
                component: () =>
                  import('@/views/center/liveroom/start-live/index.vue'),
              },
            ],
          },
          {
            name: routerName.centerLiveData,
            path: 'live-data',
            component: () => import('@/views/center/live-data//index.vue'),
            children: [
              {
                name: routerName.centerLiveDataOverview,
                path: 'overview',
                component: () =>
                  import('@/views/center/live-data/overview/index.vue'),
              },
              {
                name: routerName.centerLiveDataRecord,
                path: 'record',
                component: () =>
                  import('@/views/center/live-data/record/index.vue'),
              },
            ],
          },
        ],
      },
      {
        name: routerName.user,
        path: '/user/:id',
        component: () => import('@/views/user/index.vue'),
      },
      {
        name: routerName.downloadRemoteDesktop,
        path: '/download/desk',
        component: () => import('@/views/download/desk/index.vue'),
      },
      {
        name: routerName.downloadLive,
        path: '/download/live',
        component: () => import('@/views/download/live/index.vue'),
      },
      {
        name: routerName.sponsors,
        path: '/sponsors',
        component: () => import('@/views/sponsors/index.vue'),
      },
      {
        name: routerName.privatizationDeployment,
        path: '/privatizationDeployment',
        component: () => import('@/views/privatizationDeployment/index.vue'),
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
        name: routerName.frameScreenshotByCanvas,
        path: '/videoTools/frameScreenshotByCanvas',
        component: () =>
          import('@/views/videoTools/frameScreenshot/canvas/index.vue'),
      },
      {
        name: routerName.frameScreenshotByWebcodec,
        path: '/videoTools/frameScreenshotByWebcodec',
        component: () =>
          import('@/views/videoTools/frameScreenshot/webcodec/index.vue'),
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
    name: routerName.store,
    path: '/store',
    component: () => import('@/views/store/index.vue'),
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
        name: mobileRouterName.h5My,
        path: 'my',
        component: () => import('@/views/h5/my/index.vue'),
      },
      {
        name: mobileRouterName.h5Shop,
        path: 'shop',
        component: () => import('@/views/h5/shop/index.vue'),
      },
      {
        name: mobileRouterName.h5ShopDetail,
        path: 'shop/:id',
        component: () => import('@/views/h5/shopDetail/index.vue'),
      },
    ],
  },
  {
    name: mobileRouterName.h5Room,
    path: '/h5/:roomId',
    component: () => import('@/views/h5/room/index.vue'),
  },
  {
    name: mobileRouterName.h5Store,
    path: '/h5/store',
    component: () => import('@/views/h5/store/index.vue'),
  },
  {
    name: mobileRouterName.h5StoreDetail,
    path: '/h5/store/:id',
    component: () => import('@/views/h5/storeDetail/index.vue'),
  },
  {
    name: mobileRouterName.h5privatizationDeployment,
    path: '/h5/privatizationDeployment',
    component: () => import('@/views/h5/privatizationDeployment/index.vue'),
  },
  // {
  //   name: mobileRouterName.h5Shop,
  //   path: '/h5/shop',
  //   component: () => import('@/views/h5/shop/index.vue'),
  // },
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

router.beforeEach((to, _from, next) => {
  if (to.name === routerName.oauth) {
    return next();
  }
  if (to.name === routerName.store) {
    return next({
      name: routerName.h5Store,
    });
  }
  if (to.name === routerName.h5Store) {
    return next();
  }
  if (to.name === routerName.h5StoreDetail) {
    return next();
  }
  if (Object.keys(commonRouterName).includes(to.name as string)) {
    // 跳转通用路由
    return next();
  } else if (isMobile() && !isIPad()) {
    console.log('当前是移动端');
    if (!Object.keys(mobileRouterName).includes(to.name as string)) {
      // 当前移动端，但是跳转了非移动端路由
      if (to.name === routerName.pull) {
        return next({
          name: mobileRouterName.h5Room,
          params: { roomId: to.params.roomId },
          query: { ...to.query },
        });
      } else if (to.name === routerName.shop) {
        return next({
          name: mobileRouterName.h5Shop,
          query: { ...to.query },
        });
      } else if (to.name === routerName.store) {
        return next({
          name: mobileRouterName.h5Store,
          query: { ...to.query },
        });
      } else if (to.name === routerName.privatizationDeployment) {
        return next({
          name: mobileRouterName.h5privatizationDeployment,
          query: { ...to.query },
        });
      } else {
        return next({
          name: mobileRouterName.h5,
        });
      }
    } else {
      if (to.name === routerName.h5Room) {
        if (!Number(to.params.roomId)) {
          return next({
            name: mobileRouterName.h5,
          });
        }
      }
      return next();
    }
  } else {
    if (Object.keys(mobileRouterName).includes(to.name as string)) {
      // 当前非移动端，但是跳转了移动端路由
      console.log('当前非移动端，但是跳转了移动端路由');
      if (to.name === routerName.h5Room) {
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
