import browserTool from 'browser-tool';

import { useNetworkStore } from '@/store/network';

import { WsMsgTypeEnum } from './webSocket';

function prettierInfo(
  str: string,
  data: {
    browser: string;
  },
  type?: 'log' | 'warn' | 'error',
  ...args
) {
  console[type || 'log'](
    `${new Date().toLocaleString()}，${data.browser}浏览器，${str}`,
    ...args
  );
}

export const frontendErrorCode = {
  rtcStatusErr: {
    // rtcStatus没有100%
    code: 1001,
    msg: '连接错误，是否尝试刷新页面（不影响云手机内应用运行）',
    refresh: true,
  },
  streamStop: {
    // 视频流卡主
    code: 1002,
    msg: '网络似乎不稳定，建议更换网络或刷新页面（不影响云手机内应用运行）',
    refresh: true,
  },
  blackScreen: {
    // 视频流黑屏
    code: 1003,
    msg: '当前浏览器似乎不兼容，建议使用Google Chrome浏览器',
    refresh: false,
  },
  connectionStateFailed: {
    code: 1004,
    msg: '连接错误，是否尝试刷新页面（不影响云手机内应用运行）',
    refresh: true,
  },
  iceConnectionStateDisconnected: {
    code: 1005,
    msg: '连接错误，是否尝试刷新页面（不影响云手机内应用运行）',
    refresh: true,
  },
  getStatsErr: {
    code: 1006,
    msg: '连接错误，是否尝试刷新页面（不影响云手机内应用运行）',
    refresh: true,
  },
  connectLongTime: {
    // 5秒内没有收到loadedmetadata回调
    code: 1007,
    msg: '等待太久，是否刷新页面重试？',
    refresh: true,
  },
};

export class WebRTCClass {
  roomId = '-1';

  peerConnection: RTCPeerConnection | null = null;
  dataChannel: RTCDataChannel | null = null;

  candidateFlag = false;

  sender?: RTCRtpTransceiver;

  getStatsSetIntervalDelay = 1000;
  getStatsSetIntervalTimer;

  // getStatsSetIntervalDelay是1秒的话，forceINumsMax是3，就代表一直卡了3秒。
  forceINums = 0; // 发送forceI次数
  forceINumsMax = 3; // 最多发送几次forceI

  preFramesDecoded = -1; // 上一帧

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

  rtcStatus = {
    joined: false, // true代表成功，false代表失败
    icecandidate: false, // true代表成功，false代表失败
    createOffer: false, // true代表成功，false代表失败
    setLocalDescription: false, // true代表成功，false代表失败
    answer: false, // true代表成功，false代表失败
    setRemoteDescription: false, // true代表成功，false代表失败
    addStream: false, // true代表成功，false代表失败
    loadstart: false, // true代表成功，false代表失败
    loadedmetadata: false, // true代表成功，false代表失败
  };

  localDescription: any;

  constructor({ roomId }: { roomId: string }) {
    this.roomId = roomId;
    this.browser = browserTool();
    this.createPeerConnection();
    this.update();
    // this.handleWebRtcError();
  }

  addTrack = (track, stream) => {
    console.warn('addTrackaddTrack', track, stream);
    this.sender = this.peerConnection?.addTransceiver(track, {
      streams: [stream],
      direction: 'sendonly',
    });
    // this.peerConnection?.addTrack(track, stream);
  };

