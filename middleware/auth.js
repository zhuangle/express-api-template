const { verify } = require('../util/jwt')
const { JwtPrivateKey } = require('../config/config.default')
const { User, UserBlackList } = require('../model')

module.exports = async (req, res, next) => {
  // 从请求头获取 token 数据
  let token = req.headers.authorization
  token = token 
  ? token.split('Bearer ')[1] 
  : null
  // 验证 token是否有效
  if(!token){
    return res.status(401).json({
      success: false,
      message: 'token为当前必传项'
    })
  }

  try {
    const decodedToken =  await verify(token, JwtPrivateKey)
    // console.log('decodedToken', decodedToken);
    const user = await User.findOne({
      where: {
        uid: decodedToken.uid
      }
    })
    if(!user){
      return res.status(401).json({
        success: false,
        message: 'token无效或已过期'
      })
    }
    // status
    /* 
      1 - 长期用户
      2 - 临时用户
      3 - 已停用用户
      9 - 禁用用户
    */
    if(user.dataValues.status == 1){
      // console.log('用户状态正常');
    }else if(user.dataValues.status == 2){
      // console.log("当前用户为临时用户");
      // 校验当前用户是否处在有效期之内
      console.log(user);
      const {allowedStart, allowedEnd} = user.dataValues
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
    }else if(user.dataValues.status == 9){
      return res.status(403).json({
        success: false,
        message: '账号已禁用'
      })
    }
    // 在验证成功的情况下，将用户的uid传入req，以方便下个中间件使用
    req.uid = user.uid
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'token无效或已过期'
    })
  }
  // 无效 则返回401响应 结束响应
  // 有效 把用户信息读取出来挂载到 req 请求对象上

}