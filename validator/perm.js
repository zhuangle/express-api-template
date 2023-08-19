const validate = require('../middleware/validate')
const { body, validationResult } = require('express-validator');
const customRules = require('./customRules')

// 新增权限数据校验 
exports.createPerm = validate([
  body('code')
    .custom(customRules.isBtnCodeExit),
  body('name')
    .notEmpty().withMessage('权限名称不能为空')
    .isLength({min: 2, max: 30}).withMessage('机构名称应为2-30位个字符'),
])

// 更新权限数据校验 
exports.updatePerm = validate([
  body('btnId')
    .notEmpty().withMessage('权限id不能为空')
    .isUUID().withMessage(`权限id格式不正确`)
    .custom(customRules.updatePerm)
])




exports.deletePerm = validate([
  body('btnId')
    .notEmpty().withMessage('权限编码permId不能为空')
    .isUUID().withMessage('权限编码permId格式不正确')
    .custom(customRules.deletePerm)
])