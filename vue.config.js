'use strict'
const path = require('path')
console.log(process.env.NODE_ENV)
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
  host: '172.18.84.31',
  proxy: {
   'api': {
    target: '11',
    pathRewrite: {
     '^/api': '',
     changeOrigin: true
    }
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