const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");

const {User, Dept } = require('../model')
const { convertToTree } = require('../util/listToTree')

// addDept 新增机构
exports.addDept = async (req, res, next) => {
  try {
    console.log('addDept' ,req.body);
    const { managerUcode} = req.body
    const manager = await User.findOne({
      where: { usercode: managerUcode }
    }) 
    console.log(manager);
    await Dept.create({
      ...req.body,
      managerUid: manager.uid,
      manager: manager.nickname
    })

    res.status(201).json({
      success: true,
      message: "机构创建成功",
      data: {
          deptId: 'aaa'
        }
    })
  } catch (err) {
    next(err);
  }
};
// getDeptList 获取机构列表
exports.getDeptList = async (req, res, next) => {
  try {
    console.log('req.query', req.query);
    // const code = req.query.code || ''
    const dept = await Dept.findAll({where:[], order: ['code']})
    const result = convertToTree(dept)
    res.status(200).json({
      success: true,
      message: "获取机构列表成功",
      data: result
    })
  } catch (err) {
    next(err);
  }
};
// 更新机构
exports.updateDept = async (req, res, next) => {
  try {


    
  } catch (err) {
    next(err);
  }
};
// 删除机构
exports.deleteDept = async (req, res, next) => {
  try {


    
  } catch (err) {
    next(err);
  }
};