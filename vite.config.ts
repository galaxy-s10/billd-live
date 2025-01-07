import path from 'path';

import vue from '@vitejs/plugin-vue';
import { BilldHtmlWebpackPlugin, logData } from 'billd-html-webpack-plugin';
import externalGlobals from 'rollup-plugin-external-globals';
import autoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import unpluginVueComponents from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import prefetchPlugin from 'vite-plugin-bundle-prefetch';
import checker from 'vite-plugin-checker';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import eslint from 'vite-plugin-eslint2';
import { createHtmlPlugin } from 'vite-plugin-html';

import pkg from './package.json';

const globals: any = externalGlobals({
  // 'runtime-core': 'runtime-core',
  // vue: 'Vue',
  // 'vue-demi': 'VueDemi',
  // 'vue-router': 'VueRouter',
  'video.js': 'videojs',
  'mpegts.js': 'mpegts',
  // fabric: 'fabric',
  'cos-js-sdk-v5': 'COS',
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const outputStaticUrl = () => {
    if (isProduction) {
      return 'https://live.hsslive.cn/dist/';
    } else {
      return './';
    }
    // return './';
  };

  return {
    base: outputStaticUrl(),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use 'billd-scss/src/index.scss' as *;@import '@/assets/constant.scss';`,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // 'runtime-core':
        //   'https://tencentcos-res.hsslive.cn/npm/@vue/runtime-core@3.5.13/+esm.js',
        // vue: 'https://tencentcos-res.hsslive.cn/npm/vue@3.5.13/+esm.js',
        // 'vue-router': 'https://tencentcos-res.hsslive.cn/npm/vue-router@4.2.4/+esm.js',
        // 'video.js': 'https://tencentcos-res.hsslive.cn/npm/video.js@8.21.0/+esm.js',
        // 'mpegts.js': 'https://tencentcos-res.hsslive.cn/npm/mpegts.js@1.7.3/+esm.js',
        // fabric: 'https://tencentcos-res.hsslive.cn/npm/fabric@5.4.2/+esm.js',
        // 'cos-js-sdk-v5':
        //   'https://tencentcos-res.hsslive.cn/npm/cos-js-sdk-v5@1.8.6/+esm.js',
      },
      /**
       * 不建议省略.vue后缀
       * https://cn.vitejs.dev/config/shared-options.html#resolve-extensions
       */
      // extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        external: [
          // 'vue',
          // 'vue-demi',
          // 'vue-router',
          // 'runtime-core',
          'video.js',
          'mpegts.js',
          // 'fabric',
          'cos-js-sdk-v5',
        ],
        plugins: [globals],
      },
    },
    plugins: [
      // visualizer({
      //   gzipSize: true,
      //   brotliSize: true,
      //   emitFile: false,
      //   filename: 'visualizer.html', // 分析图生成的文件名
      //   open: true, // 如果存在本地服务端口，将在打包后自动展示
      // }),
      chunkSplitPlugin({
        // 指定拆包策略
        // customSplitting: {
        //   // `vue` and `vue-router` 会被打包到一个名为`vue-vendor`的 chunk 里面(包括它们的一些依赖，如 object-assign)
        //   'vue-vendor': [/vue/],
        //   'vue-router-vendor': [/vue-router/],
        //   'av-cliper-vendor': [/@webav\/av-cliper/],
        //   // 源码中 utils 目录的代码都会打包进 `utils` 这个 chunk 中
        //   // utils: [/src\/utils/],
        //   views: [/src\/views/],
        //   compoents: [/src\/compoents/],
        // },
      }),
      prefetchPlugin(),
      // isProduction && legacy(),
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            // @ts-ignore
            title: 'billd直播',
            // injectScript: `<script src="${outputStaticUrl()}worker.js"></script>`,
          },
          tags: isProduction
            ? [
                {
                  injectTo: 'head',
                  tag: 'script',
                  attrs: {
                    src: 'https://tencentcos-res.hsslive.cn/npm/video.js@8.21.0/video.min.js',
                  },
                },
                {
                  injectTo: 'head',
                  tag: 'script',
                  attrs: {
                    src: 'https://tencentcos-res.hsslive.cn/npm/mpegts.js@1.7.3/mpegts.min.js',
                  },
                },
                {
                  injectTo: 'head',
                  tag: 'script',
                  attrs: {
                    src: 'https://tencentcos-res.hsslive.cn/npm/cos-js-sdk-v5@1.8.6/cos-js-sdk-v5.min.js',
                  },
                },
                // {
                //   injectTo: 'head',
                //   tag: 'script',
                //   attrs: {
                //     src: 'https://tencentcos-res.hsslive.cn/npm/vue@3.5.13/vue.global.min.js',
                //   },
                // },
                // {
                //   injectTo: 'head',
                //   tag: 'script',
                //   attrs: {
                //     src: 'https://tencentcos-res.hsslive.cn/npm/vue-demi@0.14.6/index.iife.min.js',
                //   },
                // },
                // {
                //   injectTo: 'head',
                //   tag: 'script',
                //   attrs: {
                //     src: 'https://tencentcos-res.hsslive.cn/npm/vue-router@4.2.4/vue-router.global.min.js',
                //   },
                // },
              ]
            : [],
        },
      }),
      checker({
        // typescript: true,
        vueTsc: true,
        // eslint: {
        //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // for example, lint .ts & .tsx
        // },
      }),
      eslint({}),
      autoImport({
        imports: [
          {
            'naive-ui': ['useMessage', 'useNotification'],
          },
        ],
      }),
      unpluginVueComponents({
        // eslint-disable-next-line
        resolvers: [NaiveUiResolver()],
      }),
      new BilldHtmlWebpackPlugin({ env: 'vite4' }).config,
    ],
    define: {
      'process.env': {
        BilldHtmlWebpackPlugin: logData(null),
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
        PUBLIC_PATH: outputStaticUrl(),
        VUE_APP_RELEASE_PROJECT_NAME: JSON.stringify(
          process.env.VUE_APP_RELEASE_PROJECT_NAME
        ),
        VUE_APP_RELEASE_PROJECT_ENV: JSON.stringify(
          process.env.VUE_APP_RELEASE_PROJECT_ENV
        ),
        VUE_APP_RELEASE_PROJECT_VERSION: JSON.stringify(pkg.version),
      },
    },

    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:4300',
          secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
          /**
           * changeOrigin，是否修改请求地址的源
           * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
           * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
           */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/'),
        },
        '/betaapi': {
          target: 'http://localhost:4300',
          secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
          /**
           * changeOrigin，是否修改请求地址的源
           * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
           * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
           */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/betaapi/, '/'),
        },
        '/prodapi': {
          target: 'http://localhost:4200',
          secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
          /**
           * changeOrigin，是否修改请求地址的源
           * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
           * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
           */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/prodapi/, '/'),
        },
      },
    },
  };
});
