const { Op, where } = require("sequelize");

const {
  User,
  Dept,
  PermMenu,
  PermBtn,
  PermRoleRole,
  PermRolePerm,
  PermUserRole,
  PermUserPerm,
  PermDeptRole,
  PermDeptPerm,
  PermMenuRoute,
} = require("../model");
const { convertToTree } = require("../util/listToTree");
const { getDataType, sortArrByLenth, isEmpty } = require("../util/handlData");

exports.Register_UpdateUserStatus = (value, { req }) => {
  // 当状态为1时为长期用户，不校验授权开始时间和结束时间
  console.log("value", value);
  if (req.body.status == 1 || req.body.status == 9) {
    return true;
  }
  // 当状态为2时，临时用户，必须传入授权开始时间和结束时间
  if (req.body.status == 2) {
    // 校验时间格式正则，时间格式：2023-06-10 17:47:45
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    if (
      !regex.test(req.body.allowedStart) ||
      !regex.test(req.body.allowedEnd)
    ) {
      throw new Error("时间格式不正确");
    }
    const start = new Date(req.body.allowedStart).getTime();
    const end = new Date(req.body.allowedEnd).getTime();
    if (start > end) {
      throw new Error("授权开始时间不能晚于结束时间");
    }
    return true;
  }
  // 当前仅定义状态 1和 2, 9
  // 1-长期用户，
  // 2-临时用户，
  // 3-过期用户，一般不需要处理，后期设置自动化任务每晚改变状态
  // 9-禁用用户
  throw new Error("未定义用户状态");
};
exports.registerChannel = (value, { req }) => {
  // 注册途径仅以下几种方式，目前不校验传值
  // "网站", "小程序", "PC应用", "移动app"
  return true;
};
// 更新用户机构信息校验
exports.updateUserDept = async (value, { req }) => {
  const user = await User.findOne({
    where: {
      uid: req.body.uid,
    },
  });
  if (!user) {
    throw new Error(`用户[uid: ${req.body.uid}]不存在`);
  }

  const dept = await Dept.findOne({
    where: {
      deptId: value,
    },
  });
  if (!dept) {
    throw new Error(`机构[deptId: ${value}]不存在`);
  }

  return true;
};

// 更新机构校验
exports.updateDept = async (value, { req }) => {
  // 更新要求传入deptId,其他均为可选参数
  console.log("update", req.body);
  // 除deptId,要修改的字段至少传入一个
  if (!checkIfOtherValuesExist(req.body)) {
    throw new Error(`要修改的字段至少传入一个`);
  }
  // 过滤用户传入的空值
  req.body = filterEmptyValues(req.body);
  const { deptId, code, name, status, Pid } = req.body;
  const DeptId = await Dept.findOne({
    where: { deptId },
  });
  if (!DeptId) {
    throw new Error(`机构【deptId: ${deptId}】不存在`);
  }
  if (code) {
    const Code = await Dept.findOne({
      where: { code },
    });
    if (Code) {
      throw new Error(`机构[code: ${code}]已存在`);
    }
  }
  if (name) {
    if (!(name.length >= 2 && name.length <= 30)) {
      throw new Error(`机构名称应为2-30位个字符`);
    }
  }
  if (Pid) {
    if (deptId === Pid) {
      throw new Error(`机构id不能与父级id相同`);
    }
    const PID = await Dept.findOne({
      where: { deptId: Pid },
    });
    console.log("PID", PID);
    if (!PID) {
      throw new Error(`父级机构[Pid: ${Pid}]不存在`);
    }
  }

  return true;
};

// 删除机构校验
exports.deleteDept = async (value, { req }) => {
  // 删除 允许单个删除和批量删除
  console.log("value", value);
  let query = {};
  if (getDataType(value) === "Array") {
    // 传入数组，批量删除
    // 数组重排
    const arr = sortArrByLenth(value);
  } else if (getDataType(value) === "String") {
    const Pid = await Dept.findOne({
      where: [{ code: value }],
    });
    console.log("Pid", Pid);
    if (!Pid) {
      // 如果不存在Pid，可能是不存在，或者已删除
      throw new Error(`机构【code: ${value}】不存在`);
    }
    query = {
      where: {
        Pid: {
          [Op.startsWith]: Pid.deptId,
        },
      },
    };
  } else {
    throw new Error("传入数据格式不正确，应为字符串或数组");
  }

  const result = await Dept.findAll(query);
  let a = [];
  result.forEach((item) => a.push(item.code));
  console.log(isEmpty(result));
  if (!isEmpty(result)) {
    throw new Error(`要删除的机构下存在未处理的子机构【${a}】`);
  }
  return true;
};

// PermBtn 权限表
// 检查权限code是否存在
exports.isBtnCodeExit = async (value, { req }) => {
  const isBtnCodeExit = await PermBtn.findOne({ where: { code: value } });
  if (isBtnCodeExit) {
    throw new Error(`权限【code: ${value}】已存在`);
  }
  return true;
};
// 删除权限检查
exports.deletePerm = async (value, { req, res }) => {
  // 检测当前字段是否与其他表存在关联
  const tab = [
    { tab: PermRolePerm, field: "permId" },
    { tab: PermDeptPerm, field: "permId" },
    { tab: PermUserPerm, field: "permId" },
  ];
  const result = await isIdinOtherTab(value, tab);
  if (result.length) {
    throw new Error(`权限[${value}]在其他表内已存在对应关系，请先处理`);
  }
  return true;
};

// 检查更新传入的对象内,除了DeptId以外是否存在其他字段
function checkIfOtherValuesExist(obj) {
  for (let key in obj) {
    if (key !== "deptId") {
      return true;
    }
  }
  return false;
}
// 更新,过滤对象空值
function filterEmptyValues(obj) {
  const filteredObj = {};
  for (let key in obj) {
    const value = obj[key];
    if (value !== "") {
      filteredObj[key] = value;
    }
  }
  return filteredObj;
}

// 检查字段与其他表的关联
async function isIdinOtherTab(value, tab) {
  const results = await Promise.all(
    tab.map(async ({ tab: Table, field }) => {
      const query = {
        where: { [field]: value },
      };
      const result = await Table.findOne(query);

      if (result) {
        return { tab: Table, value: result };
      }
    })
  );

  const validResults = results.filter((result) => result); // 过滤掉空结果

  return validResults;
}