  handleWebRtcError = () => {
    this.getStatsSetIntervalTimer = setInterval(() => {
      this.peerConnection
        ?.getStats()
        .then((res) => {
          let isBlack = false;
          let currFramesDecoded = -1;
          res.forEach((report: RTCInboundRtpStreamStats) => {
            // 不能结构report的值，不然如果卡主之后，report的值就一直都是
            // const { type, kind, framesDecoded } = report;
            const data = {
              type: report.type,
              kind: report.kind,
              framesDecoded: report.framesDecoded,
              decoderImplementation: report.decoderImplementation,
              isChrome: false,
              isSafari: false,
              other: '',
            };
            if (this.browser.browser === 'safari') {
              data.isSafari = true;
            } else if (this.browser.browser === 'chrome') {
              data.isChrome = true;
            } else {
              data.other = this.browser.browser;
            }
            const isStopFlag = this.getCurrentFramesDecoded(data);
            const isBlackFlag = this.isBlackScreen(data);
            if (isStopFlag !== false) {
              currFramesDecoded = isStopFlag;
            }
            if (isBlackFlag !== false) {
              isBlack = isBlackFlag;
            }
          });
          /** 处理视频流卡主 */
          const handleStreamStop = () => {
            // console.error(
            //   `上一帧：${this.preFramesDecoded}，当前帧:${currFramesDecoded}，forceINums：${this.forceINums}`
            // );
            if (this.preFramesDecoded === currFramesDecoded) {
              if (this.forceINums >= this.forceINumsMax) {
                prettierInfo(
                  '超过forceI次数，提示更换网络',
                  { browser: this.browser.browser },
                  'warn'
                );
                this.forceINums = 0;
              } else {
                this.forceINums += 1;
                prettierInfo(
                  `当前视频流卡主了，主动刷新云手机（${this.forceINums}/${this.forceINumsMax}）`,
                  { browser: this.browser.browser },
                  'warn'
                );
              }
            } else {
              this.forceINums = 0;
              // console.warn('视频流没有卡主');
            }
            this.preFramesDecoded = currFramesDecoded;
          };
          /** 处理黑屏 */
          const handleBlackScreen = () => {
            if (isBlack) {
              prettierInfo(
                '黑屏了',
                { browser: this.browser.browser },
                'error'
              );
            }
            // else {
            //   console.warn('没有黑屏');
            // }
          };
          /** 处理rtcStatus */
          const handleRtcStatus = () => {
            const res = this.rtcStatusIsOk();
            const length = Object.keys(res).length;
            if (length) {
              prettierInfo(
                `rtcStatus错误：${Object.keys(res).join()}`,
                { browser: this.browser.browser },
                'error'
              );
            }
            //  else {
            //   console.warn('rtcStatus正常');
            // }
          };
          handleStreamStop();
          handleBlackScreen();
          handleRtcStatus();
          // if (!networkStore.errorCode.length) {
          //   networkStore.setShowErrorModal(false);
          // }
        })
        .catch((err) => {
          console.error(new Date().toLocaleString(), 'getStatsErr', err);
          // networkStore.setErrorCode(frontendErrorCode.getStatsErr);
          // networkStore.setShowErrorModal(true);
        });
    }, this.getStatsSetIntervalDelay);
  };

  /** rtcStatus是否都是true了 */
  rtcStatusIsOk = () => {
    const res = {};
    const status = this.rtcStatus;
    Object.keys(status).forEach((key) => {
      if (!status[key]) {
        res[key] = false;
      }
    });
    return res;
  };

  /** 当前是否黑屏,true代表黑屏了，false代表没有黑屏 */
  isBlackScreen = ({
    type,
    kind,
    framesDecoded,
    decoderImplementation,
    isSafari = false,
    isChrome = false,
  }) => {
    // https://blog.csdn.net/weixin_44523653/article/details/127414387
    // console.warn(
    //   // eslint-disable-next-line
    //   `type:${type},kind:${kind},framesDecoded:${framesDecoded},decoderImplementation:${decoderImplementation}`
    // );
    if (isSafari) {
      if (
        type === 'inbound-rtp' &&
        kind === 'video' &&
        // framesDecoded等于0代表黑屏
        framesDecoded === 0
      ) {
        return true;
      }
    } else if (isChrome) {
      if (
        (type === 'track' || type === 'inbound-rtp') &&
        kind === 'video' &&
        // framesDecoded等于0代表黑屏
        framesDecoded === 0
      ) {
        return true;
      }
    } else {
      if (
        (type === 'track' || type === 'inbound-rtp') &&
        kind === 'video' &&
        // framesDecoded等于0代表黑屏
        framesDecoded === 0
      ) {
        // 安卓的qq浏览器适用这个黑屏判断
        return true;
      }
    }

    return false;
  };

