var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://exam.test/api"',
  QRCODE_API: '"http://localhost:9528/#/register"',
  QINIU_URL: '"http://ofa50j8as.bkt.clouddn.com/"'
})
