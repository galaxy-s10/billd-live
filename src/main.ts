import 'webrtc-adapter';
import './main.scss';
import './showBilldVersion';

import { createApp } from 'vue';

import router from '@/router/index';
import store from '@/store/index';

import App from './App.vue';

// import 'windi.css'; // windicss-webpack-plugin会解析windi.css这个MODULE_ID

const app = createApp(App);

app.use(store);
app.use(router);

app.mount('#app');
