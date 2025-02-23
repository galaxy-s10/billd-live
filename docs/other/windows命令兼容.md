## SRS

### 新建目录

1. 新建 C:\\Users\\huangshuisheng\\Desktop\\docker\\srs 目录

### 启动一个临时容器

```bash
docker run -d registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.200
```

实际执行效果：

```bash
➜  billd-live-server git:(master) ✗ docker run -d registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.200
yyyyyyyyyyyyy
➜  billd-live-server git:(master) ✗
```

> 启动容器后，会返回容器的 id

### 复制 conf 和 objs

```bash
docker cp yyyyyyyyyyyyy:/usr/local/srs/conf C:\\Users\\huangshuisheng\\Desktop\\docker\\srs
```

```bash
docker cp yyyyyyyyyyyyy:/usr/local/srs/objs C:\\Users\\huangshuisheng\\Desktop\\docker\\srs
```

### 复制完成了，停止和删除临时容器

```bash
docker stop yyyyyyyyyyyyy
```

```bash
docker rm yyyyyyyyyyyyy
```

### 启动容器

> 左边的是宿主机的端口号，右边的是容器内的端口号

```bash
LOCAL_DOCKER_SRS_PATH=C:\\Users\\huangshuisheng\\Desktop\\docker\\srs \
&& docker run -d --rm \
--name billd-live-srs \
--env CANDIDATE='ip地址' \
-p 1935:1935 \
-p 5001:8080 \
-p 1985:1985 \
-p 8000:8000/udp \
-v $LOCAL_DOCKER_SRS_PATH\\conf:/usr/local/srs/conf/ \
-v $LOCAL_DOCKER_SRS_PATH\\objs:/usr/local/srs/objs/ \
registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.200 objs/srs \
-c conf/rtc2rtmp.conf
```

## Mysql

### 新建目录

1. 新建 C:\\Users\\huangshuisheng\\Desktop\\docker\\mysql 目录

### 启动一个临时容器

```bash
docker run -d mysql:8.0
```

实际执行效果：

```bash
➜  billd-live-server git:(master) ✗ docker run -d mysql:8.0
xxxxxxxxx
➜  billd-live-server git:(master) ✗
```

> 启动容器后，会返回容器的 id

### 复制 conf

```bash
docker cp xxxxxxxxx:/etc/my.cnf C:\\Users\\huangshuisheng\\Desktop\\docker\\mysql\\conf
```

### 复制完成了，停止和删除临时容器

```bash
docker stop xxxxxxxxx
```

```bash
docker rm xxxxxxxxx
```

### 启动容器

> 左边的是宿主机的端口号，右边的是容器内的端口号

```bash
LOCAL_DOCKER_MYSQL_PATH=C:\\Users\\huangshuisheng\\Desktop\\docker\\mysql \
&& docker run -d \
-p 3306:3306 \
--name billd-live-mysql \
-e MYSQL_ROOT_PASSWORD=mysql123. \
-v $LOCAL_DOCKER_MYSQL_PATH\\conf/my.cnf:/etc/my.cnf \
-v $LOCAL_DOCKER_MYSQL_PATH\\data:/var/lib/mysql/ \
mysql:8.0
```
