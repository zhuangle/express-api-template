const express = require('express')

const router = require('./router')
const { PORT,APIPATH } = require('./config/config.default')
const errorHandler = require('./middleware/errorHandler.js')

const app = express()

// 处理req.body内的数据
app.use(express.json())

app.use(APIPATH ,router)

// 统一问题处理中间件
app.use(errorHandler())

app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
})