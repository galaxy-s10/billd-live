import { ComponentPublicInstance, createApp } from 'vue';

import ModalCpt from './modal/index.vue';

const app = createApp(ModalCpt);
const container = document.createElement('div');
// @ts-ignore
const instance: ComponentPublicInstance<InstanceType<typeof ModalCpt>> =
  app.mount(container);

document.body.appendChild(container);

export function useTip(
  msg: string,
  hiddenCancel?: boolean,
  hiddenClose?: boolean
) {
  instance.show = true;
  instance.msg = msg;
  instance.hiddenCancel = !!hiddenCancel;
  instance.hiddenClose = !!hiddenClose;
  return new Promise((resolve, reject) => {
    instance.handleOk = () => {
      instance.show = false;
      resolve('ok');
    };
    instance.handleCancel = () => {
      instance.show = false;
      reject('cancel');
    };
  });
}
