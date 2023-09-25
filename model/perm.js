const baseModel = require("./baseModel");
const { v4: uuidv4, v1: uuidv1 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  // 角色表模型
  /* 
     perm_role  # 角色表
     perm_menu  # 菜单权限表
     perm_btn   # 按钮接口权限表
     perm_role_role  # 角色与角色对应关系表
     perm_role_perm  # 角色与权限对应关系表
     perm_user_role  # 用户与角色对应关系表
  
  */
  //  当建表的时候，数据库建表时会默认加s
  // 角色表
  const Role = sequelize.define("perm_role", {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    status: {
      type: DataTypes.STRING,
      required: true,
      defaultValue: "1",
    },
    scription: {
      type: DataTypes.STRING,
    },
    ...baseModel,
  });
  // 菜单权限表
  const PermMenu = sequelize.define("perm_menu", {
    menuId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    code: {
      type: DataTypes.STRING,
      required: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    status: {
      type: DataTypes.STRING,
      required: true,
      defaultValue: "1",
    },
    scripttion: {
      type: DataTypes.STRING,
    },
    ...baseModel,
  });
  // 按钮权限表
  const PermBtn = sequelize.define("perm_btn", {
    btnId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    code: {
      type: DataTypes.STRING,
      required: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    status: {
      type: DataTypes.STRING,
      required: true,
      defaultValue: "1",
    },
    scripttion: {
      type: DataTypes.STRING,
    },
    ...baseModel,
  });
  // 角色与角色对应关系表
  const PermRoleRole = sequelize.define("perm_role_role", {
    roleId: {
      type: DataTypes.UUID,
      required: true,
    },
    childRoleId: {
      type: DataTypes.UUID,
      required: true,
    },
    scripttion: {
      type: DataTypes.STRING,
    },
    ...baseModel,
  });
  // 角色与权限对应关系表
  const PermRolePerm = sequelize.define("perm_role_perm", {
    roleId: {
      type: DataTypes.UUID,
      required: true,
    },
    permId: {
      type: DataTypes.UUID,
      required: true,
    },
    scripttion: {
      type: DataTypes.STRING,
    },
    ...baseModel,
  });
  // 用户与角色对应关系表
  const PermUserRole = sequelize.define("perm_user_role", {
    uid: {
      type: DataTypes.UUID,
      required: true,
    },
    roleId: {
      type: DataTypes.UUID,
      required: true,
    },
    scripttion: {
      type: DataTypes.STRING,
    },
    ...baseModel,
  });

  // perm_menu_route  #菜单和路由对应关系
  const PermMenuRoute = sequelize.define("perm_menu_route", {
    menuId: {
      type: DataTypes.UUID,
      required: true,
    },
    routeId: {
      type: DataTypes.STRING,
      required: true,
    },
    scripttion: {
      type: DataTypes.STRING,
    },
    ...baseModel,
  });

  return {
    Role,
    PermMenu,
    PermBtn,
    PermRoleRole,
    PermRolePerm,
    PermUserRole,
    PermMenuRoute,
  };
};
