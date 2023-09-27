<p align="center">
  <a href="https://live.hsslive.cn" target="_blank">
    <img
      width="200"
      src="https://github.com/galaxy-s10/billd-live/blob/master/src/assets/img/logo-txt.svg"
      alt="Billd-Live logo"
    />
  </a>
</p>

<h1 align="center">
  Billd-Live
</h1>

<p align="center">
  基于Vue3 + WebRTC + Node + SRS + FFmpeg搭建的直播间
</p>

## 生态

| 名称       | 仓库                                                                 | star & fork                                                                                                                                                                                                                                                                                                 | 线上地址                                                       |
| ---------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 直播间前台 | [billd-live](https://github.com/galaxy-s10/billd-live)               | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live)                             | [https://live.hsslive.cn](https://live.hsslive.cn)             |
| 直播间后台 | [billd-live-admin](https://github.com/galaxy-s10/billd-live-admin)   | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-admin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-admin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin)     | [https://live-admin.hsslive.cn](https://live-admin.hsslive.cn) |
| 直播间后端 | [billd-live-server](https://github.com/galaxy-s10/billd-live-server) | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-server?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-server?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server) | [https://live-api.hsslive.cn](https://live-api.hsslive.cn)     |

## 简介

billd 直播间，目前实现了类似 [bilibili 的 Web 在线直播](https://live.bilibili.com)功能，即你（房主）可以发布直播，别人进入你的直播间后能看到你的直播内容；而你也可以作为观众，进入别人的直播间看别人的直播内容。

## 功能

- [x] 原生 webrtc 推拉流
- [x] srs webrtc 推流，`http-flv` 或 `hls`拉流
- [x] msr 推流，ffmpeg转码，`http-flv` 或 `hls`拉流
- [x] 前端混流
- [x] 推流鉴权
- [x] [OBS](https://github.com/obsproject/obs-studio)、[FFmpeg](https://ffmpeg.org)推流
- [x] 用户模块（qq 登录）
- [x] 支付模块（支付宝当面付）
- [x] 订单模块
- [x] 商品模块
- [x] 适配移动端
- [x] 在线后台
- [x] 接入腾讯云直播

## 技术栈

- 前端相关：[Vue3](https://vuejs.org) 以及相关技术栈、`Typescript`、`WebRTC`、`Web Workder`、`Web Audio`、`Canvas`
- 后端相关：[Nodejs](https://nodejs.org) 以及相关技术栈、`Koa2`、`Sequelize`、`Mysql`、`Redis`、`Socket.io`
- 流媒体服务器相关：[SRS](https://ossrs.net)、 [FFmpeg](https://ffmpeg.org)、[Coturn](https://github.com/coturn/coturn)
- Docker 相关：[Docker](https://www.docker.com)

## 预览

线上地址：[https://live.hsslive.cn](https://live.hsslive.cn)

### 电脑端

- 首页

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/95849774-1df0-4a59-b726-8d3bc0795619" 
  style="width:800px"
/>

- 进入直播间

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/91ac3f5f-b06d-46b3-84bc-ab6e0add4d5b" 
  style="width:800px"
/>

- 发起直播

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/81e2f413-8470-42ab-bee7-699e2f8f0290" 
  style="width:800px"
/>

- 排行榜

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/6d7d79b6-e8b9-42ff-9e25-d44c41948579" 
  style="width:800px"
/>

### 移动端

- 首页

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/9b56e99a-f821-4c9c-b9c3-330c2f61d533" 
  style="height:500px"
/>

- 进入直播间

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/db4145a9-517d-45a5-9c74-641892d55a3e" 
  style="height:500px"
/>

## 本地启动

> b站视频：[从零搭建迷你版b站web直播间合集](https://space.bilibili.com/381307133/channel/collectiondetail?sid=1458070)

- 安装依赖（建议使用 node 版本：16.16.0）

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest
```

- 运行

```bash
npm run start
```

- 打包

```bash
npm run build
```

## 兼容性

- [x] iphone 14
- [x] 三星 s10
- [x] ipad air 3

## FAQ

[https://live.hsslive.cn/about/faq](https://live.hsslive.cn/about/faq)

## 环境配置

### 本地开发环境

> 配置：macbookpro 2020 m1，8 核 CPU，16G 内存

- 操作系统：mac os 13.3.1
- node 版本：16.16.0
- pnpm 版本：8.6.3
- docker 版本：24.0.5, build ced0996
- mysql 版本：基于 docker，镜像：mysql:8.0
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.170
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
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.170
- ffmpeg 版本：6.0
