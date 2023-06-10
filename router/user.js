const express = require('express')
// controller
const userCtl = require('../controller/user')

const router = express.Router()
// 注册
router.post('/register', userCtl.register)

module.exports = router