import { ref } from 'vue';

import { fetchRtcV1Whep } from '@/api/srs';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { WebRTCClass } from '@/utils/network/webRTC';

export const useWebRtcRtmpToRtc = () => {
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const isPk = ref(false);
  const roomId = ref('');

  function updateWebRtcRtmpToRtcConfig(data: { isPk; roomId }) {
    isPk.value = data.isPk;
    roomId.value = data.roomId;
  }

  const webRtcRtmpToRtc = {
    newWebRtc: (data: {
      sender: string;
      receiver: string;
      videoEl: HTMLVideoElement;
      sucessCb: (stream) => void;
    }) => {
      console.log({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
      });
      return new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        isSRS: true,
        roomId: roomId.value,
        videoEl: data.videoEl,
        sender: data.sender,
        receiver: data.receiver,
        sucessCb: data.sucessCb,
      });
    },
    /**
     * 主播发offer给观众
     */
    sendOffer: async ({
      sender,
      receiver,
    }: {
      sender: string;
      receiver: string;
    }) => {
      console.log('开始webRtcRtmpToRtc的sendOffer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          rtc.peerConnection?.addTransceiver('audio', {
            direction: 'recvonly',
          });
          rtc.peerConnection?.addTransceiver('video', {
            direction: 'recvonly',
          });
          const offerSdp = await rtc.createOffer();
          if (!offerSdp) {
            console.error('webRtcRtmpToRtc的offerSdp为空');
            window.$message.error('webRtcRtmpToRtc的offerSdp为空');
            return;
          }
          await rtc.setLocalDescription(offerSdp!);
          const answerRes = await fetchRtcV1Whep({
            sdp: offerSdp.sdp!,
            stream: `roomId___${roomId.value}`,
            app: 'livestream',
          });
          if (!answerRes.data.answer) {
            console.error('/rtc/v1/play/拿不到sdp');
            window.$message.error('/rtc/v1/play/拿不到sdp');
            return;
          }
          await rtc.setRemoteDescription(
            new RTCSessionDescription({
              type: 'answer',
              sdp: answerRes.data.answer,
            })
          );
          // const answerRes = await fetchRtcV1Play({
          //   sdp: offerSdp.sdp!,
          //   streamurl: `${myLiveRoom.rtmp_url!}`,
          // });
          // if (answerRes.data.code !== 0) {
          //   console.error('/rtc/v1/play/拿不到sdp');
          //   window.$message.error('/rtc/v1/play/拿不到sdp');
          //   return;
          // }
          // await rtc.setRemoteDescription(
          //   new RTCSessionDescription({
          //     type: 'answer',
          //     sdp: answerRes.data.sdp,
          //   })
          // );
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('webRtcRtmpToRtc的sendOffer错误');
        console.log(error);
      }
    },
  };

  return { updateWebRtcRtmpToRtcConfig, webRtcRtmpToRtc };
};
