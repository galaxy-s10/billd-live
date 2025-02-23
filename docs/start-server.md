## billd-live-server(pro)

## 安装依赖

> 使用 node 版本：v18.19.0，建议18版本
> 使用 pnpm 版本：9.1.3，建议9版本

```bash
pnpm i
```

## 运行

> 本地必须要有ffmpeg 环境！
>
> 1. 项目启动后，会在项目的 src/secret/目录下生成 secret-beta、secret-dev、secret-prod 文件，请填写里面的信息，MYSQL_CONFIG、REDIS_CONFIG、RABBITMQ_CONFIG、SRS_CONFIG 必填！
> 2. 配置文件：**`src/spec-config.ts`**，请填写里面的信息。

1. 初始化 docker 容器

如果你不用 docker，你本地需要有mysql、redis、rabbitmq、srs，只要你连上mysql、redis、rabbitmq、srs即可，不需要初始化 docker 容器。

如果你用 docker 启动mysql、redis、rabbitmq、srs，就需要初始化 docker 容器：

```bash
npm run docker:dev
```

执行效果：

```bash
➜  billd-live-server-pro git:(main) npm run docker:dev

> billd-live-server-pro@0.1.0 docker:dev
> cross-env NODE_ENV=development NODE_APP_RELEASE_PROJECT_ALIAS=src NODE_APP_RELEASE_PROJECT_NAME=billd-live-server NODE_APP_RELEASE_PROJECT_ENV=dev NODE_APP_RELEASE_PROJECT_PORT=4300 nodemon --exec node -r @swc-node/register ./src/init/docker.ts

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r @swc-node/register ./src/init/docker.ts`
[2025/2/21 13:25:51] SUCCESS  添加路径别名成功！
[2025/2/21 13:25:51] SUCCESS  docker已安装
[2025/2/21 13:25:51]  WARN    开始启动Mysql
Error response from daemon: No such container: billd_live_mysql
停掉旧的mysql容器出错
[2025/2/21 13:25:51] SUCCESS  启动Mysql成功！ ✅
[2025/2/21 13:25:51]  WARN    开始启动Redis
Error response from daemon: No such container: billd_live_redis
停掉旧的redis容器出错
[2025/2/21 13:25:52] SUCCESS  启动Redis成功！ ✅
[2025/2/21 13:25:52]  WARN    开始启动SRS
Error response from daemon: No such container: billd_live_srs
停掉旧的srs容器出错
[2025/2/21 13:25:52] SUCCESS  启动SRS成功！ ✅
[2025/2/21 13:25:52]  WARN    开始启动RabbitMQ
Error response from daemon: No such container: billd_live_rabbitmq
停掉旧的rabbitmq容器出错
[2025/2/21 13:25:52] SUCCESS  启动RabbitMQ成功！ ✅
[nodemon] clean exit - waiting for changes before restart

```

> 看到 `[nodemon] clean exit - waiting for changes before restart`后，就 ctrl+c 退出命令即可。

2. 初始化数据库

这个命令只需要执行一次，执行后就会自动创建数据库（src/secret/secret-dev 的 MYSQL_CONFIG.database）和数据库表。

执行一次后，以后都不需要执行了。

```bash
npm run mysql:dev
```

执行效果：

```bash
➜  billd-live-server-pro git:(main) npm run mysql:dev

