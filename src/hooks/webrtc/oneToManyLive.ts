import { getRandomString } from 'billd-utils';
import { ref } from 'vue';

import { useRTCParams } from '@/hooks/use-rtcParams';
import { WebRTCClass } from '@/network/webRTC';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { WsAnswerType, WsMsgTypeEnum, WsOfferType } from '@/types/websocket';

export const useWebRtcOneToManyLive = () => {
  const appStore = useAppStore();
  const networkStore = useNetworkStore();

  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const roomId = ref('');
  const canvasVideoStream = ref<MediaStream>();

  function updateWebRtcOneToManyLiveConfig(data: {
    roomId;
    canvasVideoStream;
  }) {
    roomId.value = data.roomId;
    canvasVideoStream.value = data.canvasVideoStream;
  }

  const webRtcOneToManyLive = {
    newWebRtc: (data: {
      sender: string;
      receiver: string;
      videoEl: HTMLVideoElement;
    }) => {
      return new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        isSRS: false,
        roomId: roomId.value,
        videoEl: data.videoEl,
        sender: data.sender,
        receiver: data.receiver,
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
      console.log('开始webRtcOneToManyLive的sendOffer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          canvasVideoStream.value?.getTracks().forEach((track) => {
            if (canvasVideoStream.value) {
              console.log(
                'webRtcOneToManyLive的canvasVideoStream插入track',
                track.kind,
                track
              );
              rtc.peerConnection?.addTrack(track, canvasVideoStream.value);
            }
          });
          const offerSdp = await rtc.createOffer();
          if (!offerSdp) {
            console.error('webRtcOneToManyLive的offerSdp为空');
            return;
          }
          await rtc.setLocalDescription(offerSdp!);
          networkStore.wsMap.get(roomId.value)?.send<WsOfferType['data']>({
            requestId: getRandomString(8),
            msgType: WsMsgTypeEnum.nativeWebRtcOffer,
            data: {
              live_room: appStore.liveRoomInfo!,
              live_room_id: appStore.liveRoomInfo!.id!,
              sender,
              receiver,
              sdp: offerSdp,
            },
          });
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('webRtcOneToManyLive的sendOffer错误');
      }
    },
    /**
     * 观众收到主播的offer，观众回复主播answer
     */
    sendAnswer: async ({
      sdp,
      sender,
      receiver,
    }: {
      sdp: RTCSessionDescriptionInit;
      sender: string;
      receiver: string;
    }) => {
      console.log('开始webRtcOneToManyLive的sendAnswer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          await rtc.setRemoteDescription(sdp);
          const answerSdp = await rtc.createAnswer();
          if (!answerSdp) {
            console.error('webRtcOneToManyLive的answerSdp为空');
            return;
          }
          await rtc.setLocalDescription(answerSdp);
          networkStore.wsMap.get(roomId.value)?.send<WsAnswerType['data']>({
            requestId: getRandomString(8),
            msgType: WsMsgTypeEnum.nativeWebRtcAnswer,
            data: {
              live_room_id: Number(roomId.value),
              sender,
              receiver,
              sdp: answerSdp,
            },
          });
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('webRtcOneToManyLive的sendAnswer错误');
      }
    },
  };

  return { updateWebRtcOneToManyLiveConfig, webRtcOneToManyLive };
};
