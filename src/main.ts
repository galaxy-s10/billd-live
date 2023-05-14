import './main.scss';
import './showBilldVersion';
// import 'windi.css'; // windicss-webpack-plugin会解析windi.css这个MODULE_ID

import { createApp } from 'vue';
import adapter from 'webrtc-adapter';

import Message from '@/components/Message/index.vue';
import router from '@/router/index';
import store from '@/store/index';

import App from './App.vue';

console.log('webrtc-adapter', adapter.browserDetails);

const app = createApp(App);

app.use(store);
app.use(router);

const message = createApp(Message);
const messageEle = document.createElement('div');
const appEl = document.getElementById('app');
appEl?.appendChild(messageEle);
message.mount(messageEle);
app.mount('#app');
