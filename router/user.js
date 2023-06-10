const express = require('express')
// controller
const userCtl = require('../controller/user')

// 验证token中间件
const auth = require('../middleware/auth')
// 上传文件中间件
const upload = require('../middleware/uploadFile')
//数据校验
const userValidator = require('../validator/user')

const router = express.Router()

// 注册
router.post('/register', userValidator.register, userCtl.register)
// 登录 工号
router.post('/loginByCode', userValidator.loginByCode, userCtl.loginByCode)
// 获取验证码
router.get('/getCaptcha',  userCtl.getCaptcha)
// 校验验证码
router.post('/verifyCaptcha', userValidator.verifyCaptcha ,userCtl.verifyCaptcha)

// 获取用户列表
router.get('/getUserList', auth, userCtl.getUserList)
// 获取用户信息
router.get('/getUserProfile', auth, userCtl.getUserProfile)
// 更新用户信息
router.put('/updateUserProfile', userValidator.updateUserProfile, auth, userCtl.updateUserProfile)
// 上传用户头像
router.post('/uploadBio', auth, upload.single('file'), userCtl.uploadBio)
// 用户状态管理
router.put('/updateUserStatus',userValidator.registerStatus , auth, userCtl.updateUserStatus)
// 用户修改密码
router.put('/changePassword',userValidator.changePassword, auth, userCtl.changePassword)

// 发布静态资源
router.use('/uploads', express.static('uploads'));

module.exports = router