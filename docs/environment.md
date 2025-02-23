## 本地开发环境

> 配置：MacBook Pro 2023 Apple M3 Max，14 核 CPU，36G 内存

- 操作系统：mac os 14.1
- node 版本：v18.19.0
- pnpm 版本：8.6.3
- docker 版本：24.0.5, build ced0996
- mysql 版本：基于 docker，镜像：mysql:8.0
- redis 版本：基于 docker，镜像：redis:7.0
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.170
- ffmpeg 版本：6.1.1

## 构建/托管服务器环境

> 配置：4 核 CPU，4G 内存，8M 峰值带宽（广州）

- 操作系统：CentOS Linux release 8.2.2004
- nginx 版本：1.22.1
- node 版本：v16.19.1
- pnpm 版本：8.6.3
- docker 版本：23.0.1, build a5ee5b1
- mysql 版本：基于 docker，镜像：mysql:8.0
- redis 版本：基于 docker，镜像：redis:7.0

## 流媒体服务器环境

> ~~配置：2 核 CPU，2G 内存，30M 峰值带宽（香港）~~，2G 内存也能跑，但偶尔会占满内存导致服务器卡死。
>
> 配置：2 核 CPU，4G 内存，30M 峰值带宽（香港）

- 操作系统：Alibaba Cloud Linux release 3 (Soaring Falcon)
- node 版本：v16.20.0
- pnpm 版本：8.6.3
- pm2 版本：5.3.0
- docker 版本：24.0.2, build cb74dfc
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.170
- ffmpeg 版本：6.0
