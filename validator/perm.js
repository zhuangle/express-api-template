const validate = require("../middleware/validate");
const { query, body, validationResult } = require("express-validator");
const customRules = require("./customRules");

// 角色
// 新增角色
exports.createRole = validate([
  body("name")
    .notEmpty()
    .withMessage("角色名称不能为空")
    .isLength({ min: 2, max: 20 })
    .withMessage("角色名称应为2-20位个字符"),
]);

// 新增权限数据校验
exports.createPerm = validate([
  body("code").custom(customRules.isBtnCodeExit),
  body("name")
    .notEmpty()
    .withMessage("权限名称不能为空")
    .isLength({ min: 2, max: 30 })
    .withMessage("机构名称应为2-30位个字符"),
]);

// 更新权限数据校验
exports.updatePerm = validate([
  body("roleId").notEmpty().withMessage("权限id不能为空"),
]);

exports.deletePerm = validate([
  query("roleId").notEmpty().withMessage("权限编码permId不能为空"),
]);
