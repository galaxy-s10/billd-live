<template>
  <div class="about-wrap">
    <h1>about页面</h1>
    <p class="myfont">MIUI 13 采用全新系统字体 MiSans</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {},
  setup() {},
});
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'MiSans';
  src: url('@/assets/font/MiSans-Normal.ttf');
}

.about-wrap {
  padding: 20px;
  background-color: bisque;
  .myfont {
    font-family: 'MiSans';
  }
}
</style>
