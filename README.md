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
- [x] srs webrtc 推流， `webrtc` 或 `http-flv` 或 `hls`拉流
- [x] [obs](https://github.com/obsproject/obs-studio)推流
- [x] 支付宝打赏
- [x] 用户模块
- [x] 订单模块
- [ ] 礼物模块
- [ ] 在线后台
- [ ] 适配移动端
- [ ] 敬请期待！

## 预览

- 线上地址：[https://live.hsslive.cn](https://live.hsslive.cn)

## b 站视频

- [从零搭建迷你版 b 站 web 直播间（Vue3+WebRTC+Node+SRS），公开课一：项目功能介绍 1](https://www.bilibili.com/video/BV1vW4y1Q7gP)
- [从零搭建迷你版 b 站 web 直播间（Vue3+WebRTC+Node+SRS），公开课一：项目功能介绍 2](https://www.bilibili.com/video/BV1tP411q7qw)
- [从零搭建迷你版 b 站 web 直播间（Vue3+WebRTC+Node+SRS），公开课二：本地运行项目 1](https://www.bilibili.com/video/BV1KW4y1D7Z6)
- [从零搭建迷你版 b 站 web 直播间（Vue3+WebRTC+Node+SRS），公开课二：本地运行项目 2](https://www.bilibili.com/video/BV1jc411u7K9)

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

- 打包

```bash
npm run build
```

## FAQ

[https://live.hsslive.cn/about/faq](https://live.hsslive.cn/about/faq)

~~不通过 npm 安装 flv.js，因为安装了 flv.js 后，`import flvJs from 'flv.js'` 会导致 vscode 的 ts 错乱。因此直接下载 flv.min.js 使用。~~，应该是我的 vscode 用了 vscode 的 ts 版本（ts 的 5.x 版本），用回工作区（也就是项目里面安装的 ts 的 4.9 的版本）的 ts 版本就没事了

## 团队

[https://live.hsslive.cn/about/team](https://live.hsslive.cn/about/team)

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

## 环境配置

### 本地开发环境

> 配置：macbookpro 2020 m1，8 核 CPU，16G 内存

- 操作系统：mac os 13.3.1
- node 版本：16.16.0
- pnpm 版本：8.6.3
- docker 版本：20.10.24, build 297e128
- mysql 版本：基于 docker，镜像：mysql:8.0
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5
- ffmpeg 版本：5.1.2

### 构建/托管服务器环境

> 配置：4 核 CPU，4G 内存，8M 带宽（广州）

- 操作系统：CentOS Linux release 8.2.2004
- nginx 版本：1.22.1
- node 版本：v16.19.1
- pnpm 版本：8.6.3
- docker 版本：23.0.1, build a5ee5b1
- redis 版本：基于 docker，镜像：redis:7.0
- mysql 版本：基于 docker，镜像：mysql:8.0

### 流媒体服务器环境

> 配置：2 核 CPU，2G 内存，带宽 30M（香港）

- 操作系统：Alibaba Cloud Linux release 3 (Soaring Falcon)
- node 版本：v16.20.0
- pnpm 版本：8.6.3
- pm2 版本：5.3.0
- docker 版本：24.0.2, build cb74dfc
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5
- ffmpeg 版本：6.0
