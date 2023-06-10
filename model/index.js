// 配置数据库连接
const Sequelize = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "", MYSQL_DATABASE } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql", /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  // logging: false,// 阻止Sequelize在执行查询时将SQL输出到控制台
  timezone: '+08:00' //东八时区
});

// 导入模型
const {User, VerificationCode, UserProfile, UserBlackList } = require('./user')(sequelize, Sequelize);
const { FileUploads } = require('./upload')(sequelize, Sequelize);
const init = async () => {
  await sequelize.sync();
}
init()



// 导出初始化方法和模型
module.exports = {
  init,
  User,
  UserProfile,
  UserBlackList,
  VerificationCode,
  FileUploads
};
