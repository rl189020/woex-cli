'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

//测试环境变量
module.exports = merge(devEnv, {
    NODE_ENV: 'production'
})