> billd-live-server-pro@0.1.0 mysql:dev
> cross-env NODE_APP_INIT_MYSQL=true NODE_ENV=development NODE_APP_RELEASE_PROJECT_NAME=billd-live-server NODE_APP_RELEASE_PROJECT_ENV=dev NODE_APP_RELEASE_PROJECT_PORT=4300 nodemon --exec node -r @swc-node/register ./src/index.ts

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r @swc-node/register ./src/index.ts`
[2025/2/21 13:26:46] SUCCESS  添加路径别名成功！
[2025/2/21 13:26:46]  INFO    加载数据库表: area
[2025/2/21 13:26:46]  INFO    加载数据库表: live_room
[2025/2/21 13:26:46]  INFO    加载数据库表: qq_user
[2025/2/21 13:26:46]  INFO    加载数据库表: role
[2025/2/21 13:26:46]  INFO    加载数据库表: user
[2025/2/21 13:26:46]  INFO    加载数据库表: wallet
[2025/2/21 13:26:46]  INFO    加载数据库表: wechat_user
[2025/2/21 13:26:46]  INFO    加载数据库表: live_record
[2025/2/21 13:26:46]  INFO    加载数据库表: area_live_room
[2025/2/21 13:26:46]  INFO    加载数据库表: live
[2025/2/21 13:26:46]  INFO    加载数据库表: user_live_room
[2025/2/21 13:26:46]  INFO    加载数据库表: live_view
[2025/2/21 13:26:46]  INFO    加载数据库表: ws_message
[2025/2/21 13:26:47]  INFO    加载数据库表: auth
[2025/2/21 13:26:47]  INFO    加载数据库表: blacklist
[2025/2/21 13:26:47]  INFO    加载数据库表: login_record
[2025/2/21 13:26:47]  INFO    加载数据库表: third_user
[2025/2/21 13:26:47]  INFO    加载数据库表: log
[2025/2/21 13:26:47]  INFO    加载数据库表: goods
[2025/2/21 13:26:47]  INFO    加载数据库表: wallet_record
[2025/2/21 13:26:47]  INFO    加载数据库表: order
[2025/2/21 13:26:47]  INFO    开始连接127.0.0.1:3306服务器的billd_live_test数据库...
[2025/2/21 13:26:47] SUCCESS  新建billd_live_test数据库成功！
[2025/2/21 13:26:47]  WARN    开始校正数据库所有表
[2025/2/21 13:26:47] SUCCESS  校正数据库所有表完成！
[2025/2/21 13:26:47]  INFO    加载数据库表: config
[2025/2/21 13:26:47]  INFO    加载数据库表: daily_activity
[2025/2/21 13:26:47]  INFO    加载数据库表: gift_record
[2025/2/21 13:26:47]  INFO    加载数据库表: global_msg
[2025/2/21 13:26:47]  INFO    加载数据库表: mock_day_data
[2025/2/21 13:26:47]  INFO    加载数据库表: mock_hour_data
[2025/2/21 13:26:47]  INFO    加载数据库表: mock_minute_ten_data
[2025/2/21 13:26:47]  INFO    加载数据库表: mock_minute_thirty_data
[2025/2/21 13:26:47]  INFO    加载数据库表: online_statistics
[2025/2/21 13:26:47]  INFO    加载数据库表: qiniu_data
[2025/2/21 13:26:47]  INFO    加载数据库表: role_auth
[2025/2/21 13:26:47]  INFO    加载数据库表: signin_record
[2025/2/21 13:26:47]  INFO    加载数据库表: signin_statistics
[2025/2/21 13:26:47]  INFO    加载数据库表: user_role
[2025/2/21 13:26:47]  INFO    加载数据库表: visitor_log
[2025/2/21 13:26:47] SUCCESS  加载所有数据库表成功!
[2025/2/21 13:26:47]  WARN    开始初始化数据库所有表
[2025/2/21 13:26:47]  WARN    需要删除外键的表:area,area_live_room,auth,blacklist,goods,live,live_record,live_room,live_view,log,login_record,order,qq_user,role,third_user,user,user_live_room,wallet,wallet_record,wechat_user,ws_message
[2025/2/21 13:26:47]  INFO    area表的外键:
[2025/2/21 13:26:47]  INFO    area_live_room表的外键:
[2025/2/21 13:26:47]  INFO    auth表的外键:
[2025/2/21 13:26:47]  INFO    blacklist表的外键:
[2025/2/21 13:26:47]  INFO    goods表的外键:
[2025/2/21 13:26:47]  INFO    live表的外键:
[2025/2/21 13:26:47]  INFO    live_record表的外键:
[2025/2/21 13:26:47]  INFO    live_room表的外键:
[2025/2/21 13:26:47]  INFO    live_view表的外键:
[2025/2/21 13:26:47]  INFO    log表的外键:
[2025/2/21 13:26:47]  INFO    login_record表的外键:
[2025/2/21 13:26:47]  INFO    order表的外键:
[2025/2/21 13:26:47]  INFO    qq_user表的外键:
[2025/2/21 13:26:47]  INFO    role表的外键:
[2025/2/21 13:26:47]  INFO    third_user表的外键:
[2025/2/21 13:26:47]  INFO    user表的外键:
[2025/2/21 13:26:47]  INFO    user_live_room表的外键:
[2025/2/21 13:26:47]  INFO    wallet表的外键:
[2025/2/21 13:26:47]  INFO    wallet_record表的外键:
[2025/2/21 13:26:47]  INFO    wechat_user表的外键:
[2025/2/21 13:26:47]  INFO    ws_message表的外键:
[2025/2/21 13:26:47] SUCCESS  删除area,area_live_room,auth,blacklist,goods,live,live_record,live_room,live_view,log,login_record,order,qq_user,role,third_user,user,user_live_room,wallet,wallet_record,wechat_user,ws_message表的外键成功！
[2025/2/21 13:26:47]  WARN    需要删除索引的表:area,area_live_room,auth,blacklist,goods,live,live_record,live_room,live_view,log,login_record,order,qq_user,role,third_user,user,user_live_room,wallet,wallet_record,wechat_user,ws_message
[2025/2/21 13:26:47]  INFO    area表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    area_live_room表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    auth表的索引: PRIMARY,p_id
[2025/2/21 13:26:47]  INFO    blacklist表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    goods表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    live表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    live_record表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    live_room表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    live_view表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    log表的索引: PRIMARY,user_id
[2025/2/21 13:26:47]  INFO    login_record表的索引: PRIMARY,user_id
[2025/2/21 13:26:47]  INFO    order表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    qq_user表的索引: PRIMARY,client_id,openid,unionid
[2025/2/21 13:26:47]  INFO    role表的索引: PRIMARY,p_id
[2025/2/21 13:26:47]  INFO    third_user表的索引: PRIMARY,user_id,third_user_id
[2025/2/21 13:26:47]  INFO    user表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    user_live_room表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    wallet表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    wallet_record表的索引: PRIMARY
[2025/2/21 13:26:47]  INFO    wechat_user表的索引: PRIMARY,appid,openid,unionid
[2025/2/21 13:26:47]  INFO    ws_message表的索引: PRIMARY,user_id,client_ip
[2025/2/21 13:26:47] SUCCESS  删除area,area_live_room,auth,blacklist,goods,live,live_record,live_room,live_view,log,login_record,order,qq_user,role,third_user,user,user_live_room,wallet,wallet_record,wechat_user,ws_message表的索引成功！
[2025/2/21 13:26:47] SUCCESS  删除所有表成功！
[2025/2/21 13:26:48] SUCCESS  初始化数据库所有表完成！
[2025/2/21 13:26:48] SUCCESS  初始化数据库数据完成！请退出该命令！

```

