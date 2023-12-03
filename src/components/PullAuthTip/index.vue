<template>
  <div class="pull-auth">
    <div class="auth-txt">需要权限</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.pull-auth {
  position: absolute !important;
  z-index: 10;
  border-radius: 4px;
  background-color: rgba($color: black, $alpha: 0.5);

  @extend %maskBg;
  .auth-txt {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 2px 10px;
    border-radius: 6px;
    background-color: rgba($color: $theme-color-gold, $alpha: 0.8);
    color: white;
    font-weight: bold;
    transform: translate(-50%, -50%);
  }
}
</style>