  /** 获取当前帧 */
  getCurrentFramesDecoded = ({
    type,
    kind,
    framesDecoded = this.preFramesDecoded,
    isSafari = false,
    isChrome = false,
  }) => {
    if (isSafari) {
      if (type === 'inbound-rtp' && kind === 'video') {
        return framesDecoded;
      }
    } else if (isChrome) {
      if ((type === 'track' || type === 'inbound-rtp') && kind === 'video') {
        return framesDecoded;
      }
    } else {
      if ((type === 'track' || type === 'inbound-rtp') && kind === 'video') {
        // 安卓的qq浏览器适用这个卡屏判断
        return framesDecoded;
      }
    }
    return false;
  };

  // 创建offer
  createOffer = async () => {
    if (!this.peerConnection) return;
    prettierInfo('createOffer开始', { browser: this.browser.browser }, 'warn');
    try {
      const description = await this.peerConnection.createOffer({
        iceRestart: true,
      });
      // const description = await this.peerConnection.createOffer({
      //   iceRestart: true,
      //   offerToReceiveAudio: true,
      //   offerToReceiveVideo: true,
      // });
      this.localDescription = description;
      this.rtcStatus.createOffer = true;
      this.update();
      prettierInfo(
        'createOffer成功',
        { browser: this.browser.browser },
        'warn'
      );
      console.log('createOffer', description);
      return description;
    } catch (error) {
      prettierInfo(
        'createOffer失败',
        { browser: this.browser.browser },
        'error'
      );
      console.log(error);
    }
  };

  // 设置本地描述
  setLocalDescription = async (description) => {
    if (!this.peerConnection) return;
    prettierInfo(
      'setLocalDescription开始',
      { browser: this.browser.browser },
      'warn'
    );
    try {
      await this.peerConnection.setLocalDescription(description);
      this.rtcStatus.setLocalDescription = true;
      this.update();
      prettierInfo(
        'setLocalDescription成功',
        { browser: this.browser.browser },
        'warn'
      );
      console.log(description);
    } catch (error) {
      prettierInfo(
        'setLocalDescription失败',
        { browser: this.browser.browser },
        'error'
      );
      console.log('setLocalDescription', description);
      console.log(error);
    }
  };

  // 创建answer
  createAnswer = async () => {
    if (!this.peerConnection) return;
    prettierInfo('createAnswer开始', { browser: this.browser.browser }, 'warn');
    try {
      const description = await this.peerConnection.createAnswer();
      this.update();
      prettierInfo(
        'createAnswer成功',
        { browser: this.browser.browser },
        'warn'
      );
      console.log(description);
      return description;
    } catch (error) {
      prettierInfo(
        'createAnswer失败',
        { browser: this.browser.browser },
        'error'
      );
      console.log(error);
    }
  };

