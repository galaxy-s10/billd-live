declare module '*.vue' {
  /* eslint-disable */
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface Window {
  $message: {
    info: any;
    success: any;
    warning: any;
    error: any;
    loading: any;
    default: any;
  };
}
