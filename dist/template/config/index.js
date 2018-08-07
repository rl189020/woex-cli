'use strict'

const path = require('path')

const config = require('./index')


module.exports = {
  dev :{
      assetsSubDirectory: 'static',
      assetsPublicPath: '/',
      proxyTable: {},

      host: 'localhost',
      port: 8080,
      autoOpenBrowser: false,
      errorOverlay: true,
      notifyOnErrors: true,
      poll: false,
    {{#lint}}
      useEslint: true,
      showEslintErrorsInOverlay: false,
    {{/lint}}
  devtool: 'cheap-module-eval-source-map',
  cacheBusting: true,
  cssSourceMap: true

  },
    preview:{
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
      //  assetsPublicPath: '/',//资源路径

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',
        {{#lint}}
        useEslint: true,
        showEslintErrorsInOverlay: false,
        {{/lint}}
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']

    },
    release: {
        index: path.resolve(__dirname, '../dist/index.html'),

            // Paths
            assetsRoot: path.resolve(__dirname, '../dist'),
            assetsSubDirectory: 'static',
           // assetsPublicPath: '/',//资源路径
            productionSourceMap: false,
            // https://webpack.js.org/configuration/devtool/#production
            devtool: '#source-map',
            {{#lint}}
            useEslint: true,
            showEslintErrorsInOverlay: false,
            {{/lint}}
            productionGzip: false,
            productionGzipExtensions: ['js', 'css']
    }
}
