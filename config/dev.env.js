var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://exam.app/api"',
  QRCODE_API: '"http://localhost:9528/#/register"',
})
