const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = defineConfig({
  assetsDir: "static",
  parallel: false,
  publicPath: process.env.BASE_URL, // process.env.BASE_URL默认为 '/'

  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },

  css: { // less全局变量文件引入
    loaderOptions: {
      less: {
        additionalData: '@import "@/assets/style/custom.less";'
      }
    }
  },

  // 跨域 --> node代理 
  // devServer: {
  //   port: 8080,
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.0.101:3000',
  //       changeOrigin: true,
  //       ws: true,  // 这一行很关键  表示是否开启  websocket
  //       secure: true,
  //       pathRewrite: {
  //         '^/api': '/'
  //       },
  //       open: true
  //     }
  //   }
  // }
})

