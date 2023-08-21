import { ref } from 'vue';

export const useRTCParams = () => {
  const maxBitrate = ref([
    {
      label: '1',
      value: 1,
    },
    {
      label: '10',
      value: 10,
    },
    {
      label: '1000',
      value: 1000,
    },
    {
      label: '2000',
      value: 2000,
    },
    {
      label: '3000',
      value: 3000,
      disabled: true,
    },
    {
      label: '4000',
      value: 4000,
      disabled: true,
    },
    {
      label: '5000',
      value: 5000,
      disabled: true,
    },
    {
      label: '6000',
      value: 6000,
      disabled: true,
    },
    {
      label: '7000',
      value: 7000,
      disabled: true,
    },
    {
      label: '8000',
      value: 8000,
      disabled: true,
    },
  ]);
  const maxFramerate = ref([
    {
      label: '1帧',
      value: 1,
    },
    {
      label: '10帧',
      value: 10,
    },
    {
      label: '24帧',
      value: 24,
    },
    {
      label: '30帧',
      value: 30,
    },
    {
      label: '60帧',
      value: 60,
      disabled: true,
    },
  ]);
  const resolutionRatio = ref([
    {
      label: '360P',
      value: 360,
    },
    {
      label: '540P',
      value: 540,
    },
    {
      label: '720P',
      value: 720,
    },
    {
      label: '1080P',
      value: 1080,
    },
    {
      label: '1440P',
      value: 1440,
      disabled: true,
    },
  ]);

  return { maxBitrate, maxFramerate, resolutionRatio };
};
