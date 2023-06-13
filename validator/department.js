const validate = require('../middleware/validate')
const { body, validationResult } = require('express-validator');
// 控制验证码长度 Options.size
const customRules = require('./customRules')

exports.deleteDept = validate([
  body('code')
    .notEmpty().withMessage('机构编码不能为空')
    .isLength({min: 2, max: 8}).withMessage('机构编码应为2-8位的数字')
    .custom()
])