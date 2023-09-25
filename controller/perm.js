const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const {
  Role,
  PermMenu,
  PermBtn,
  PermRoleRole,
  PermRolePerm,
  PermUserRole,
  PermUserPerm,
  PermDeptRole,
  PermDeptPerm,
  PermMenuRoute,
} = require("../model");
const { convertToTree } = require("../util/listToTree");

// createRole 新增角色
exports.createRole = async (req, res, next) => {
  try {
    const { name } = req.body;
    const role = await Role.findOne({ where: { name } });
    if (role) {
      return res.status(401).json({
        success: false,
        message: `角色名称[${name}]已存在`,
      });
    }
    const result = await Role.create(req.body);
    console.log("result", result);
    res.status(201).json({
      success: true,
      message: "机构创建成功",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
// getDeptList 查询角色列表
exports.getRoleLists = async (req, res, next) => {
  try {
    const { name = "", roleId = "" } = req.query;
    console.log("name,roleId", name, roleId);
    let query = {};
    if (name) {
      query = { ...{ name } };
    }
    if (roleId) {
      query = { ...{ roleId } };
    }
    console.log("query", query);
    res.status(200).json({
      success: true,
      message: "获取角色列表成功",
    });
  } catch (err) {
    next(err);
  }
};
// getRoleProfile 获取单个角色
exports.getRoleProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "获取角色列表成功",
    });
  } catch (err) {
    next(err);
  }
};
// 更新角色
exports.updateRole = async (req, res, next) => {
  try {
    res.status(201).json({
      success: true,
      message: "机构更新成功",
    });
  } catch (err) {
    next(err);
  }
};
// 删除角色
exports.deleteRole = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "删除机构成功",
    });
  } catch (err) {
    next(err);
  }
};

// createPerm 新增权限
exports.createPerm = async (req, res, next) => {
  try {
    await PermBtn.create(req.body);

    res.status(201).json({
      success: true,
      message: "权限新增成功",
    });
  } catch (err) {
    next(err);
  }
};
// getRoleLists 查询权限列表
exports.getPermLists = async (req, res, next) => {
  try {
    console.log("req.query", req.query);

    const lists = await PermBtn.findAll({
      where: req.query,
      order: ["code"],
    });

    console.log("lists", lists);

    res.status(200).json({
      success: true,
      message: "获取角色列表成功",
      data: lists,
    });
  } catch (err) {
    next(err);
  }
};
// 更新权限
exports.updatePerm = async (req, res, next) => {
  try {
    console.log("req", req.body);
    const { btnId, name } = req.body;
    const updatePerm = await PermBtn.findOne({ where: { btnId } });
    if (!updatePerm) {
      return res.status(401).json({
        success: false,
        message: "权限id btnId不存在",
      });
    }
    console.log("updatePerm", updatePerm);
    await PermBtn.update(
      { name },
      {
        where: { btnId },
      }
    );
    res.status(201).json({
      success: true,
      message: "机构更新成功",
    });
  } catch (err) {
    next(err);
  }
};
// 删除权限
exports.deletePerm = async (req, res, next) => {
  try {
    const { btnId } = req.body;
    const deletePerm = await PermBtn.findOne({ where: { btnId } });
    if (!deletePerm) {
      return res.status(401).json({
        success: false,
        message: "权限id btnId不存在",
      });
    }
    await PermBtn.destroy({ where: { btnId } });

    res.status(200).json({
      success: true,
      message: "删除机构成功",
    });
  } catch (err) {
    next(err);
  }
};
