# express-api-template
- ### 介绍

  一个使用Express框架构建应用服务器的模板，以MySQL和Sequelize为数据库，包括用户登录和注册等基本功能。

- ### 部署Buliding

​		先决条件：

​		  1.nodejs(  >= 16 )

​		  2.mysql数据库,开发过程中使用的是8.0+版本

​		部署:

​			1.克隆项目到本地

```power shell
	 git clone git@github.com:zhuangle/express-api-template.git
```

​			2.cd进入到文件夹

```
     cd express-api-template.git
```

​			3.安装依赖

```
 	  npm install
```

​			4.修改环境变量.env文件

```javascript
      # 版本
      VERSSION = 0.0.2
  
      # express运行端口
      PORT = 3001
  
      # 数据库连接数据,以下为示例数据
      # 数据库地址，如本机则用localhost,端口默认3306
      MYSQL_ADDRESS = localhost:3306
	  # 数据库连接用户名 express
      MYSQL_USERNAME = express  
	  # 数据库连接密码
      MYSQL_PASSWORD = 1n2d30?374esdaifew
      # 数据库名称 express
      MYSQL_DATABASE = express
```

​		这是一份.env示例代码，数据库的连接信息需要配置，强烈不建议使用以上配置，按实际配置填入。

​		**注意**： 一定要在数据库内创建数据库，与配置MYSQL_DATABASE对应，sequelize在此过程中不会新建数据库

​	

​		5.配置config/config.default.js

​	以下是应用的相关配置，下方使用uuid,如7bc30955-76ba-469c-91e8-e4574b7efd8b这种格式的，均为加密私钥，可使用 [uuid生成网站]('https://www.uuid.online/') 来随机生成不重复的的uuid对数据进行加密。

```javascript
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
```

​	6.以上配置完成后，使用pm2后台运行express应用

​		如果还没有安装，可以使用如下命令
```powershell
    # 安装pm2
    npm i pm2 -g
    # 查看pm应用列表
    pm2 ls
    # 在应用的根目录下运行
    pm2 start app.js --name express
	
	# 停止
	pm2 stop app
	# 重启
	pm2 restart app
	# 查看日志
	pm2 log
	
```

​		完成以上操作项目就在正常运行了

7.第六步中的pm2是在服务端，如果要在本地运行，可直接使用node app.js，pm2的好处是可以后台运行。

​	如果要进行代码的调试，可以使用nodemon来实现应用修改后自动重启

```powershell
#安装nodemon
npm i -g nodemon
# 运行express
nodemon app.js
```



#### **【注意】在完成部署后，切记保存.env和config下的config.default.js文件，否则将导致数据库内加密数据无法恢复**





---

- ### 应用架构

  express+ mysql+sequelize+pm2

  

  数据库ORM [sequelize]('')

  分页查询: sequelize-paginate

  生成图形验证码  [svg-captcha]('https://github.com/produck/svg-captcha')

  ```powershell
  npm install --save svg-captcha
  ```

  获取sessionId

  ```powershell
  npm install express-session
  ```

  数据校验 [express-validator]('https://express-validator.github.io/docs/guides/getting-started')

  https://github.com/express-validator/express-validator

  

  注册登录jwt

  [jwt.io]('https://jwt.io/')

  [jsonwebtoken]('')

  

----

- ### 使用接口

  访问接口文档，[接口文档apifox](https://apifox.com/apidoc/project-2828442?nav=1)

  ---

- ### Q&A

  ---

- ### 联系我

  ​	email: coderzhuang@163.com

  ---

- ### 致谢 