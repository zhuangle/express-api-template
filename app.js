const express = require('express')

const router = require('./router')
const { PORT,APIPATH } = require('./config/config.default')

const app = express()


// 处理req.body内的数据
app.use(express.json())

app.use(APIPATH ,router)

app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
})