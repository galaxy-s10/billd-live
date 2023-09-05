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
  基于Vue3 + WebRtc + Node + SRS + FFmpeg搭建的直播间
</p>

## ⚡️ 生态系统

| 名称       | 仓库                                                                 | star & fork                                                                                                                                                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 直播间前台 | [billd-live](https://github.com/galaxy-s10/billd-live)               | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live)                             |
| 直播间后台 | [billd-live-admin](https://github.com/galaxy-s10/billd-live-admin)   | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-admin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-admin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin)     |
| 直播间后端 | [billd-live-server](https://github.com/galaxy-s10/billd-live-server) | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-server?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-server?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server) |

## 📢 注意

该项目一开始只是为了记录本人学习直播相关技术的过程，初心也是将它作为开源项目，让想要学习直播技术相关的人能有些借鉴（因为市面上能找到的直播相关资源少之又少），但随着项目不断的完善，我发现虽然项目涉及的技术栈不是很难，但都不是常规的技术栈，而我也因此花费了大量的时间和精力（为什么市面上能找到的直播相关资源很少？突然明白了。）

也因此萌生了将它作为商业项目的想法，而我又不希望因为一些值得付费的功能，就此将仓库设置为私有，所以我决定后续会将一些 **`基础功能开源`**，而那些我认为值得 **`付费的功能不会开源`**，而是会作为扩展插件或者其他形式添加进项目里。

## 🙏 寻求贡献

该项目从创建至今，所有东西都是只有我一个人在维护，非常期待有能力的各位参与进来，并且如果该项目有收益的话，会按劳分配给参与贡献的所有人~

## 🚀 私有化部署

查看详情：[https://live.hsslive.cn/privatizationDeployment](https://live.hsslive.cn/privatizationDeployment)

## 简介

billd 直播间，目前实现了类似 [bilibili 的 Web 在线直播](https://live.bilibili.com)功能，即你（房主）可以发布直播，别人进入你的直播间后能看到你的直播内容；而你也可以作为观众，进入别人的直播间看别人的直播内容。

## 功能

> 基本复刻了 b 站 web 直播间

- [x] 原生 webrtc 推拉流
- [x] srs webrtc 推流， `webrtc` 或 `http-flv` 或 `hls`拉流
- [x] 前端混流
- [x] [OBS](https://github.com/obsproject/obs-studio)推流
- [x] 用户模块（qq 登录）
- [x] 支付模块（支付宝当面付）
- [x] 订单模块
- [x] 商品模块
- [x] 适配移动端
- [x] 在线后台

## 设备兼容

- [x] iphone 14
- [x] 三星 s10
- [x] ipad air 3

## 预览

线上地址：[https://live.hsslive.cn](https://live.hsslive.cn)

### 电脑端界面

> 首页

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/68543c4c-ef8c-42ce-af06-cfd3880199e6" 
  style="width:800px"
/>

> 进入直播间

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/99cac75d-76ff-4644-a686-8238390c2c25" 
  style="width:800px"
/>

> 发起直播

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/40dd55ac-d998-4617-81d0-0c86b6332a19" 
  style="width:800px"
/>

> 排行榜

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/35a81bea-b428-4fe1-a184-a9b8c0ef6ca6" 
  style="width:800px"
/>

### 移动端界面

> 首页

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/3253cb33-69a4-44f7-b23f-2ef7f9e4dc8c" 
  style="height:500px"
/>

> 分区列表

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/5a29c965-9979-4ba8-b120-ab2a164d0bf2" 
  style="height:500px"
/>

> 进入直播间

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/e52f1676-2d76-4203-b2fa-c094e7ef02fe" 
  style="height:500px"
/>

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

## FAQ

[https://live.hsslive.cn/about/faq](https://live.hsslive.cn/about/faq)

## 团队

[https://live.hsslive.cn/about/team](https://live.hsslive.cn/about/team)

## 赞助

[https://live.hsslive.cn/sponsors](https://live.hsslive.cn/sponsors)

## 微信群

[https://live.hsslive.cn/about/group](https://live.hsslive.cn/about/group)

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