> 看到 `初始化数据库数据完成！请退出该命令！`后，就 ctrl+c 退出命令即可。

3. 运行，默认运行在 4300 端口

```bash
npm run dev
```

执行效果：

```bash
➜  billd-live-server-pro git:(main) npm run dev

> billd-live-server-pro@0.1.0 dev
> cross-env NODE_ENV=development NODE_APP_RELEASE_PROJECT_NAME=billd-live-server NODE_APP_RELEASE_PROJECT_ENV=dev NODE_APP_RELEASE_PROJECT_PORT=4300 nodemon --exec node -r @swc-node/register ./src/index.ts

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r @swc-node/register ./src/index.ts`
[2025/2/21 13:27:29] SUCCESS  添加路径别名成功！
[2025/2/21 13:27:29]  INFO    加载数据库表: area
[2025/2/21 13:27:29]  INFO    加载数据库表: live_room
[2025/2/21 13:27:29]  INFO    加载数据库表: qq_user
[2025/2/21 13:27:29]  INFO    加载数据库表: role
[2025/2/21 13:27:29]  INFO    加载数据库表: user
[2025/2/21 13:27:29]  INFO    加载数据库表: wallet
[2025/2/21 13:27:29]  INFO    加载数据库表: wechat_user
[2025/2/21 13:27:29]  INFO    加载数据库表: live_record
[2025/2/21 13:27:29]  INFO    加载数据库表: area_live_room
[2025/2/21 13:27:29]  INFO    加载数据库表: live
[2025/2/21 13:27:29]  INFO    加载数据库表: user_live_room
[2025/2/21 13:27:30]  INFO    加载数据库表: live_view
[2025/2/21 13:27:30]  INFO    加载数据库表: ws_message
[2025/2/21 13:27:30]  INFO    加载数据库表: auth
[2025/2/21 13:27:30]  INFO    加载数据库表: blacklist
[2025/2/21 13:27:30]  INFO    加载数据库表: login_record
[2025/2/21 13:27:30]  INFO    加载数据库表: third_user
[2025/2/21 13:27:30]  INFO    加载数据库表: log
[2025/2/21 13:27:30]  INFO    加载数据库表: goods
[2025/2/21 13:27:30]  INFO    加载数据库表: wallet_record
[2025/2/21 13:27:30]  INFO    加载数据库表: order
[2025/2/21 13:27:30]  INFO    开始连接127.0.0.1:3306服务器的billd_live_test数据库...
[2025/2/21 13:27:30]  INFO    开始连接127.0.0.1:6379服务器的redis数据库...
[2025/2/21 13:27:30]  INFO    开始连接127.0.0.1:6379服务器的redis Pub...
[2025/2/21 13:27:30]  INFO    开始连接127.0.0.1:6379服务器的redis Sub...
[2025/2/21 13:27:30]  WARN    连接RabbitMQ Producer
[2025/2/21 13:27:30]  WARN    连接RabbitMQ Consumer
[2025/2/21 13:27:30] SUCCESS  连接127.0.0.1:6379服务器的redis Sub 成功!
[2025/2/21 13:27:30] SUCCESS  连接127.0.0.1:6379服务器的redis数据库成功!
[2025/2/21 13:27:30] SUCCESS  连接127.0.0.1:6379服务器的redis Pub 成功!
[2025/2/21 13:27:30] SUCCESS  连接amqp://localhost服务器的RabbitMQ成功！
[2025/2/21 13:27:30] SUCCESS  RabbitMQ创建channel成功！
[2025/2/21 13:27:30]  INFO    加载数据库表: config
[2025/2/21 13:27:30]  INFO    加载数据库表: daily_activity
[2025/2/21 13:27:30]  INFO    加载数据库表: gift_record
[2025/2/21 13:27:30]  INFO    加载数据库表: global_msg
[2025/2/21 13:27:30]  INFO    加载数据库表: mock_day_data
[2025/2/21 13:27:30]  INFO    加载数据库表: mock_hour_data
[2025/2/21 13:27:30]  INFO    加载数据库表: mock_minute_ten_data
[2025/2/21 13:27:30]  INFO    加载数据库表: mock_minute_thirty_data
[2025/2/21 13:27:30]  INFO    加载数据库表: online_statistics
[2025/2/21 13:27:30]  INFO    加载数据库表: qiniu_data
[2025/2/21 13:27:30]  INFO    加载数据库表: role_auth
[2025/2/21 13:27:30]  INFO    加载数据库表: signin_record
[2025/2/21 13:27:30]  INFO    加载数据库表: signin_statistics
[2025/2/21 13:27:30]  INFO    加载数据库表: user_role
[2025/2/21 13:27:30]  INFO    加载数据库表: visitor_log
[2025/2/21 13:27:30] SUCCESS  加载所有数据库表成功!
[2025/2/21 13:27:30] SUCCESS  连接127.0.0.1:3306服务器的billd_live_test数据库成功!
[2025/2/21 13:27:30]  INFO    加载路由: area.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: auth.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: bilibili.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: blacklist.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: giftRecord.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: globalMsg.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: goods.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: init.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: live.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: liveRecord.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: liveRoom.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: liveView.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: loginRecord.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: mq.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: order.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: other.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: qiniuData.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: qqUser.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: role.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: signinRecord.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: signinStatistics.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: srs.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: tencentcloudChat.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: tencentcloudCos.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: tencentcloudCss.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: user.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: userLiveRoom.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: wallet.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: walletRecord.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: wechatUser.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: ws.router.ts
[2025/2/21 13:27:30]  INFO    加载路由: wsMessage.router.ts
[2025/2/21 13:27:30] SUCCESS  加载所有路由成功！
[2025/2/21 13:27:30] SUCCESS  初始化websocket成功！

