const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// 自定义morgan格式
morgan.token('time', (req, res) => {
  const currentTime = new Date().toISOString();
  return currentTime;
});

morgan.token('ip', (req, res) => {
  return req.ip;
});

morgan.token('sessionId', (req, res) => {
  return req.session ? req.session.id : '-';
});

morgan.token('params', (req, res) => {
  return JSON.stringify(req.params);
});

morgan.token('query', (req, res) => {
  return JSON.stringify(req.query);
});

morgan.token('status', (req, res) => {
  return res.statusCode;
});

morgan.token('response', (req, res) => {
  return res.body || '-';
});

// morgan.token('response', (req, res) => {
//   return res._getData(); // 获取响应数据
// });

// 自定义morgan格式字符串
const logFormat = '[:time] | :ip | :method :url | Params: :params | Query: :query | Status: :status | Response: :response |  :sessionId ';

// 日志文件路径
const logFilePath = path.join(__dirname, '../log', 'request.log');

// 创建写入流
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// 封装为中间件
const customMorganMiddleware = morgan(logFormat, { stream: logStream });

module.exports = customMorganMiddleware;
