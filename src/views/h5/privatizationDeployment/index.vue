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
        :class="{ [item['color']]: 1 }"
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

import { COMMON_URL } from '@/constant';
import { routerName } from '@/router';

const router = useRouter();
const showContach = ref(false);

const currentTab = ref<'course' | 'single' | 'multi' | 'forever' | string>(
  'single'
);

const tab = ref([
  {
    id: 'course',
    txt: '视频课',
  },
  {
    id: 'single',
    txt: '开源版',
  },
  {
    id: 'multi',
    txt: '高级版',
  },
  {
    id: 'forever',
    txt: '定制版',
  },
]);

const detail = ref({
  course: {
    slogan: ['billd-live付费课', '火热进行中⚡️'],
    list: [
      {
        color: '#597ef7',
        name: '视频课程',
        desc: 'Vue3 + WebRTC + Node + SRS<br />讲解直播核心代码、流程、思路',
        price: {
          left: '￥',
          center: '399',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-class',
          },
          {
            status: 'done',
            txt: 'billd-live-server-class',
          },
        ],
        btn: {
          type: 'link',
          link: COMMON_URL.payCoursesArticle,
          txt: '查看详情',
        },
      },
    ],
  },
  single: {
    slogan: ['欢迎部署billd直播~'],
    list: [
      {
        color: '#1677ff',
        name: 'Web直播',
        desc: '网页开直播、看直播',
        price: {
          left: '￥',
          center: '0',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live',
          },
          {
            status: 'done',
            txt: 'billd-live-server',
          },
        ],
        btn: {
          type: 'link',
          link: 'https://github.com/galaxy-s10/billd-live',
          txt: '立即部署',
        },
      },
      {
        color: '#EE826C',
        name: 'App直播',
        desc: '手机App开直播、看直播',
        price: {
          left: '￥',
          center: '0',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-flutter',
          },
          {
            status: 'done',
            txt: 'billd-live-server',
          },
        ],
        btn: {
          type: 'link',
          link: 'https://github.com/galaxy-s10/billd-live',
          txt: '立即部署',
        },
      },
      {
        color: '#bae637',
        name: 'Web直播+后台',
        desc: '网页开直播、看直播；<br />直播后台',
        price: {
          left: '￥',
          center: '0',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live',
          },
          {
            status: 'done',
            txt: 'billd-live-admin',
          },
          {
            status: 'done',
            txt: 'billd-live-server',
          },
        ],
        btn: {
          type: 'link',
          link: 'https://github.com/galaxy-s10/billd-live',
          txt: '立即部署',
        },
      },
      {
        color: '#eb2f96',
        name: 'App直播+后台',
        desc: '手机App开直播、看直播；<br />直播后台',
        price: {
          left: '￥',
          center: '0',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live-flutter',
          },
          {
            status: 'done',
            txt: 'billd-live-admin',
          },
          {
            status: 'done',
            txt: 'billd-live-server',
          },
        ],
        btn: {
          type: 'link',
          link: 'https://github.com/galaxy-s10/billd-live',
          txt: '立即部署',
        },
      },
      {
        color: '#13c2c2',
        name: '全平台直播',
        desc: '网页、App开/看直播；<br />直播后台',
        price: {
          left: '￥',
          center: '0',
          right: '元',
        },
        tip: '包含以下代码仓库：',
        feat: [
          {
            status: 'done',
            txt: 'billd-live',
          },
          {
            status: 'done',
            txt: 'billd-live-admin',
          },
          {
            status: 'done',
            txt: 'billd-live-flutter',
          },
          {
            status: 'done',
            txt: 'billd-live-server',
          },
        ],
        btn: {
          type: 'link',
          link: 'https://github.com/galaxy-s10/billd-live',
          txt: '立即部署',
        },
      },
    ],
  },
  multi: {
    slogan: ['billd直播累计收获1.4k+ star', '值得信赖，欢迎部署~'],
    list: [
      {
        color: '#1677ff',
        name: 'Web直播',
        desc: '网页开直播、看直播',
        price: {
          left: '￥',
          center: '5999',
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
          right: '元',
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
          center: '6999',
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
          center: '6999',
          right: '元',
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
          center: '7999',
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
  forever: {
    slogan: ['billd直播支持定制化', '立即定制自己的个性化直播间~'],
    list: [
      {
        color: '#38c0ff',
        name: '在线咨询',
        desc: '咨询任何问题服务',
        price: {
          left: '￥',
          center: '100',
          right: '元/小时',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: '一对一解答',
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
        name: '技术支持',
        desc: '处理技术相关问题服务',
        price: {
          left: '￥',
          center: '300',
          right: '元/小时',
        },
        tip: '',
        feat: [
          {
            status: 'done',
            txt: '远程协助处理问题',
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
        name: '定制私有化部署',
        desc: '适用于个人/企业自建直播间',
        price: {
          left: '￥',
          center: '9999',
          right: '元/起',
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
  background-color: #f4f8ff;
  min-height: 100vh;
  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
    width: 80%;
    height: 140px;
    // background-color: red;
    text-align: center;
    font-size: 24px;
  }
  .tab {
    display: flex;
    justify-content: center;
    margin: 10px auto 0;
    padding: 8px 0;
    width: 320px;
    border-radius: 40px;
    background: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);

    user-select: none;
    .item {
      padding: 4px 18px;
      border-radius: 40px;
      color: #686e88;
      font-size: 13px;
      cursor: pointer;
      &.active {
        background-color: $theme-color-gold;
        color: white;
      }
    }
  }
  .list {
    padding-top: 20px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .item {
      box-sizing: border-box;
      padding: 20px 20px;
      width: 80%;
      margin-bottom: 20px;
      // border: 1px solid #dde6ed;
      border-radius: 2px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: white;
      font-size: 14px;
      box-shadow:
        0 0.90667vw 2.13333vw 0 rgba(0, 0, 0, 0.10196078431372549),
        0 1px 0.53333vw 0 hsla(0, 0%, 100%, 0.5019607843137255);
      &.blue {
        border-top: 7px solid #38c0ff;
      }
      &.green {
        border-top: 7px solid #30d1aa;
      }
      &.orange {
        border-top: 7px solid #ffbd33;
      }
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
