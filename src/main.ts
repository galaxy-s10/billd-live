import '@/assets/js/aa';

import './main.scss';
import './showBilldVersion';
// import 'windi.css'; // windicss-webpack-plugin会解析windi.css这个MODULE_ID

import { createApp } from 'vue';
import adapter from 'webrtc-adapter';

import router from '@/router/index';
import store from '@/store/index';

import App from './App.vue';

console.log('webrtc-adapter', adapter.browserDetails);

const app = createApp(App);

app.use(store);
app.use(router);

app.mount('#app');
