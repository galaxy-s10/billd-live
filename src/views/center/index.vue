<template>
  <div class="center-wrap">
    <div class="center">
      <div class="sidebar">
        <div
          class="sidebar-item"
          :class="{
            show: route.matched.find((v) => v.name === routerName.centerUser),
          }"
          @click="router.push({ name: routerName.centerUserInfo })"
        >
          <div class="panel">
            <div class="label">
              <div class="ico user"></div>
              <div class="name">用户中心</div>
            </div>
            <div class="arrow"></div>
          </div>

          <div class="list">
            <div
              class="list-item"
              :class="{
                active: route.name === routerName.centerUserInfo,
              }"
              @click.stop="router.push({ name: routerName.centerUserInfo })"
            >
              个人信息
            </div>
            <div
              class="list-item"
              :class="{
                active: route.name === routerName.centerUserIncome,
              }"
              @click.stop="router.push({ name: routerName.centerUserIncome })"
            >
              个人收益
            </div>
          </div>
        </div>
        <div
          class="sidebar-item"
          :class="{
            show: route.matched.find(
              (v) => v.name === routerName.centerLiveRoom
            ),
          }"
          @click="router.push({ name: routerName.centerLiveRoomInfo })"
        >
          <div class="panel">
            <div class="label">
              <div class="ico camera"></div>
              <div class="name">我的直播间</div>
            </div>
            <div class="arrow"></div>
          </div>

          <div class="list">
            <div
              class="list-item"
              :class="{
                active: route.name === routerName.centerLiveRoomInfo,
              }"
              @click.stop="router.push({ name: routerName.centerLiveRoomInfo })"
            >
              直播间信息
            </div>
            <div
              class="list-item"
              :class="{
                active: route.name === routerName.centerLiveRoomStartLive,
              }"
              @click.stop="
                router.push({ name: routerName.centerLiveRoomStartLive })
              "
            >
              开播设置
            </div>
            <div
              class="list-item"
              :class="{
                active: route.name === routerName.centerLiveRoomForward,
              }"
              @click.stop="
                router.push({ name: routerName.centerLiveRoomForward })
              "
            >
              转推设置
            </div>
          </div>
        </div>
        <div
          class="sidebar-item"
          :class="{
            show: route.matched.find(
              (v) => v.name === routerName.centerLiveData
            ),
          }"
          @click="router.push({ name: routerName.centerLiveDataOverview })"
        >
          <div class="panel">
            <div class="label">
              <div class="ico line_chart"></div>
              <div class="name">直播数据</div>
            </div>
            <div class="arrow"></div>
          </div>

          <div class="list">
            <div
              class="list-item"
              :class="{
                active: route.name === routerName.centerLiveDataOverview,
              }"
              @click.stop="
                router.push({ name: routerName.centerLiveDataOverview })
              "
            >
              数据总览
            </div>
            <div
              class="list-item"
              :class="{
                active: route.name === routerName.centerLiveDataRecord,
              }"
              @click.stop="
                router.push({ name: routerName.centerLiveDataRecord })
              "
            >
              场次数据
            </div>
          </div>
        </div>
      </div>
      <div class="view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import router, { routerName } from '@/router';

const route = useRoute();

onMounted(() => {
  console.log(route.matched);
});
</script>

<style lang="scss" scoped>
.center-wrap {
  display: flex;
  padding-top: $header-height;
  width: 100vw;
  min-height: calc(100vh - $header-height);
  background-color: #f3f3f7;

  .center {
    display: flex;
    justify-content: space-between;
    margin: 20px auto 0;
    width: 1200px;
    .sidebar {
      padding: 10px 0;
      height: 40vh;
      border: 1px solid #e9eaec;
      border-radius: 12px;
      background-color: white;
      font-size: 16px;
      .sidebar-item {
        position: relative;
        width: 190px;
        .panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 55px;
          border-bottom: 1px solid #e9eaec;
          cursor: pointer;
          .label {
            display: flex;
            align-items: center;
            .ico {
              margin-right: 8px;
              width: 20px;
              height: 20px;
              &.user {
                @include setBackground('@/assets/img/user.png');
              }
              &.line_chart {
                @include setBackground('@/assets/img/line_chart.png');
              }
              &.camera {
                @include setBackground('@/assets/img/camera.png');
              }
            }
            .name {
            }
          }
          .arrow {
            border-color: #8e8e8e;

            @include arrow(bottom, 6px, 1px);
          }
        }
        &.show {
          .label {
            color: $theme-color-gold;
          }
          .arrow {
            transform: rotate(180deg);
          }
          .list {
            height: auto;
          }
        }

        .list {
          overflow: hidden;
          box-sizing: border-box;
          width: 100%;
          height: 0;
          font-size: 12px;
          .list-item {
            padding-left: 47px;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            &.active {
              color: $theme-color-gold;
            }
            &:hover {
              color: $theme-color-gold;
            }
          }
        }
      }
    }
    .view {
      flex: 1;
      padding-left: 20px;
    }
  }
}
</style>
