'use strict'
const path = require('path')
const config = require('../config/index')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

exports.assetPath = function (assets) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.release.assetsSubDirectory : (process.env.NODE_ENV === 'preview' ? config.preview.assetsSubDirectory : config.dev.assetsSubDirectory)

    return path.join(assetsSubDirectory, assets)

}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap:options.sourceMap
    }
  }

}

exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
