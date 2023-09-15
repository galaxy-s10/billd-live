// 一定要引入webrtc-adapter（约等于垫片，适配safari等其他浏览器）
import 'webrtc-adapter';
import './main.scss';
import './showBilldVersion';
// import 'windi.css'; // windicss-webpack-plugin会解析windi.css这个MODULE_ID
import { createApp } from 'vue';

import Message from '@/components/Message/index.vue';
import registerDirectives from '@/directives';
import router from '@/router/index';
import store from '@/store/index';

import App from './App.vue';

const app = createApp(App);
registerDirectives(app);
app.use(store);
app.use(router);

const message = createApp(Message);
const messageEle = document.createElement('div');
const appEl = document.getElementById('app');
appEl?.appendChild(messageEle);
message.mount(messageEle);
app.mount('#app');
