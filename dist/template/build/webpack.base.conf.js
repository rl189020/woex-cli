'use strict'

const path = require('path')
const utils = require('./utils')
const os = require('os');
const HappyPack = require('happypack');
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const vueLoaderConfig = require('./vue-loader.conf')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
HappyPack.SERIALIZABLE_OPTIONS = HappyPack.SERIALIZABLE_OPTIONS.concat([
    'postcss'
]);

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias :{
            "@": resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: merge(vueLoaderConfig,{
                    optimizeSSR: false,
                    loaders: {
                        js: 'happypack/loader?id=babel',
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader'
                        })
                    },
                    compilerModules: [{
                        postTransformNode: el => {
                            // to convert vnode for weex components.
                            require('weex-vue-precompiler')()(el)
                        }
                    }]
                })
            },
            {
                test: /\.js$/,
                use: 'happypack/loader?id=babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options:{
                    limit: 10000,
                    name: utils.assetPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins:[
        new HappyPack({
            id: 'babel',
            verbose: true,
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool
        }),
        new HappyPack({
            id: 'css',
            verbose: true,
            loaders: ['postcss-loader'],
            threadPool: happyThreadPool
        })
    ]
}
