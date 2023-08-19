const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const svgCaptcha = require('svg-captcha');
// 分页查询扩展
const paginate = require('sequelize-paginate');

const fs = require('fs');
const path = require('path')

const jwt = require('../util/jwt')
const md5 = require('../util/md5')
const {Options, CaptchaExpiration,HashPrivateKey, JwtPrivateKey, TokenExpiration, UploadFilePath} = require('../config/config.default')

const { User, VerificationCode, UserProfile, FileUploads,Dept } = require('../model')
paginate.paginate(User);

// register 用户注册
exports.register = async (req, res, next) => {
  try {
    const { usercode, nickname, password, channel,dept } = req.body;
    if(usercode){
      // 用户传入工号
      const isExistUsercode = await User.findOne({
        where: { usercode},
      })
      if(isExistUsercode){
        return res.status(409).json({
          success: false,
          message: `工号${usercode}已存在`,
          usercode
        })
      }
      
    }else{
      // 用户未传入工号 查询库内的最大工号
      let usercode = await User.max('usercode');
      //  如未查到，则默认从1000开始
      usercode = usercode ? (usercode * 1 + 1) : 1000
    }
    if(dept){
      const deptid = await Dept.findOne({
        where: {deptId: dept}
      })
      if(!deptid){
        return res.status(400).json({
          success: false,
          message: `机构[deptId: ${dept}]不存在`,
          usercode
        })
      }
    }

    // 创建用户
    const createUser =  await User.create({
      usercode,
      nickname,
      password: md5(password, HashPrivateKey),
      channel,
      dept
    });
    console.log('createUser.uid', createUser.uid);
    res.status(201).json({
      success: true,
      message: '注册成功',
      uid:createUser.uid
    });
    next();
  } catch (err) {
    next(err);
  }
};
// user login 用户登录
exports.loginByCode =  async (req, res, next) => {
  try {
    const { usercode, password } = req.body
    let user = await User.findOne({
        where: { usercode },
    })
    if(!user){
      return res.status(401).json({
        success: false,
        message:'用户不存在或密码错误'
      })
    }
    //如果查询不到，则说明用户不存在 
    const {allowedStart, allowedEnd} = user.dataValues
    if(user.status == 1){
      // 直接放行
    }else if(user.status == 2){
      // 临时用户，需要校验授权时间
      const start = new Date(allowedStart).getTime()
      const end = new Date(allowedEnd).getTime();
      const currentTimestamp = Date.now(); // 当前时间戳
      const isStartBeforeNow = start < currentTimestamp;
      const isEndAfterNow = end > currentTimestamp;

      if (!isStartBeforeNow || !isEndAfterNow) {
        return res.status(403).json({
          success: false,
          message: '账号目前不在可用期',
          allowedStart,
          allowedEnd
        })
      }
    }else if(user.status == 9){
      return res.status(403).json({
        success: false,
        message:`当前用户已禁用`,
        uid: user.uid
    })        
    }else{
      return res.status(403).json({
        success: false,
        message:`用户状态未定义，请联系管理员维护`,
        uid: user.uid
      })
    }
    // token内写入uid
    const tokenData = {
      "uid": user.uid
    }
    // 将用户传入的密码转为md5值
    const hashedPassword = await md5(password, HashPrivateKey)
    // 比对用户传入的密码和数据库中储存的密码
    if(hashedPassword === user.password){
      const token = await jwt.sign(tokenData, JwtPrivateKey, TokenExpiration)
      return res.status(200).send({
        message: '登录成功',
        success: true,
        data: {
          uid: user.dataValues.uid,
          token
        }
      })
    }else{
      return res.status(401).json({
        success: false,
        message:'用户不存在或密码错误'
      })
    }
  } catch (err) {
    next(err)
  }
}
// user getCaptcha 获取验证码
exports.getCaptcha = async (req, res, next) => {
  try {
    // 创建验证码
    const captcha = svgCaptcha.create(Options);

    // 使用会话Id(sessionId)与验证码对应
    const sessionId = req.sessionID;
    
    // 存储验证码
    // 判断用户是否存在验证码记录，不存在新增，存在更新记录
    const existingCode = await VerificationCode.findOne({ where: { sessionId } });
    if (existingCode) {
      // 已存在验证码，更新原记录
      await existingCode.update({
        code: captcha.text,
        expiration: Date.now() + CaptchaExpiration,
      });
    } else {
      // 不存在验证码，新增记录
      await VerificationCode.create({
        sessionId,
        code: captcha.text,
        expiration: Date.now() + CaptchaExpiration,
      });
    }

    // 向客户端返回图形验证码
    res.type('svg');
    res.status(200).send(captcha.data);
  } catch (err) {
    next(err)
  }
}
// user verifyCaptcha 校验验证码
exports.verifyCaptcha = async (req, res, next) => {
  try {
    const sessionId = req.sessionID;
    const code = req.body.code
    // 查询数据库内是否存在验证
    const isCodeLegal = await VerificationCode.findOne({ where: { sessionId, code} });
    if(isCodeLegal){
      res.status(200).json({
        success: true,
        message: "验证码校验通过"
      })
    }else{
      res.status(400).json({
        success: false,
        message: "验证码不正确或已过期"
      })
    }
  } catch (err) {
    next(err)
  }
}
// user getUserProfile 获取用户详情
exports.getUserProfile = async (req, res, next) => {
  const uid = req.query.uid
  try {
    const Profile = await UserProfile.findOne({
      where: [{uid}]
    });
    const profile = Profile ? Profile.dataValues : {}
    // 获取用户头像
    const bioUri = await FileUploads.findOne({
      where:[{uid}]
    });
    // 头像地址
    let relativePath = ''
    if(bioUri || Object.getOwnPropertyNames(profile).length){
      if(bioUri){
        relativePath = path.join('uploads', bioUri.newFileName).replace(/\\/g, '/');
      }
    }else{
      return res.status(401).json({
        success: false,
        message: "用户信息不存在",
      });
    }
    // 获取用户信息
    res.status(200).json({
      success: true,
      message: "获取用户信息成功",
      data: [{
        ...profile,
        bio: relativePath
      }]
    });
  } catch (err) {
    next(err)
  }
}
// user getUserList 获取用户列表
exports.getUserList = async (req, res, next) => {
  // 分页参数,如未指定，则返回第1页，且每页数据为10
  let pageIndex = parseInt(req.query.pageIndex) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  try {
    const totalCount = await User.count({where: []});
      // 计算实际的页数
    const totalPages = Math.ceil(totalCount / pageSize);
      // 如果用户传入的 pageIndex 大于实际的 totalPages，则将 pageIndex 设置为实际的最大页数
    if (pageIndex > totalPages) {
      pageIndex = totalPages;
    }

    const { docs, pages, total } = await User.paginate({
      page: pageIndex,
      paginate: pageSize,
      order: [['usercode', 'ASC']],
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({
      success: true,
      data: {
        users: docs,
        currentPage: pageIndex,
        totalPages: pages,
        totalCount: total,
      }
    });
  } catch (err) {
    next(err)
  }
}
// 上传用户头像
exports.uploadBio = async (req, res, next) => {
  try {
    // 访问上传的文件  
    const isExsitFile = await FileUploads.findOne({
      where: {
        [Op.and]: [
          { uid: req.uid},
          { purpose: 'bio' }
        ]
      }
    }) 
    if(isExsitFile){
      // 如果已存在，更新数据库信息
      await FileUploads.update( req.newFile, {
        where: {
          [Op.and]: [
            { uid: req.uid},
            { purpose: 'bio' }
          ]
        }
      });
      // 更新完成后，删除本地的文件
      fs.unlink(UploadFilePath + isExsitFile.newFileName, (err) => {
        if (err) {
          console.error('删除文件时出现错误:', err);
        }
      });
    }else{
      // 不存在，新增
      await FileUploads.create({
        uid: req.uid,
        purpose: 'bio',
        ...req.newFile
      })
    }

    res.status(200).json({
      success: true,
      message: '文件上传成功'
    });
  } catch (err) {
    next(err)
  }
}
// user updateUserProfile 更新用户信息
exports.updateUserProfile = async (req, res, next) => {
  try {
    // 1.在库中查询用户的详情是否存在
    const profile = await UserProfile.findOne({
      where: [{uid: req.body.uid}]
    })
    if(profile){
      // 存在用户信息，更新
      await UserProfile.update(req.body, {
        where:[{uid: req.body.uid}]
      })
    }else{
      // 不存在用户信息
      // 校验用户uid是否存在
      const isExistUid = await User.findOne({
        where:{uid: req.body.uid}
      })
      if(!isExistUid){
        // 不存在uid
        console.log('不存在用户uid', isExistUid);
        return res.status(401).json({
          success: false,
          message: "当前要更新的用户信息，用户不存在",
          uid: req.body.uid
        });
      }
      // 存在则新增
      await UserProfile.create({
        ...req.body
      })
    }
    res.status(201).json({
      success: true,
      message: '用户信息更新成功'
    });
  } catch (err) {
    next(err)
  }
}
// 更新用户机构 updateUserDept
exports.updateUserDept = async (req, res, next) => {
  try {
    const { uid, dept } = req.body
    await User.update({dept}, {
      where: {uid}
    })
    res.status(201).json({
      success: true,
      message: '用户机构更新成功'
    });
  } catch (err) {
    next(err)
  }
}
// user updateUserStatus 更新用户状态
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { uid, status, allowedStart, allowedEnd } = req.body
    // 1.查询要更新的用户是否存在
    const isExistUser = await User.findOne({
      where: [{ uid }]
    })
    if(!isExistUser){
      return res.status(401).json({
        success: false,
        message: "要更新的用户不存在",
      });
    }
    // 当状态不为2时，过滤用户传入的授权开始、结束时间
    if(status * 1 !== 2){
      if(allowedStart){
        delete req.body.allowedStart
      }
      if(allowedEnd){
        delete req.body.allowedEnd
      }
    }
    // 更新数据库
    await User.update(req.body, {where: [
      {uid: req.body.uid}
    ]})
    res.status(200).json({
      success: true,
      message: '用户状态更新成功'
    })
  } catch (err) {
    next(err)
  }
}
// user changePassword 修改密码
exports.changePassword = async (req, res, next) => {
  try {
    const { uid, oldPassword, newPassword } = req.body
    let user = await User.findOne({
      where: { uid },
    })
    console.log(user);
    if(!user){
      return res.status(401).json({
        success: false,
        message:'要修改的用户不存在',
        uid
      })
    }
    const hashedOldPassword = await md5( oldPassword , HashPrivateKey )
    const hashedNewPassword = await md5( newPassword , HashPrivateKey )
    console.log('旧密码：', hashedOldPassword);
    console.log('新密码：', hashedNewPassword);
    // 对比原密码是否正确
    if(hashedOldPassword === user.password){
      await User.update({ password: hashedNewPassword }, {
        where: { uid }
      })

      return res.status(201).send({
        success: true,
        message: '密码修改成功',
        uid
      })
    }else{
      return res.status(400).json({
        success: false,
        message:'原密码错误',
        uid
      })
    }

  } catch (err) {
    next(err)
  }
}
