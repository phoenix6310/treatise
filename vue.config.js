'use strict'
const path = require('path')
const NODE_ENV = process.env.NODE_ENV
let prodPlugins = []
if (NODE_ENV === 'production') {
  // 去掉console
  prodPlugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        drop_console: true,
      },
    },
  }))
}

function resolve(dir) {
  return path.join(__dirname, dir)
}
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  devServer: {
    disableHostCheck: true,
    open: true,
    port: 9526,
    host: '192.168.0.105',
    proxy: {
      'api': {
        // target: 'http://172.18.84.42:7006',
        target: 'http://f3176v6414.zicp.vip',
        pathRewrite: {
          '^/api': '',
          changeOrigin: true
        },
        // headers: {
        //     Host: 'f3176v6414.zicp.vip'
        // }
      },
      '/video_signnature': {
        target: 'http://xxsy.apabi.cn',
        pathRewrite: {
          '^/video_signnature': '',
          changeOrigin: true
        },
      }
    }
  },
  productionSourceMap: false,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: '答辩',
    resolve: {
      alias: {
        '@': resolve('src'),
      }
    },
    plugins: [
      ...prodPlugins,
    ],
  },
}