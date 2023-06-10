const validate = require('../middleware/validate')
const { body, validationResult } = require('express-validator');
// 控制验证码长度 Options.size
const { Options } = require('../config/config.default')
const customRules = require('./customRules')
exports.register = validate([
  body('nickname')
    .notEmpty().withMessage('昵称不能为空')
    .isLength({min: 3, max: 64}).withMessage('昵称长度应为3-64之间'),
  body('usercode')
    .notEmpty().withMessage('工号不能为空')
    .isLength({min: 1, max: 32}).withMessage('工号长度应为1-32位之间'),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({min: 6, max: 40}).withMessage('密码长度应为6-40之间'),
  body('channel')
    .notEmpty().withMessage('注册途径不能为空')
    .custom(customRules.registerChannel).withMessage('注册途径传入有误，请传入以下几种方式: "网站", "小程序", "PC应用", "移动app"')
])
// 使用工号登录
exports.loginByCode = validate([
  body('usercode')
    .notEmpty().withMessage('工号不能为空')
    .isLength({min: 1, max: 40}).withMessage('工号长度应为1-30之间'),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({min: 6, max: 40}).withMessage('密码长度应为6-40之间'),
])
// user verifyCaptcha 校验验证码
exports.verifyCaptcha = validate([
  body('code')
    .notEmpty().withMessage('验证码不能为空')
    .isLength({ min: Options.size, max: Options.size}).withMessage(`验证码的长度应为${Options.size}`),
])
// 更新用户信息
exports.updateUserProfile = validate([
  body('userName')
    .notEmpty().withMessage('姓名不能为空')
    .isLength({ min: 2, max: 30}).withMessage('姓名长度应为2-30个字符'),
  body('gender')
    .notEmpty().withMessage('性别不能为空'),    
])
// 更新用户状态
exports.registerStatus = validate([
  body('uid')
    .notEmpty().withMessage('uid不能为空')
    .isUUID().withMessage('uid格式不正确'),
  body('status')
    .notEmpty().withMessage('状态码不能为空')
    // 自定义校验规则
    .custom(customRules.Register_UpdateUserStatus)
    // 自定义校验消息
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
})

// changePassword
exports.changePassword = validate([
  body('uid')
    .notEmpty().withMessage('uid不能为空')
    .isUUID().withMessage('uid格式不正确'),
  body('oldPassword')
    .notEmpty().withMessage('原密码不能为空')
    .isLength({min: 6, max: 40}).withMessage('密码长度应为6-40之间'),
  body('newPassword')
    .notEmpty().withMessage('新密码不能为空')
    .isLength({min: 6, max: 40}).withMessage('密码长度应为6-40之间'),
])