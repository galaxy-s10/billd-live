import browserTool from 'browser-tool';

import { ICandidate } from '@/interface';
import { useNetworkStore } from '@/store/network';

import { WsMsgTypeEnum } from './webSocket';

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
  videoEl;
  peerConnection: RTCPeerConnection | null = null;
  dataChannel: RTCDataChannel | null = null;

  sender?: RTCRtpTransceiver;

  getStatsSetIntervalDelay = 1000;
  getStatsSetIntervalTimer;

  // getStatsSetIntervalDelay是1秒的话，forceINumsMax是3，就代表一直卡了3秒。
  forceINums = 0; // 发送forceI次数
  forceINumsMax = 3; // 最多发送几次forceI

  preFramesDecoded = -1; // 上一帧

  maxBitrate: number; // 当前码率
  resolutionRatio: number; // 当前分辨率

  localStream?: MediaStream;

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

  constructor({
    roomId,
    videoEl,
    maxBitrate,
    resolutionRatio,
  }: {
    roomId: string;
    videoEl: HTMLVideoElement;
    maxBitrate?: number;
    resolutionRatio?: number;
  }) {
    this.roomId = roomId;
    this.videoEl = videoEl;
    this.maxBitrate = maxBitrate || 1000;
    this.resolutionRatio = resolutionRatio || 1080;
    this.browser = browserTool();
    this.createPeerConnection();
    this.update();
    // this.handleWebRtcError();
  }

  prettierLog = (msg: string, type?: 'log' | 'warn' | 'error', ...args) => {
    console[type || 'log'](
      `${new Date().toLocaleString()}，${this.roomId}，${
        this.browser.browser
      }浏览器，${msg}`,
      ...args
    );
  };

  addTrack = (track, stream) => {
    const sender = this.peerConnection
      ?.getSenders()
      .find((s) => s.track === track);
    if (!sender) {
      console.warn('开始addTrack', this.roomId, track, stream);
      this.peerConnection?.addTrack(track, stream);
      this.localStream = stream;
      this.setMaxBitrate(this.maxBitrate);
      this.setResolutionRatio(this.resolutionRatio);
    } else {
      console.warn('不addTrack了', this.roomId, track, stream);
    }
  };

  setResolutionRatio = (height: number) => {
    console.log('开始设置分辨率', height);
    return new Promise((resolve) => {
      this.localStream?.getTracks().forEach((track) => {
        if (track.kind === 'video') {
          track
            .applyConstraints({
              height,
            })
            .then(() => {
              console.log('设置分辨率成功');
              resolve(1);
            })
            .catch((error) => {
              console.error('设置分辨率失败', error);
              resolve(0);
            });
        }
      });
    });
  };

  setMaxBitrate = (maxBitrate: number) => {
    console.log('开始设置码率', maxBitrate);
    return new Promise<number>((resolve) => {
      this.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'video') {
          const parameters = { ...sender.getParameters() };
          if (parameters.encodings[0]) {
            parameters.encodings[0].maxBitrate = 1000 * maxBitrate;
            sender
              .setParameters(parameters)
              .then(() => {
                console.log('设置码率成功');
                resolve(1);
              })
              .catch((error) => {
                console.error('设置码率失败', error);
                resolve(0);
              });
          }
        }
      });
    });
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
                this.prettierLog('超过forceI次数，提示更换网络', 'warn');
                this.forceINums = 0;
              } else {
                this.forceINums += 1;
                this.prettierLog(
                  `当前视频流卡主了，主动刷新云手机（${this.forceINums}/${this.forceINumsMax}）`,
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
              this.prettierLog('黑屏了', 'error');
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
              this.prettierLog(
                `rtcStatus错误：${Object.keys(res).join()}`,
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
    this.prettierLog('createOffer开始', 'warn');
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
      this.prettierLog('createOffer成功', 'warn');
      console.log('createOffer', description);
      return description;
    } catch (error) {
      this.prettierLog('createOffer失败', 'error');
      console.log(error);
    }
  };

  // 设置本地描述
  setLocalDescription = async (description) => {
    if (!this.peerConnection) return;
    this.prettierLog('setLocalDescription开始', 'warn');
    try {
      await this.peerConnection.setLocalDescription(description);
      this.rtcStatus.setLocalDescription = true;
      this.update();
      this.prettierLog('setLocalDescription成功', 'warn');
      console.log(description);
    } catch (error) {
      this.prettierLog('setLocalDescription失败', 'error');
      console.log('setLocalDescription', description);
      console.log(error);
    }
  };

  // 创建answer
  createAnswer = async () => {
    if (!this.peerConnection) return;
    this.prettierLog('createAnswer开始', 'warn');
    try {
      const description = await this.peerConnection.createAnswer();
      this.update();
      this.prettierLog('createAnswer成功', 'warn');
      console.log(description);
      return description;
    } catch (error) {
      this.prettierLog('createAnswer失败', 'error');
      console.log(error);
    }
  };

  // 设置远端描述
  setRemoteDescription = async (description) => {
    if (!this.peerConnection) return;
    this.prettierLog(`setRemoteDescription开始`, 'warn');
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(description)
      );
      this.rtcStatus.setRemoteDescription = true;
      this.update();
      this.prettierLog('setRemoteDescription成功', 'warn');
      console.log(description);
    } catch (error) {
      this.prettierLog('setRemoteDescription失败', 'error');
      console.log('setRemoteDescription', description);
      console.log(error);
    }
  };

  addStream = (stream) => {
    if (!this.peerConnection) return;
    this.rtcStatus.addStream = true;
    this.update();
    console.log('开始addStream', this.videoEl, stream, this.roomId);
    this.videoEl.srcObject = stream;
    this.prettierLog('addStream成功', 'warn');
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
    });
  };

  // 创建连接
  startConnect = () => {
    if (!this.peerConnection) return;
    this.handleStream();
    console.warn(`${this.roomId}，开始监听pc的icecandidate`);
    this.peerConnection.addEventListener('icecandidate', (event) => {
      this.prettierLog('pc收到icecandidate', 'warn');
      this.rtcStatus.icecandidate = true;
      this.update();
      if (event.candidate) {
        const networkStore = useNetworkStore();
        this.update();
        console.log('准备发送candidate', event.candidate.candidate);
        const roomId = this.roomId.split('___')[0];
        const receiver = this.roomId.split('___')[1];
        const data: ICandidate['data'] = {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sender: networkStore.wsMap.get(roomId)?.socketIo?.id || '',
          receiver,
          live_room_id: Number(roomId),
        };
        networkStore.wsMap
          .get(roomId)
          ?.send({ msgType: WsMsgTypeEnum.candidate, data });
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
