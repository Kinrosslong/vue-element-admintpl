'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

//测试环境
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: "http://myproject.com:9090/api/"
})