[2025/2/21 13:27:30]  WARN    监听端口: 4300
[2025/2/21 13:27:30]  WARN    项目名称: billd-live-server
[2025/2/21 13:27:30]  WARN    项目环境: dev
[2025/2/21 13:27:30]  WARN    mysql host: 127.0.0.1
[2025/2/21 13:27:30]  WARN    mysql数据库: billd_live_test
[2025/2/21 13:27:30] SUCCESS  http://127.0.0.1:4300/
[2025/2/21 13:27:30] SUCCESS  http://10.10.20.29:4300/
[2025/2/21 13:27:30] SUCCESS  http://10.211.55.2:4300/
[2025/2/21 13:27:30] SUCCESS  http://10.37.129.2:4300/
[2025/2/21 13:27:30] SUCCESS  项目启动成功！耗时：341ms

[2025/2/21 13:27:30]  INFO    作者微信:    shuisheng9905
[2025/2/21 13:27:30]  INFO    付费课程:    https://www.hsslive.cn/article/151
[2025/2/21 13:27:30]  INFO    私有化部署:   https://live.hsslive.cn/privatizationDeployment
[2025/2/21 13:27:30]  INFO    欢迎PR:      billd-live目前只有作者一人开发，难免有不足的地方，欢迎提PR或Issue

```
