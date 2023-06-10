const crypto = require('crypto')
const { HashPrivateKey } = require('../config/config.default')

module.exports = str => {
  return crypto.createHash('md5')
    .update(str + HashPrivateKey)
    .digest('hex')
}