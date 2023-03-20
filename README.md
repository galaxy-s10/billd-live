# 简介

> 主要实现了 vuecli5 的大部分功能

- [x] 基于 vue3 + webpack5
- [x] 路由管理：vue-router4.x
- [x] 状态管理：pinia2.x
- [x] css 处理：scss + windicss（可选）
- [x] 代码规范：eslint + prettier
- [x] 项目规范：husky + commitizen + commitlint + lintstaged

- [x] 支持热更新、typescript、路由懒加载

> 一些相关的配置（如 eslint、windicss、outputStaticUrl 等）暴露在 script/constant.ts 了

# 安装依赖

更新 billd 依赖：

```bash
pnpm i billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest billd-deploy@latest
```

```bash
pnpm install
```

# 项目运行

```bash
pnpm run start
```

script/constant.ts 里的 outputStaticUrl 如果是'/'的话，默认就运行在 [http://localhost:8000/](http://localhost:8000/)，如果 8000 端口被占用了，会自动递增+1
script/constant.ts 里的 outputStaticUrl 如果是'/aaa/'的话，默认就运行在 [http://localhost:8000/aaa/](http://localhost:8000/aaa/)，如果 8000 端口被占用了，会自动递增+1

> 项目启动完成后，终端会打印调试地址，不必担心调试地址是什么~

# 项目打包

```bash
pnpm run build
```

# git 提交

```bash
pnpm run cz
```

# 内置第三方包

- [billd-utils](https://github.com/galaxy-s10/billd-utils)
- [billd-scss](https://github.com/galaxy-s10/billd-scss)，已在 sass-loader 里配置了 additionalData: `@use 'billd-scss/src/index.scss' as *;`
- [billd-html-webpack-plugin](https://github.com/galaxy-s10/billd-html-webpack-plugin)，已在 webpack 配置里使用了该插件
