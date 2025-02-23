<template>
  <div class="privatizationDeployment-wrap">
    <h2 class="title">
      <div
        v-for="(item, index) in detail[currentTab].slogan"
        :key="index"
      >
        {{ item }}
      </div>
    </h2>
    <div class="tab">
      <div
        v-for="(item, index) in tab"
        :key="index"
        class="item"
        :class="{ active: item.id === currentTab }"
        @click="currentTab = item.id"
      >
        {{ item.txt }}
      </div>
    </div>
    <div class="list">
      <div
        v-for="(item, index) in detail[currentTab].list"
        :key="index"
        class="item"
        :style="{ borderColor: item['color'] }"
      >
        <div class="name">{{ item.name }}</div>
        <div class="desc">
          <!-- eslint-disable vue/no-v-html -->
          <div v-html="item.desc"></div>
          <!-- eslint-enable -->
        </div>
        <div class="price">
          <span class="t1">{{ item.price.left }}</span>
          <span class="t2">{{ item.price.center }}</span>
          <span class="t3">{{ item.price.right }}</span>
        </div>
        <div class="feat">
          <div
            v-if="item.tip !== ''"
            class="feat-item tip"
          >
            {{ item.tip }}
          </div>
          <div
            v-for="(iten, indey) in item.feat"
            :key="indey"
            class="feat-item"
          >
            <div
              :class="{
                done: iten.status === 'done',
                todo: iten.status === 'todo',
              }"
            ></div>
            <div class="txt">{{ iten.txt }}</div>
          </div>
        </div>
        <div
          class="btn"
          @click="handleClick(item.btn)"
        >
          {{ item.btn.txt }}
        </div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showContach">
    <n-card
      style="width: 300px"
      title="联系作者"
      role="dialog"
      closable
      @close="showContach = false"
    >
      <div>
        <span
          class="link"
          @click="router.push({ name: routerName.hi })"
        >
          点击查看
        </span>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { routerName } from '@/router';

const router = useRouter();
const showContach = ref(false);
const currentTab = ref<'single' | 'multi' | 'forever' | string>('multi');

const tab = ref([
  {
    id: 'single',
    txt: '个人订阅',
  },
  {
    id: 'multi',
    txt: '企业订阅',
  },
  {
    id: 'forever',
    txt: '套餐订阅',
  },
]);

