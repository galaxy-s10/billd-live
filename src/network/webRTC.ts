import { getRandomString } from 'billd-utils';
import browserTool from 'browser-tool';

import { MediaTypeEnum } from '@/interface';
import { WsCandidateType } from '@/interface-ws';
import { AppRootState, useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';

import { WsMsgTypeEnum } from './webSocket';

export class WebRTCClass {
  roomId = '-1';
  receiver = '';

  videoEl: HTMLVideoElement;

  peerConnection: RTCPeerConnection | null = null;

  /** 最大码率 */
  maxBitrate = -1;
  /** 最大帧率 */
  maxFramerate = -1;
  /** 分辨率 */
  resolutionRatio = -1;

  localStream?: MediaStream;

  isSRS: boolean;

  browser: {
    device: string;
    language: string;
    engine: string;
    browser: string;
    system: string;
    systemVersion: string;
    platform: string;
    isWebview: boolean;
    isBot: boolean;
    version: string;
  };

  constructor(data: {
    roomId: string;
    videoEl: HTMLVideoElement;
    maxBitrate?: number;
    maxFramerate?: number;
    resolutionRatio?: number;
    isSRS: boolean;
    receiver: string;
  }) {
    this.roomId = data.roomId;
    this.videoEl = data.videoEl;
    this.receiver = data.receiver;
    if (data.maxBitrate) {
      this.maxBitrate = data.maxBitrate;
    }
    if (data.resolutionRatio) {
      this.resolutionRatio = data.resolutionRatio;
    }
    if (data.maxFramerate) {
      this.maxFramerate = data.maxFramerate;
    }
    this.isSRS = data.isSRS;
    console.warn('new webrtc参数:', data);
    this.browser = browserTool();
    this.createPeerConnection();
  }

  prettierLog = (msg: string, type?: 'log' | 'warn' | 'error', ...args) => {
    console[type || 'log'](
      `${new Date().toLocaleString()}，${this.roomId}，${
        this.browser.browser
      }浏览器，${msg}`,
      ...args
    );
  };

  addTrack = (stream: MediaStream, isCb?: boolean) => {
    console.log('开始addTrack,是否是pc的track回调', isCb);
    console.log('收到新track', stream);
    console.log('收到新track的视频轨', stream.getVideoTracks());
    console.log('收到新track的音频轨', stream.getAudioTracks());
    console.log('原本旧track的视频轨', this.localStream?.getVideoTracks());
    console.log('原本旧track的音频轨', this.localStream?.getAudioTracks());

    const appStore = useAppStore();
    if (isCb) {
      stream.onremovetrack = (event) => {
        console.log('onremovetrack事件', event);
        const res = appStore.allTrack.filter((info) => {
          if (info.track?.id === event.track.id) {
            return false;
          }
          return true;
        });
        appStore.setAllTrack(res);
      };
    }

    const addTrack: AppRootState['allTrack'] = [];

    this.localStream?.getVideoTracks().forEach((track) => {
      if (!appStore.allTrack.find((info) => info.track?.id === track.id)) {
        addTrack.push({
          id: getRandomString(8),
          track,
          stream,
          audio: 2,
          video: 1,
          type: MediaTypeEnum.screen,
          mediaName: '',
          streamid: stream.id,
          trackid: track.id,
        });
      }
    });
    this.localStream?.getAudioTracks().forEach((track) => {
      if (!appStore.allTrack.find((info) => info.track?.id === track.id)) {
        addTrack.push({
          id: getRandomString(8),
          track,
          stream,
          audio: 1,
          video: 2,
          type: MediaTypeEnum.microphone,
          mediaName: '',
          streamid: stream.id,
          trackid: track.id,
        });
      }
    });
    stream.getVideoTracks().forEach((track) => {
      if (!appStore.allTrack.find((info) => info.track?.id === track.id)) {
        addTrack.push({
          id: getRandomString(8),
          track,
          stream,
          audio: 2,
          video: 1,
          type: MediaTypeEnum.screen,
          mediaName: '',
          streamid: stream.id,
          trackid: track.id,
        });
      }
    });
    stream.getAudioTracks().forEach((track) => {
      if (!appStore.allTrack.find((info) => info.track?.id === track.id)) {
        addTrack.push({
          id: getRandomString(8),
          track,
          stream,
          audio: 1,
          video: 2,
          type: MediaTypeEnum.microphone,
          mediaName: '',
          streamid: stream.id,
          trackid: track.id,
        });
      }
    });
    if (addTrack.length) {
      appStore.setAllTrack([...appStore.allTrack, ...addTrack]);
    }
    this.localStream = stream;

    // if (this.maxBitrate !== -1) {
    //   this.setMaxBitrate(this.maxBitrate);
    // }
    // if (this.maxFramerate !== -1) {
    //   this.setMaxFramerate(this.maxFramerate);
    // }
    // if (this.resolutionRatio !== -1) {
    //   this.setResolutionRatio(this.resolutionRatio);
    // }
  };

  /** 设置分辨率 */
  setResolutionRatio = (height: number) => {
    console.log('开始设置分辨率', height);
    console.log('旧的分辨率', this.resolutionRatio);
    return new Promise((resolve) => {
      this.localStream?.getTracks().forEach((track) => {
        if (track.kind === 'video') {
          console.log('设置分辨率ing', track.id);
          track
            .applyConstraints({
              height,
            })
            .then(() => {
              console.log('设置分辨率成功');
              this.resolutionRatio = height;
              resolve(1);
            })
            .catch((error) => {
              console.error('设置分辨率失败', height, error);
              resolve(0);
            });
        }
      });
    });
  };

  /** 设置最大帧率 */
  setMaxFramerate = (maxFramerate: number) => {
    console.log('开始设置最大帧率', maxFramerate);
    console.log('旧的最大帧率', this.maxFramerate);
    return new Promise<number>((resolve) => {
      this.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'video') {
          console.log('设置最大帧率ing', sender.track.id);
          const parameters = { ...sender.getParameters() };
          if (parameters.encodings[0]) {
            if (parameters.encodings[0].maxFramerate === maxFramerate) {
              console.log('最大帧率不变，不设置');
              resolve(1);
              return;
            }
            parameters.encodings[0].maxFramerate = maxFramerate;
            sender
              .setParameters(parameters)
              .then(() => {
                console.log('设置最大帧率成功', maxFramerate);
                this.maxFramerate = maxFramerate;
                resolve(1);
              })
              .catch((error) => {
                console.error('设置最大帧率失败', maxFramerate, error);
                resolve(0);
              });
          }
        }
      });
    });
  };

  /** 设置最大码率 */
  setMaxBitrate = (maxBitrate: number) => {
    console.log('开始设置最大码率', maxBitrate);
    console.log('旧的最大码率', this.maxBitrate);
    return new Promise<number>((resolve) => {
      this.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'video') {
          console.log('设置最大码率ing', sender.track.id);
          const parameters = { ...sender.getParameters() };
          if (parameters.encodings[0]) {
            const val = 1000 * maxBitrate;
            console.log(parameters.encodings[0].maxBitrate, val, 23223);
            if (parameters.encodings[0].maxBitrate === val) {
              console.log('最大码率不变，不设置');
              resolve(1);
              return;
            }
            parameters.encodings[0].maxBitrate = val;
            sender
              .setParameters(parameters)
              .then(() => {
                console.log('设置最大码率成功', maxBitrate);
                this.maxBitrate = val;
                resolve(1);
              })
              .catch((error) => {
                console.error('设置最大码率失败', maxBitrate, error);
                resolve(0);
              });
          }
        }
      });
    });
  };

  // 创建offer
  createOffer = async () => {
    if (!this.peerConnection) return;
    this.prettierLog('createOffer开始', 'warn');
    try {
      const sdp = await this.peerConnection.createOffer();
      this.prettierLog('createOffer成功', 'warn', sdp);
      return sdp;
    } catch (error) {
      this.prettierLog('createOffer失败', 'error');
      console.log(error);
    }
  };

  addIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      await this.peerConnection?.addIceCandidate(candidate);
      console.log('addIceCandidate成功');
    } catch (error) {
      console.error('addIceCandidate错误');
      console.log(error);
    }
  };

  // 创建answer
  createAnswer = async () => {
    if (!this.peerConnection) return;
    this.prettierLog('createAnswer开始', 'warn');
    try {
      const sdp = await this.peerConnection.createAnswer();
      this.prettierLog('createAnswer成功', 'warn', sdp);
      return sdp;
    } catch (error) {
      this.prettierLog('createAnswer失败', 'error');
      console.log(error);
    }
  };

  // 设置本地描述
  setLocalDescription = async (sdp: RTCLocalSessionDescriptionInit) => {
    if (!this.peerConnection) return;
    this.prettierLog('setLocalDescription开始', 'warn');
    try {
      await this.peerConnection.setLocalDescription(sdp);
      this.prettierLog('setLocalDescription成功', 'warn', sdp);
    } catch (error) {
      this.prettierLog('setLocalDescription失败', 'error');
      console.error('setLocalDescription', sdp);
      console.error(error);
    }
  };

  // 设置远端描述
  setRemoteDescription = async (sdp: RTCSessionDescriptionInit) => {
    if (!this.peerConnection) return;
    this.prettierLog(`setRemoteDescription开始`, 'warn');
    try {
      await this.peerConnection.setRemoteDescription(sdp);
      this.prettierLog('setRemoteDescription成功', 'warn', sdp);
    } catch (error) {
      this.prettierLog('setRemoteDescription失败', 'error');
      console.error('setRemoteDescription', sdp);
      console.error(error);
    }
  };

  handleStreamEvent = () => {
    if (!this.peerConnection) return;
    // 废弃：https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream
    console.warn(`${this.roomId}，开始监听pc的addstream`);
    this.peerConnection.addEventListener('addstream', (event: any) => {
      // console.warn(`${this.roomId}，pc收到addstream事件`, event);
      // console.log('addstream事件的stream', event.stream);
      // console.log('addstream事件的视频轨', event.stream.getVideoTracks());
      // console.log('addstream事件的音频轨', event.stream.getAudioTracks());
      // this.addTrack(event.stream, true);
    });

    console.warn(`${this.roomId}，开始监听pc的track`);
    this.peerConnection.addEventListener('track', (event) => {
      console.warn(`${this.roomId}，pc收到track事件`, event);
      console.log('track事件的stream', event.streams[0]);
      console.log('track事件的视频轨', event.streams[0].getVideoTracks());
      console.log('track事件的音频轨', event.streams[0].getAudioTracks());
      this.addTrack(event.streams[0], true);
      this.videoEl.srcObject = event.streams[0];
    });
  };

  handleConnectionEvent = () => {
    if (!this.peerConnection) return;

    console.warn(`${this.roomId}，开始监听pc的icecandidate`);
    // icecandidate
    this.peerConnection.addEventListener('icecandidate', (event) => {
      this.prettierLog('pc收到icecandidate', 'warn');
      if (event.candidate) {
        const networkStore = useNetworkStore();
        console.log('准备发送candidate', event.candidate.candidate);
        const roomId = this.roomId.split('___')[0];
        const receiver = this.roomId.split('___')[1];
        networkStore.wsMap.get(roomId)?.send<WsCandidateType['data']>({
          msgType: WsMsgTypeEnum.candidate,
          data: {
            candidate: event.candidate,
            sender: networkStore.wsMap.get(roomId)?.socketIo?.id || '',
            receiver,
            live_room_id: Number(roomId),
          },
        });
      } else {
        console.log('没有候选者了');
      }
    });

    console.warn(`${this.roomId}，开始监听pc的iceconnectionstatechange`);
    // iceconnectionstatechange
    this.peerConnection.addEventListener(
      'iceconnectionstatechange',
      (event: any) => {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/connectionState
        const iceConnectionState = event.currentTarget.iceConnectionState;
        console.log(
          this.roomId,
          'pc收到iceconnectionstatechange',
          // eslint-disable-next-line
          `iceConnectionState:${iceConnectionState}`,
          event
        );
        if (iceConnectionState === 'connected') {
          // ICE 代理至少对每个候选发现了一个可用的连接，此时仍然会继续测试远程候选以便发现更优的连接。同时可能在继续收集候选。
          console.warn(this.roomId, 'iceConnectionState:connected', event);
        }
        if (iceConnectionState === 'completed') {
          // ICE 代理已经发现了可用的连接，不再测试远程候选。
          console.warn(this.roomId, 'iceConnectionState:completed', event);
        }
        if (iceConnectionState === 'failed') {
          // ICE 候选测试了所有远程候选没有发现匹配的候选。也可能有些候选中发现了一些可用连接。
          console.error(this.roomId, 'iceConnectionState:failed', event);
        }
        if (iceConnectionState === 'disconnected') {
          // 测试不再活跃，这可能是一个暂时的状态，可以自我恢复。
          console.error(this.roomId, 'iceConnectionState:disconnected', event);
        }
        if (iceConnectionState === 'closed') {
          // ICE 代理关闭，不再应答任何请求。
          console.error(this.roomId, 'iceConnectionState:closed', event);
        }
      }
    );

    console.warn(`${this.roomId}，开始监听pc的connectionstatechange`);
    // connectionstatechange
    this.peerConnection.addEventListener(
      'connectionstatechange',
      (event: any) => {
        const connectionState = event.currentTarget.connectionState;
        console.log(
          this.roomId,
          'pc收到connectionstatechange',
          // eslint-disable-next-line
          `connectionState:${connectionState}`,
          event
        );
        if (connectionState === 'connected') {
          // 表示每一个 ICE 连接要么正在使用（connected 或 completed 状态），要么已被关闭（closed 状态）；并且，至少有一个连接处于 connected 或 completed 状态。
          console.warn(this.roomId, 'connectionState:connected');
          // if (this.maxBitrate !== -1) {
          //   this.setMaxBitrate(this.maxBitrate);
          // }
          // if (this.maxFramerate !== -1) {
          //   this.setMaxFramerate(this.maxFramerate);
          // }
          // if (this.resolutionRatio !== -1) {
          //   this.setResolutionRatio(this.resolutionRatio);
          // }
        }
        if (connectionState === 'disconnected') {
          // 表示至少有一个 ICE 连接处于 disconnected 状态，并且没有连接处于 failed、connecting 或 checking 状态。
          console.error(this.roomId, 'connectionState:disconnected');
        }
        if (connectionState === 'closed') {
          // 表示 RTCPeerConnection 已关闭。
          console.error(this.roomId, 'connectionState:closed');
        }
        if (connectionState === 'failed') {
          // 表示至少有一个 ICE 连接处于 failed 的状态。
          console.error(this.roomId, 'connectionState:failed');
        }
      }
    );
  };

  // 创建对等连接
  createPeerConnection = () => {
    if (!window.RTCPeerConnection) {
      console.error('当前环境不支持RTCPeerConnection！');
      alert('当前环境不支持RTCPeerConnection！');
      return;
    }
    if (!this.peerConnection) {
      const iceServers = this.isSRS
        ? []
        : [
            // {
            //   urls: 'stun:stun.l.google.com:19302',
            // },
            {
              urls: 'turn:hsslive.cn:3478',
              username: 'hss',
              credential: '123456',
            },
          ];
      this.peerConnection = new RTCPeerConnection({
        iceServers,
      });
      this.handleStreamEvent();
      this.handleConnectionEvent();
      this.update();
    }
  };

  // 手动关闭webrtc连接
  close = () => {
    console.warn(`${new Date().toLocaleString()}，手动关闭webrtc连接`);
    this.peerConnection?.getSenders().forEach((sender) => {
      this.peerConnection?.removeTrack(sender);
    });
    this.peerConnection?.close();
    this.peerConnection = null;
  };

  // 更新store
  update = () => {
    const networkStore = useNetworkStore();
    networkStore.updateRtcMap(this.roomId, this);
  };
}
