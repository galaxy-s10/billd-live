<template>
  <div class="area-modal-wrap">
    <Modal
      title="直播分区"
      :mask-closable="true"
      :width="'520px'"
      @close="emits('close')"
    >
      <div class="container">
        <div class="p-area-list">
          <div
            v-for="item in appStore.treeAreaList"
            :key="item.id"
            @click="changePAreaId(item.id)"
          >
            <div
              class="p-area"
              :class="{ active: pAreaId === item.id }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div
          v-if="appStore.treeAreaList.find((v) => v.id === pAreaId)"
          class="area-list"
        >
          <span
            v-for="(item, index) in appStore.treeAreaList.find(
              (v) => v.id === pAreaId
            )?.children"
            :key="index"
            class="area"
            :class="{ active: item.id === areaId }"
            @click="changeAreaId(item.id)"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
      <template #footer>
        <div class="btn-wrap">
          <div
            class="btn confirm"
            :class="{ disable: areaId === 0 }"
            @click="handleConfirm"
          >
            确定
          </div>
          <div
            class="btn cancel"
            @click="emits('close')"
          >
            取消
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();
const areaId = ref(0);
const pAreaId = ref(0);

const emits = defineEmits(['close', 'confirm']);

function changePAreaId(val) {
  pAreaId.value = val;
}

function changeAreaId(val) {
  areaId.value = val;
}

function handleConfirm() {
  const parent = appStore.flatAreaList.find((v) => v.id === pAreaId.value);
  const child = appStore.flatAreaList.find((v) => v.id === areaId.value);
  if (!parent || !child) {
    window.$message.warning('请选择分区');
    return;
  }
  emits('confirm', [parent, child]);
}

onMounted(() => {
  pAreaId.value = appStore.treeAreaList[0].id!;
});
</script>

<style lang="scss" scoped>
.area-modal-wrap {
  .p-area-list {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .p-area {
      display: inline-block;
      padding: 0 8px;
      border-right: 1px solid #e9eaec;
      color: #999;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: $theme-color-gold;
      }
      &.active {
        color: $theme-color-gold;
      }
    }
    .area {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 2px 10px;
      border: 1px solid rgba($color: #999, $alpha: 0.3);
      border-radius: 10px;
      color: #61666d;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        background-color: rgba($color: $theme-color-gold, $alpha: 0.1);
        color: #f9ca24;
      }
      &.active {
        border: 1px solid rgba($color: $theme-color-gold, $alpha: 2);
        background-color: $theme-color-gold;
        color: #fff;
      }
    }
  }
  .area-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .area {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 2px 10px;
      border: 1px solid rgba($color: #999, $alpha: 0.3);
      border-radius: 10px;
      color: #61666d;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        background-color: rgba($color: $theme-color-gold, $alpha: 0.1);
        color: #f9ca24;
      }
      &.active {
        border: 1px solid rgba($color: $theme-color-gold, $alpha: 2);
        background-color: $theme-color-gold;
        color: #fff;
      }
    }
  }
  .btn-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      margin-right: 20px;
      width: 100px;
      height: 34px;
      border: 1px solid $theme-color-gold;
      border-radius: 4px;
      background-color: $theme-color-gold;
      color: white;
      text-align: center;
      line-height: 34px;
      cursor: pointer;
      transition: all 0.3s ease;

      user-select: none;

      &.disable {
        cursor: no-drop;
      }
      &.confirm {
        &:hover {
          background-color: #f5df65;
        }
      }
      &.cancel {
        background-color: white;
        color: $theme-color-gold;
        &:hover {
          background-color: $theme-color-gold;
          color: white;
        }
      }
    }
  }
}
</style>
