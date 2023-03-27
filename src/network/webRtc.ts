export class WebRTCClass {
  peerConnection: RTCPeerConnection | null = null;
  dataChannel: RTCDataChannel | null = null;

  constructor() {
    this.createPeerConnection();
  }

  // 创建offer
  createOffer = async () => {
    if (!this.peerConnection) return;
    try {
      const description = await this.peerConnection.createOffer();
      console.warn('createOffer成功');
      await this.peerConnection.setLocalDescription(description);
      console.warn('setLocalDescription成功', description);
      return description;
    } catch (error) {
      console.error('创建offer失败', error);
    }
  };

  // 设置远端描述
  setRemoteDescription = async (description: any) => {
    if (!this.peerConnection) return;
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(description)
      );
      console.warn('设置远端描述成功');
    } catch (error) {
      console.error('设置远端描述错误', error);
    }
  };

  // 创建连接
  createConnect = () => {
    if (!this.peerConnection) return;
    console.warn('createConnect');
    this.peerConnection.addEventListener('icecandidate', (event) => {
      console.log('icecandidate:', event);
    });

    this.peerConnection.addEventListener('addstream', (event: any) => {
      console.log('addstream', event.stream);
    });

    // 已经有视频或者声音通道
    this.peerConnection.addEventListener('ontrack', (event: any) => {
      console.log('ontrack', event.stream.id);
    });

    // 有视频或者声音通道
    this.peerConnection.addEventListener('addtrack', (event: any) => {
      console.log('addtrack', event.stream.id);
    });

    // connectionstatechange
    this.peerConnection.addEventListener(
      'connectionstatechange',
      (event: any) => {
        console.log('connectionstatechange', event);
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
  createPeerConnection() {
    if (!window.RTCPeerConnection) {
      console.error('当前环境不支持RTCPeerConnection！');
      alert('当前环境不支持RTCPeerConnection！');
      return;
    }
    if (!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection();
      this.dataChannel =
        this.peerConnection.createDataChannel('MessageChannel');

      this.dataChannel.onopen = (event) => {
        console.warn('dataChannel---onopen', event);
      };
      this.dataChannel.onerror = (event) => {
        console.warn('dataChannel---onerror', event);
      };
      this.dataChannel.onmessage = (event) => {
        console.log('dataChannel---onmessage', event);
      };
      this.peerConnection.addTransceiver('video', { direction: 'recvonly' });
      this.peerConnection.addTransceiver('audio', { direction: 'recvonly' });
      this.createConnect();
    }
  }

  // 手动关闭webrtc连接
  close() {
    console.warn(`${new Date().toLocaleString()}，手动关闭webrtc连接`);
    this.peerConnection?.close();
    this.dataChannel?.close();
    this.peerConnection = null;
    this.dataChannel = null;
  }
}
