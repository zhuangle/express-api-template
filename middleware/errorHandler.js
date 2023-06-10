const util = require('util')

// 处理服务端错误中间件
module.exports = () => {
  return (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
      error: util.format(err)
    })
  }
}