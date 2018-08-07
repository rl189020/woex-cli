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
            sourceMap: config.release.productionSourceMap,
            extract: true,
            usePostCss: true
        })
    },
    devtool: config.release.productionSourceMap ? config.release.devtool : false,
    output: {
        path: config.release.assetsRoot,
        filename: utils.assetPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetPath('js/[id].[chunkhash].js'),
        publicPath: config.release.assetsPublicPath
    },
    plugins:
        [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(require('../config/release.env').NODE_ENV)
            }),
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                },
                sourceMap: config.release.productionSourceMap,
                parallel: true
            }),
            // extract css into its own file
            new ExtractTextPlugin({
                filename: utils.assetPath('css/[name].[chunkhash].css'),
                // Setting the following option to `false` will not extract CSS from codesplit chunks.
                // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
                // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
                // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
                allChunks: true,
            }),
            new OptimizeCssPlugin({
                cssProcessorOptions: config.release.productionSourceMap
                    ? { safe: true, map: { inline: false } }
                    : { safe: true }
            }),
            new HtmlWebpackPlugin({
                filename:config.release.index,
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


if (config.release.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.release.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}


module.exports = webpackConfig
