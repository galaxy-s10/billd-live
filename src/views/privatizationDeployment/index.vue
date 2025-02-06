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
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="desc"
          v-html="item.desc"
        ></div>
        <!-- eslint-enable -->
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
      style="width: 400px"
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
          center: '7999',
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
          center: '9999',
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
          center: '12999',
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
          center: '200',
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
  height: 100%;
  background-color: #f4f8ff;
  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
    width: 1200px;
    height: 180px;
    // background-color: red;
    text-align: center;
    font-size: 40px;
  }
  .tab {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    padding: 8px 0;
    width: 320px;
    border-radius: 40px;
    background: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);

    user-select: none;
    .item {
      padding: 4px 25px;
      border-radius: 40px;
      color: #686e88;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      &.active {
        background-color: $theme-color-gold;
        color: white;
      }
    }
  }
  .list {
    display: flex;
    justify-content: center;
    margin: 50px auto 0;
    width: 1400px;
    .item {
      box-sizing: border-box;
      margin: 0 10px;
      padding: 20px 20px;
      width: 250px;
      border-top: 6px solid;
      // border: 1px solid #dde6ed;
      border-radius: 2px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background-color: white;
      font-size: 14px;

      .name {
        padding: 10px 0 0;
        height: 40px;
        text-align: center;
        font-size: 26px;
        line-height: 1;
      }
      .desc {
        margin-top: 10px;
        height: 50px;
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
        height: 200px;
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
