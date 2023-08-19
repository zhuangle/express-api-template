const { v4: uuidv4 } = require('uuid');
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
  PermMenuRoute 
} = require('../model')
const { convertToTree } = require('../util/listToTree')

// createRole 新增角色
exports.createRole = async (req, res, next) => {
  try {


    res.status(201).json({
      success: true,
      message: "机构创建成功",
      data: req.body
    })
  } catch (err) {
    next(err);
  }
};
// getDeptList 查询角色列表
exports.getRoleLists = async (req, res, next) => {
  try {




    res.status(200).json({
      success: true,
      message: "获取角色列表成功",
    })
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
    })
  } catch (err) {
    next(err);
  }
};
// 更新角色
exports.updateRole = async (req, res, next) => {
  try {




    res.status(201).json({
      success: true,
      message: "机构更新成功"
    })
  } catch (err) {
    next(err);
  }
};
// 删除角色
exports.deleteRole = async (req, res, next) => {
  try {



    res.status(200).json({
      success: true,
      message: "删除机构成功"
    })
  } catch (err) {
    next(err);
  }
};


// createPerm 新增权限
exports.createPerm = async (req, res, next) => {
  try {

    await PermBtn.create(req.body)

    res.status(201).json({
      success: true,
      message: "权限新增成功",
    })
  } catch (err) {
    next(err);
  }
};
// getRoleLists 查询权限列表
exports.getPermLists = async (req, res, next) => {
  try {
    console.log('req.query', req.query);

    const lists =  await PermBtn.findAll({
      where: req.query
    })

    console.log('lists', lists);

    res.status(200).json({
      success: true,
      message: "获取角色列表成功",
      data: lists
    })
  } catch (err) {
    next(err);
  }
};
// 更新权限
exports.updatePerm = async (req, res, next) => {
  try {




    res.status(201).json({
      success: true,
      message: "机构更新成功"
    })
  } catch (err) {
    next(err);
  }
};
// 删除权限
exports.deletePerm = async (req, res, next) => {
  const {btnId, code} = req.body
  let query = {}
  if(btnId){
    query = {
      where: {btnId}
    }
  }else{
    query = {
      where: {code}
    }
  }
  try {
    await PermBtn.destroy(query)

    res.status(200).json({
      success: true,
      message: "删除机构成功"
    })
  } catch (err) {
    next(err);
  }
};