const detail = ref({
  single: {
    slogan: ['一次性源码，适合个人用户', '欢迎订阅🚀'],
    list: [
      {
        color: '#38c0ff',
        name: 'Web直播前台',
        desc: '基于Vue3 + WebRTC + Vite6',
        price: {
          left: '￥',
          center: '1999',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#597ef7',
        name: 'Web直播后台',
        desc: '基于Vue3 + NaiveUI + Vite6',
        price: {
          left: '￥',
          center: '1999',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-admin-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#30d1aa',
        name: 'Web直播后端',
        desc: '基于Node + Koa2 + Ts + Srs',
        price: {
          left: '￥',
          center: '2999',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-server-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#ffa940',
        name: 'App直播客户端',
        desc: '基于Flutter3 + Dart3 + WebRTC',
        price: {
          left: '￥',
          center: '1999',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-flutter-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
    ],
  },
  multi: {
    slogan: ['源码永久更新，适合企业用户', '欢迎订阅🚀'],
    list: [
      {
        color: '#38c0ff',
        name: 'Web直播前台',
        desc: '基于Vue3 + WebRTC + Vite6',
        price: {
          left: '￥',
          center: '2999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#597ef7',
        name: 'Web直播后台',
        desc: '基于Vue3 + NaiveUI + Vite6',
        price: {
          left: '￥',
          center: '2999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-admin-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#30d1aa',
        name: 'Web直播后端',
        desc: '基于Node + Koa2 + Ts + Srs',
        price: {
          left: '￥',
          center: '3999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-server-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#ffa940',
        name: 'App直播客户端',
        desc: '基于Flutter3 + Dart3 + WebRTC',
        price: {
          left: '￥',
          center: '2999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-flutter-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
    ],
  },
  forever: {
    slogan: ['源码永久更新，适合企业用户', '套餐订阅更优惠！🚀'],
    list: [
      {
        color: '#1677ff',
        name: 'Web直播',
        desc: '网页开直播、看直播',
        price: {
          left: '￥',
          center: '5999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-server-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#EE826C',
        name: 'App直播',
        desc: '手机App开直播、看直播',
        price: {
          left: '￥',
          center: '5999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-flutter-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-server-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#bae637',
        name: 'Web直播+后台',
        desc: '网页开直播、看直播；<br />直播后台',
        price: {
          left: '￥',
          center: '7999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-admin-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-server-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#eb2f96',
        name: 'App直播+后台',
        desc: '手机App开直播、看直播；<br />直播后台',
        price: {
          left: '￥',
          center: '7999',
          right: '元/永久',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-flutter-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-admin-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-server-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
      {
        color: '#13c2c2',
        name: '全平台直播',
        desc: '网页、App开/看直播；<br />直播后台',
        price: {
          left: '￥',
          center: '9999',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-admin-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-flutter-pro',
          },
          {
            status: 'done',
            txt: 'billd-live-server-pro',
          },
        ],
        btn: {
          type: 'showContact',
          link: '',
          txt: '立即咨询',
        },
      },
    ],
  },
});

function handleClick(item) {
  if (item.type === 'link') {
    openToTarget(item.link);
  } else if (item.type === 'push') {
    const url = router.resolve({
      name: item.link,
    });
    openToTarget(url.href);
  } else if (item.type === 'buy') {
    console.log('buy');
  } else if (item.type === 'toast') {
    window.$message.info(item.link);
  } else if (item.type === 'showContact') {
    showContach.value = true;
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: $theme-color-gold;
  text-decoration: none;
  cursor: pointer;
}
.privatizationDeployment-wrap {
  min-height: 100vh;
  background-color: #f4f8ff;
  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
    width: 80%;
    height: 160px;
    // background-color: red;
    text-align: center;
    font-size: 30px;
  }
  .tab {
    display: flex;
    justify-content: center;
    margin: 10px auto 0;
    padding: 8px 0;
    width: 324px;
    border-radius: 40px;
    background: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);

    user-select: none;
    .item {
      padding: 4px 20px;
      border-radius: 40px;
      color: #686e88;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      &.active {
        background-color: $theme-color-gold;
        color: white;
      }
    }
  }
  .list {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding-top: 20px;
    .item {
      box-sizing: border-box;
      margin-bottom: 20px;
      padding: 20px 20px;
      width: 80%;
      border-top: 6px solid;
      // border: 1px solid #dde6ed;
      border-radius: 2px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: white;
      box-shadow:
        0 0.90667vw 2.13333vw 0 rgba(0, 0, 0, 0.10196078431372549),
        0 1px 0.53333vw 0 hsla(0, 0%, 100%, 0.5019607843137255);
      font-size: 14px;

      .name {
        padding: 10px 0 0;
        height: 40px;
        text-align: center;
        font-size: 30px;
        line-height: 1;
      }
      .desc {
        margin-top: 10px;
        height: 40px;
        color: #88898d;
        text-align: center;
        // background-color: red;
      }
      .price {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 45px;
        color: #88898d;
        text-align: center;
        .t1 {
          color: #272727;
          font-weight: 600;
          font-size: 16px;
        }
        .t2 {
          color: #272727;
          font-size: 40px;
          line-height: 36px;
        }
        .t3 {
          color: #2c2c2c;
          font-size: 16px;
        }
        // background-color: red;
      }
      .feat {
        margin-top: 30px;
        height: 180px;
        .feat-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          &.tip {
            color: #88898d;
          }
          .todo,
          .done {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            text-align: center;
          }
          .todo {
            position: relative;
            &::after {
              color: #ffc049;
              content: '-';
              text-align: center;
              font-size: 16px;
            }
          }
          .done {
            @include setBackground('@/assets/img/check.png');
          }
        }
      }
      .btn {
        margin: 0 auto;
        padding: 8px 0;
        width: 160px;
        border: 1px solid $theme-color-gold;
        border-radius: 4px;
        color: $theme-color-gold;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        transition: all 00.3s ease;
        &:hover {
          background-color: $theme-color-gold;
          color: white;
        }
      }
    }
  }
}
</style>
