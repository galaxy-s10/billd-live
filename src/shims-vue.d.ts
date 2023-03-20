declare module '*.vue' {
  /* eslint-disable */
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  // eslint-disable-next-line
}
