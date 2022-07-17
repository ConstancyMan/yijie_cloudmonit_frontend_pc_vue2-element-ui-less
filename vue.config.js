const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 配置反向代理服务器：
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/', // 对应自己的接口地址
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '/api': '/api'
        }
      },
      '/spublic': {
        target: 'http://127.0.0.1:3000/', // 对应自己的静态图片地址
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '/spublic': '/spublic'
        }
      }
    }
  }
})
