const baseModel = require('./baseModel')
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  // 用户表模型
  const Dept = sequelize.define('department', {
    deptId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    code:{
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      required: true
    },
    status:{
      type: DataTypes.STRING,
      required: true,
      defaultValue: '1'
    },
    Pid:{
      type: DataTypes.STRING,
      required: true,
    },
    managerUid: {
      type: DataTypes.STRING,
    },
    managerUcode: {
      type: DataTypes.STRING,
    },
    manager: {
      type: DataTypes.STRING,
    },
    ...baseModel
  });

  return {
    Dept
  };
};