<p align="center">
  <a href="https://live.hsslive.cn" target="_blank">
    <img
      width="200"
      src="https://resource.hsslive.cn/image/1613141138717Billd.webp"
      alt="Billd-Live logo"
    />
  </a>
</p>

<h1 align="center">
  Billd-Live
</h1>

<p align="center">
  基于Vue3 + WebRtc + Node + SRS + FFmpeg搭建的直播间
</p>

## 简介

billd 直播间，目前实现了类似 [bilibili 的 Web 在线直播](https://live.bilibili.com)功能，即你（房主）可以发布直播，别人进入你的直播间后能看到你的直播内容；而你也可以作为观众，进入别人的直播间看别人的直播内容。

> 后端：[https://github.com/galaxy-s10/billd-live-server](https://github.com/galaxy-s10/billd-live-server)

## 功能

- [x] 原生 webrtc 推拉流
- [x] srs webrtc 推流， `webrtc` 或 `http-flv` 拉流
- [ ] [obs](https://github.com/obsproject/obs-studio)推流
- [x] 支付宝打赏
- [ ] 用户模块
- [ ] 订单模块
- [ ] 礼物模块
- [ ] 在线后台
- [ ] 适配移动端
- [ ] 敬请期待！

## 预览

- [https://live.hsslive.cn](https://live.hsslive.cn) - 线上地址

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

## 准备

- 前端相关：[vue3](https://vuejs.org) 以及相关技术栈
- 后端相关： [nodejs](https://nodejs.org) 以及相关技术栈、[socket.io](https://socket.io)
- webrtc 相关： webrtc 相关 api（[RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)）、[coturn](https://github.com/coturn/coturn)
- 流媒体服务器相关： [srs](https://ossrs.net)、 [ffmpeg](https://ffmpeg.org)
- 数据库相关： mysql、redis
- docker 相关：[docker](https://www.docker.com)

## 安装和使用

- 获取项目代码

```bash
git clone https://github.com/galaxy-s10/billd-live.git
```

- 安装依赖

> 建议使用 node 版本：16.16.0

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest billd-deploy@latest
```

- 运行

```bash
npm run start
```

## 赞助

[https://live.hsslive.cn/sponsors](https://live.hsslive.cn/sponsors)

## 交流

如果你对该项目感兴趣或有想法，欢迎进群或添加我的微信：

<div>
  <img
    src="https://resource.hsslive.cn/image/1443d854f04cd03980343ef3d003a427.webp" 
    style="height:300px"
    />
  <img
    src="https://resource.hsslive.cn/image/57c5b5598736e6e4f7e406ae503120f8.webp" 
    style="height:300px"
    />
</div>
