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
![language](https://img.shields.io/github/languages/top/galaxy-s10/billd-live-server)
![language](https://img.shields.io/github/languages/top/galaxy-s10/billd-live-flutter)

</div>

## ⭐️ BilldLive

> [!CAUTION]
> BilldLive 目前仍未发布稳定版，不建议开发者用于生产环境！

## ⚡️ BilldLivePro

`BilldLivePro` 稳定性更高、性能更强、代码可读性更好、更新更频繁！

> [!WARNING]
> BilldLivePro 对普通用户不影响，一直免费。
>
> BilldLivePro 主要针对开发者。源码并不开源，需付费订阅：[https://live.hsslive.cn/price](https://live.hsslive.cn/price)

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

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a1.png?raw=true)

- 分区

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a11.png?raw=true)

- 进入直播间

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a2.png?raw=true)

- 发起直播

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a3.png?raw=true)

- 排行榜

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a4.png?raw=true)

- 用户中心

> 个人信息

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a5.png?raw=true)

> 个人收益

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a6.png?raw=true)

- 直播中心

> 直播间信息

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a8.png?raw=true)

> 开播设置

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a9.png?raw=true)

> 直播数据

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a10.png?raw=true)

### 移动端（web）

- 首页

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a12.png?raw=true)

- 进入直播间

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a13.png?raw=true)

### 后台（web）

- 控制台

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a14.png?raw=true)

- 黑名单

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a15.png?raw=true)

- 直播管理

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a16.png?raw=true)

- 直播记录

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a17.png?raw=true)

- 直播间列表

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a18.png?raw=true)

- 直播间消息列表

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a19.png?raw=true)

- 订单列表

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a20.png?raw=true)

- 商品列表

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a21.png?raw=true)

- 全局消息列表

![img](https://github.com/galaxy-s10/billd-live/blob/main/readme_img/a7.png?raw=true)

### 安卓端（flutter）

- 首页

联系作者。

- 直播间详情、分区详情

联系作者。

- 直播中心

联系作者。

## 技术栈

- 前端相关：[Vue3](https://vuejs.org) 以及相关技术栈、`Typescript`、`WebRTC`、`WebCodecs`、`Web Workder`、`Web Audio`、`Canvas`
- 后端相关：[Nodejs](https://nodejs.org) 以及相关技术栈、`Koa2`、`Typescript`、`Sequelize`、`Mysql`、`Redis`、`Socket.io`
- 客户端相关：[Flutter3](https://flutter.dev)以及相关技术栈、`getx`、`WebRTC`
- 流媒体服务器相关：[SRS](https://ossrs.net)、 [FFmpeg](https://ffmpeg.org)、[Coturn](https://github.com/coturn/coturn)
- Docker 相关：[Docker](https://www.docker.com)

## 直播性能

### 延迟

- webrtc 直播：最低 300ms 左右
- 其他直播：最低 3000ms 左右

## 接口性能

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

## 问题反馈

欢迎提 [issue](https://github.com/galaxy-s10/billd-live/issues)

## 参与贡献

欢迎提 [pr](https://github.com/galaxy-s10/billd-live/pulls)

## 客户端下载

查看 [https://live.hsslive.cn/download](https://live.hsslive.cn/download)

## 私有化部署

billd-live 完全开源（可商用），欢迎部署！

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

## 官方交流群

![img](https://github.com/galaxy-s10/billd-live/blob/master/src/assets/readme_img/wechat_group.jpg)
