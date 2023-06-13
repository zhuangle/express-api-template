const { Op } = require("sequelize");

const {User, Dept } = require('../model')

exports.Register_UpdateUserStatus = (value, { req }) => {
  // 当状态为1时为长期用户，不校验授权开始时间和结束时间
  console.log('value', value);
  if(req.body.status == 1 || req.body.status == 9){
    return true
  }
  // 当状态为2时，临时用户，必须传入授权开始时间和结束时间
  if(req.body.status == 2){
    // 校验时间格式正则，时间格式：2023-06-10 17:47:45
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/; 
    
    if (!regex.test(req.body.allowedStart) || !regex.test(req.body.allowedEnd)) {
      throw new Error('时间格式不正确');
    }
    const start = new Date(req.body.allowedStart).getTime();
    const end = new Date(req.body.allowedEnd).getTime();
    if(start > end){
      throw new Error('授权开始时间不能晚于结束时间');
    }
    return true
  }
  // 当前仅定义状态 1和 2, 9 
  // 1-长期用户， 
  // 2-临时用户， 
  // 3-过期用户，一般不需要处理，后期设置自动化任务每晚改变状态 
  // 9-禁用用户
  throw new Error('未定义用户状态');
};

exports.registerChannel = (value, { req }) => {
  // 注册途径仅以下几种方式，目前不校验传值
  // "网站", "小程序", "PC应用", "移动app"
  return true
};

exports.deleteDept = async (value, { req }) => {
  await Dept.findOne({where:{
    code: {
      [Op.startsWith]: value
    }
  }})
}