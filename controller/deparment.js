const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const { User, Dept } = require("../model");
const { convertToTree } = require("../util/listToTree");

// addDept 新增机构
exports.addDept = async (req, res, next) => {
  try {
    const { managerUid, name, code, Pid, status } = req.body;
    if (req.body.code == "00") {
      res.status(400).json({
        success: false,
        message: "机构编码不能为00",
      });
    }
    const Code = await Dept.findOne({
      where: { code },
    });
    const DeptName = await Dept.findOne({
      where: { name },
    });
    const Status = await Dept.findOne({
      where: { status },
    });
    if (Code) {
      res.status(400).json({
        success: false,
        message: `机构编码[code:${code}]已存在`,
      });
    }
    if (Pid !== "00") {
      const pid = await Dept.findOne({
        where: { deptId: Pid },
      });
      if (!pid) {
        res.status(400).json({
          success: false,
          message: `父级机构[Pid:${Pid}]不存在`,
        });
      }
    }
    const manager = await User.findOne({
      where: { uid: managerUid },
    });
    if (!manager) {
      return res.status(400).json({
        success: false,
        message: `管理者[managerUid:${managerUid}]不存在`,
      });
    }
    const createDept = await Dept.create(req.body);
    console.log("createDept", createDept.dataValues);
    return res.status(201).json({
      success: true,
      message: "机构创建成功",
      data: createDept.dataValues,
    });
  } catch (err) {
    next(err);
  }
};
// getDeptList 获取机构列表
exports.getDeptList = async (req, res, next) => {
  try {
    console.log("req", req.query);
    const { code, name } = req.query;
    let queryParams = {};
    if (code) {
      queryParams = { code };
    }
    if (name) {
      queryParams = { name };
    }
    const dept = await Dept.findAll({ where: queryParams, order: ["code"] });
    const result = convertToTree(dept);
    res.status(200).json({
      success: true,
      message: "获取机构列表成功",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
// 更新机构
exports.updateDept = async (req, res, next) => {
  try {
    const { deptId } = req.body;
    await Dept.update(req.body, {
      where: { deptId },
    });
    res.status(201).json({
      success: true,
      message: "机构更新成功",
    });
  } catch (err) {
    next(err);
  }
};
// 删除机构
exports.deleteDept = async (req, res, next) => {
  try {
    await Dept.destroy({ where: [{ code: req.body.code }] });
    res.status(200).json({
      success: true,
      message: "删除机构成功",
    });
    // 204不会返回成功消息,因此使用200响应
    // res.status(204).json({
    //   success: true,
    //   message: "删除机构成功"
    // })
  } catch (err) {
    next(err);
  }
};
