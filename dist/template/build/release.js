'use strict'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.release.conf')

const spinner = ora('开始构建生产环境工程包...')
spinner.start()

rm(path.join(config.release.assetsRoot, config.release.assetsSubDirectory), err => {
    if (err) throw err

    webpack(webpackConfig, (err, stats) => {
        spinner.stop()

        if (err) throw err

        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  生产环境工程包构建失败.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  生产环境工程包构建完成.\n'))


    })
})
