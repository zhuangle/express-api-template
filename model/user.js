const md5 = require('../util/md5')
const baseModel = require('./baseModel')
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  // 用户表模型
  const User = sequelize.define('users', {
    uid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    nickname: {
      type: DataTypes.STRING,
      required: true
    },
    usercode:{
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      required: true
    },
    status:{
      type: DataTypes.STRING,
      defaultValue: '1'
    },
    dept: {
      type: DataTypes.STRING,
    },
    // 注册途径
    channel: {
      type: DataTypes.ENUM('网站', '小程序', 'PC应用', '移动app'),
      required: true
    },
    allowedStart: {
      type: DataTypes.DATE,
    },
    allowedEnd: {
      type: DataTypes.DATE,
    },
    ...baseModel
  });
  // 用户详细信息
  const UserProfile = sequelize.define('user_profile', {
    uid: {
      type: DataTypes.STRING,
      primaryKey: true,
      required: true
    },
    userName: {
      type: DataTypes.STRING,
      required: true
    },
    gender: {
      type: DataTypes.STRING,
      required: true
    },
    idCard:{
      type: DataTypes.STRING,
    },
    brith: {
      type: DataTypes.STRING,
    },
    city:{
      type: DataTypes.STRING,
    },
    email:{
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
      required: true
    },
    address: {
      type: DataTypes.STRING,
      required: true
    },
    ...baseModel
  });
  const UserBlackList = sequelize.define('user_blacklist', {
    uid: {
      type: DataTypes.STRING,
      primaryKey: true,
      required: true
    },
    note: {
      type: DataTypes.STRING,
      required: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  })
  // 图形验证码模型 
  const VerificationCode = sequelize.define('verification_code', {
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      required: true
    },
    code: {
      type: DataTypes.STRING,
      required: true
    },
    expiration: {
      type: DataTypes.DATE,
      required: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
  
  return {
    User,
    UserProfile,
    VerificationCode,
    UserBlackList
  };
};