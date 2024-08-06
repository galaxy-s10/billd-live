declare module '*.vue' {
  /* eslint-disable */
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.webp';

interface Window {
  $message: import('naive-ui/es/message/src/MessageProvider').MessageApiInjection;
  TXLivePusher: any;
}
