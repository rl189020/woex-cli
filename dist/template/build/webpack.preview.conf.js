'use strict'
const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config')
const utils = require('./utils')

const webpackConfig = merge(baseWebpackConfig, {
    module : {
        rules: utils.styleLoaders({
            sourceMap: config.preview.productionSourceMap,
            extract: true,
            usePostCss: true
        })
    },
    devtool: config.preview.productionSourceMap ? config.preview.devtool : false,
    output: {
        path: config.preview.assetsRoot,
        filename: utils.assetPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetPath('js/[id].[chunkhash].js'),
        publicPath: config.preview.assetsPublicPath
    },
    plugins:
        [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(require('../config/preview.env').NODE_ENV)
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: config.preview.productionSourceMap,
            parallel: true
        }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: utils.assetPath('css/[name].[hash].css'),
            allChunks: true
        }),
         new OptimizeCssPlugin({
             cssProcessorOptions: config.preview.productionSourceMap
                 ? { safe: true, map: { inline: false } }
                 : { safe: true }
         }),
        new HtmlWebpackPlugin({
            filename:config.preview.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),
         new webpack.HashedModuleIdsPlugin(),
         new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks (module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            async: 'vendor-async',
            children: true,
            minChunks: 3
        })
    ]
})


if (config.preview.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.preview.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}


module.exports = webpackConfig
