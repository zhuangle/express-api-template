// 系统全局配置
module.exports = {
  // 会话ID加密密钥
  SecretKey: "7bc30955-76ba-469c-91e8-e4574b7efd8b",
  // 验证码配置 
  Options: {
    size: 4, // 验证码长度
    ignoreChars: '0o1il', // 验证码字符中排除 0o1i
    noise: 2, // 干伸线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设置了背景，则默认有
    // background: '#cc9966', // 验证码图片背景颜色
  },
  // 验证码过期时间 
  // 默认60s
  CaptchaExpiration: 1000 * 60,

  // 密码md5加密私钥
  HashPrivateKey: '40eeea13-9539-4786-889f-fd7044e0821d',
  
  // jwt token
  JwtPrivateKey: "6c489c35-2ccf-491b-bfa2-49a1c373dd1e",
  // jwt token有效期
  TokenExpiration: {
    // 单位是秒，现在token有效期为2小时
    expiresIn: 2 * 60 * 60
  },
  // 文件存储路径
  UploadFilePath: 'uploads/'
}