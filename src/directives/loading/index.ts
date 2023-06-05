import { App, ComponentPublicInstance, Directive, createApp } from 'vue';

import main from '@/components/FullLoading/main.vue';

const map = new Map<
  HTMLElement,
  {
    app: App<Element>;
    instance: ComponentPublicInstance<InstanceType<typeof main>>;
  }
>();

export default <Directive>{
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created() {},
  // 在元素被插入到 DOM 前调用
  beforeMount() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {
    const { value } = binding;
    const app = createApp(main);
    const container = document.createElement('div');
    // @ts-ignore
    const instance: ComponentPublicInstance<InstanceType<typeof main>> =
      app.mount(container);
    el.appendChild(container);
    instance.loading = value;
    map.set(el, { app, instance });
    return instance;
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate() {},
  // 在绑定元素的父组件及他自己的所有子节点都更新后调用
  updated(el, binding, vnode) {
    const { value } = binding;
    const res = map.get(el);
    if (res) {
      res.instance.loading = value;
    }
  },
  // 绑定元素的父组件卸载前调用
  beforeUnmount() {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {
    map.get(el)?.app.unmount();
  },
};
