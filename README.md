# 简介

billd 直播间（前端），目前实现了类似 bilibili 的直播功能，即你可以发布直播，别人进入你的直播房间后能看到你的直播内容。

前后端主要的技术栈：

- webrtc 相关 api（[RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)）
- [vue3](https://vuejs.org) 以及相关技术栈
- [nodejs](https://nodejs.org) 以及相关技术栈
- [socket.io](https://socket.io)
- [coturn](https://github.com/coturn/coturn)

# 后端

> 需要 mysql、redis 环境

[https://github.com/galaxy-s10/billd-live-server](https://github.com/galaxy-s10/billd-live-server)

# 贡献

> 如果你对该项目有感兴趣或想法，欢迎一起加入开发

<div>
  <img
    src="https://resource.hsslive.cn/image/8293fce7457e7188e1288fb044c7902d.webp" 
    style="width:300px"
    />
</div>

# 演示

<div>
  <video
    src="https://user-images.githubusercontent.com/61055341/232222153-cbd0c7d9-ae1c-436f-9fa4-a3c4c9537a95.mp4"
    autoplay
    webkit-playsinline="true"
    playsinline
    x-webkit-airplay="allow"
    x5-video-player-type="h5"
    x5-video-player-fullscreen="true"
    x5-video-orientation="portraint"
    muted
    controls
  ></video>
</div>

# 安装依赖

```bash
pnpm i
```

# 本地运行

```bash
npm run start
```

# billd 依赖

```bash
pnpm i billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest billd-deploy@latest
```
