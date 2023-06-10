const express = require('express')
// 处理日志
const requestLogger = require('./middleware/formatLogger');

// 处理跨域
const cors = require('cors')
// 加载 .env 环境文件
require('dotenv').config();
// 获取sessionID
const session = require('express-session')

const router = require('./router')
const errorHandler = require('./middleware/errorHandler.js')
require('./model')
const { SecretKey } = require('./config/config.default')

const app = express()


// 格式化日志中间件
app.use(requestLogger)
app.use(cors())
// 处理req.body内的数据
app.use(express.json())

// 获取session
app.use(session({
  secret: SecretKey, // 设置会话的加密密钥
  resave: false,
  saveUninitialized: true
}));

const port = process.env.PORT || 3000

// 路由
app.use('/api', router)


// 统一问题处理中间件
app.use(errorHandler())


app.listen(port, async () => {
  console.log(`Server is Running at http://localhost:${port}`);
})