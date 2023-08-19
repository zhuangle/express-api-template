// 角色 权限相关路由
const express = require('express')
// controller
const permtCtl = require('../controller/perm')
//数据校验
const permValidator = require('../validator/perm')
// 鉴权中间件
const auth = require('../middleware/auth')
const router = express.Router()

// 角色
// 新增角色
router.post('/createRole', auth,permtCtl.createRole)
// 查询角色列表
router.get('/getRoleLists', auth, permtCtl.getRoleLists)
// 获取单个角色
router.get('/getRoleProfile', auth, permtCtl.getRoleProfile)
// 更新角色
router.put('/updateRole', auth, permtCtl.updateRole)
// 删除角色
router.delete('/deleteRole', auth, permtCtl.deleteRole)

// 权限
// 新增权限
router.post('/createPerm', auth, permValidator.createPerm, permtCtl.createPerm)
// // 查询权限列表
router.get('/getPermLists', auth, permtCtl.getPermLists)
// // 更新权限
router.put('/updatePerm', auth, permtCtl.updatePerm)
// // 删除权限
router.delete('/deletePerm', auth, permValidator.deletePerm, permtCtl.deletePerm)



module.exports = router