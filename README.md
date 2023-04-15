# 简介

billd 直播间（前端），目前实现了类似 bilibili 的直播功能，即你可以发布直播，别人进入你的直播房间后能看到你的直播内容。

主要技术栈：

- webrtc 相关 api（RTCPeerConnection）
- vue3
- socket.io

> 如果你对该项目有感兴趣或想法，欢迎一起加入开发（可能不久后就会将该仓库设置为私有）~

# 演示

<div>
  <video
    src="https://project.hsslive.cn/billd_live.mp4"
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

# 后端

[https://github.com/galaxy-s10/billd-live-server](https://github.com/galaxy-s10/billd-live-server)

# billd 依赖

```bash
pnpm i billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest billd-deploy@latest
```
