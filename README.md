<p align="center">
  <a href="https://live.hsslive.cn" target="_blank">
    <img
      width="200"
      src="https://resource.hsslive.cn/billd-live/image/240160ddbc14367f7e0126c1f5b09b69.svg"
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

<div align="center">

![stars](https://img.shields.io/github/stars/galaxy-s10/billd-live)
![forks](https://img.shields.io/github/forks/galaxy-s10/billd-live)

![version](https://img.shields.io/github/package-json/v/galaxy-s10/billd-live)
![License](https://img.shields.io/github/license/galaxy-s10/billd-live)
![language](https://img.shields.io/github/languages/top/galaxy-s10/billd-live)

</div>

## 🎉🎉🎉

- 2025 年起，billd-live-pro 项目的所有仓库将进入 prod 状态！
- 2025 年起，billd-live 项目的所有仓库将进入 dev 状态！

## 简介

billd 直播间，目前实现了类似 [bilibili 的 Web 在线直播](https://live.bilibili.com)功能，即你（房主）可以发布直播，别人进入你的直播间后能看到你的直播内容；而你也可以作为观众，进入别人的直播间看别人的直播内容。

## 生态

| 名称         | 仓库                                                                             | star & fork                                                                                                                                                                                                                                                                                                                         | 线上地址                                                             |
| ------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 直播间前台   | [billd-live](https://github.com/galaxy-s10/billd-live)                           | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live)                                                     | [https://live.hsslive.cn](https://live.hsslive.cn)                   |
| 直播间后端   | [billd-live-server](https://github.com/galaxy-s10/billd-live-server)             | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-server?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-server?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server)                         | [https://live-api.hsslive.cn](https://live-api.hsslive.cn)           |
| 直播间后台   | [billd-live-admin](https://github.com/galaxy-s10/billd-live-admin)               | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-admin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-admin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin)                             | [https://live-admin.hsslive.cn](https://live-admin.hsslive.cn)       |
| 直播间移动端 | [billd-live-flutter](https://github.com/galaxy-s10/billd-live-flutter)           | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-flutter?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-flutter) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-flutter?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-flutter)                     | [https://live.hsslive.cn/download](https://live.hsslive.cn/download) |
| 直播间移动端 | [billd-live-react-native](https://github.com/galaxy-s10/billd-live-react-native) | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-react-native?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-react-native) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-react-native?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-react-native) | [https://live.hsslive.cn/download](https://live.hsslive.cn/download) |
| 直播间客户端 | [billd-live-electron](https://github.com/galaxy-s10/billd-live-electron)         | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-electron?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-flutter) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-electron?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-electron)                  | [https://live.hsslive.cn/download](https://live.hsslive.cn/download) |
| 直播间移动端 | [billd-live-kotlin](https://github.com/galaxy-s10/billd-live-kotlin)             | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-kotlin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-kotlin) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-kotlin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-kotlin)                         | [https://live.hsslive.cn/download](https://live.hsslive.cn/download) |

## 功能

- [x] 原生 webrtc 推拉流
- [x] srs webrtc 推流，支持 `http-flv`、`hls`、`webrtc`、`rtmp`拉流
- [x] msr 推流，ffmpeg 转码，支持 `http-flv`、`hls`、`webrtc`、`rtmp`拉流
- [x] 一对一打 PK
- [x] 一对多打 PK
- [x] 多对多打 PK
- [x] 多平台转推（b 站、虎牙直播）
- [x] 前端混流
- [x] 推流鉴权
- [x] 拉流鉴权
- [x] [OBS](https://github.com/obsproject/obs-studio)、[FFmpeg](https://ffmpeg.org)推流
- [x] 用户模块（qq 登录）
- [x] 支付模块（支付宝当面付）
- [x] 订单模块
- [x] 商品模块
- [x] 礼物模块
- [x] 直播后台
- [x] 响应式页面
- [x] 适配多语言（i18n）
- [x] 移动端 App（Flutter）
- [ ] 客户端 App（Electron）
- [x] 接入 bilibili 直播
- [x] 接入腾讯云（云直播）
- [ ] 接入腾讯云（实时音视频 TRTC）
- [x] 私有化部署

## 预览

线上地址：[https://live.hsslive.cn](https://live.hsslive.cn)

### 电脑端（web）

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

### 移动端（web）

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

### 后台（web）

### 安卓端（flutter）

- 首页

<img
  src="https://resource.hsslive.cn/billd-live/image/38a0fae4c5104913ca0b7617ca58b518.webp" 
  style="width:300px"
/><img
  src="https://resource.hsslive.cn/billd-live/image/8fa5423182476341ade6d74dba9eac0f.webp" 
  style="width:300px"
/><img
  src="https://resource.hsslive.cn/billd-live/image/a6df703d48c3c3e5ec708ebf0b48f345.webp" 
  style="width:300px"
/>

- 直播间详情、分区详情

<img
  src="https://resource.hsslive.cn/billd-live/image/420a663259487309a51cdc0d44b01246.webp" 
  style="width:300px"
/> <img
  src="https://resource.hsslive.cn/billd-live/image/da8d31cda66f51b95cd8b34f4cbeb680.webp" 
  style="width:300px"
/>

-

<img
  src="https://resource.hsslive.cn/billd-live/image/3a777718d31f94e6d25071d29f5e5185.webp" 
  style="width:300px"
/> <img
  src="https://resource.hsslive.cn/billd-live/image/e785bc308c2d24460baf36f65aa39c5e.webp" 
  style="width:300px"
/>

- 直播中心

<img
  src="https://resource.hsslive.cn/billd-live/image/77b89ccf7a10be1663f7e9d5bc69565d.jpg" 
  style="width:300px"
/> <img
  src="https://resource.hsslive.cn/billd-live/image/90f505de2580b69aed73ea5c5717e669.jpg" 
  style="width:300px"
/>

## 技术栈

- 前端相关：[Vue3](https://vuejs.org) 以及相关技术栈、`Typescript`、`WebRTC`、`WebCodecs`、`Web Workder`、`Web Audio`、`Canvas`
- 后端相关：[Nodejs](https://nodejs.org) 以及相关技术栈、`Koa2`、`Typescript`、`Sequelize`、`Mysql`、`Redis`、`Socket.io`
- 客户端相关：[Flutter3](https://flutter.dev)以及相关技术栈、`getx`、`WebRTC`
- 流媒体服务器相关：[SRS](https://ossrs.net)、 [FFmpeg](https://ffmpeg.org)、[Coturn](https://github.com/coturn/coturn)
- Docker 相关：[Docker](https://www.docker.com)

## 本地启动

- [x] billd-live(pro) 查看 [start-client.md](docs/start-client.md)

- [x] billd-live-server(pro) 查看 [start-server.md](docs/start-server.md)

- [x] billd-live-flutter(pro) 查看 [start-app.md](docs/start-app.md)

## 性能测试

查看 [benchmarking.md](docs/benchmarking.md)

## 常见问题

查看 [faq.md](docs/faq.md)

查看 [https://live.hsslive.cn/doc/faq](https://live.hsslive.cn/doc/faq)

## 环境配置

查看 [environment.md](docs/environment.md)

## 相关视频

查看 [从零搭建迷你版 b 站 web 直播间合集](https://space.bilibili.com/381307133/lists/1458070?type=season)

## 接口文档

查看 [https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed](https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed)

## 技术支持

查看 [https://live.hsslive.cn/support](https://live.hsslive.cn/support)

## 客户端下载

查看 [https://live.hsslive.cn/download](https://live.hsslive.cn/download)

## 私有化部署

查看 [https://live.hsslive.cn/privatizationDeployment](https://live.hsslive.cn/privatizationDeployment)

## 兼容性

- [x] iphone 14
- [x] 三星 s10
- [x] ipad air 3

## 贡献者

  <a href="https://github.com/galaxy-s10/billd-live/graphs/contributors" target="_blank">
    <img
      width="200"
      src="https://contrib.rocks/image?repo=galaxy-s10/billd-live"
      alt="Billd-Live logo"
    />
  </a>
