import { ref } from 'vue';

import { BilldHtmlWebpackPluginLog } from '@/interface';

export const useCheckUpdate = () => {
  const appInfo = ref<BilldHtmlWebpackPluginLog>(
    // @ts-ignore
    process.env.BilldHtmlWebpackPlugin as BilldHtmlWebpackPluginLog
  );
  return { appInfo };
};
