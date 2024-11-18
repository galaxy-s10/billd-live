import { judgeType } from 'billd-utils';
import { App, ComponentPublicInstance, Directive, createApp } from 'vue';

import main from '@/components/FullLoading/main.vue';

const map = new Map<
  HTMLElement,
  {
    app: App<Element>;
    instance: ComponentPublicInstance<InstanceType<typeof main>>;
  }
>();

const vLoadingProp = {
  'loading-content': 'loading-content',
  'loading-content-color': 'loading-content-color',
  'loading-mask-zindex': 'loading-mask-zindex',
  'loading-size': 'loading-size',
};

export const directiveLoading: Directive = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created() {},
  // 在元素被插入到 DOM 前调用
  beforeMount() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el: HTMLElement, binding) {
    const { value, modifiers } = binding;
    const content = el.getAttribute(vLoadingProp['loading-content']);
    const contentColor = el.getAttribute(vLoadingProp['loading-content-color']);
    const zIndex = el.getAttribute(vLoadingProp['loading-mask-zindex']);
    const size = el.getAttribute(vLoadingProp['loading-size']);
    const app = createApp(main);
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.right = '0';
    container.style.top = '0';
    container.style.bottom = '0';
    container.style.pointerEvents = 'none';
    // @ts-ignore
    const instance: ComponentPublicInstance<InstanceType<typeof main>> =
      app.mount(container);
    el.appendChild(container);

    instance.loading = value;
    instance.mask = modifiers.mask;
    if (zIndex !== null) {
      instance.zindex = Number(zIndex);
    }
    if (content !== null) {
      instance.content = content;
    }
    if (contentColor !== null) {
      instance.contentColor = contentColor;
    }
    if (size !== null) {
      instance.loadingSize = Number(size);
    }
    map.set(el, { app, instance });
    return instance;
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate() {},
  // 在绑定元素的父组件及他自己的所有子节点都更新后调用
  updated(el, binding) {
    const { value } = binding;
    const res = map.get(el);
    if (res) {
      res.instance.loading = value;
      const content = el.getAttribute(vLoadingProp['loading-content']);
      const contentColor = el.getAttribute(
        vLoadingProp['loading-content-color']
      );
      const size = el.getAttribute(vLoadingProp['loading-size']);
      if (content !== null && judgeType(content) === 'string') {
        res.instance.content = content;
      }
      if (contentColor !== null && judgeType(contentColor) === 'string') {
        res.instance.contentColor = contentColor;
      }
      if (size !== null && judgeType(size) === 'string') {
        res.instance.loadingSize = size;
      }
    }
  },
  // 绑定元素的父组件卸载前调用
  beforeUnmount() {},
  // 绑定元素的父组件卸载后调用
  unmounted(el) {
    map.get(el)?.app.unmount();
  },
};
