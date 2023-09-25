const validate = require("../middleware/validate");
const { body, validationResult } = require("express-validator");
// 控制验证码长度 Options.size
const customRules = require("./customRules");

// 新增机构数据校验
exports.addeDept = validate([
  body("code")
    .notEmpty()
    .withMessage("机构编码不能为空")
    .isLength({ min: 2, max: 8 })
    .withMessage("机构编码应为2-8位的数字"),
  body("name")
    .notEmpty()
    .withMessage("机构名称不能为空")
    .isLength({ min: 2, max: 30 })
    .withMessage("机构名称应为2-30位个字符"),
  body("status")
    .notEmpty()
    .withMessage("机构状态不能为空")
    .isLength({ min: 1, max: 1 })
    .withMessage("机构状态为1-9之间的数字"),
  body("Pid").notEmpty().withMessage("父级机构DeptId不能为空"),
  body("managerUid")
    .notEmpty()
    .withMessage("管理managerUid不能为空")
    .isUUID()
    .withMessage("管理managerUid格式不正确"),
]);

// 更新机构数据校验
exports.updateDept = validate([
  body("deptId")
    .notEmpty()
    .withMessage("机构id不能为空")
    .isUUID()
    .withMessage(`机构id格式不正确`)
    .custom(customRules.updateDept),
]);

exports.deleteDept = validate([
  body("code")
    .notEmpty()
    .withMessage("权限编码不能为空")
    .isUUID()
    .withMessage(`机构id格式不正确`),
]);
