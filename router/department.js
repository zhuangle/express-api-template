const express = require('express')
// controller
const deptCtl = require('../controller/deparment')
//数据校验
const deptValidator = require('../validator/department.js')
// 鉴权中间件
const auth = require('../middleware/auth')
const router = express.Router()

// 机构管理

// 目前机构允许建立四级
// 新增机构
router.post('/addDept', auth, deptCtl.addDept)
// 查询机构列表
router.get('/getDeptList', auth, deptCtl.getDeptList)
// 更新机构
router.put('/updateDept', auth,  deptCtl.updateDept)
// 删除机构
router.delete('/deleteDept', auth, deptCtl.deleteDept)

module.exports = router