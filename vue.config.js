const path = require('path');

module.exports = {
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    port: 8081,
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true
  },
  configureWebpack: {
    externals: {
      WxLogin: 'window.WxLogin'
    }
  },
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '@components': path.join(__dirname, './src/components')
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        additionalData: `
          @import "@/less/public_variable.less";
        `
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
}
