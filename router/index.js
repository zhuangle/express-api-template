const express = require('express')
const router = express.Router()

// 用户相关
router.use('/user', require('./user'))
// 机构相关
router.use('/dept', require('./department'))

module.exports = router