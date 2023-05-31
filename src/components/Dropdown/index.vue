<template>
  <div class="dropdown-wrap">
    <div class="btn">
      <slot name="btn"></slot>
    </div>
    <div class="container">
      <div class="wrap">
        <slot name="list"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.dropdown-wrap {
  position: relative;
  &:hover {
    .container {
      display: block;
    }
  }
  .btn {
    cursor: pointer;
  }
  .container {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 2;
    display: none;
    .wrap {
      box-sizing: border-box;
      margin-top: 5px;
      padding: 10px 0;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
      color: black;
      font-size: 13px;
    }
  }
}
</style>