  // 设置远端描述
  setRemoteDescription = async (description) => {
    if (!this.peerConnection) return;
    prettierInfo(
      `setRemoteDescription开始`,
      { browser: this.browser.browser },
      'warn'
    );
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(description)
      );
      this.rtcStatus.setRemoteDescription = true;
      this.update();
      prettierInfo(
        'setRemoteDescription成功',
        { browser: this.browser.browser },
        'warn'
      );
      console.log(description);
    } catch (error) {
      prettierInfo(
        'setRemoteDescription失败',
        { browser: this.browser.browser },
        'error'
      );
      console.log('setRemoteDescription', description);
      console.log(error);
    }
  };

  addStream = (stream) => {
    if (!this.peerConnection) return;
    // if (!this.peerConnection || this.rtcStatus.addStream) return;
    this.rtcStatus.addStream = true;
    this.update();
    console.log('addStreamaddStreamaddStream', stream);
    document.querySelector<HTMLVideoElement>('#localVideo')!.srcObject = stream;
    prettierInfo('addStream成功', { browser: this.browser.browser }, 'warn');
  };

  handleStream = () => {
    console.warn(`${this.roomId}，开始监听pc的addstream`);
    this.peerConnection?.addEventListener('addstream', (event: any) => {
      console.warn(`${this.roomId}，pc收到addstream事件`, event, event.stream);
      this.addStream(event.stream);
    });

    console.warn(`${this.roomId}，开始监听pc的ontrack`);
    this.peerConnection?.addEventListener('ontrack', (event: any) => {
      console.warn(`${this.roomId}，pc收到ontrack事件`, event);
      this.addStream(event.streams[0]);
    });

    console.warn(`${this.roomId}，开始监听pc的addtrack`);
    this.peerConnection?.addEventListener('addtrack', (event: any) => {
      console.warn(`${this.roomId}，pc收到addtrack事件`, event);
    });

    console.warn(`${this.roomId}，开始监听pc的track`);
    this.peerConnection?.addEventListener('track', (event: any) => {
      console.warn(`${this.roomId}，pc收到track事件`, event);
      this.addStream(event.streams[0]);
      // document.querySelector<HTMLVideoElement>('#localVideo')!.srcObject =
      //   event.streams[0];
    });
  };

  // 创建连接
  startConnect = () => {
    if (!this.peerConnection) return;
    console.warn(`${this.roomId}，开始监听pc的icecandidate`);
    this.peerConnection.addEventListener('icecandidate', (event) => {
      prettierInfo(
        'pc收到icecandidate',
        { browser: this.browser.browser },
        'warn'
      );
      this.rtcStatus.icecandidate = true;
      this.update();
      if (event.candidate) {
        const networkStore = useNetworkStore();
        this.candidateFlag = true;
        this.update();
        console.log('准备发送candidate', event.candidate.candidate);
        const data = {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          // sender: networkStore.wsMap.get(this.roomId)?.socketIo?.id,
        };
        const roomId = this.roomId.split('___')[0];
        networkStore.wsMap
          .get(roomId)
          ?.send({ msgType: WsMsgTypeEnum.candidate, data });
      } else {
        console.log('没有候选者了');
      }
    });

    this.handleStream();

    // connectionstatechange
    this.peerConnection.addEventListener(
      'connectionstatechange',
      (event: any) => {
        prettierInfo(
          'pc收到connectionstatechange',
          { browser: this.browser.browser },
          'warn'
        );
        const connectionState = event.currentTarget.connectionState;
        const iceConnectionState = event.currentTarget.iceConnectionState;
        console.log(
          // eslint-disable-next-line
          `connectionState:${connectionState}, iceConnectionState:${iceConnectionState}`
        );
        if (connectionState === 'connected') {
          console.warn('connectionState:connected');
        }
        if (connectionState === 'failed') {
          // 失败
          console.error('connectionState:failed', event);
        }
        if (iceConnectionState === 'disconnected') {
          // 已断开，请重新连接
          console.error('iceConnectionState:disconnected', event);
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
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          // {
          //   urls: 'stun:stun.l.google.com:19302',
          // },
          {
            urls: 'turn:hsslive.cn:3478',
            username: 'hss',
            credential: '123456',
          },
        ],
      });
      // this.dataChannel =
      //   this.peerConnection.createDataChannel('MessageChannel');

      // this.dataChannel.onopen = (event) => {
      //   console.warn('dataChannel---onopen', event);
      // };
      // this.dataChannel.onerror = (event) => {
      //   console.warn('dataChannel---onerror', event);
      // };
      // this.dataChannel.onmessage = (event) => {
      //   console.log('dataChannel---onmessage', event);
      // };
      // this.peerConnection.addTransceiver('video', { direction: 'recvonly' });
      // this.peerConnection.addTransceiver('audio', { direction: 'recvonly' });
      this.startConnect();
      this.update();
    }
  };

  // 手动关闭webrtc连接
  close = () => {
    console.warn(`${new Date().toLocaleString()}，手动关闭webrtc连接`);
    if (this.sender?.sender) {
      this.peerConnection?.removeTrack(this.sender?.sender);
    }
    this.peerConnection?.close();
    this.dataChannel?.close();
    this.peerConnection = null;
    this.dataChannel = null;
    this.update();
  };

  // 更新store
  update = () => {
    const networkStore = useNetworkStore();
    networkStore.updateRtcMap(this.roomId, this);
  };
}
